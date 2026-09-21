import { Helmet } from "react-helmet-async";
import {
  FaLock,
  FaUserShield,
  FaDatabase,
  FaShieldAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>سياسة الخصوصية | سهرة</title>

        <meta
          name="description"
          content="تعرف على كيفية تعامل سهرة مع بيانات العملاء والمعلومات التي يتم جمعها واستخدامها أثناء التسوق وإتمام الطلبات."
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
                  <FaLock className="text-2xl" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#F2E4E1]">
                  SAHRA
                </p>

                <h1 className="mt-3 text-3xl font-black md:text-5xl">
                  سياسة الخصوصية
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-white/70 md:text-base">
                  نوضح لك هنا بشكل مبسط كيف نتعامل مع المعلومات التي تقدمها
                  أثناء استخدامك لمتجر سهرة.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-10 p-6 md:p-12">
              {/* Introduction */}
              <div className="rounded-[24px] border border-[#E8D9D6] bg-[#FBF6F1] p-6 md:p-7">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                    <FaUserShield />
                  </div>

                  <h2 className="text-xl font-black text-[#4A1821]">
                    خصوصيتك تهمنا
                  </h2>
                </div>

                <p className="leading-8 text-[#806D70]">
                  في سهرة نحرص على التعامل مع بياناتك بمسؤولية ووضوح. يتم
                  استخدام المعلومات التي تقدمها بالقدر اللازم لتقديم خدمات
                  المتجر ومعالجة طلباتك والتواصل معك عند الحاجة.
                </p>
              </div>

              {/* Information */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                    <FaDatabase />
                  </div>

                  <h2 className="text-2xl font-black text-[#4A1821]">
                    المعلومات التي قد تقدمها
                  </h2>
                </div>

                <p className="mb-4 leading-8 text-[#806D70]">
                  عند إنشاء طلب أو التواصل معنا، قد نحتاج إلى بعض البيانات
                  الأساسية اللازمة لخدمة طلبك، ومنها:
                </p>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    "الاسم وبيانات التواصل.",
                    "رقم الجوال المستخدم للطلب.",
                    "عنوان ومعلومات التوصيل.",
                    "تفاصيل المنتجات والطلبات.",
                  ].map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-[#E8D9D6] bg-white px-5 py-4 text-sm font-semibold text-[#806D70]"
                    >
                      <span className="ml-2 text-[#A83F55]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* How we use data */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                    <FaShieldAlt />
                  </div>

                  <h2 className="text-2xl font-black text-[#4A1821]">
                    كيف نستخدم المعلومات؟
                  </h2>
                </div>

                <div className="space-y-3">
                  <p className="leading-8 text-[#806D70]">
                    نستخدم البيانات التي يتم تقديمها من أجل معالجة الطلبات
                    وتجهيزها وإيصالها إلى العنوان المسجل، بالإضافة إلى التواصل
                    مع العميل بشأن طلبه عند الحاجة.
                  </p>

                  <p className="leading-8 text-[#806D70]">
                    وقد نستخدم بعض المعلومات لتحسين أداء المتجر وتطوير تجربة
                    التسوق والخدمات المقدمة للعملاء.
                  </p>
                </div>
              </div>

              {/* Data protection */}
              <div className="rounded-[24px] bg-[#641F2B] p-6 text-white md:p-8">
                <h2 className="mb-4 text-2xl font-black">حماية بياناتك</h2>

                <p className="leading-8 text-white/75">
                  نعمل على اتخاذ الإجراءات المناسبة للمحافظة على المعلومات
                  المقدمة عبر المتجر وتقليل احتمالية الوصول إليها أو استخدامها
                  بطريقة غير مصرح بها.
                </p>
              </div>

              {/* Third parties */}
              <div>
                <h2 className="mb-4 text-2xl font-black text-[#4A1821]">
                  مشاركة المعلومات
                </h2>

                <p className="leading-8 text-[#806D70]">
                  لا يتم التعامل مع بيانات الطلبات على أنها معلومات متاحة
                  للعامة. وقد تتم مشاركة البيانات الضرورية فقط مع الجهات التي
                  تحتاج إليها لتنفيذ الخدمة المطلوبة، مثل خدمات التوصيل، أو
                  عندما يكون ذلك مطلوبًا بموجب الأنظمة واللوائح المعمول بها.
                </p>
              </div>

              {/* Contact */}
              <div className="rounded-[24px] border border-[#E8D9D6] bg-[#F7EEE9] p-6 text-center md:p-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#A83F55] shadow-sm">
                  <FaEnvelope />
                </div>

                <h2 className="text-xl font-black text-[#4A1821]">
                  لديك استفسار؟
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#806D70]">
                  إذا كان لديك سؤال يتعلق ببياناتك أو بطريقة التعامل معها،
                  يسعدنا استقبال استفسارك.
                </p>

                <a
                  href="mailto:sahra0sales@gmail.com"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#641F2B] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821]"
                >
                  <FaEnvelope />
                  sahra0sales@gmail.com
                </a>
              </div>

              {/* Footer */}
              <div className="border-t border-[#E8D9D6] pt-7 text-center">
                <p className="text-sm leading-7 text-[#806D70]">
                  في <span className="font-bold text-[#641F2B]">سهرة</span>،
                  نحترم خصوصيتك ونسعى إلى تقديم تجربة تسوق واضحة وموثوقة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
