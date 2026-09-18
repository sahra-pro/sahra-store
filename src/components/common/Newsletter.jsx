function Newsletter() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-[#641F2B] py-16 text-white md:py-20"
    >
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#A83F55]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#F2E4E1]/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Small Label */}
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8C5CC]">
          SAHRA STORE
        </p>

        {/* Heading */}
        <h2 className="mt-3 text-3xl font-black md:text-4xl">
          اشترك ليصلك كل جديد
        </h2>

        <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#DCA5B1]" />

        {/* Description */}
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#F2E4E1] md:text-base">
          احصل على أحدث العروض والمنتجات الجديدة من سهرة.
        </p>

        {/* Form */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:mt-10 sm:flex-row">
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            aria-label="البريد الإلكتروني"
            className="min-h-[52px] flex-1 rounded-2xl border border-white/15 bg-white px-5 text-sm text-[#4A1821] shadow-lg outline-none transition placeholder:text-[#9B8588] focus:border-[#E8C5CC] focus:ring-2 focus:ring-[#E8C5CC]/30"
          />

          <button
            type="button"
            className="min-h-[52px] rounded-2xl bg-white px-8 text-sm font-bold text-[#641F2B] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F7EEE9] hover:shadow-xl"
          >
            اشتراك
          </button>
        </div>

        <p className="mt-4 text-[11px] text-[#E8C5CC]">
          لن نرسل لك رسائل مزعجة، ويمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>
    </section>
  );
}

export default Newsletter;
