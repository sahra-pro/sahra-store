export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const email = process.env.TREEK_EMAIL;
    const password = process.env.TREEK_PASSWORD;

    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message:
          "TREEK_EMAIL أو TREEK_PASSWORD غير موجودة في Environment Variables",
      });
    }

    // 1. تسجيل الدخول
    const loginResponse = await fetch(
      "https://api.gotreek.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

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
        message: "تم تسجيل الدخول لكن لم يتم استلام Access Token",
      });
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    // 2. جلب المستودعات
    const warehousesResponse = await fetch(
      "https://api.gotreek.com/api/warehouses?per_page=100",
      {
        method: "GET",
        headers,
      },
    );

    const warehousesData = await warehousesResponse.json();

    // 3. جلب الدول
    const countriesResponse = await fetch(
      "https://api.gotreek.com/api/countries",
      {
        method: "GET",
        headers,
      },
    );

    const countriesData = await countriesResponse.json();

    // 4. جلب أنواع التغليف
    const packagingResponse = await fetch(
      "https://api.gotreek.com/api/packaging-types",
      {
        method: "GET",
        headers,
      },
    );

    const packagingData = await packagingResponse.json();

    // لا نرجع الـ token للمتصفح
    return res.status(200).json({
      success: true,
      message: "تم الاتصال مع Treek بنجاح",

      warehouses: warehousesData?.data || [],
      countries: countriesData?.data || [],
      packagingTypes: packagingData?.data || [],
    });
  } catch (error) {
    console.error("Treek test error:", error);

    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء الاتصال مع Treek",
      error: error.message,
    });
  }
}
