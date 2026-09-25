import { useEffect, useState } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaShoppingBag,
  FaTruck,
  FaLocationArrow,
} from "react-icons/fa";

import { useOrders } from "../hooks/useOrders";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const location = useLocation();

  const myOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");

  const hasAccess = location.state?.order || myOrders.includes(orderNumber);

  const { fetchOrderByNumber } = useOrders();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (order) return;

    let cancelled = false;

    fetchOrderByNumber(orderNumber).then((result) => {
      if (cancelled) return;

      if (result) {
        setOrder(result);
      } else {
        setNotFound(true);
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[65vh] items-center justify-center bg-[#FBF6F1] px-4"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-[#E8D9D6] bg-white px-6 py-5 text-sm text-[#806D70] shadow-[0_10px_35px_rgba(100,31,43,0.05)]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8D9D6] border-t-[#641F2B]" />
          جارٍ تحميل بيانات الطلب...
        </div>
      </section>
    );
  }

  if (notFound || !order) {
    return <Navigate to="/" replace />;
  }

  const customer = order.customer || {};

  const city = customer.city?.trim() || "";
  const neighborhood = customer.neighborhood?.trim() || "";

  const shortAddress =
    customer.shortAddress?.trim() || customer.address?.trim() || "";

  const notes = customer.notes?.trim() || "";

  const latitude =
    customer.latitude !== undefined && customer.latitude !== null
      ? Number(customer.latitude)
      : null;

  const longitude =
    customer.longitude !== undefined && customer.longitude !== null
      ? Number(customer.longitude)
      : null;

  const hasCoordinates =
    Number.isFinite(latitude) && Number.isFinite(longitude);

  const shippingMethod =
    order.shippingMethod?.name ||
    order.shippingMethodName ||
    order.shippingCompany ||
    (typeof order.shippingMethod === "string" ? order.shippingMethod : "");

  const mapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : "";

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#FBF6F1] via-white to-[#FBF6F1] py-8 sm:py-10 md:py-14"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Progress */}
        <div className="mb-8 overflow-x-auto md:mb-10">
          <div className="mx-auto flex min-w-[430px] items-center justify-center gap-2 text-xs font-bold sm:text-sm">
            <div className="flex items-center gap-2 rounded-full bg-[#4A1821] px-4 py-2.5 text-white shadow-sm">
              <FaCheckCircle className="text-[#D49B35]" />
              السلة
            </div>

            <div className="h-px w-7 bg-[#D8B6B9] sm:w-12" />

            <div className="flex items-center gap-2 rounded-full bg-[#4A1821] px-4 py-2.5 text-white shadow-sm">
              <FaCheckCircle className="text-[#D49B35]" />
              إتمام الطلب
            </div>

            <div className="h-px w-7 bg-[#D8B6B9] sm:w-12" />

            <div className="flex items-center gap-2 rounded-full bg-[#641F2B] px-4 py-2.5 text-white shadow-[0_8px_20px_rgba(100,31,43,0.15)]">
              <FaCheckCircle />
              تم الطلب
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-[32px] border border-[#E8D9D6] bg-white shadow-[0_20px_60px_rgba(100,31,43,0.08)]">
          {/* Success Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#4A1821] via-[#641F2B] to-[#8F3046] px-6 py-12 text-center text-white sm:px-10 md:py-16">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10 bg-white/[0.04]" />

            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-[#D49B35]/15 bg-[#D49B35]/[0.06]" />

            <div className="absolute right-1/2 top-1/2 h-80 w-80 -translate-y-1/2 translate-x-1/2 rounded-full border border-white/[0.04]" />

            <div className="relative">
              <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] shadow-2xl backdrop-blur-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl text-[#641F2B] shadow-lg">
                  <FaCheckCircle />
                </div>
              </div>

              <p className="mb-2 text-xs font-bold tracking-[0.25em] text-[#E8C9CE]">
                سهرة ستور
              </p>

              <h1 className="text-3xl font-black leading-tight sm:text-4xl">
                تم استلام طلبك بنجاح 🎉
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-white/75 sm:text-base">
                شكرًا لثقتك في سهرة. تم تسجيل طلبك بنجاح وسيتم التواصل معك
                قريبًا لتأكيده وتنسيق عملية التوصيل.
              </p>

              <div className="mx-auto mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.08] px-6 py-3.5 backdrop-blur-md">
                <span className="text-xs text-white/65">رقم الطلب</span>

                <span className="text-lg font-black tracking-wide text-[#F2E4E1]">
                  #{order.orderNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7 md:p-10">
            {/* Delivery Information */}
            <div className="mb-8 overflow-hidden rounded-[26px] border border-[#E8D9D6] bg-[#FBF6F1]">
              <div className="border-b border-[#F0E6E3] bg-gradient-to-r from-[#F7EEE9] to-[#FBF6F1] px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                    <FaTruck />
                  </div>

                  <div>
                    <h2 className="font-black text-[#4A1821]">
                      بيانات التوصيل
                    </h2>

                    <p className="mt-1 text-xs text-[#806D70]">
                      المعلومات التي سيتم الاعتماد عليها لتوصيل طلبك
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                {/* Name */}
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A83F55] shadow-sm">
                    <FaUser className="text-sm" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-[#806D70]">الاسم</p>

                    <p className="mt-1 font-bold text-[#4A1821]">
                      {customer.name || "—"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A83F55] shadow-sm">
                    <FaPhone className="text-sm" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-[#806D70]">رقم الجوال</p>

                    <p
                      dir="ltr"
                      className="mt-1 text-right font-bold text-[#4A1821]"
                    >
                      {customer.phone || "—"}
                    </p>
                  </div>
                </div>

                {/* City */}
                {city && (
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A83F55] shadow-sm">
                      <FaMapMarkerAlt className="text-sm" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-[#806D70]">المدينة</p>

                      <p className="mt-1 font-bold text-[#4A1821]">{city}</p>
                    </div>
                  </div>
                )}

                {/* Neighborhood */}
                {neighborhood && (
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A83F55] shadow-sm">
                      <FaMapMarkerAlt className="text-sm" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-[#806D70]">الحي</p>

                      <p className="mt-1 font-bold text-[#4A1821]">
                        {neighborhood}
                      </p>
                    </div>
                  </div>
                )}

                {/* Short Address */}
                {shortAddress && (
                  <div className="flex gap-3 sm:col-span-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A83F55] shadow-sm">
                      <FaMapMarkerAlt className="text-sm" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-[#806D70]">العنوان المختصر</p>

                      <p className="mt-1 font-bold leading-6 text-[#4A1821]">
                        {shortAddress}
                      </p>
                    </div>
                  </div>
                )}

                {/* Shipping Company */}
                {shippingMethod && (
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A83F55] shadow-sm">
                      <FaTruck className="text-sm" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-[#806D70]">شركة الشحن</p>

                      <p className="mt-1 font-bold text-[#4A1821]">
                        {shippingMethod}
                      </p>
                    </div>
                  </div>
                )}

                {/* Map Location */}
                {hasCoordinates && (
                  <div className="sm:col-span-2">
                    <div className="rounded-2xl border border-[#E8D9D6] bg-white p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                            <FaLocationArrow className="text-sm" />
                          </div>

                          <div>
                            <p className="font-black text-[#4A1821]">
                              موقع التوصيل
                            </p>

                            <p
                              dir="ltr"
                              className="mt-1 text-xs text-[#806D70]"
                            >
                              {latitude.toFixed(6)}, {longitude.toFixed(6)}
                            </p>
                          </div>
                        </div>

                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#4A1821] hover:shadow-[0_8px_20px_rgba(100,31,43,0.16)]"
                        >
                          <FaMapMarkerAlt />
                          فتح الموقع على الخريطة
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {notes && (
                  <div className="border-t border-[#F0E6E3] pt-5 sm:col-span-2">
                    <p className="text-xs text-[#806D70]">الملاحظات</p>

                    <p className="mt-1 leading-7 text-[#5F5154]">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="overflow-hidden rounded-[26px] border border-[#E8D9D6] bg-[#FBF6F1]">
              <div className="border-b border-[#F0E6E3] bg-gradient-to-r from-[#F7EEE9] to-[#FBF6F1] px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                    <FaShoppingBag />
                  </div>

                  <div>
                    <h2 className="font-black text-[#4A1821]">تفاصيل الطلب</h2>

                    <p className="mt-1 text-xs text-[#806D70]">
                      المنتجات التي تمت إضافتها إلى طلبك
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-[#E8D9D6] bg-white p-3.5 transition-all duration-300 hover:border-[#D8C0C3] hover:shadow-sm sm:gap-4 sm:p-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] sm:h-20 sm:w-20">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-bold leading-6 text-[#4A1821] sm:text-base">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-[#806D70]">
                          الكمية: {item.quantity}
                        </p>
                      </div>

                      <div className="shrink-0 text-left">
                        <p className="text-sm font-black text-[#641F2B] sm:text-base">
                          {(
                            Number(item.price || 0) * Number(item.quantity || 0)
                          ).toFixed(2)}{" "}
                          <span className="text-xs">ر.س</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 space-y-3 border-t border-[#E8D9D6] pt-5">
                  <div className="flex justify-between gap-4 text-sm text-[#806D70]">
                    <span>إجمالي المنتجات</span>

                    <span className="font-semibold text-[#4A1821]">
                      {Number(order.subtotal ?? order.total ?? 0).toFixed(2)}{" "}
                      ر.س
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm text-[#806D70]">
                    <span>الشحن</span>

                    <span
                      className={
                        Number(order.shipping ?? 0) === 0
                          ? "font-bold text-[#7A8B43]"
                          : "font-semibold text-[#4A1821]"
                      }
                    >
                      {Number(order.shipping ?? 0) > 0
                        ? `${Number(order.shipping).toFixed(2)} ر.س`
                        : "مجاني 🎉"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[#E8D9D6] pt-5">
                    <span className="text-base font-black text-[#4A1821]">
                      الإجمالي
                    </span>

                    <span className="text-2xl font-black text-[#641F2B]">
                      {Number(order.total || 0).toFixed(2)}{" "}
                      <span className="text-sm">ر.س</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Step */}
            <div className="mt-8 rounded-[24px] border border-[#E8D9D6] bg-gradient-to-br from-[#F7EEE9] to-[#FBF6F1] p-5 text-center sm:p-6">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F2E4E1] text-[#641F2B]">
                <FaPhone />
              </div>

              <h3 className="font-black text-[#4A1821]">ماذا بعد؟</h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#806D70]">
                سيتم التواصل معك قريبًا لتأكيد الطلب وتنسيق عملية التوصيل. احتفظ
                برقم الطلب لمتابعة حالته بسهولة.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/products"
                className="group flex items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-8 py-4 text-center font-bold text-white shadow-[0_10px_25px_rgba(100,31,43,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-[0_14px_30px_rgba(100,31,43,0.22)]"
              >
                <FaShoppingBag className="transition-transform group-hover:scale-110" />
                متابعة التسوق
              </Link>

              <Link
                to="/track-order"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#D8B6B9] bg-white px-8 py-4 text-center font-bold text-[#641F2B] transition-all duration-300 hover:border-[#A83F55] hover:bg-[#F7EEE9] hover:shadow-sm"
              >
                <FaTruck />
                متابعة حالة الطلب
              </Link>
            </div>

            {/* Brand Footer */}
            <div className="mt-10 border-t border-[#F0E6E3] pt-6 text-center">
              <p className="text-xs font-bold tracking-[0.25em] text-[#A83F55]">
                SAHRA STORE
              </p>

              <p className="mt-2 text-xs text-[#A69A9C]">
                شكرًا لاختيارك سهرة ستور
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
