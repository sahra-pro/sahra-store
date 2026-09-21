import { Helmet } from "react-helmet-async";
import {
  FaExchangeAlt,
  FaUndo,
  FaBoxOpen,
  FaExclamationTriangle,
  FaClock,
  FaEnvelope,
  FaShippingFast,
} from "react-icons/fa";

export default function ReturnPolicy() {
  return (
    <>
      <Helmet>
        <meta property="og:type" content="website" />

        <meta property="og:title" content="سياسة الاسترجاع والاستبدال | سهرة" />

        <meta
          property="og:description"
          content="اطلع على ضوابط الاسترجاع والاستبدال وآلية التعامل مع المنتجات التالفة أو غير المطابقة في سهرة."
        />

        <title>سياسة الاسترجاع والاستبدال | سهرة</title>

        <meta
          name="description"
          content="تعرف على سياسة الاسترجاع والاستبدال في سهرة والشروط المتعلقة بإعادة المنتجات واستبدالها."
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
                  <FaExchangeAlt className="text-2xl" />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#F2E4E1]">
                  SAHRA
                </p>

                <h1 className="mt-3 text-3xl font-black md:text-5xl">
                  الاسترجاع والاستبدال
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-white/70 md:text-base">
                  تعرف على الإجراءات والشروط المتعلقة بإعادة المنتجات أو
                  استبدالها.
                </p>
              </div>
            </div>

            {/* Last Update */}
            <div className="border-b border-[#E8D9D6] bg-[#FBF6F1] px-6 py-4 text-center">
              <p className="text-xs font-semibold text-[#806D70]">
                آخر تحديث: 2 سبتمبر 2026
              </p>
            </div>

            {/* Content */}
            <div className="space-y-10 p-6 md:p-12">
              {/* Return */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                    <FaUndo />
                  </div>

                  <h2 className="text-2xl font-black text-[#4A1821]">
                    طلب الاسترجاع
                  </h2>
                </div>

                <p className="leading-8 text-[#806D70]">
                  يمكن للعميل طلب إعادة المنتج خلال
                  <strong className="mx-1 text-[#641F2B]">7 أيام</strong>
                  من تاريخ الاستلام، بشرط المحافظة على حالة المنتج الأصلية
                  واتباع المتطلبات التالية:
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "أن يكون المنتج بحالته الأصلية.",
                    "ألا يكون المنتج قد تم استخدامه أو فتحه.",
                    "بقاء المنتج داخل تغليفه الأصلي.",
                    "تقديم رقم الطلب عند التواصل معنا.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] px-5 py-4 text-sm font-semibold leading-7 text-[#806D70]"
                    >
                      <span className="ml-2 text-[#A83F55]">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Exchange */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                    <FaExchangeAlt />
                  </div>

                  <h2 className="text-2xl font-black text-[#4A1821]">
                    استبدال المنتج
                  </h2>
                </div>

                <p className="leading-8 text-[#806D70]">
                  يمكن طلب الاستبدال خلال
                  <strong className="mx-1 text-[#641F2B]">7 أيام</strong>
                  في حال وجود مشكلة في المنتج أو عدم مطابقته للطلب، ومن الحالات
                  التي يمكن التعامل معها:
                </p>

                <ul className="mt-5 space-y-3">
                  <li className="rounded-2xl border border-[#E8D9D6] bg-white px-5 py-4 text-sm text-[#806D70]">
                    وجود عيب مصنعي في المنتج.
                  </li>

                  <li className="rounded-2xl border border-[#E8D9D6] bg-white px-5 py-4 text-sm text-[#806D70]">
                    وصول منتج مختلف عن المنتج المطلوب.
                  </li>

                  <li className="rounded-2xl border border-[#E8D9D6] bg-white px-5 py-4 text-sm text-[#806D70]">
                    تعرض المنتج للتلف أثناء عملية الشحن.
                  </li>
                </ul>

                <p className="mt-5 rounded-2xl bg-[#F7EEE9] px-5 py-4 text-sm leading-7 text-[#806D70]">
                  في الحالات التي يكون سببها خطأ من المتجر أو تلف المنتج أثناء
                  الشحن، يتحمل المتجر تكاليف الشحن المتعلقة بمعالجة الحالة وفق
                  ما ينطبق عليها.
                </p>
              </div>

              {/* Non-returnable */}
              <div className="rounded-[26px] border border-[#E8D9D6] bg-[#FBF6F1] p-6 md:p-7">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#A83F55] shadow-sm">
                    <FaBoxOpen />
                  </div>

                  <h2 className="text-2xl font-black text-[#4A1821]">
                    حالات لا يشملها الاسترجاع
                  </h2>
                </div>

                <ul className="space-y-3 text-sm leading-7 text-[#806D70]">
                  <li>• المنتجات الغذائية أو المكملات بعد فتحها.</li>
                  <li>• المنتجات التي أزيل تغليفها بطريقة تمنع إعادة بيعها.</li>
                  <li>• المنتجات المستخدمة أو المتضررة بسبب سوء الاستخدام.</li>
                  <li>
                    • المنتجات التي تم تجهيزها بشكل مخصص بناءً على طلب العميل.
                  </li>
                </ul>
              </div>

              {/* Damaged */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                    <FaExclamationTriangle />
                  </div>

                  <h2 className="text-2xl font-black text-[#4A1821]">
                    إذا وصل المنتج تالفًا أو غير صحيح
                  </h2>
                </div>

                <p className="leading-8 text-[#806D70]">
                  في حال استلام منتج تالف أو غير مطابق، يرجى التواصل معنا خلال
                  <strong className="mx-1 text-[#641F2B]">48 ساعة</strong>
                  من تاريخ الاستلام، مع توفير المعلومات التالية:
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#E8D9D6] bg-white p-5 text-center">
                    <p className="text-sm font-bold text-[#641F2B]">
                      رقم الطلب
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E8D9D6] bg-white p-5 text-center">
                    <p className="text-sm font-bold text-[#641F2B]">
                      صور المنتج
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E8D9D6] bg-white p-5 text-center">
                    <p className="text-sm font-bold text-[#641F2B]">
                      وصف المشكلة
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Fees */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#A83F55]">
                    <FaShippingFast />
                  </div>

                  <h2 className="text-2xl font-black text-[#4A1821]">
                    تكاليف الشحن
                  </h2>
                </div>

                <div className="space-y-3 text-sm leading-8 text-[#806D70]">
                  <p>
                    إذا كان الاسترجاع بسبب رغبة العميل، فقد يتم خصم تكاليف الشحن
                    وفق السياسة المعتمدة للطلب.
                  </p>

                  <p>
                    أما إذا كان السبب خطأ في تنفيذ الطلب أو وصول المنتج تالفًا،
                    فيتحمل المتجر تكاليف الشحن المرتبطة بمعالجة الحالة وفقًا
                    للظروف.
                  </p>
                </div>
              </div>

              {/* Cancellation */}
              <div className="rounded-[26px] bg-[#641F2B] p-6 text-white md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#F2E4E1]">
                    <FaClock />
                  </div>

                  <h2 className="text-2xl font-black">إلغاء الطلب</h2>
                </div>

                <p className="leading-8 text-white/75">
                  يمكن طلب إلغاء الطلب قبل خروجه للشحن. أما إذا تم شحن الطلب،
                  فيتم التعامل معه وفق أحكام الاسترجاع والاستبدال وحالة الشحنة.
                </p>
              </div>

              {/* Contact */}
              <div className="rounded-[26px] border border-[#E8D9D6] bg-[#F7EEE9] p-6 text-center md:p-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#A83F55] shadow-sm">
                  <FaEnvelope />
                </div>

                <h2 className="text-xl font-black text-[#4A1821]">
                  تحتاج إلى مساعدة؟
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#806D70]">
                  للاستفسار عن حالة استرجاع أو استبدال، يمكنك التواصل مع سهرة
                  عبر البريد الإلكتروني.
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
                  نحرص على أن تكون إجراءات الاسترجاع والاستبدال واضحة وسهلة قدر
                  الإمكان.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
