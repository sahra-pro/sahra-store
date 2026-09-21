import { FaEnvelope, FaHeadset, FaHeart, FaCheckCircle } from "react-icons/fa";

function About() {
  return (
    
    <div className="min-h-screen bg-[var(--sahra-ivory)] py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="overflow-hidden rounded-[32px] border border-[#E8D9D6] bg-white shadow-[0_20px_60px_rgba(100,31,43,0.08)]">
          {/* Hero */}
          <div className="relative overflow-hidden bg-[#641F2B] px-6 py-14 text-center text-white md:px-12 md:py-20">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#A83F55]/20" />

            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-24 w-40 items-center justify-center rounded-[26px] border border-white/15  px-3 py-2 shadow-lg backdrop-blur-sm">
                <img
                  src="/sahra-1.png"
                  alt="سهرة"
                  className="h-full w-full scale-125 object-contain"
                />
              </div>

              <h1 className="text-3xl font-black leading-tight md:text-5xl">
                مرحبًا بكم في سهرة
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/75 md:text-base">
                وجهتكم للتسوق واكتشاف مجموعة مختارة من المنتجات بعناية، مع تجربة
                إلكترونية بسيطة ومريحة.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 p-6 md:p-12">
            {/* من نحن */}
            <div className="rounded-[26px] border border-[#E8D9D6] bg-[#FBF6F1] p-6 md:p-8">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-black text-[#4A1821]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                  <FaHeart />
                </span>
                من نحن
              </h2>

              <p className="leading-8 text-[#806D70]">
                في سهرة نحرص على تقديم تجربة تسوق واضحة وسهلة، من خلال مجموعة
                مختارة من المنتجات التي تلبي احتياجات عملائنا، مع الاهتمام
                بالتفاصيل وجودة الخدمة في مختلف مراحل الطلب.
              </p>
            </div>

            {/* ما نقدمه */}
            <div>
              <h2 className="mb-5 flex items-center gap-3 text-2xl font-black text-[#4A1821]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                  <FaCheckCircle />
                </span>
                ما نقدمه
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[#E8D9D6] bg-white p-5">
                  <h3 className="mb-2 font-bold text-[#641F2B]">
                    اختيارات مميزة
                  </h3>
                  <p className="text-sm leading-7 text-[#806D70]">
                    منتجات يتم اختيارها بعناية لتوفير خيارات متنوعة لعملائنا.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8D9D6] bg-white p-5">
                  <h3 className="mb-2 font-bold text-[#641F2B]">تجربة سهلة</h3>
                  <p className="text-sm leading-7 text-[#806D70]">
                    نسعى لجعل تصفح المنتجات وإتمام الطلب عملية بسيطة وواضحة.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8D9D6] bg-white p-5">
                  <h3 className="mb-2 font-bold text-[#641F2B]">خدمة موثوقة</h3>
                  <p className="text-sm leading-7 text-[#806D70]">
                    نهتم بخدمة العميل والتواصل معه قبل وأثناء وبعد الطلب.
                  </p>
                </div>
              </div>
            </div>

            {/* خدمة العملاء */}
            <div className="rounded-[26px] bg-[#641F2B] p-6 text-white md:p-8">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-black">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#F2E4E1]">
                  <FaHeadset />
                </span>
                خدمة العملاء
              </h2>

              <p className="leading-8 text-white/75">
                رضاكم محل اهتمامنا، لذلك نحرص على تقديم الدعم والإجابة عن
                استفساراتكم ومساعدتكم قبل وأثناء وبعد إتمام الطلب.
              </p>
            </div>

            {/* التواصل */}
            <div className="rounded-[26px] border border-[#E8D9D6] bg-[#F7EEE9] p-7 text-center md:p-9">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#A83F55] shadow-sm">
                <FaEnvelope className="text-xl" />
              </div>

              <h3 className="text-2xl font-black text-[#4A1821]">
                يسعدنا تواصلكم معنا
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#806D70]">
                لأي استفسار أو مساعدة، يمكنكم التواصل معنا عبر البريد
                الإلكتروني.
              </p>

              <a
                href="mailto:info@sahra.com"
                className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-[#641F2B] px-6 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(100,31,43,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#4A1821] hover:shadow-[0_15px_35px_rgba(100,31,43,0.25)]"
              >
                <FaEnvelope />
                تواصل معنا عبر البريد
              </a>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E8D9D6] pt-7 text-center">
              <p className="text-sm leading-7 text-[#806D70]">
                شكرًا لاختياركم{" "}
                <span className="font-bold text-[#641F2B]">سهرة</span>، ونتمنى
                لكم تجربة تسوق ممتعة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
