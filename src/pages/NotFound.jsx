import { Link } from "react-router-dom";
import { FaArrowLeft, FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-[var(--sahra-ivory)] px-4 py-16"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F2E4E1]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#E8D9D6]/60" />

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* 404 */}
        <div className="relative mx-auto mb-8 w-fit">
          <span className="select-none text-[110px] font-black leading-none tracking-[-0.08em] text-[#641F2B]/10 sm:text-[150px]">
            404
          </span>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-[#E8D9D6] bg-white text-[#641F2B] shadow-[0_15px_40px_rgba(100,31,43,0.10)]">
              <FaSearch className="text-2xl" />
            </div>
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#A83F55]">
          SAHRA
        </p>

        <h1 className="mt-3 text-3xl font-black text-[#4A1821] md:text-5xl">
          الصفحة غير موجودة
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-[#806D70] md:text-base">
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها. يمكنك
          العودة إلى الرئيسية ومتابعة تصفح منتجات سهرة.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#641F2B] px-7 py-4 font-bold text-white shadow-[0_12px_30px_rgba(100,31,43,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#4A1821] hover:shadow-[0_18px_38px_rgba(100,31,43,0.24)] sm:w-auto"
          >
            <FaHome className="text-sm" />
            الصفحة الرئيسية
          </Link>

          <Link
            to="/products"
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-[#E8D9D6] bg-white px-7 py-4 font-bold text-[#641F2B] shadow-[0_8px_25px_rgba(100,31,43,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8B8B9] hover:bg-[#FBF6F1] sm:w-auto"
          >
            تصفح المنتجات
            <FaArrowLeft className="text-sm" />
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#806D70]">
          إذا وصلت إلى هنا من خلال رابط محفوظ، يمكنك العودة للمنتجات والبحث عن
          ما تحتاجه.
        </p>
      </div>
    </main>
  );
}
