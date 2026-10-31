import { adminDb } from "./firebaseAdmin.js";

const TREEK_API = "https://api.gotreek.com/api";

export default async function handler(req, res) {
  try {
    // السماح لخدمة الجدولة باستدعاء الملف
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    // حماية الملف بمفتاح سري
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // بيانات تسجيل الدخول إلى Treek
    const email = process.env.TREEK_EMAIL;
    const password = process.env.TREEK_PASSWORD;

    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "TREEK_EMAIL أو TREEK_PASSWORD غير موجودة",
      });
    }

    // 1. تسجيل الدخول إلى Treek
    const loginResponse = await fetch(`${TREEK_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok || !loginData.access_token) {
      return res.status(500).json({
        success: false,
        message: "فشل تسجيل الدخول إلى Treek",
      });
    }

    const headers = {
      Authorization: `Bearer ${loginData.access_token}`,
      Accept: "application/json",
    };

    // 2. قراءة الطلبات من Firestore
    const ordersSnapshot = await adminDb.collection("orders").get();

    const orders = ordersSnapshot.docs.filter((doc) => {
      const order = doc.data();

      return (
        order.treek?.id &&
        ["processing", "shipped", "completed"].includes(order.status)
      );
    });

    let checked = 0;
    let updated = 0;
    const errors = [];

    // 3. فحص حالة كل طلب في Treek
    for (const orderDoc of orders) {
      const order = orderDoc.data();
      const treekOrderId = order.treek.id;

      try {
        const response = await fetch(`${TREEK_API}/orders/${treekOrderId}`, {
          method: "GET",
          headers,
        });

        const result = await response.json();

        if (!response.ok || !result?.data?.status) {
          errors.push({
            orderNumber: order.orderNumber,
            message: "تعذر جلب حالة الطلب من Treek",
          });
          continue;
        }

        checked++;

        const treekStatus = result.data.status;

        // 4. تحويل حالات Treek إلى حالات المتجر
        let newStoreStatus = null;

        if (treekStatus === "currently_shipping") {
          newStoreStatus = "shipped";
        } else if (treekStatus === "delivered") {
          newStoreStatus = "completed";
        }

        // 5. تحديث Firebase عند وجود تغيير فعلي
        if (newStoreStatus && order.status !== newStoreStatus) {
          const now = new Date().toISOString();

          const history = Array.isArray(order.history)
            ? [...order.history]
            : [];

          history.push({
            status: newStoreStatus,
            date: now,
          });

          await orderDoc.ref.update({
            status: newStoreStatus,
            history,
            "treek.status": treekStatus,
            "treek.lastSyncAt": now,
          });

          updated++;
        } else {
          // تحديث آخر حالة Treek حتى لو لم تتغير حالة المتجر
          await orderDoc.ref.update({
            "treek.status": treekStatus,
            "treek.lastSyncAt": new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(
          `Treek sync error for ${order.orderNumber}:`,
          error.message,
        );

        errors.push({
          orderNumber: order.orderNumber,
          message: error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "تمت مزامنة حالات الطلبات",
      checked,
      updated,
      errors,
    });
  } catch (error) {
    console.error("Treek sync error:", error);

    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء مزامنة الطلبات",
      error: error.message,
    });
  }
}
