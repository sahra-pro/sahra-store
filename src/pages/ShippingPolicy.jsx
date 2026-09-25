import { Helmet } from "react-helmet-async";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaShippingFast,
  FaBoxOpen,
} from "react-icons/fa";
import { FaGlobe, FaInfoCircle } from "react-icons/fa";

export default function ShippingPolicy() {
  return (
    <>
      <Helmet>
        <title>سياسة الشحن والتوصيل | سهرة</title>

        <meta
          name="description"
          content="تعرف على آلية تجهيز الطلبات وشحنها ومدة التوصيل ورسوم الشحن في متجر سهرة."
        />
      </Helmet>

      <section
        dir="rtl"
        className="min-h-screen bg-[var(--sahra-ivory)] py-10 md:py-16"
      >
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="overflow-hidden rounded-[32px] border border-[#E8D9D6] bg-white shadow-[0_20px_60px_rgba(100,31,43,0.08)]">
            {/* Header */}
            <div className="relative overflow-hidden bg-[#641F2B] px-6 py-12 text-center text-white md:px-12 md:py-16">
              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#A83F55]/20" />

              <div className="relative z-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#F2E4E1] shadow-lg backdrop-blur-sm">
                  <FaTruck className="text-2xl" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#F2E4E1]">
                  SAHRA
                </p>

                <h1 className="mt-3 text-3xl font-black md:text-5xl">
                  سياسة الشحن والتوصيل
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-white/70 md:text-base">
                  كل ما تحتاج معرفته عن تجهيز طلبك، شحنه، والمدة المتوقعة
                  لوصوله.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8 p-6 md:p-12">
              {/* Delivery Duration */}{" "}
              <div className="rounded-[24px] border border-[#E8D9D6] bg-[#FBF6F1] p-6 md:p-7">
                {" "}
                {/* Header */}{" "}
                <div className="mb-6 text-center">
                  {" "}
                  <p className="text-xs font-black tracking-[0.3em] text-[#A83F55]">
                    {" "}
                    SAHRA™{" "}
                  </p>{" "}
                  <div className="mt-2 flex items-center justify-center gap-3">
                    {" "}
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                      {" "}
                      <FaTruck />{" "}
                    </div>{" "}
                    <h2 className="text-2xl font-black text-[#4A1821]">
                      {" "}
                      مدة التوصيل{" "}
                    </h2>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Delivery Times */}{" "}
                <div className="grid gap-4 sm:grid-cols-3">
                  {" "}
                  {/* Saudi Arabia */}{" "}
                  <div className="group rounded-2xl border border-[#E8D9D6] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A5AD] hover:shadow-[0_12px_30px_rgba(74,24,33,0.08)]">
                    {" "}
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                      {" "}
                      <FaTruck />{" "}
                    </div>{" "}
                    <h3 className="font-black text-[#4A1821]">
                      {" "}
                      السعودية{" "}
                    </h3>{" "}
                    <p className="mt-2 text-sm font-bold text-[#A83F55]">
                      {" "}
                      خلال 3 أيام عمل{" "}
                    </p>{" "}
                  </div>{" "}
                  {/* Gulf Countries */}{" "}
                  <div className="group rounded-2xl border border-[#E8D9D6] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A5AD] hover:shadow-[0_12px_30px_rgba(74,24,33,0.08)]">
                    {" "}
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                      {" "}
                      <FaGlobe />{" "}
                    </div>{" "}
                    <h3 className="font-black text-[#4A1821]">
                      {" "}
                      دول الخليج{" "}
                    </h3>{" "}
                    <p className="mt-2 text-sm font-bold text-[#A83F55]">
                      {" "}
                      خلال 6 أيام عمل{" "}
                    </p>{" "}
                  </div>{" "}
                  {/* Turkey */}{" "}
                  <div className="group rounded-2xl border border-[#E8D9D6] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A5AD] hover:shadow-[0_12px_30px_rgba(74,24,33,0.08)]">
                    {" "}
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                      {" "}
                      <FaMapMarkerAlt />{" "}
                    </div>{" "}
                    <h3 className="font-black text-[#4A1821]"> تركيا </h3>{" "}
                    <p className="mt-2 text-sm font-bold text-[#A83F55]">
                      {" "}
                      في نفس اليوم{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Note */}{" "}
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#E8D9D6] bg-white/70 p-4">
                  {" "}
                  <div className="mt-0.5 shrink-0 text-[#D49B35]">
                    {" "}
                    <FaInfoCircle />{" "}
                  </div>{" "}
                  <p className="text-sm leading-7 text-[#806D70]">
                    {" "}
                    قد تختلف المدة في حالات استثنائية لدى شركة الشحن.{" "}
                  </p>{" "}
                </div>{" "}
              </div>
              {/* Processing */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                    <FaBoxOpen />
                  </div>

                  <h2 className="text-2xl font-black text-[#4A1821]">
                    تجهيز الطلب
                  </h2>
                </div>

                <p className="leading-8 text-[#806D70]">
                  بعد تأكيد الطلب، يتم العمل على تجهيزه وتجميع المنتجات المطلوبة
                  قبل تسليمه لخدمة الشحن. قد تختلف مدة التجهيز بحسب توفر المنتج
                  وطبيعة الطلب.
                </p>
              </div>
              {/* Delivery Time */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                    <FaClock />
                  </div>

                  <h2 className="text-2xl font-black text-[#4A1821]">
                    مدة التوصيل
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#E8D9D6] bg-white p-5">
                    <p className="mb-2 text-sm font-bold text-[#641F2B]">
                      المدن والمناطق الرئيسية
                    </p>

                    <p className="text-sm leading-7 text-[#806D70]">
                      تختلف مدة الوصول بحسب موقع العميل وخدمة الشحن المتاحة.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E8D9D6] bg-white p-5">
                    <p className="mb-2 text-sm font-bold text-[#641F2B]">
                      المناطق الأخرى
                    </p>

                    <p className="text-sm leading-7 text-[#806D70]">
                      قد تحتاج بعض المناطق إلى مدة إضافية بحسب شركة الشحن وبعدها
                      عن مراكز التوزيع.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#806D70]">
                  المدد المذكورة تقديرية وقد تتأثر بأيام العطلات، المواسم،
                  الظروف التشغيلية، أو أي عوامل خارجة عن نطاق المتجر.
                </p>
              </div>
              {/* Shipping Fees */}
              <div className="rounded-[24px] bg-[#641F2B] p-6 text-white md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#F2E4E1]">
                    <FaShippingFast />
                  </div>

                  <h2 className="text-2xl font-black">رسوم الشحن</h2>
                </div>

                <p className="leading-8 text-white/75">
                  تظهر تكلفة الشحن للعميل أثناء إتمام الطلب وفق قيمة الطلب
                  وإعدادات الشحن المعتمدة في المتجر. وقد تتوفر عروض أو شروط خاصة
                  للشحن المجاني من وقت لآخر.
                </p>
              </div>
              {/* Tracking */}
              <div>
                <h2 className="mb-4 text-2xl font-black text-[#4A1821]">
                  متابعة الشحنة
                </h2>

                <p className="leading-8 text-[#806D70]">
                  عند توفر معلومات التتبع، يمكن تزويد العميل ببيانات الشحنة
                  لمتابعة حالتها حتى وصولها. كما يمكن التواصل مع خدمة العملاء
                  عند وجود أي استفسار متعلق بالطلب أو التوصيل.
                </p>
              </div>
              {/* Important Note */}
              <div className="rounded-[24px] border border-[#E8D9D6] bg-[#F7EEE9] p-6">
                <h2 className="mb-3 text-lg font-black text-[#4A1821]">
                  ملاحظة مهمة
                </h2>

                <p className="text-sm leading-8 text-[#806D70]">
                  يرجى التأكد من صحة رقم الجوال والعنوان وبيانات التواصل عند
                  إتمام الطلب، لأن دقة هذه المعلومات تساعد على تسهيل عملية
                  التوصيل وتجنب التأخير.
                </p>
              </div>
              {/* Footer */}
              <div className="border-t border-[#E8D9D6] pt-7 text-center">
                <p className="text-sm leading-7 text-[#806D70]">
                  في <span className="font-bold text-[#641F2B]">سهرة</span>،
                  نسعى إلى جعل رحلة طلبك واضحة وسهلة من لحظة الشراء حتى وصول
                  المنتج إليك.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
