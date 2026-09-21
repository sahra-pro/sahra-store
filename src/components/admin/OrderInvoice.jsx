import QRCode from "qrcode";

export default function OrderInvoice({ order }) {
  const printInvoice = async () => {
    const qrText = `
سهرة
رقم الطلب: ${order.orderNumber}
العميل: ${order.customer?.name}
الجوال: ${order.customer?.phone}
إجمالي المنتجات:
${(order.subtotal ?? order.total).toFixed(2)} ريال

الشحن:
${(order.shipping ?? 0) > 0 ? `${order.shipping.toFixed(2)} ريال` : "مجاني"}

الإجمالي:
${order.total.toFixed(2)} ريال
`;

    const qrImage = await QRCode.toDataURL(qrText);

    const width = 900;
    const height = 750;

    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const invoiceWindow = window.open(
      "",
      "_blank",
      `
      width=${width},
      height=${height},
      top=${top},
      left=${left},
      resizable=yes,
      scrollbars=yes
      `,
    );

    if (!invoiceWindow) {
      alert("تعذر فتح نافذة الفاتورة. يرجى السماح بالنوافذ المنبثقة.");
      return;
    }

    const orderDate = order.createdAt?.toDate
      ? order.createdAt.toDate().toLocaleString("ar-SA")
      : order.date
        ? new Date(order.date).toLocaleString("ar-SA")
        : "-";

    invoiceWindow.document.write(`
      <!DOCTYPE html>

      <html dir="rtl">

      <head>

        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          فاتورة ${order.orderNumber}
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, Tahoma, sans-serif;
            color: #35151c;
            direction: rtl;
            width: 80mm;
            padding: 8px;
            margin: 0 auto;
            background: #ffffff;
          }

          .invoice {
            width: 100%;
          }

          .brand {
            text-align: center;
            padding: 8px 0 14px;
            border-bottom: 2px solid #641f2b;
            margin-bottom: 12px;
          }

          .brand-name {
            color: #641f2b;
            font-size: 26px;
            font-weight: 900;
            margin: 0;
          }

          .brand-subtitle {
            color: #8f3046;
            font-size: 10px;
            margin-top: 5px;
            letter-spacing: 1px;
          }

          .invoice-title {
            text-align: center;
            margin: 12px 0;
          }

          .invoice-title h2 {
            margin: 0;
            font-size: 17px;
            color: #35151c;
          }

          .invoice-title p {
            margin: 5px 0 0;
            font-size: 11px;
            color: #806d70;
          }

          .card {
            border: 1px solid #e8d9d6;
            border-radius: 9px;
            padding: 9px;
            margin-bottom: 9px;
          }

          .card h3 {
            color: #641f2b;
            font-size: 14px;
            margin: 0 0 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #f2e4e1;
          }

          .row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 8px;
            margin: 5px 0;
          }

          .label {
            color: #806d70;
            font-size: 11px;
          }

          .value {
            color: #35151c;
            font-size: 11px;
            font-weight: bold;
            text-align: left;
          }

          .product {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 8px 0;
            border-bottom: 1px dashed #e8d9d6;
          }

          .product:last-child {
            border-bottom: none;
          }

          .product img {
            width: 42px;
            height: 42px;
            object-fit: cover;
            border-radius: 7px;
            border: 1px solid #e8d9d6;
            flex-shrink: 0;
          }

          .product-info {
            flex: 1;
            min-width: 0;
          }

          .product-name {
            color: #35151c;
            font-size: 11px;
            font-weight: bold;
            line-height: 1.5;
          }

          .product-meta {
            color: #806d70;
            font-size: 10px;
            margin-top: 3px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            padding: 5px 0;
            font-size: 11px;
          }

          .summary-label {
            color: #806d70;
          }

          .summary-value {
            color: #35151c;
            font-weight: bold;
          }

          .divider {
            border: none;
            border-top: 1px dashed #d8c7c4;
            margin: 8px 0;
          }

          .total {
            margin-top: 9px;
            padding: 11px;
            border-radius: 8px;
            background: #641f2b;
            color: #ffffff;
            text-align: center;
          }

          .total-label {
            font-size: 10px;
            opacity: 0.8;
          }

          .total-value {
            margin-top: 4px;
            font-size: 21px;
            font-weight: 900;
          }

          .cod {
            margin-top: 9px;
            padding: 7px;
            border-radius: 7px;
            background: #f2e4e1;
            color: #641f2b;
            text-align: center;
            font-size: 10px;
            font-weight: bold;
          }

          .qr {
            text-align: center;
            margin-top: 14px;
            padding-top: 12px;
            border-top: 1px dashed #e8d9d6;
          }

          .qr img {
            width: 92px;
            height: 92px;
          }

          .qr p {
            margin: 6px 0 0;
            color: #806d70;
            font-size: 9px;
          }

          .footer {
            text-align: center;
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid #e8d9d6;
          }

          .footer strong {
            display: block;
            color: #641f2b;
            font-size: 11px;
          }

          .footer span {
            display: block;
            margin-top: 4px;
            color: #9a898b;
            font-size: 8px;
          }

          @media print {

            @page {
              size: 100mm 150mm;
              margin: 5mm;
            }

            body {
              width: 80mm;
              padding: 0;
            }

            .no-print {
              display: none !important;
            }

          }

        </style>

      </head>

      <body>

        <div class="invoice">

          <div class="brand">
            <h1 class="brand-name">
              سهرة
            </h1>

            <div class="brand-subtitle">
              SAHRA
            </div>
          </div>

          <div class="invoice-title">
            <h2>
              فاتورة الطلب
            </h2>

            <p>
              رقم الطلب: ${order.orderNumber}
            </p>
          </div>

          <div class="card">

            <h3>
              بيانات الطلب
            </h3>

            <div class="row">
              <span class="label">
                رقم الطلب
              </span>

              <span class="value">
                ${order.orderNumber || "-"}
              </span>
            </div>

            <div class="row">
              <span class="label">
                التاريخ
              </span>

              <span class="value">
                ${orderDate}
              </span>
            </div>

            <div class="row">
              <span class="label">
                طريقة الدفع
              </span>

              <span class="value">
                الدفع عند الاستلام
              </span>
            </div>

          </div>

          <div class="card">

            <h3>
              بيانات العميل
            </h3>

            <div class="row">
              <span class="label">
                الاسم
              </span>

              <span class="value">
                ${order.customer?.name || "-"}
              </span>
            </div>

            <div class="row">
              <span class="label">
                الجوال
              </span>

              <span class="value">
                ${order.customer?.phone || "-"}
              </span>
            </div>

            <div class="row">
              <span class="label">
                المدينة
              </span>

              <span class="value">
                ${order.customer?.city || "-"}
              </span>
            </div>

            <div class="row">
              <span class="label">
                العنوان
              </span>

              <span class="value">
                ${order.customer?.address || "-"}
              </span>
            </div>

          </div>

          <div class="card">

            <h3>
              المنتجات
            </h3>

            ${
              order.items
                ?.map(
                  (item) => `
                  <div class="product">

                    ${
                      item.image
                        ? `
                          <img
                            src="${item.image}"
                            alt="${item.name || "المنتج"}"
                          />
                        `
                        : ""
                    }

                    <div class="product-info">

                      <div class="product-name">
                        ${item.name || "منتج"}
                      </div>

                      <div class="product-meta">
                        الكمية: ${item.quantity ?? 0}
                      </div>

                      <div class="product-meta">
                        السعر: ${Number(item.price ?? 0).toFixed(2)} ريال
                      </div>

                    </div>

                  </div>
                `,
                )
                .join("") || "<p>لا توجد منتجات</p>"
            }

          </div>

          <div class="card">

            <h3>
              ملخص المبلغ
            </h3>

            <div class="summary-row">
              <span class="summary-label">
                إجمالي المنتجات
              </span>

              <span class="summary-value">
                ${Number(order.subtotal ?? order.total ?? 0).toFixed(2)}
                ريال
              </span>
            </div>

            <div class="summary-row">
              <span class="summary-label">
                الشحن
              </span>

              <span class="summary-value">
                ${
                  Number(order.shipping ?? 0) > 0
                    ? `${Number(order.shipping).toFixed(2)} ريال`
                    : "مجاني"
                }
              </span>
            </div>

            <hr class="divider" />

            <div class="total">
              <div class="total-label">
                الإجمالي النهائي
              </div>

              <div class="total-value">
                ${Number(order.total ?? 0).toFixed(2)}
                ريال
              </div>
            </div>

            <div class="cod">
              الدفع عند الاستلام
            </div>

          </div>

          <div class="qr">

            <img
              src="${qrImage}"
              alt="QR"
            />

            <p>
              امسح رمز QR لعرض معلومات الطلب
            </p>

          </div>

          <div class="footer">
            <strong>
              شكرًا لاختيارك سهرة
            </strong>

            <span>
              جميع الحقوق محفوظة © 2026 سهرة
            </span>
          </div>

        </div>

        <script>

          window.onload = function () {
            setTimeout(() => {
              window.print();
            }, 500);
          };

        </script>

      </body>

      </html>
    `);

    invoiceWindow.document.close();
  };

  return (
    <button
      type="button"
      onClick={printInvoice}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4A1821] hover:shadow-md"
    >
      🧾 طباعة الفاتورة
    </button>
  );
}
