import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaTruck,
  FaShieldAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

import { useCart } from "../hooks/useCart";
import { useSettings } from "../hooks/useSettings";

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { settings } = useSettings();

  const shippingFee = settings?.shipping?.shippingFee || 0;

  const freeShippingThreshold = settings?.shipping?.freeShippingThreshold || 0;

  const shippingCost =
    freeShippingThreshold > 0 && cartTotal >= freeShippingThreshold
      ? 0
      : shippingFee;

  const finalTotal = cartTotal + shippingCost;

  const shippingProgress =
    freeShippingThreshold > 0
      ? Math.min(100, (cartTotal / freeShippingThreshold) * 100)
      : 100;

  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - cartTotal,
  );

  const navigate = useNavigate();

  /* ============================================================
     EMPTY CART
  ============================================================ */
  if (cartItems.length === 0) {
    return (
      <section className="min-h-[75vh] bg-[#FBF6F1] px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[32px] border border-[#E8D9D6] bg-white px-6 py-12 text-center shadow-[0_20px_60px_rgba(100,31,43,0.06)] sm:px-10 md:px-14">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F7EEE9] text-[#641F2B]">
              <FaShoppingBag className="text-3xl" />
            </div>

            <p className="mt-7 text-xs font-bold tracking-[0.18em] text-[#A83F55]">
              سهرة ستور
            </p>

            <h1 className="mt-3 text-3xl font-black text-[#4A1821] sm:text-4xl">
              سلة المشتريات فارغة
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-[#806D70] sm:text-base">
              لم تضف أي منتجات إلى سلتك حتى الآن. تصفح منتجات سهرة واختر ما
              يناسبك.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-[#641F2B] px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(100,31,43,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-[0_14px_30px_rgba(100,31,43,0.2)]"
            >
              تصفح المنتجات
              <FaArrowLeft className="text-xs" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#FBF6F1] py-8 sm:py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            PAGE HEADER
        ========================================================= */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold tracking-[0.16em] text-[#A83F55]">
              سهرة ستور
            </p>

            <h1 className="text-3xl font-black tracking-tight text-[#4A1821] sm:text-4xl">
              سلة المشتريات
            </h1>

            <p className="text-sm text-[#806D70]">
              راجع منتجاتك والكميات قبل إتمام الطلب.
            </p>
          </div>
        </div>

        {/* ========================================================
            FREE SHIPPING PROGRESS
        ========================================================= */}
        {freeShippingThreshold > 0 && (
          <div className="mb-7 rounded-[24px] border border-[#E8D9D6] bg-white p-5 shadow-[0_8px_30px_rgba(100,31,43,0.04)] sm:p-6">
            {shippingCost === 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2E4E1] text-[#641F2B]">
                  <FaCheckCircle />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#4A1821]">
                    حصلت على الشحن المجاني
                  </p>

                  <p className="mt-1 text-xs text-[#806D70]">
                    طلبك تجاوز الحد المطلوب للشحن المجاني.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <FaTruck className="text-[#A83F55]" />

                    <span className="text-sm font-bold text-[#4A1821]">
                      اقتربت من الشحن المجاني
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#A83F55]">
                    {shippingProgress.toFixed(0)}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#F2E4E1]">
                  <div
                    className="h-full rounded-full bg-[#641F2B] transition-all duration-700"
                    style={{
                      width: `${shippingProgress}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-[#806D70]">
                  أضف{" "}
                  <span className="font-bold text-[#641F2B]">
                    {remainingForFreeShipping.toFixed(2)} ر.س
                  </span>{" "}
                  للحصول على شحن مجاني.
                </p>
              </>
            )}
          </div>
        )}

        {/* ========================================================
            MAIN CONTENT
        ========================================================= */}
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-9">
          {/* ======================================================
              CART
          ======================================================= */}
          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-[#4A1821] sm:text-xl">
                  منتجاتك
                </h2>

                <p className="mt-1 text-xs text-[#806D70]">
                  {cartItems.length}{" "}
                  {cartItems.length === 1 ? "منتج" : "منتجات"} في السلة
                </p>
              </div>

              <Link
                to="/products"
                className="hidden items-center gap-2 text-xs font-bold text-[#A83F55] transition-colors hover:text-[#641F2B] sm:inline-flex"
              >
                متابعة التسوق
                <FaArrowLeft className="text-[10px]" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_12px_40px_rgba(100,31,43,0.05)]">
              {cartItems.map((item) => {
                const itemTotal =
                  Number(item.price || 0) * Number(item.quantity || 0);

                return (
                  <article
                    key={item.id}
                    className="border-b border-[#F0E6E3] p-4 last:border-b-0 sm:p-5 md:p-6"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      {/* PRODUCT IMAGE */}
                      <Link
                        to={`/product/${item.seoSlug || item.slug || item.id}`}
                        className="group shrink-0"
                      >
                        <div className="h-24 w-24 overflow-hidden rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] sm:h-28 sm:w-28 md:h-32 md:w-32">
                          <img
                            src={
                              item.images?.[0] ||
                              "https://via.placeholder.com/200"
                            }
                            alt={item.name || "منتج سهرة"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>

                      {/* PRODUCT CONTENT */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <Link
                              to={`/product/${
                                item.seoSlug || item.slug || item.id
                              }`}
                            >
                              <h3 className="line-clamp-2 text-sm font-bold leading-7 text-[#4A1821] transition-colors hover:text-[#A83F55] sm:text-base md:text-lg">
                                {item.name}
                              </h3>
                            </Link>

                            {item.category && (
                              <p className="mt-1.5 text-xs text-[#806D70]">
                                {item.category}
                              </p>
                            )}
                          </div>

                          {/* DESKTOP ITEM TOTAL */}
                          <div className="hidden shrink-0 text-left sm:block">
                            <p className="text-base font-black text-[#4A1821] md:text-lg">
                              {itemTotal.toFixed(2)}{" "}
                              <span className="text-xs font-bold">ر.س</span>
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 text-sm font-bold text-[#641F2B]">
                          {Number(item.price || 0).toFixed(2)} ر.س
                        </p>

                        {/* ACTIONS */}
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <div className="flex h-10 items-center overflow-hidden rounded-xl border border-[#E8D9D6] bg-[#FBF6F1]">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="flex h-10 w-10 items-center justify-center text-[#806D70] transition-colors hover:bg-[#F2E4E1] hover:text-[#641F2B] disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label="تقليل الكمية"
                            >
                              <FaMinus className="text-[10px]" />
                            </button>

                            <span className="flex h-10 min-w-[42px] items-center justify-center border-x border-[#E8D9D6] bg-white text-sm font-bold text-[#4A1821]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="flex h-10 w-10 items-center justify-center text-[#806D70] transition-colors hover:bg-[#F2E4E1] hover:text-[#641F2B]"
                              aria-label="زيادة الكمية"
                            >
                              <FaPlus className="text-[10px]" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-[#9B6269] transition-colors hover:bg-[#FBF0F1] hover:text-[#641F2B]"
                            aria-label="حذف المنتج"
                          >
                            <FaTrash className="text-[10px]" />
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* MOBILE TOTAL */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#F0E6E3] pt-4 sm:hidden">
                      <span className="text-xs text-[#806D70]">
                        إجمالي المنتج
                      </span>

                      <span className="text-sm font-black text-[#4A1821]">
                        {itemTotal.toFixed(2)} ر.س
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* MOBILE CONTINUE SHOPPING */}
            <Link
              to="/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#A83F55] transition-colors hover:text-[#641F2B] sm:hidden"
            >
              <FaArrowLeft className="text-xs" />
              متابعة التسوق
            </Link>
          </div>

          {/* ======================================================
              ORDER SUMMARY
          ======================================================= */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_16px_45px_rgba(100,31,43,0.08)]">
              {/* SUMMARY HEADER */}
              <div className="border-b border-[#F0E6E3] px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-[#4A1821]">
                      ملخص الطلب
                    </h2>

                    <p className="mt-1 text-xs text-[#806D70]">
                      تفاصيل إجمالي طلبك
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                    <FaShoppingBag />
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* PAYMENT METHOD */}
                <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#641F2B] shadow-sm">
                      <FaMoneyBillWave />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#4A1821]">
                        الدفع عند الاستلام
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#806D70]">
                        ادفع عند استلام طلبك.
                      </p>
                    </div>
                  </div>
                </div>

                {/* TOTALS */}
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4 text-[#806D70]">
                    <span>الإجمالي الفرعي</span>

                    <span className="font-bold text-[#4A1821]">
                      {Number(cartTotal || 0).toFixed(2)} ر.س
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-[#806D70]">
                    <span>الشحن</span>

                    <span
                      className={
                        shippingCost === 0
                          ? "font-bold text-[#7A8B43]"
                          : "font-bold text-[#4A1821]"
                      }
                    >
                      {shippingCost === 0
                        ? "مجاني"
                        : `${Number(shippingCost).toFixed(2)} ر.س`}
                    </span>
                  </div>
                </div>

                {/* FINAL TOTAL */}
                <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#E8D9D6] pt-5">
                  <div>
                    <p className="text-sm font-bold text-[#4A1821]">الإجمالي</p>
                    <p className="mt-1 text-xs text-[#806D70]">
                      شامل تكلفة الشحن
                    </p>
                  </div>

                  <p className="text-2xl font-black text-[#641F2B]">
                    {Number(finalTotal || 0).toFixed(2)}
                    <span className="mr-1 text-sm font-bold">ر.س</span>
                  </p>
                </div>

                {/* CHECKOUT */}
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(100,31,43,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-[0_14px_30px_rgba(100,31,43,0.22)] active:scale-[0.99]"
                >
                  متابعة إتمام الطلب
                  <FaArrowLeft className="text-xs" />
                </button>

                {/* TRUST FEATURES */}
                <div className="mt-5 border-t border-[#F0E6E3] pt-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[#806D70]">
                      <FaTruck className="shrink-0 text-[#A83F55]" />
                      <span>شحن سريع وموثوق</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#806D70]">
                      <FaMoneyBillWave className="shrink-0 text-[#A83F55]" />
                      <span>الدفع عند الاستلام</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#806D70]">
                      <FaShieldAlt className="shrink-0 text-[#A83F55]" />
                      <span>بياناتك محمية وآمنة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ========================================================
            BOTTOM TRUST BAR
        ========================================================= */}
        <div className="mt-10 grid gap-3 border-t border-[#E8D9D6] pt-7 sm:grid-cols-3">
          <div className="flex items-center justify-center gap-2 text-xs text-[#806D70]">
            <FaShieldAlt className="text-[#A83F55]" />
            تسوق آمن
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#806D70]">
            <FaTruck className="text-[#A83F55]" />
            توصيل موثوق
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#806D70]">
            <FaCheckCircle className="text-[#A83F55]" />
            خدمة موثوقة
          </div>
        </div>
      </div>
    </section>
  );
}
