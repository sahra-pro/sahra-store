import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowRight,
  FaTrash,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBox,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaShoppingBag,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaMapMarkedAlt,
  FaStickyNote,
} from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";

import OrderInvoice from "../components/admin/OrderInvoice";
import WhatsAppButton from "../components/admin/WhatsAppButton";

import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUSES } from "../context/order-statuses";

const STATUS_STYLES = {
  pending: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: FaClock,
  },
  processing: {
    className: "border-sky-200 bg-sky-50 text-sky-700",
    icon: FaShoppingBag,
  },
  shipped: {
    className: "border-violet-200 bg-violet-50 text-violet-700",
    icon: FaTruck,
  },
  completed: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: FaCheckCircle,
  },
  cancelled: {
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: FaTrash,
  },
};

const getStatusStyle = (status) =>
  STATUS_STYLES[status] || {
    className: "border-gray-200 bg-gray-50 text-gray-700",
    icon: FaShoppingBag,
  };

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getOrderById, updateOrderStatus, deleteOrder } = useOrders();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const order = getOrderById(id);

  if (!order) {
    return (
      <AdminLayout>
        <div className="mx-auto mt-10 max-w-3xl rounded-[32px] border border-[#E8D9D6] bg-white p-10 text-center shadow-[0_15px_45px_rgba(74,24,33,0.07)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2E4E1] text-2xl text-[#641F2B]">
            <FaBox />
          </div>

          <h2 className="mt-5 text-2xl font-black text-[#4A1821]">
            الطلب غير موجود
          </h2>

          <p className="mt-2 text-sm text-[#806D70]">
            ربما تم حذف الطلب أو أن الرابط غير صحيح.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#641F2B] px-6 py-3 font-bold text-white shadow-lg shadow-[#641F2B]/15 transition hover:-translate-y-0.5 hover:bg-[#4A1821]"
          >
            <FaArrowRight />
            العودة للطلبات
          </button>
        </div>
      </AdminLayout>
    );
  }

  const totalItems =
    order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ||
    0;

  const statusStyle = getStatusStyle(order.status);
  const StatusIcon = statusStyle.icon;

  /*
   * بيانات التوصيل الجديدة
   * نستخدم أكثر من fallback حتى لا تتأثر الطلبات القديمة.
   */
  const customer = order.customer || {};

  const city = customer.city || order.city || "";
  const neighborhood = customer.neighborhood || order.neighborhood || "";

  const shortAddress =
    customer.address ||
    customer.shortAddress ||
    order.address ||
    order.shortAddress ||
    "";

  const deliveryNotes =
    customer.notes ||
    customer.deliveryNotes ||
    order.notes ||
    order.deliveryNotes ||
    "";

  const latitude =
    customer.latitude ?? order.latitude ?? order.location?.latitude ?? null;

  const longitude =
    customer.longitude ?? order.longitude ?? order.location?.longitude ?? null;

  const hasCoordinates =
    Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));

  const shippingMethod =
    order.shippingMethod ||
    order.shippingCompany ||
    order.shipping?.method ||
    order.shipping?.company ||
    null;

  const shippingMethodName =
    typeof shippingMethod === "string"
      ? shippingMethod
      : shippingMethod?.name ||
        shippingMethod?.title ||
        order.shippingMethodName ||
        order.shippingCompanyName ||
        "";

  const shippingAmount = Number(
    order.shippingCost ?? order.shippingFee ?? order.shipping ?? 0,
  );

  const mapUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        `${Number(latitude)},${Number(longitude)}`,
      )}`
    : "";

  const handleDelete = async () => {
    await deleteOrder(order.id);
    navigate("/admin/orders");
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1600px] pb-10">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#806D70] transition hover:text-[#641F2B]"
        >
          <FaArrowRight />
          العودة إلى الطلبات
        </button>

        {/* Main Header */}
        <div className="mt-5 overflow-hidden rounded-[32px] border border-[#E8D9D6] bg-white shadow-[0_18px_50px_rgba(74,24,33,0.07)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#641F2B] via-[#711F31] to-[#4A1821] px-5 py-7 text-white md:px-8 md:py-9">
            <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-28 right-10 h-64 w-64 rounded-full bg-white/5" />

            <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-white/65">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    SAHRA ADMIN
                  </span>

                  <span>تفاصيل الطلب</span>
                </div>

                <h1 className="text-2xl font-black md:text-4xl">
                  طلب #{order.orderNumber}
                </h1>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt />

                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleString("ar-SA")
                      : "-"}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaBox />
                    {totalItems} منتجات
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-black ${statusStyle.className}`}
                >
                  <StatusIcon />

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className="cursor-pointer bg-transparent font-black outline-none"
                  >
                    {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <OrderInvoice order={order} />

                <WhatsAppButton phone={order.customer?.phone} order={order} />

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-2.5 font-bold text-white transition hover:bg-rose-500"
                >
                  <FaTrash />
                  حذف الطلب
                </button>
              </div>
            </div>
          </div>

          {/* Order Stats */}
          <div className="grid gap-px border-t border-[#E8D9D6] bg-[#E8D9D6] sm:grid-cols-2 lg:grid-cols-5">
            <div className="bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                  <FaBox />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#806D70]">
                    عدد المنتجات
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#4A1821]">
                    {totalItems}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${statusStyle.className}`}
                >
                  <StatusIcon />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#806D70]">
                    حالة الطلب
                  </p>

                  <p className="mt-1 font-black text-[#4A1821]">
                    {ORDER_STATUSES[order.status] || order.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5">
              <p className="text-xs font-semibold text-[#806D70]">
                إجمالي المنتجات
              </p>

              <p className="mt-2 text-2xl font-black text-[#4A1821]">
                {Number(order.subtotal ?? order.total ?? 0).toFixed(2)}
                <span className="mr-1 text-sm font-bold text-[#806D70]">
                  ر.س
                </span>
              </p>
            </div>

            <div className="bg-white p-5">
              <p className="text-xs font-semibold text-[#806D70]">الشحن</p>

              <p
                className={`mt-2 text-2xl font-black ${
                  shippingAmount === 0 ? "text-emerald-600" : "text-[#4A1821]"
                }`}
              >
                {shippingAmount > 0 ? shippingAmount.toFixed(2) : "مجاني"}

                {shippingAmount > 0 && (
                  <span className="mr-1 text-sm font-bold text-[#806D70]">
                    ر.س
                  </span>
                )}
              </p>
            </div>

            <div className="bg-[#FBF6F1] p-5">
              <p className="text-xs font-semibold text-[#806D70]">
                الإجمالي النهائي
              </p>

              <p className="mt-2 text-2xl font-black text-[#641F2B]">
                {Number(order.total || 0).toFixed(2)}
                <span className="mr-1 text-sm font-bold text-[#806D70]">
                  ر.س
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer + Products */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Customer */}
          <div className="rounded-[30px] border border-[#E8D9D6] bg-white p-5 shadow-[0_15px_45px_rgba(74,24,33,0.05)] md:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                <FaUser />
              </div>

              <div>
                <h2 className="font-black text-[#4A1821]">بيانات العميل</h2>

                <p className="mt-0.5 text-xs text-[#806D70]">
                  معلومات التواصل والتوصيل
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                <div className="flex items-start gap-3">
                  <FaUser className="mt-1 text-[#A83F55]" />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#806D70]">
                      اسم العميل
                    </p>

                    <p className="mt-1 break-words font-bold text-[#4A1821]">
                      {customer.name || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                <div className="flex items-start gap-3">
                  <FaPhone className="mt-1 text-[#A83F55]" />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#806D70]">
                      رقم الهاتف
                    </p>

                    <p className="mt-1 break-words font-bold text-[#4A1821]">
                      {customer.phone || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* City */}
              <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 text-[#A83F55]" />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#806D70]">
                      المدينة
                    </p>

                    <p className="mt-1 break-words font-bold text-[#4A1821]">
                      {city || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Neighborhood */}
              <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 text-[#A83F55]" />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#806D70]">الحي</p>

                    <p className="mt-1 break-words font-bold text-[#4A1821]">
                      {neighborhood || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Short Address */}
              <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="mt-1 text-[#A83F55]" />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#806D70]">
                      العنوان المختصر
                    </p>

                    <p className="mt-1 break-words leading-7 text-[#4A1821]">
                      {shortAddress || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Notes */}
              <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                <div className="flex items-start gap-3">
                  <FaStickyNote className="mt-1 text-[#A83F55]" />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#806D70]">
                      ملاحظات التوصيل
                    </p>

                    <p className="mt-1 break-words leading-7 text-[#4A1821]">
                      {deliveryNotes || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Location */}
              <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkedAlt className="mt-1 text-[#A83F55]" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#806D70]">
                      موقع العميل على الخريطة
                    </p>

                    {hasCoordinates ? (
                      <>
                        <div className="mt-2 rounded-xl border border-[#E8D9D6] bg-white p-3">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="block text-[#806D70]">
                                خط العرض
                              </span>

                              <strong className="mt-1 block break-all text-[#4A1821]">
                                {Number(latitude).toFixed(6)}
                              </strong>
                            </div>

                            <div>
                              <span className="block text-[#806D70]">
                                خط الطول
                              </span>

                              <strong className="mt-1 block break-all text-[#4A1821]">
                                {Number(longitude).toFixed(6)}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#641F2B] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#4A1821]"
                        >
                          <FaMapMarkedAlt />
                          فتح الموقع على الخريطة
                        </a>
                      </>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-[#806D70]">
                        لم يتم حفظ موقع على الخريطة لهذا الطلب.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Company */}
              <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                <div className="flex items-start gap-3">
                  <FaTruck className="mt-1 text-[#A83F55]" />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#806D70]">
                      شركة الشحن
                    </p>

                    <p className="mt-1 break-words font-bold text-[#4A1821]">
                      {shippingMethodName || "لم يتم تحديد شركة شحن"}
                    </p>

                    <p className="mt-1 text-xs text-[#806D70]">
                      رسوم الشحن:{" "}
                      <span className="font-bold text-[#4A1821]">
                        {shippingAmount > 0
                          ? `${shippingAmount.toFixed(2)} ر.س`
                          : "مجاني"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="rounded-[30px] border border-[#E8D9D6] bg-white p-5 shadow-[0_15px_45px_rgba(74,24,33,0.05)] md:p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                  <FaShoppingBag />
                </div>

                <div>
                  <h2 className="font-black text-[#4A1821]">منتجات الطلب</h2>

                  <p className="mt-0.5 text-xs text-[#806D70]">
                    {totalItems} قطعة ضمن هذا الطلب
                  </p>
                </div>
              </div>

              <span className="hidden rounded-full bg-[#FBF6F1] px-4 py-2 text-xs font-bold text-[#641F2B] sm:block">
                {order.items?.length || 0} منتجات
              </span>
            </div>

            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={item.id || `${item.name}-${index}`}
                  className="group rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4 transition hover:border-[#A83F55]/40 hover:shadow-md"
                >
                  <div className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-[#E8D9D6]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-black text-[#4A1821]">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#806D70]">
                        <span>
                          السعر:{" "}
                          <strong className="text-[#4A1821]">
                            {Number(item.price || 0).toFixed(2)} ر.س
                          </strong>
                        </span>

                        <span>
                          الكمية:{" "}
                          <strong className="text-[#4A1821]">
                            {item.quantity}
                          </strong>
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#806D70]">
                          إجمالي المنتج
                        </span>

                        <span className="font-black text-[#641F2B]">
                          {(
                            Number(item.price || 0) * Number(item.quantity || 0)
                          ).toFixed(2)}{" "}
                          ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-6 overflow-hidden rounded-[30px] border border-[#E8D9D6] bg-white shadow-[0_15px_45px_rgba(74,24,33,0.05)]">
          <div className="border-b border-[#E8D9D6] bg-[#FBF6F1] px-5 py-5 md:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#641F2B] text-white">
                <FaMoneyBillWave />
              </div>

              <div>
                <h2 className="font-black text-[#4A1821]">ملخص المبلغ</h2>

                <p className="mt-0.5 text-xs text-[#806D70]">
                  تفاصيل القيمة النهائية للطلب
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 md:px-7">
            <div className="mx-auto max-w-3xl space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#806D70]">إجمالي المنتجات</span>

                <span className="font-bold text-[#4A1821]">
                  {Number(order.subtotal ?? order.total ?? 0).toFixed(2)} ر.س
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#806D70]">شركة الشحن</span>

                <span className="font-bold text-[#4A1821]">
                  {shippingMethodName || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#806D70]">الشحن</span>

                <span
                  className={
                    shippingAmount === 0
                      ? "font-bold text-emerald-600"
                      : "font-bold text-[#4A1821]"
                  }
                >
                  {shippingAmount > 0
                    ? `${shippingAmount.toFixed(2)} ر.س`
                    : "مجاني 🎉"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#806D70]">طريقة الدفع</span>

                <span className="font-bold text-[#4A1821]">
                  {order.paymentMethod === "cod" ||
                  order.paymentMethod === "cash_on_delivery" ||
                  !order.paymentMethod
                    ? "الدفع عند الاستلام"
                    : order.paymentMethod}
                </span>
              </div>

              <div className="border-t border-[#E8D9D6] pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg font-black text-[#4A1821]">
                    الإجمالي النهائي
                  </span>

                  <span className="text-2xl font-black text-[#641F2B] md:text-3xl">
                    {Number(order.total || 0).toFixed(2)} ر.س
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="mt-6 rounded-[30px] border border-[#E8D9D6] bg-white p-5 shadow-[0_15px_45px_rgba(74,24,33,0.05)] md:p-7">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
              <FaClock />
            </div>

            <div>
              <h2 className="font-black text-[#4A1821]">سجل الطلب</h2>

              <p className="mt-0.5 text-xs text-[#806D70]">
                التسلسل الزمني لتحديثات حالة الطلب
              </p>
            </div>
          </div>

          {order.history?.length > 0 ? (
            <div className="relative mr-2 space-y-6 border-r-2 border-[#E8D9D6] pr-7">
              {[...order.history].reverse().map((item, index) => {
                const historyStyle = getStatusStyle(item.status);
                const HistoryIcon = historyStyle.icon;

                return (
                  <div key={index} className="relative">
                    <div
                      className={`absolute -right-[41px] top-0 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white text-[10px] ${historyStyle.className}`}
                    >
                      <HistoryIcon />
                    </div>

                    <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-black text-[#4A1821]">
                          {ORDER_STATUSES[item.status] || item.status}
                        </p>

                        <p className="text-xs font-semibold text-[#806D70]">
                          {item.date
                            ? new Date(item.date).toLocaleString("ar-SA")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E8D9D6] bg-[#FBF6F1] p-8 text-center">
              <FaClock className="mx-auto text-2xl text-[#A83F55]" />

              <p className="mt-3 text-sm font-semibold text-[#806D70]">
                لا يوجد سجل لهذا الطلب حتى الآن
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#241015]/70 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-[#E8D9D6] bg-white shadow-2xl">
            <div className="bg-gradient-to-br from-[#641F2B] to-[#4A1821] px-6 py-7 text-center text-white">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                <FaExclamationTriangle />
              </div>

              <h2 className="mt-4 text-2xl font-black">حذف الطلب؟</h2>

              <p className="mt-2 text-sm text-white/70">
                هذا الإجراء سيحذف الطلب من لوحة التحكم.
              </p>
            </div>

            <div className="p-6 text-center">
              <p className="text-sm leading-7 text-[#806D70]">
                هل أنت متأكد من حذف الطلب{" "}
                <strong className="text-[#4A1821]">#{order.orderNumber}</strong>
                ؟
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] py-3 font-bold text-[#4A1821] transition hover:bg-[#F2E4E1]"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 font-bold text-white transition hover:bg-rose-700"
                >
                  <FaTrash />
                  حذف الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
