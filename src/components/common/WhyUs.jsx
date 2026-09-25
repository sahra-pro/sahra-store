import {
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaLock,
  FaClipboardCheck,
  FaGift,
} from "react-icons/fa";

function WhyUs() {
  const features = [
    {
      icon: <FaCheckCircle />,
      title: "منتجات أصلية 100%",
      desc: "نحرص على توفير منتجات أصلية وموثوقة لتجربة شراء مطمئنة.",
    },
    {
      icon: <FaTruck />,
      title: "شحن سريع",
      desc: "شحن سريع إلى مختلف مناطق السعودية خلال 3 أيام.",
    },
    {
      icon: <FaShieldAlt />,
      title: "الضمان الذهبي",
      desc: "ضمان ذهبي يمنحك مزيدًا من الثقة والاطمئنان عند الشراء.",
    },
    {
      icon: <FaLock />,
      title: "تغليف سري",
      desc: "نحرص على تغليف طلبك بعناية وخصوصية تامة.",
    },
    {
      icon: <FaClipboardCheck />,
      title: "توثيق الطلب قبل الشحن",
      desc: "نتأكد من تفاصيل طلبك قبل الشحن لتقليل الأخطاء وضمان وصوله بشكل صحيح.",
    },
    {
      icon: <FaGift />,
      title: "هدايا جميلة مع الطلبات",
      desc: "قد تجد هدية جميلة مضافة إلى طلبك تقديرًا لثقتك بنا.",
    },
  ];

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-[#FBF6F1] py-16 md:py-24"
    >
      {/* Decorative Shapes */}
      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-[#A83F55]/6 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#641F2B]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center md:mb-14">
          <p className="text-xs font-black tracking-[0.3em] text-[#A83F55]">
            SAHRA™
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#4A1821] md:text-4xl">
            لماذا سهرة؟
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#641F2B] to-[#A83F55]" />

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#806D70] md:text-base">
            تفاصيل نهتم بها لنمنحك تجربة شراء أكثر ثقة وراحة.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[24px] border border-[#E8D9D6] bg-white p-4 text-center shadow-[0_8px_30px_rgba(74,24,33,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D6A5AD] hover:shadow-[0_20px_45px_rgba(74,24,33,0.12)] md:p-7"
            >
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2E4E1] text-xl text-[#641F2B] transition-all duration-500 group-hover:bg-[#641F2B] group-hover:text-white group-hover:shadow-lg md:mb-6 md:h-16 md:w-16 md:text-2xl">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2 text-sm font-black text-[#4A1821] transition-colors duration-300 group-hover:text-[#A83F55] md:mb-3 md:text-lg">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[11px] leading-5 text-[#806D70] md:text-sm md:leading-7">
                {item.desc}
              </p>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-[#641F2B] to-[#A83F55] transition-all duration-500 group-hover:w-1/2" />
            </div>
          ))}
        </div>

        {/* Trust Message */}
        <div className="mx-auto mt-10 max-w-xl text-center md:mt-14">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#D8B6B9] bg-white px-6 py-3 shadow-[0_8px_25px_rgba(74,24,33,0.06)]">
            <FaShieldAlt className="text-[#D49B35]" />

            <span className="text-sm font-black text-[#641F2B] md:text-base">
              اطلب بثقة
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
