import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import { useStore } from "../../hooks/useStore";

export default function WhatsAppFloat() {
  // رقم واتساب سهرة بدون علامة +
  const phone = "905555507388";

  const location = useLocation();
  const { getProductBySlug } = useStore();

  const slug = decodeURIComponent(location.pathname.split("/").pop() || "");

  const currentProduct = getProductBySlug(slug);

  let message = "السلام عليكم، أريد الاستفسار عن منتجات سهرة.";

  if (location.pathname.startsWith("/product/") && currentProduct) {
    message = `السلام عليكم

أرغب بالاستفسار عن هذا المنتج في سهرة:

- المنتج: ${currentProduct.name}
- السعر: ${currentProduct.price} ر.س

🔗 رابط المنتج:
${window.location.href}

هل المنتج متوفر؟`;
  }

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-[120px] left-5 z-[9999] md:bottom-5">
      {/* نبضة هوية سهرة */}
      <span
        className="
          absolute inset-0
          rounded-full
          bg-[#A83F55]
          opacity-70
          animate-[sahraWhatsappPulse_2s_ease-out_infinite]
        "
      />

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="واتساب"
        className="
          relative
          flex items-center gap-3
          rounded-full
          bg-[#25D366]
          px-4 py-3
          text-white
          shadow-2xl
          ring-4 ring-[#A83F55]/20
          transition-all duration-300
          hover:scale-105
          hover:ring-[#A83F55]/40
          active:scale-95
        "
      >
        <FaWhatsapp size={30} />

        <div className="hidden sm:block">
          <p className="text-sm font-bold">تحدث معنا</p>
          <p className="text-xs opacity-90">خدمة عملاء سهرة</p>
        </div>
      </a>

      <style>{`
        @keyframes sahraWhatsappPulse {
          0% {
            transform: scale(1);
            opacity: 0.55;
          }

          70% {
            transform: scale(1.55);
            opacity: 0;
          }

          100% {
            transform: scale(1.55);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
