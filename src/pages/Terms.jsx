import { Helmet } from "react-helmet-async";
import {
  FaFileContract,
  FaShoppingBag,
  FaTag,
  FaUserCheck,
  FaCopyright,
  FaEnvelope,
} from "react-icons/fa";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>الشروط والأحكام | سهرة</title>

        <meta
          name="description"
          content="اطلع على الشروط والأحكام المنظمة لاستخدام موقع سهرة وإتمام عمليات الشراء."
        />
      </Helmet>

      <main dir="rtl" className="min-h-screen bg-[var(--sahra-ivory)]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#641F2B]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#A83F55]/20" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 py-14 text-center md:px-6 md:py-20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#F2E4E1] shadow-lg backdrop-blur-sm">
              <FaFileContract className="text-2xl" />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#F2E4E1]">
              SAHRA
            </p>

            <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
              الشروط والأحكام
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-white/70 md:text-base">
              توضح هذه الشروط القواعد العامة لاستخدام موقع سهرة وإتمام عمليات
              الشراء من خلاله.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
          <div className="overflow-hidden rounded-[32px] border border-[#E8D9D6] bg-white shadow-[0_18px_50px_rgba(100,31,43,0.07)]">
            <div className="p-6 md:p-10 lg:p-12">
              <div className="space-y-10 text-sm leading-8 text-[#806D70] md:text-base">
                {/* Introduction */}
                <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-5 md:p-6">
                  <p>
                    باستخدامك لموقع سهرة أو إتمامك لأي عملية شراء من خلاله، فإنك
                    تقر بقراءة هذه الشروط وفهمها والموافقة على الالتزام بها.
                  </p>
                </div>

                {/* Orders */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                      <FaShoppingBag />
                    </div>

                    <h2 className="text-2xl font-black text-[#4A1821]">
                      الطلبات والشراء
                    </h2>
                  </div>

                  <p>
                    يتم إرسال الطلب بعد إدخال البيانات المطلوبة وإتمام خطوات
                    الشراء. يحق لسهرة مراجعة الطلب قبل اعتماده، وقد يتم إلغاء
                    الطلب في حال وجود مشكلة في توفر المنتج أو البيانات المدخلة
                    أو وجود خطأ واضح في تفاصيل الطلب.
                  </p>
                </div>

                {/* Prices */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                      <FaTag />
                    </div>

                    <h2 className="text-2xl font-black text-[#4A1821]">
                      الأسعار والعروض
                    </h2>
                  </div>

                  <p>
                    يتم عرض سعر كل منتج وقت التصفح والطلب. قد تتغير الأسعار أو
                    العروض من وقت لآخر، ويُعتد بالسعر الظاهر للعميل عند إتمام
                    الطلب، ما لم يوجد خطأ تقني أو كتابي واضح.
                  </p>
                </div>

                {/* Customer Responsibility */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                      <FaUserCheck />
                    </div>

                    <h2 className="text-2xl font-black text-[#4A1821]">
                      مسؤولية العميل
                    </h2>
                  </div>

                  <p>
                    يلتزم العميل بتقديم بيانات صحيحة وكاملة عند الطلب، والتأكد
                    من صحة معلومات التواصل وعنوان التوصيل. كما يلتزم باستخدام
                    المنتجات وفق التعليمات والمعلومات المرفقة بها.
                  </p>
                </div>

                {/* Intellectual Property */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                      <FaCopyright />
                    </div>

                    <h2 className="text-2xl font-black text-[#4A1821]">
                      الملكية الفكرية
                    </h2>
                  </div>

                  <p>
                    جميع النصوص والصور والعناصر البصرية والشعارات والتصاميم
                    المنشورة عبر موقع سهرة مخصصة للموقع ومحتواه، ولا يجوز نسخها
                    أو إعادة استخدامها أو نشرها دون الحصول على إذن مسبق.
                  </p>
                </div>

                {/* Changes */}
                <div>
                  <h2 className="mb-3 text-2xl font-black text-[#4A1821]">
                    تحديث الشروط
                  </h2>

                  <p>
                    قد يتم تحديث هذه الشروط عند الحاجة بما يتناسب مع تطوير خدمات
                    الموقع أو آلية العمل. وتصبح النسخة المنشورة على هذه الصفحة
                    هي المرجع المعتمد عند إجراء أي تحديث.
                  </p>
                </div>

                {/* Contact */}
                <div className="rounded-[28px] bg-[#641F2B] p-6 text-white md:p-8">
                  <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#F2E4E1]">
                      <FaEnvelope />
                    </div>

                    <div>
                      <h2 className="text-xl font-black">هل لديك استفسار؟</h2>

                      <p className="mt-1 text-sm leading-7 text-white/70">
                        إذا كان لديك أي سؤال حول الشروط أو عملية الشراء، يمكنك
                        التواصل معنا عبر البريد الإلكتروني.
                      </p>

                      <a
                        href="mailto:sahra0sales@gmail.com"
                        className="mt-3 inline-block font-bold text-[#F2E4E1] transition-colors hover:text-white"
                      >
                        sahra0sales@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E8D9D6] bg-[#FBF6F1] px-6 py-5 text-center md:px-10">
              <p className="text-xs leading-6 text-[#806D70]">
                تهدف سهرة إلى تقديم تجربة تسوق واضحة وموثوقة، مع توضيح حقوق
                والتزامات جميع الأطراف.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
