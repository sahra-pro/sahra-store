import { adminDb } from "./firebaseAdmin.js";

const TREEK_API = "https://api.gotreek.com/api";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const email = process.env.TREEK_EMAIL;
    const password = process.env.TREEK_PASSWORD;

    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "بيانات تسجيل الدخول إلى Treek غير موجودة",
      });
    }

    // تسجيل الدخول إلى Treek
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

    // جلب الطلبات التي ما زالت بحاجة للمزامنة فقط
    const ordersSnapshot = await adminDb
      .collection("orders")
      .where("status", "in", ["processing", "shipped", "completed"])
      .get();
    const orders = ordersSnapshot.docs.filter((doc) => {
      return doc.data().treek?.id;
    });

    let checked = 0;
    let updated = 0;
    let failed = 0;

    // فحص الطلبات بالتوازي، 5 طلبات في كل مجموعة
    const batchSize = 5;

    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (orderDoc) => {
          const order = orderDoc.data();
          const treekOrderId = order.treek.id;

          try {
            const response = await fetch(
              `${TREEK_API}/orders/${treekOrderId}`,
              {
                method: "GET",
                headers,
                signal: AbortSignal.timeout(15000),
              },
            );

            const result = await response.json();

            if (!response.ok || !result?.data?.status) {
              failed++;
              return;
            }

            checked++;

            const treekStatus = result.data.status;

            let newStoreStatus = null;

            if (treekStatus === "currently_shipping") {
              newStoreStatus = "shipped";
            } else if (treekStatus === "delivered") {
              newStoreStatus = "completed";
            }

            const now = new Date().toISOString();

            if (
              newStoreStatus &&
              ["processing", "shipped", "completed"].includes(order.status) &&
              order.status !== newStoreStatus
            ) {
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
              await orderDoc.ref.update({
                "treek.status": treekStatus,
                "treek.lastSyncAt": now,
              });
            }
          } catch (error) {
            failed++;

            console.error(
              `Treek sync error for ${order.orderNumber}:`,
              error.message,
            );
          }
        }),
      );
    }

    return res.status(200).json({
      success: true,
      message: "تمت مزامنة حالات الطلبات",
      total: orders.length,
      checked,
      updated,
      failed,
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
