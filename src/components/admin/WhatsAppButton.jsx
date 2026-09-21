export default function WhatsAppButton({ order }) {
  const sendWhatsApp = () => {
    let phone = String(order.customer?.phone || "").replace(/\D/g, "");

    // تحويل الرقم السعودي من 05 إلى 966
    if (phone.startsWith("05")) {
      phone = "966" + phone.substring(1);
    }

    const message = `
السلام عليكم ${order.customer?.name || ""}

شكرًا لطلبك من سهرة 🤍

تم استلام طلبك بنجاح.

رقم الطلب:
${order.orderNumber}

تفاصيل الطلب:

${
  order.items
    ?.map(
      (item) =>
        `• ${item.name}
الكمية: ${item.quantity}
الإجمالي: ${(item.price * item.quantity).toFixed(2)} ريال`,
    )
    .join("\n\n") || "لا توجد تفاصيل للمنتجات"
}

────────────────

إجمالي المنتجات:
${(order.subtotal ?? order.total).toFixed(2)} ريال

الشحن:
${
  (order.shipping ?? 0) > 0
    ? `${Number(order.shipping).toFixed(2)} ريال`
    : "مجاني"
}

الإجمالي النهائي:
${Number(order.total ?? 0).toFixed(2)} ريال

طريقة الدفع:
الدفع عند الاستلام

عنوان التوصيل:
${order.customer?.city || ""}
${order.customer?.address || ""}

حالة الطلب:
جاري المراجعة والتجهيز.

سيتم التواصل معك عند تجهيز الطلب وخروجه للتوصيل.

شكرًا لاختيارك سهرة 🤍
`;

    if (!phone) {
      alert("رقم جوال العميل غير موجود.");
      return;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <button
      type="button"
      onClick={sendWhatsApp}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe5d] hover:shadow-md"
    >
      💬 واتساب العميل
    </button>
  );
}
