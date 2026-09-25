import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = (process.env.SITE_URL || "https://sahracart.com").replace(
  /\/$/,
  "",
);

const STORE_NAME = "سهرة";
const STORE_EMAIL = "sahra0sales@gmail.com";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { order } = req.body;

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order data missing",
      });
    }

    const customer = order.customer || {};
    const items = Array.isArray(order.items) ? order.items : [];

    const productsHtml =
      items
        .map(
          (item) => `
            <tr>
              <td style="padding:10px;border:1px solid #eadcda;">
                ${escapeHtml(item.name || "")}
              </td>

              <td
                style="
                  padding:10px;
                  border:1px solid #eadcda;
                  text-align:center;
                "
              >
                ${Number(item.quantity || 0)}
              </td>

              <td
                style="
                  padding:10px;
                  border:1px solid #eadcda;
                  text-align:center;
                "
              >
                ${Number(item.price || 0).toFixed(2)} ر.س
              </td>
            </tr>
          `,
        )
        .join("") || "";

    const orderNumber = escapeHtml(order.orderNumber || "");
    const customerName = escapeHtml(customer.name || "");
    const customerPhone = escapeHtml(customer.phone || "");

    const customerCity = escapeHtml(customer.city || "غير محددة");
    const customerNeighborhood = escapeHtml(
      customer.neighborhood || "غير محدد",
    );

    const customerAddress = escapeHtml(
      customer.address || customer.shortAddress || "غير محدد",
    );

    const customerNotes = escapeHtml(customer.notes || "لا يوجد");

    const latitude = Number(customer.latitude);
    const longitude = Number(customer.longitude);

    const hasLocation =
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180;

    const mapUrl = hasLocation
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : "";

    const shippingCompany = order.shippingCompany || {};

    const shippingCompanyName = escapeHtml(shippingCompany.name || "غير محددة");

    const shippingCompanyFee = Number(shippingCompany.extraFee || 0).toFixed(2);

    const paymentMethod = escapeHtml(
      order.paymentMethod || "الدفع عند الاستلام",
    );

    const subtotal = Number(order.subtotal || 0).toFixed(2);
    const shipping = Number(order.shipping || 0).toFixed(2);
    const total = Number(order.total || 0).toFixed(2);

    const result = await resend.emails.send({
      from: `${STORE_NAME} <onboarding@resend.dev>`,
      to: [STORE_EMAIL],

      subject: `🛒 طلب جديد ${order.orderNumber || ""} - ${
        customer.name || ""
      }`,

      html: `
        <div
          style="
            direction:rtl;
            font-family:Arial,sans-serif;
            background:#fbf6f1;
            padding:30px 15px;
            color:#4a1821;
          "
        >
          <div
            style="
              max-width:720px;
              margin:0 auto;
              background:#ffffff;
              border:1px solid #e8d9d6;
              border-radius:18px;
              overflow:hidden;
            "
          >

            <!-- Header -->
            <div
              style="
                background:#641f2b;
                color:#ffffff;
                padding:24px;
              "
            >
              <h1
                style="
                  margin:0;
                  font-size:24px;
                "
              >
                طلب جديد في ${STORE_NAME}
              </h1>

              <p
                style="
                  margin:8px 0 0;
                  font-size:14px;
                  opacity:.9;
                "
              >
                رقم الطلب: ${orderNumber}
              </p>
            </div>

            <div style="padding:24px;">

              <!-- Customer -->
              <h2
                style="
                  margin:0 0 18px;
                  font-size:18px;
                  color:#641f2b;
                "
              >
                بيانات العميل
              </h2>

              <table
                style="
                  width:100%;
                  border-collapse:collapse;
                  margin-bottom:24px;
                "
              >
                <tbody>

                  <tr>
                    <td
                      style="
                        padding:9px 0;
                        font-weight:bold;
                        width:130px;
                      "
                    >
                      الاسم
                    </td>

                    <td style="padding:9px 0;">
                      ${customerName}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding:9px 0;
                        font-weight:bold;
                      "
                    >
                      الجوال
                    </td>

                    <td style="padding:9px 0;">
                      ${customerPhone}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding:9px 0;
                        font-weight:bold;
                      "
                    >
                      المدينة
                    </td>

                    <td style="padding:9px 0;">
                      ${customerCity}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding:9px 0;
                        font-weight:bold;
                      "
                    >
                      الحي
                    </td>

                    <td style="padding:9px 0;">
                      ${customerNeighborhood}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding:9px 0;
                        font-weight:bold;
                        vertical-align:top;
                      "
                    >
                      العنوان المختصر
                    </td>

                    <td style="padding:9px 0;">
                      ${customerAddress}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding:9px 0;
                        font-weight:bold;
                        vertical-align:top;
                      "
                    >
                      الملاحظات
                    </td>

                    <td style="padding:9px 0;">
                      ${customerNotes}
                    </td>
                  </tr>

                </tbody>
              </table>

              <!-- Location -->
              <h2
                style="
                  margin:0 0 14px;
                  font-size:18px;
                  color:#641f2b;
                "
              >
                موقع التوصيل
              </h2>

              ${
                hasLocation
                  ? `
                    <div
                      style="
                        background:#f2e4e1;
                        border:1px solid #e8d9d6;
                        border-radius:14px;
                        padding:16px;
                        margin-bottom:24px;
                      "
                    >
                      <div
                        style="
                          margin-bottom:10px;
                          font-size:13px;
                          color:#806d70;
                        "
                      >
                        تم تحديد موقع العميل على الخريطة.
                      </div>

                      <div
                        style="
                          margin-bottom:12px;
                          font-size:13px;
                        "
                      >
                        الإحداثيات:
                        ${latitude.toFixed(6)},
                        ${longitude.toFixed(6)}
                      </div>

                      <a
                        href="${mapUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="
                          display:inline-block;
                          background:#641f2b;
                          color:#ffffff;
                          padding:11px 18px;
                          text-decoration:none;
                          border-radius:10px;
                          font-weight:bold;
                          font-size:14px;
                        "
                      >
                        📍 فتح موقع العميل على الخريطة
                      </a>
                    </div>
                  `
                  : `
                    <div
                      style="
                        background:#fbf6f1;
                        border:1px solid #e8d9d6;
                        border-radius:14px;
                        padding:14px 16px;
                        margin-bottom:24px;
                        color:#806d70;
                      "
                    >
                      لم يتم تسجيل إحداثيات الموقع.
                    </div>
                  `
              }

              <!-- Shipping -->
              <h2
                style="
                  margin:0 0 14px;
                  font-size:18px;
                  color:#641f2b;
                "
              >
                شركة الشحن
              </h2>

              <div
                style="
                  background:#fbf6f1;
                  border:1px solid #e8d9d6;
                  border-radius:14px;
                  padding:16px;
                  margin-bottom:24px;
                "
              >
                <div
                  style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    margin-bottom:8px;
                  "
                >
                  <span>الشركة</span>
                  <strong>${shippingCompanyName}</strong>
                </div>

                <div
                  style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                  "
                >
                  <span>الرسوم الإضافية</span>
                  <strong>${shippingCompanyFee} ر.س</strong>
                </div>
              </div>

              <!-- Products -->
              <h2
                style="
                  margin:0 0 14px;
                  font-size:18px;
                  color:#641f2b;
                "
              >
                المنتجات
              </h2>

              <table
                style="
                  width:100%;
                  border-collapse:collapse;
                  margin-bottom:24px;
                "
              >
                <thead>
                  <tr style="background:#f7eee9;">

                    <th
                      style="
                        padding:11px;
                        border:1px solid #eadcda;
                        text-align:right;
                      "
                    >
                      المنتج
                    </th>

                    <th
                      style="
                        padding:11px;
                        border:1px solid #eadcda;
                        text-align:center;
                      "
                    >
                      الكمية
                    </th>

                    <th
                      style="
                        padding:11px;
                        border:1px solid #eadcda;
                        text-align:center;
                      "
                    >
                      السعر
                    </th>

                  </tr>
                </thead>

                <tbody>
                  ${productsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <div
                style="
                  background:#fbf6f1;
                  border:1px solid #e8d9d6;
                  border-radius:14px;
                  padding:18px;
                "
              >

                <div
                  style="
                    display:flex;
                    justify-content:space-between;
                    margin-bottom:10px;
                  "
                >
                  <span>المجموع الفرعي</span>
                  <strong>${subtotal} ر.س</strong>
                </div>

                <div
                  style="
                    display:flex;
                    justify-content:space-between;
                    margin-bottom:10px;
                  "
                >
                  <span>الشحن</span>

                  <strong>
                    ${
                      Number(order.shipping || 0) > 0
                        ? `${shipping} ر.س`
                        : "مجاني"
                    }
                  </strong>
                </div>

                <div
                  style="
                    border-top:1px solid #e8d9d6;
                    margin-top:12px;
                    padding-top:12px;
                    display:flex;
                    justify-content:space-between;
                    font-size:18px;
                    color:#641f2b;
                  "
                >
                  <strong>الإجمالي</strong>
                  <strong>${total} ر.س</strong>
                </div>

              </div>

              <!-- Payment -->
              <div
                style="
                  margin-top:24px;
                  padding:14px 16px;
                  border-radius:12px;
                  background:#f2e4e1;
                  color:#641f2b;
                "
              >
                <strong>طريقة الدفع:</strong>
                ${paymentMethod}
              </div>

              <!-- Admin Button -->
              <a
                href="${SITE_URL}/admin/orders"
                style="
                  display:inline-block;
                  margin-top:24px;
                  background:#641f2b;
                  color:#ffffff;
                  padding:13px 22px;
                  text-decoration:none;
                  border-radius:10px;
                  font-weight:bold;
                "
              >
                عرض الطلبات
              </a>

            </div>

            <!-- Footer -->
            <div
              style="
                border-top:1px solid #e8d9d6;
                padding:18px 24px;
                text-align:center;
                color:#806d70;
                font-size:12px;
              "
            >
              شكرًا لاختيارك ${STORE_NAME}
            </div>

          </div>
        </div>
      `,
    });

    console.log("RESEND RESULT:", result);

    return res.status(200).json({
      success: true,
      id: result?.data?.id || null,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Email sending failed",
    });
  }
}
