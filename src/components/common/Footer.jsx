import { FaWhatsapp, FaInstagram, FaTruck, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#4A1821] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo */}
          <div>
            <h2 className="mb-4 text-3xl font-bold text-[#F2C8C8]">سهرة</h2>

            <p className="leading-8 text-[#E8D9D6]">
              متجر سهرة يقدم لك مجموعة مختارة بعناية من المنتجات، بتجربة تسوق
              أنيقة وموثوقة وخدمة نهتم من خلالها بكل تفاصيل طلبك.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">روابط سريعة</h3>

            <div className="flex flex-col gap-3 text-[#E8D9D6]">
              <Link
                to="/"
                className="transition duration-300 hover:text-[#F2C8C8]"
              >
                الرئيسية
              </Link>

              <Link
                to="/products"
                className="transition duration-300 hover:text-[#F2C8C8]"
              >
                المنتجات
              </Link>

              <Link
                to="/products?category=العروض+والبكجات"
                className="transition duration-300 hover:text-[#F2C8C8]"
              >
                العروض
              </Link>

              <Link
                to="/about"
                className="transition duration-300 hover:text-[#F2C8C8]"
              >
                تواصل معنا
              </Link>

              <Link
                to="/return-policy"
                className="transition duration-300 hover:text-[#F2C8C8]"
              >
                سياسة الاسترجاع والاستبدال
              </Link>
            </div>
          </div>

          {/* السياسات */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">السياسات</h3>

            <div className="flex flex-col gap-3 text-[#E8D9D6]">
              <Link
                className="transition duration-300 hover:text-[#F2C8C8]"
                to="/return-policy"
              >
                سياسة الاسترجاع والاستبدال
              </Link>

              <Link
                className="transition duration-300 hover:text-[#F2C8C8]"
                to="/shipping-policy"
              >
                سياسة الشحن والتوصيل
              </Link>

              <Link
                className="transition duration-300 hover:text-[#F2C8C8]"
                to="/privacy-policy"
              >
                سياسة الخصوصية
              </Link>

              <Link
                className="transition duration-300 hover:text-[#F2C8C8]"
                to="/terms"
              >
                الشروط والأحكام
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">تواصل معنا</h3>

            <div className="space-y-4 text-[#E8D9D6]">
              <p>التواصل عبر واتساب</p>
              <p>خدمة عملاء سهرة</p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">لماذا سهرة؟</h3>

            <div className="space-y-4 text-[#E8D9D6]">
              <div className="flex items-center gap-3">
                <FaTruck className="text-[#D98A9D]" />
                <span>شحن سريع</span>
              </div>

              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-[#D98A9D]" />
                <span>دفع آمن</span>
              </div>

              <div className="flex items-center gap-3">
                <FaWhatsapp className="text-[#D98A9D]" />
                <span>دعم عبر واتساب</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#71333F] pt-6 md:flex-row">
          <p className="text-sm text-[#CDB9BA]">
            © 2026 سهرة | جميع الحقوق محفوظة
          </p>

          <div className="flex gap-4 text-2xl">
            <a
              href="#"
              aria-label="Instagram"
              className="text-[#E8D9D6] transition duration-300 hover:text-[#F2C8C8]"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="WhatsApp"
              className="text-[#E8D9D6] transition duration-300 hover:text-[#F2C8C8]"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
