import { FaThLarge, FaArrowDown } from "react-icons/fa";
import Categories from "../components/common/Categories";

function CategoriesPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[var(--sahra-ivory)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#641F2B]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#A83F55]/20" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 text-center md:px-6 md:py-20">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#F2E4E1] shadow-lg backdrop-blur-sm">
            <FaThLarge className="text-2xl" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#F2E4E1]">
            SAHRA
          </p>

          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
            أقسام سهرة
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-white/70 md:text-base">
            تصفح أقسام المتجر واكتشف المنتجات التي تناسب احتياجك بسهولة.
          </p>

          <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-sm">
            <FaArrowDown className="text-[#F2E4E1]" />
            اكتشف الأقسام
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="rounded-[32px] border border-[#E8D9D6] bg-white p-4 shadow-[0_15px_45px_rgba(100,31,43,0.06)] md:p-8">
          <Categories />
        </div>
      </section>
    </main>
  );
}

export default CategoriesPage;
