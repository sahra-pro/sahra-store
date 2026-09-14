import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import { useStore } from "../../hooks/useStore";

export default function WhatsAppFloat() {
  // رقم واتساب شهدان ستور بدون علامة +
  const phone = "966565392592";

  const location = useLocation();
  const { getProductBySlug } = useStore();

  const slug = decodeURIComponent(location.pathname.split("/").pop() || "");

  const currentProduct = getProductBySlug(slug);

  let message = "السلام عليكم، أريد الاستفسار عن منتجات شهدان ستور.";

  if (location.pathname.startsWith("/product/") && currentProduct) {
    message = `السلام عليكم

أرغب بالاستفسار عن هذا المنتج في شهدان ستور:

- المنتج: ${currentProduct.name}
- السعر: ${currentProduct.price} ر.س

🔗 رابط المنتج:
${window.location.href}

هل المنتج متوفر؟`;
  }

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="واتساب"
      className="
        whatsapp-btn
        fixed bottom-[120px] left-5 z-[9999]
        flex items-center gap-3
        rounded-full
        bg-[#25D366]
        px-4 py-3
        text-white
        shadow-2xl
        transition-all duration-300
        hover:scale-105
        md:bottom-5
      "
    >
      <FaWhatsapp size={30} />

      <div className="hidden sm:block">
        <p className="text-sm font-bold">تحدث معنا</p>

        <p className="text-xs opacity-90">خدمة عملاء شهدان ستور</p>
      </div>
    </a>
  );
}
