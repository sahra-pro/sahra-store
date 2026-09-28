import { adminDb } from "./firebaseAdmin.js";

const TREEK_API = "https://api.gotreek.com/api";
const TREEK_WAREHOUSE_ID = 3843; // مستودع Sahra

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "يجب إرسال orderId",
        example: "/api/treek-create-order?orderId=ORD-1013",
      });
    }

    // --------------------------------------------------
    // 1. بيانات الدخول
    // --------------------------------------------------

    const email = process.env.TREEK_EMAIL;
    const password = process.env.TREEK_PASSWORD;

    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message:
          "TREEK_EMAIL أو TREEK_PASSWORD غير موجودة في Environment Variables",
      });
    }

    // --------------------------------------------------
    // 2. قراءة الطلب من Firestore
    // --------------------------------------------------

    const orderRef = adminDb.collection("orders").doc(String(orderId));
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(404).json({
        success: false,
        message: `الطلب ${orderId} غير موجود في Firestore`,
      });
    }

    const order = orderSnap.data();

    if (!order.customer) {
      return res.status(400).json({
        success: false,
        message: "بيانات العميل غير موجودة داخل الطلب",
      });
    }

    if (!Array.isArray(order.items) || order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "الطلب لا يحتوي على منتجات",
      });
    }

    // --------------------------------------------------
    // 3. تسجيل الدخول إلى Treek
    // --------------------------------------------------

    const loginResponse = await fetch(`${TREEK_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      return res.status(loginResponse.status).json({
        success: false,
        step: "login",
        message: "فشل تسجيل الدخول إلى Treek",
        details: loginData,
      });
    }

    const token = loginData.access_token;

    if (!token) {
      return res.status(500).json({
        success: false,
        step: "login",
        message: "Treek لم يرجع Access Token",
      });
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    // --------------------------------------------------
    // 4. السعودية
    // --------------------------------------------------

    const countriesResponse = await fetch(`${TREEK_API}/countries`, {
      method: "GET",
      headers,
    });

    const countriesData = await countriesResponse.json();

    if (!countriesResponse.ok) {
      return res.status(countriesResponse.status).json({
        success: false,
        step: "countries",
        message: "فشل جلب الدول من Treek",
        details: countriesData,
      });
    }

    const countries = countriesData?.data || [];

    const saudiCountry = countries.find(
      (country) =>
        country.code === "SA" ||
        country.iso2 === "SA" ||
        country.name === "Saudi Arabia" ||
        country.name_ar === "المملكة العربية السعودية" ||
        country.name_ar === "السعودية",
    );

    if (!saudiCountry) {
      return res.status(500).json({
        success: false,
        step: "country",
        message: "لم يتم العثور على السعودية في Treek",
      });
    }

    // --------------------------------------------------
    // 5. مدينة العميل
    // --------------------------------------------------

    const customer = order.customer;

    const customerCity = String(customer.city || "").trim();

    if (!customerCity) {
      return res.status(400).json({
        success: false,
        step: "city",
        message: "مدينة العميل غير موجودة في الطلب",
      });
    }

    const citySearchResponse = await fetch(
      `${TREEK_API}/cities?country_id=${saudiCountry.id}&search=${encodeURIComponent(
        customerCity,
      )}`,
      {
        method: "GET",
        headers,
      },
    );

    const citySearchData = await citySearchResponse.json();

    if (!citySearchResponse.ok) {
      return res.status(citySearchResponse.status).json({
        success: false,
        step: "city",
        message: "فشل البحث عن مدينة العميل في Treek",
        details: citySearchData,
      });
    }

    const cities = citySearchData?.data || [];

    const normalizedCustomerCity = customerCity.toLowerCase();

    let matchedCity = cities.find(
      (city) =>
        String(city.name_ar || "").trim() === customerCity ||
        String(city.name || "")
          .trim()
          .toLowerCase() === normalizedCustomerCity,
    );

    if (!matchedCity && cities.length > 0) {
      matchedCity = cities[0];
    }

    if (!matchedCity) {
      return res.status(400).json({
        success: false,
        step: "city",
        message: `لم يتم العثور على مدينة "${customerCity}" في Treek`,
        results: cities,
      });
    }

    // --------------------------------------------------
    // 6. نوع التغليف
    // --------------------------------------------------

    const packagingResponse = await fetch(`${TREEK_API}/packaging-types`, {
      method: "GET",
      headers,
    });

    const packagingData = await packagingResponse.json();

    if (!packagingResponse.ok) {
      return res.status(packagingResponse.status).json({
        success: false,
        step: "packaging",
        message: "فشل جلب أنواع التغليف من Treek",
        details: packagingData,
      });
    }

    const packagingTypes = packagingData?.data || [];

    const defaultPackaging = packagingTypes.find(
      (packaging) =>
        packaging.is_default === 1 || packaging.is_default === true,
    );

    if (!defaultPackaging) {
      return res.status(400).json({
        success: false,
        step: "packaging",
        message: "لم يتم العثور على نوع تغليف افتراضي في Treek",
        packagingTypes,
      });
    }

    // --------------------------------------------------
    // 7. اسم العميل
    // --------------------------------------------------

    const fullName = String(customer.name || "").trim();

    if (!fullName) {
      return res.status(400).json({
        success: false,
        step: "customer",
        message: "اسم العميل غير موجود",
      });
    }

    const nameParts = fullName.split(/\s+/);

    const receiverFirstName = nameParts[0];

    const receiverLastName = nameParts.slice(1).join(" ") || "Customer";

    // --------------------------------------------------
    // 8. رقم الجوال
    // --------------------------------------------------

    let receiverPhone = String(customer.phone || "").replace(/\s/g, "");

    if (!receiverPhone) {
      return res.status(400).json({
        success: false,
        step: "phone",
        message: "رقم جوال العميل غير موجود",
      });
    }

    if (/^05\d{8}$/.test(receiverPhone)) {
      receiverPhone = `+966${receiverPhone.substring(1)}`;
    }

    if (/^5\d{8}$/.test(receiverPhone)) {
      receiverPhone = `+966${receiverPhone}`;
    }

    if (/^9665\d{8}$/.test(receiverPhone)) {
      receiverPhone = `+${receiverPhone}`;
    }

    // --------------------------------------------------
    // 9. العنوان
    // --------------------------------------------------

    const receiverAddressLine = String(
      customer.address || customer.shortAddress || customer.neighborhood || "",
    ).trim();

    const receiverShortAddress = String(customer.shortAddress || "").trim();

    if (!receiverAddressLine) {
      return res.status(400).json({
        success: false,
        step: "address",
        message: "عنوان العميل غير موجود",
      });
    }

    if (!receiverShortAddress) {
      return res.status(400).json({
        success: false,
        step: "short_address",
        message: "العنوان المختصر للعميل غير موجود",
      });
    }

    // --------------------------------------------------
    // 10. المنتجات والأوزان
    // --------------------------------------------------

    let totalWeight = 0;

    const treekItems = order.items.map((item) => {
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0);

      totalWeight += quantity * 100;

      return {
        name: String(item.name || "Product"),
        quantity,
        price,
        weight: 100,
      };
    });

    if (totalWeight <= 0) {
      return res.status(400).json({
        success: false,
        step: "weight",
        message: "لم يتم حساب وزن صحيح للطلب",
      });
    }

    // --------------------------------------------------
    // 11. تجهيز الطلب
    // --------------------------------------------------

    const treekPayload = {
      receiver_first_name: receiverFirstName,
      receiver_last_name: receiverLastName,
      receiver_phone: receiverPhone,

      receiver_address_line: receiverAddressLine,

      receiver_city_id: matchedCity.id,
      receiver_country_id: saudiCountry.id,

      receiver_short_address: receiverShortAddress,

      warehouse_id: TREEK_WAREHOUSE_ID,

      order_grand_total: Math.round(Number(order.total || 0)),

      payment_method: "cod",

      items: treekItems,

      packages: [
        {
          length: 10,
          width: 10,
          height: 10,
          weight: totalWeight,
          packaging_type_id: defaultPackaging.id,
        },
      ],
    };

    // --------------------------------------------------
    // 12. منع إنشاء الشحنة مرتين
    // --------------------------------------------------

    if (order.treek?.orderNumber || order.treek?.id) {
      return res.status(409).json({
        success: false,
        step: "duplicate",
        message: "هذا الطلب لديه طلب Treek مسجل مسبقًا",
        treek: order.treek,
      });
    }

    // --------------------------------------------------
    // 13. إنشاء الطلب فعليًا في Treek
    // --------------------------------------------------

    const createResponse = await fetch(`${TREEK_API}/orders`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(treekPayload),
    });

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      return res.status(createResponse.status).json({
        success: false,
        step: "create-order",
        message: "فشل إنشاء الطلب في Treek",
        status: createResponse.status,
        details: createData,
        payload: treekPayload,
      });
    }

    const treekOrder = createData?.data;

    if (!treekOrder) {
      return res.status(500).json({
        success: false,
        step: "create-order",
        message: "Treek لم يرجع بيانات الطلب بعد الإنشاء",
        response: createData,
      });
    }

    // --------------------------------------------------
    // 14. حفظ بيانات Treek داخل Firestore
    // --------------------------------------------------

    await orderRef.update({
      treek: {
        id: treekOrder.id || null,
        orderNumber: treekOrder.order_number || null,
        status: treekOrder.status || null,
        createdAt: treekOrder.created_at || new Date().toISOString(),
      },
    });

    // --------------------------------------------------
    // 15. النتيجة
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "تم إنشاء طلب Treek بنجاح",

      order: {
        id: String(orderId),
        orderNumber: order.orderNumber || String(orderId),
      },

      treek: {
        id: treekOrder.id || null,
        orderNumber: treekOrder.order_number || null,
        status: treekOrder.status || null,
      },
    });
  } catch (error) {
    console.error("Treek create-order error:", error);

    return res.status(500).json({
      success: false,
      message: "حدث خطأ غير متوقع أثناء إنشاء طلب Treek",
      error: error.message,
    });
  }
}
