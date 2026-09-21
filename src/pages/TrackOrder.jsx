import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaBoxOpen,
  FaChevronDown,
  FaMapMarkerAlt,
  FaTruck,
  FaReceipt,
  FaPhoneAlt,
  FaCheckCircle,
  FaShoppingBag,
  FaCalendarAlt,
  FaArrowLeft,
} from "react-icons/fa";

import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUSES } from "../context/order-statuses";

const STATUS_COLORS = {
  pending: "bg-[#FFF3D9] text-[#8A642F]",
  processing: "bg-[#F2E4E1] text-[#8F3046]",
  shipped: "bg-[#EEE3EA] text-[#641F2B]",
  completed: "bg-[#E7EDE0] text-[#65723F]",
  cancelled: "bg-[#F8E1E1] text-[#A34F46]",
};

function OrderStatus({ status }) {
  const statusClass = STATUS_COLORS[status] || "bg-[#F2E4E1] text-[#641F2B]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ${statusClass}`}
    >
      {ORDER_STATUSES[status] || "غير محدد"}
    </span>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const total = Number(order?.total || 0);
  const subtotal = Number(order?.subtotal ?? order?.total ?? 0);
  const shipping = Number(order?.shipping || 0);

  return (
    <article className="overflow-hidden rounded-[30px] border border-[#E8D9D6] bg-white shadow-[0_12px_45px_rgba(100,31,43,0.06)]">
      {/* Main order row */}
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="w-full text-right"
      >
        <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
              <FaReceipt className="text-lg" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#A83F55]">
                  رقم الطلب
                </span>

                <span className="font-black text-[#4A1821]">
                  #{order.orderNumber}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#806D70]">
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt />
                  {new Date(order.date).toLocaleDateString("ar-SA")}
                </span>

                <span className="h-1 w-1 rounded-full bg-[#D8C0C3]" />

                <span>
                  {(order.items || []).length}{" "}
                  {(order.items || []).length === 1 ? "منتج" : "منتجات"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[#F0E6E3] pt-4 md:min-w-[260px] md:border-0 md:pt-0">
            <div>
              <OrderStatus status={order.status} />

              <p className="mt-2 text-lg font-black text-[#641F2B]">
                {total.toFixed(2)} <span className="text-xs">ر.س</span>
              </p>
            </div>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D9D6] text-[#806D70] transition-all duration-300 ${
                expanded
                  ? "rotate-180 border-[#D8B6B9] bg-[#F2E4E1] text-[#641F2B]"
                  : "bg-[#FBF6F1]"
              }`}
            >
              <FaChevronDown className="text-xs" />
            </div>
          </div>
        </div>
      </button>

      {/* Details */}
      {expanded && (
        <div className="border-t border-[#F0E6E3] bg-[#FBF6F1] p-5 sm:p-6">
          {/* Products */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#641F2B] text-white">
                <FaShoppingBag className="text-xs" />
              </div>

              <div>
                <h3 className="text-sm font-black text-[#4A1821]">المنتجات</h3>

                <p className="mt-0.5 text-[11px] text-[#806D70]">
                  المنتجات الموجودة في هذا الطلب
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(order.items || []).map((item) => {
                const itemPrice = Number(item.price || 0);
                const quantity = Number(item.quantity || 0);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-[#E8D9D6] bg-white p-3 sm:gap-4 sm:p-4"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] sm:h-20 sm:w-20">
                      <img
                        src={
                          item.image || item.images?.[0] || "/placeholder.png"
                        }
                        alt={item.name || "منتج من سهرة"}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold leading-6 text-[#4A1821]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-[#806D70]">
                        الكمية {quantity} × {itemPrice} ر.س
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="whitespace-nowrap text-sm font-black text-[#641F2B]">
                        {(itemPrice * quantity).toFixed(2)}
                      </p>

                      <span className="text-[10px] text-[#806D70]">ر.س</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E8D9D6] bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                  <FaMapMarkerAlt />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#806D70]">
                    عنوان التوصيل
                  </p>

                  <p className="mt-1 text-sm font-bold leading-6 text-[#4A1821]">
                    {order.customer?.city || "—"}
                    {" — "}
                    {order.customer?.address || "—"}
                  </p>
                </div>
              </div>
            </div>

            {order.customer?.phone && (
              <div className="rounded-2xl border border-[#E8D9D6] bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                    <FaPhoneAlt />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#806D70]">
                      رقم الجوال
                    </p>

                    <p
                      dir="ltr"
                      className="mt-1 text-right text-sm font-bold text-[#4A1821]"
                    >
                      {order.customer.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="mt-6 rounded-2xl border border-[#E8D9D6] bg-white p-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-[#806D70]">
                <span>إجمالي المنتجات</span>

                <span className="font-bold text-[#4A1821]">
                  {subtotal.toFixed(2)} ر.س
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[#806D70]">
                <span>الشحن</span>

                <span
                  className={
                    shipping === 0
                      ? "font-bold text-[#65723F]"
                      : "font-bold text-[#4A1821]"
                  }
                >
                  {shipping > 0 ? `${shipping.toFixed(2)} ر.س` : "مجاني"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-[#E8D9D6] pt-4">
                <span className="font-black text-[#4A1821]">
                  الإجمالي النهائي
                </span>

                <span className="text-xl font-black text-[#641F2B]">
                  {total.toFixed(2)} <span className="text-xs">ر.س</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function TrackOrder() {
  const { myOrders, myOrdersLoading, findOrder } = useOrders();

  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [searchResult, setSearchResult] = useState(undefined);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderNumber.trim() || !phone.trim()) {
      setSearchResult(null);
      return;
    }

    setSearching(true);

    try {
      const result = await findOrder(orderNumber.trim(), phone.trim());

      setSearchResult(result);
    } catch (error) {
      console.error("Find order error:", error);
      setSearchResult(null);
    } finally {
      setSearching(false);
    }
  };

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-[#FBF6F1] py-8 sm:py-12 md:py-16"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Intro */}
        <div className="mb-8 overflow-hidden rounded-[34px] bg-[#4A1821] shadow-[0_20px_60px_rgba(74,24,33,0.14)]">
          <div className="relative px-6 py-10 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full border border-[#D49B35]/10" />

            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="mb-3 text-xs font-bold tracking-[0.35em] text-[#E8C9CE]">
                  SAHRA
                </p>

                <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
                  أين وصل طلبك؟
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-8 text-white/70 sm:text-base">
                  أدخل رقم الطلب ورقم الجوال المستخدم عند الشراء، وسنساعدك في
                  الوصول إلى تفاصيل طلبك وحالته.
                </p>
              </div>

              <div className="hidden h-28 w-28 items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.07] text-white/90 md:flex">
                <FaTruck className="text-5xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative z-10 -mt-2 mb-10 px-0 sm:-mt-3 sm:px-6">
          <form
            onSubmit={handleSearch}
            className="rounded-[30px] border border-[#E8D9D6] bg-white p-5 shadow-[0_18px_55px_rgba(100,31,43,0.09)] sm:p-7"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                <FaSearch />
              </div>

              <div>
                <h2 className="font-black text-[#4A1821]">البحث عن طلب</h2>

                <p className="mt-1 text-xs text-[#806D70]">
                  نحتاج فقط إلى رقم الطلب ورقم الجوال.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-[#5F5154]">
                  رقم الطلب
                </label>

                <div className="relative">
                  <FaReceipt className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A83F55]" />

                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="مثال: ORD-1001"
                    className="w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] py-4 pl-4 pr-11 text-sm text-[#4A1821] outline-none transition-all placeholder:text-[#A69A9C] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#A83F55]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#5F5154]">
                  رقم الجوال
                </label>

                <div className="relative">
                  <FaPhoneAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A83F55]" />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الجوال المستخدم بالطلب"
                    className="w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] py-4 pl-4 pr-11 text-sm text-[#4A1821] outline-none transition-all placeholder:text-[#A69A9C] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#A83F55]/10"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={searching}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#641F2B] py-4 font-bold text-white shadow-[0_10px_25px_rgba(100,31,43,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-[0_14px_30px_rgba(100,31,43,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSearch />

              {searching ? "جارٍ البحث..." : "عرض حالة الطلب"}
            </button>

            {searchResult === null && (
              <div className="mt-5 rounded-2xl border border-[#F0D4D4] bg-[#FFF7F7] p-4 text-center text-sm text-[#A34F46]">
                لم يتم العثور على طلب مطابق للبيانات المدخلة.
              </div>
            )}

            {searchResult && (
              <div className="mt-7">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#65723F]">
                  <FaCheckCircle />
                  تم العثور على طلبك
                </div>

                <OrderCard order={searchResult} />
              </div>
            )}
          </form>
        </div>

        {/* Saved orders */}
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold tracking-wider text-[#A83F55]">
                سجل الطلبات
              </p>

              <h2 className="text-xl font-black text-[#4A1821] sm:text-2xl">
                طلباتك المحفوظة
              </h2>

              <p className="mt-1.5 text-xs leading-6 text-[#806D70]">
                الطلبات التي تم حفظها على هذا الجهاز والمتصفح.
              </p>
            </div>

            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#641F2B] shadow-sm sm:flex">
              <FaReceipt />
            </div>
          </div>

          {myOrdersLoading ? (
            <div className="rounded-[30px] border border-[#E8D9D6] bg-white p-12 text-center shadow-[0_10px_35px_rgba(100,31,43,0.05)]">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#E8D9D6] border-t-[#641F2B]" />

              <p className="text-sm text-[#806D70]">جارٍ تحميل طلباتك...</p>
            </div>
          ) : myOrders.length === 0 ? (
            <div className="rounded-[30px] border border-[#E8D9D6] bg-white px-6 py-12 text-center shadow-[0_12px_40px_rgba(100,31,43,0.05)]">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2E4E1] text-[#641F2B]">
                <FaBoxOpen className="text-3xl" />
              </div>

              <h3 className="text-lg font-black text-[#4A1821]">
                لا توجد طلبات محفوظة
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-[#806D70]">
                عندما تقوم بإتمام طلب، ستظهر طلباتك هنا على هذا الجهاز.
              </p>

              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#641F2B] px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(100,31,43,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821]"
              >
                <FaShoppingBag />
                تصفح المنتجات
                <FaArrowLeft className="text-xs" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom note */}
        <div className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-[#E8D9D6] pt-7 text-center text-xs text-[#A69A9C] sm:flex-row">
          <FaCheckCircle className="text-[#7A8B43]" />
          <span>سهرة تحرص على تقديم تجربة طلب واضحة وموثوقة ومريحة.</span>
        </div>
      </div>
    </section>
  );
}
