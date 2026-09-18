
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  CheckCircle2,
  ChevronLeft,
  Loader2,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  Truck,
  ShieldCheck,
  CreditCard,
  PackageCheck,
} from "lucide-react";

import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { useSettings } from "../hooks/useSettings";

import { trackEvent } from "../lib/metaPixel";
import { trackTikTok } from "../lib/tiktokPixel";

const cities = [
  { value: "الرياض", label: "الرياض" },
  { value: "جدة", label: "جدة" },
  { value: "مكة المكرمة", label: "مكة المكرمة" },
  { value: "المدينة المنورة", label: "المدينة المنورة" },
  { value: "الدمام", label: "الدمام" },
  { value: "الخبر", label: "الخبر" },
  { value: "الظهران", label: "الظهران" },
  { value: "الطائف", label: "الطائف" },
  { value: "تبوك", label: "تبوك" },
  { value: "بريدة", label: "بريدة" },
  { value: "خميس مشيط", label: "خميس مشيط" },
  { value: "أبها", label: "أبها" },
  { value: "حائل", label: "حائل" },
  { value: "نجران", label: "نجران" },
  { value: "جازان", label: "جازان" },
  { value: "ينبع", label: "ينبع" },
  { value: "الجبيل", label: "الجبيل" },
  { value: "الأحساء", label: "الأحساء" },
  { value: "القطيف", label: "القطيف" },
  { value: "حفر الباطن", label: "حفر الباطن" },
  { value: "عرعر", label: "عرعر" },
  { value: "سكاكا", label: "سكاكا" },
  { value: "القريات", label: "القريات" },
  { value: "رابغ", label: "رابغ" },
  { value: "الخرج", label: "الخرج" },
  { value: "الرس", label: "الرس" },
  { value: "عنيزة", label: "عنيزة" },
  { value: "المجمعة", label: "المجمعة" },
  { value: "وادي الدواسر", label: "وادي الدواسر" },
  { value: "بيشة", label: "بيشة" },
  { value: "محايل عسير", label: "محايل عسير" },
];

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { settings, loading: settingsLoading } = useSettings();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const shippingFee = Number(settings?.shipping?.shippingFee || 0);

  const freeShippingThreshold = Number(
    settings?.shipping?.freeShippingThreshold || 0,
  );

  const shippingCost = useMemo(() => {
    if (
      freeShippingThreshold > 0 &&
      Number(cartTotal) >= freeShippingThreshold
    ) {
      return 0;
    }

    return shippingFee;
  }, [cartTotal, freeShippingThreshold, shippingFee]);

  const finalTotal = Number(cartTotal || 0) + Number(shippingCost || 0);

  useEffect(() => {
    if (cartItems.length === 0 || orderCompleted) return;

    trackEvent("InitiateCheckout", {
      content_ids: cartItems.map((item) => item.id),
      content_type: "product",
      num_items: cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      ),
      value: Number(finalTotal),
      currency: "SAR",
    });
  }, [cartItems, finalTotal, orderCompleted]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCityChange = (selectedOption) => {
    setCustomer((prev) => ({
      ...prev,
      city: selectedOption?.value || "",
    }));

    setErrors((prev) => ({
      ...prev,
      city: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!customer.name.trim()) {
      newErrors.name = "يرجى إدخال الاسم";
    }

    if (!customer.phone.trim()) {
      newErrors.phone = "يرجى إدخال رقم الجوال";
    } else {
      const cleanPhone = customer.phone.replace(/\s/g, "");

      if (!/^05\d{8}$/.test(cleanPhone)) {
        newErrors.phone = "يرجى إدخال رقم جوال سعودي صحيح";
      }
    }

    if (!customer.city) {
      newErrors.city = "يرجى اختيار المدينة";
    }

    if (!customer.address.trim()) {
      newErrors.address = "يرجى إدخال العنوان";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    setSubmitting(true);

    try {
      const order = await createOrder({
        customer: {
          ...customer,
          phone: customer.phone.replace(/\s/g, ""),
        },

        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || "",
        })),

        subtotal: cartTotal,
        shipping: shippingCost,
        total: finalTotal,
      });

      console.log("ORDER:", order);

      /*
       * إنشاء الطلب هو العملية الأساسية.
       * فشل البريد لا يعني فشل الطلب ولا يجب أن يؤدي إلى
       * إعادة المحاولة حتى لا يتم إنشاء طلب مكرر.
       */
      try {
        const response = await fetch("/api/send-order-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order,
          }),
        });

        let data = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (response.ok && data?.success) {
          console.log("EMAIL SENT:", data);
        } else {
          console.error("EMAIL FAILED:", {
            status: response.status,
            data,
          });
        }
      } catch (emailError) {
        console.error("EMAIL REQUEST ERROR:", emailError);
      }

      trackEvent("Purchase", {
        content_ids: order.items.map((item) => item.id),
        content_type: "product",
        num_items: order.items.reduce(
          (total, item) => total + Number(item.quantity || 0),
          0,
        ),
        value: Number(order.total),
        currency: "SAR",
      });

      trackTikTok("CompletePayment", {
        contents: order.items.map((item) => ({
          content_id: item.id,
          content_name: item.name,
          quantity: Number(item.quantity || 0),
          price: Number(item.price || 0),
        })),
        value: Number(order.total),
        currency: "SAR",
      });

      setOrderCompleted(true);

      clearCart();

      navigate(`/order-confirmation/${order.orderNumber}`, {
        replace: true,
        state: {
          order,
        },
      });
    } catch (error) {
      console.error("Create Order Error:", error);

      alert("حدث خطأ أثناء تأكيد الطلب، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  if (settingsLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center bg-[#FBF6F1]"
      >
        <div className="flex items-center gap-3 text-sm text-[#806D70]">
          <Loader2 className="h-5 w-5 animate-spin text-[#641F2B]" />
          <span>جارٍ تحميل بيانات المتجر...</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderCompleted) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FBF6F1] py-6 sm:py-8 md:py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            CHECKOUT STEPS
        ========================================================= */}
        <div className="mb-8">
          <div className="mx-auto flex max-w-xl items-center justify-center">
            <div className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <Link
                  to="/cart"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2E4E1] text-[#641F2B] transition hover:bg-[#EBD6D4]"
                >
                  <ShoppingBag className="h-4 w-4" />
                </Link>

                <span className="text-[10px] font-bold text-[#806D70] sm:text-xs">
                  السلة
                </span>
              </div>

              <div className="mx-3 h-px w-12 bg-[#641F2B] sm:mx-5 sm:w-20" />

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#641F2B] text-white shadow-[0_5px_15px_rgba(100,31,43,0.18)]">
                  <User className="h-4 w-4" />
                </div>

                <span className="text-[10px] font-bold text-[#641F2B] sm:text-xs">
                  بيانات الطلب
                </span>
              </div>

              <div className="mx-3 h-px w-12 bg-[#E8D9D6] sm:mx-5 sm:w-20" />

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8D9D6] bg-white text-[#A99A9D]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <span className="text-[10px] font-medium text-[#A99A9D] sm:text-xs">
                  التأكيد
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            PAGE HEADER
        ========================================================= */}
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold tracking-[0.16em] text-[#A83F55]">
              سهرة ستور
            </p>

            <h1 className="text-3xl font-black tracking-tight text-[#4A1821] sm:text-4xl">
              إتمام الطلب
            </h1>

            <p className="text-sm leading-7 text-[#806D70]">
              أدخل بيانات التوصيل لإتمام طلبك بسهولة وأمان.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-8"
        >
          {/* ======================================================
              CUSTOMER DETAILS
          ======================================================= */}
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_12px_40px_rgba(100,31,43,0.05)]">
              <div className="border-b border-[#F0E6E3] px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                    <User className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-black text-[#4A1821] sm:text-lg">
                      بيانات التوصيل
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-[#806D70]">
                      أدخل بياناتك كما تريد أن تظهر في طلبك.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-bold text-[#4A1821]"
                    >
                      الاسم الكامل
                    </label>

                    <div className="relative">
                      <User className="pointer-events-none absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#A99A9D]" />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={customer.name}
                        onChange={handleChange}
                        placeholder="أدخل الاسم الكامل"
                        autoComplete="name"
                        className={`h-14 w-full rounded-2xl border bg-[#FBF6F1] py-3 pr-11 pl-4 text-sm text-[#4A1821] placeholder:text-[#A99A9D] outline-none transition-all ${
                          errors.name
                            ? "border-red-400 bg-red-50/30 focus:border-red-500"
                            : "border-[#E8D9D6] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1]"
                        }`}
                      />
                    </div>

                    {errors.name && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* PHONE */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-bold text-[#4A1821]"
                    >
                      رقم الجوال
                    </label>

                    <div className="relative">
                      <Phone className="pointer-events-none absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#A99A9D]" />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        value={customer.phone}
                        onChange={handleChange}
                        placeholder="05xxxxxxxx"
                        autoComplete="tel"
                        dir="ltr"
                        className={`h-14 w-full rounded-2xl border bg-[#FBF6F1] py-3 pr-11 pl-4 text-left text-sm text-[#4A1821] placeholder:text-[#A99A9D] outline-none transition-all ${
                          errors.phone
                            ? "border-red-400 bg-red-50/30 focus:border-red-500"
                            : "border-[#E8D9D6] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1]"
                        }`}
                      />
                    </div>

                    {errors.phone && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* CITY */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#4A1821]">
                      المدينة
                    </label>

                    <Select
                      value={
                        cities.find(
                          (city) => city.value === customer.city,
                        ) || null
                      }
                      onChange={handleCityChange}
                      options={cities}
                      placeholder="اختر المدينة"
                      isSearchable
                      noOptionsMessage={() => "لا توجد نتائج"}
                      loadingMessage={() => "جارٍ التحميل..."}
                      classNamePrefix="sahra-select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: "56px",
                          borderRadius: "16px",
                          backgroundColor: "#FBF6F1",
                          borderColor: errors.city
                            ? "#f87171"
                            : state.isFocused
                              ? "#A83F55"
                              : "#E8D9D6",
                          boxShadow: state.isFocused
                            ? "0 0 0 4px rgba(168,63,85,0.10)"
                            : "none",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: errors.city
                              ? "#f87171"
                              : "#A83F55",
                          },
                        }),

                        valueContainer: (base) => ({
                          ...base,
                          paddingRight: "16px",
                          paddingLeft: "16px",
                        }),

                        singleValue: (base) => ({
                          ...base,
                          color: "#4A1821",
                          fontSize: "14px",
                        }),

                        input: (base) => ({
                          ...base,
                          color: "#4A1821",
                          fontSize: "14px",
                        }),

                        placeholder: (base) => ({
                          ...base,
                          color: "#A99A9D",
                          fontSize: "14px",
                        }),

                        indicatorSeparator: () => ({
                          display: "none",
                        }),

                        menu: (base) => ({
                          ...base,
                          zIndex: 50,
                          borderRadius: "16px",
                          overflow: "hidden",
                          border: "1px solid #E8D9D6",
                          boxShadow:
                            "0 18px 45px rgba(100,31,43,0.12)",
                        }),

                        menuList: (base) => ({
                          ...base,
                          padding: "6px",
                        }),

                        option: (base, state) => ({
                          ...base,
                          borderRadius: "10px",
                          margin: "2px 0",
                          backgroundColor: state.isSelected
                            ? "#641F2B"
                            : state.isFocused
                              ? "#F7EEE9"
                              : "#FFFFFF",
                          color: state.isSelected
                            ? "#FFFFFF"
                            : "#4A1821",
                          cursor: "pointer",
                          fontSize: "14px",
                          padding: "11px 12px",
                        }),
                      }}
                    />

                    {errors.city && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* ADDRESS */}
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-bold text-[#4A1821]"
                    >
                      العنوان
                    </label>

                    <div className="relative">
                      <MapPin className="pointer-events-none absolute right-4 top-4 h-[18px] w-[18px] text-[#A99A9D]" />

                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={customer.address}
                        onChange={handleChange}
                        placeholder="الحي، الشارع، رقم المنزل..."
                        autoComplete="street-address"
                        className={`min-h-[120px] w-full resize-none rounded-2xl border bg-[#FBF6F1] py-3 pr-11 pl-4 text-sm leading-7 text-[#4A1821] placeholder:text-[#A99A9D] outline-none transition-all ${
                          errors.address
                            ? "border-red-400 bg-red-50/30 focus:border-red-500"
                            : "border-[#E8D9D6] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1]"
                        }`}
                      />
                    </div>

                    {errors.address && (
                      <p className="mt-1.5 text-xs font-medium text-red-500">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* NOTES */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="notes"
                      className="mb-2 block text-sm font-bold text-[#4A1821]"
                    >
                      ملاحظات إضافية{" "}
                      <span className="font-normal text-[#A99A9D]">
                        (اختياري)
                      </span>
                    </label>

                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={customer.notes}
                      onChange={handleChange}
                      placeholder="أي ملاحظات ترغب بإضافتها للطلب..."
                      className="min-h-[110px] w-full resize-none rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] px-4 py-3 text-sm leading-7 text-[#4A1821] placeholder:text-[#A99A9D] outline-none transition-all focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1]"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ====================================================
                PAYMENT
            ===================================================== */}
            <section className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_12px_40px_rgba(100,31,43,0.05)]">
              <div className="border-b border-[#F0E6E3] px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                    <CreditCard className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-black text-[#4A1821] sm:text-lg">
                      طريقة الدفع
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-[#806D70]">
                      طريقة الدفع المتاحة حاليًا
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="relative rounded-2xl border-2 border-[#641F2B] bg-[#FBF6F1] p-5">
                  <div className="absolute left-4 top-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#641F2B] text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-8">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#641F2B] shadow-sm">
                      <PackageCheck className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="font-bold text-[#4A1821]">
                        الدفع عند الاستلام
                      </p>

                      <p className="mt-1 text-xs leading-6 text-[#806D70]">
                        ادفع قيمة طلبك عند استلامه.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECURITY MESSAGE */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#E8D9D6] bg-white px-4 py-4 sm:px-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#7A8B43]" />

              <div>
                <p className="text-xs font-bold text-[#4A1821]">
                  تسوق بأمان
                </p>

                <p className="mt-1 text-xs leading-5 text-[#806D70]">
                  نستخدم بياناتك فقط لمعالجة طلبك وتوصيله إليك.
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================
              ORDER SUMMARY
          ======================================================= */}
          <aside className="lg:sticky lg:top-24">
            <section className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_16px_50px_rgba(100,31,43,0.08)]">
              {/* HEADER */}
              <div className="border-b border-[#F0E6E3] px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-[#4A1821]">
                      ملخص الطلب
                    </h2>

                    <p className="mt-1 text-xs text-[#806D70]">
                      {cartItems.length}{" "}
                      {cartItems.length === 1 ? "منتج" : "منتجات"}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* PRODUCTS */}
                <div className="max-h-[310px] space-y-4 overflow-y-auto pl-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 border-b border-[#F0E6E3] pb-4 last:border-0 last:pb-0"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E8D9D6] bg-[#FBF6F1]">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#A99A9D]">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        )}

                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#641F2B] px-1 text-[9px] font-bold text-white">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-xs font-bold leading-5 text-[#4A1821] sm:text-sm">
                          {item.name}
                        </h3>

                        <div className="mt-1.5 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-[#806D70]">
                            {Number(item.price || 0).toFixed(2)} ر.س
                          </span>

                          <span className="text-xs font-black text-[#641F2B]">
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 0)
                            ).toFixed(2)}{" "}
                            ر.س
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SHIPPING NOTICE */}
                {freeShippingThreshold > 0 &&
                  Number(cartTotal) < freeShippingThreshold && (
                    <div className="mt-5 rounded-2xl bg-[#F7EEE9] px-4 py-3">
                      <div className="flex items-start gap-2">
                        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#A83F55]" />

                        <p className="text-[11px] leading-5 text-[#806D70]">
                          أضف{" "}
                          <strong className="text-[#641F2B]">
                            {Math.max(
                              0,
                              freeShippingThreshold - Number(cartTotal),
                            ).toFixed(2)}{" "}
                            ر.س
                          </strong>{" "}
                          للحصول على شحن مجاني.
                        </p>
                      </div>
                    </div>
                  )}

                {/* TOTALS */}
                <div className="mt-5 space-y-3 border-t border-[#F0E6E3] pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#806D70]">المجموع الفرعي</span>

                    <span className="font-bold text-[#4A1821]">
                      {Number(cartTotal || 0).toFixed(2)} ر.س
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#806D70]">الشحن</span>

                    {shippingCost === 0 ? (
                      <span className="font-bold text-[#7A8B43]">
                        مجاني
                      </span>
                    ) : (
                      <span className="font-bold text-[#4A1821]">
                        {Number(shippingCost).toFixed(2)} ر.س
                      </span>
                    )}
                  </div>
                </div>

                {/* FINAL TOTAL */}
                <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#E8D9D6] pt-5">
                  <div>
                    <p className="text-sm font-black text-[#4A1821]">
                      الإجمالي
                    </p>

                    <p className="mt-1 text-[11px] text-[#806D70]">
                      شامل الشحن
                    </p>
                  </div>

                  <p className="text-2xl font-black text-[#641F2B]">
                    {Number(finalTotal).toFixed(2)}
                    <span className="mr-1 text-sm">ر.س</span>
                  </p>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={submitting || cartItems.length === 0}
                  className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(100,31,43,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-[0_14px_32px_rgba(100,31,43,0.24)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جارٍ تأكيد الطلب...
                    </>
                  ) : (
                    <>
                      <span>تأكيد الطلب</span>
                      <ChevronLeft className="h-5 w-5" />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-[10px] leading-5 text-[#A99A9D]">
                  بالضغط على تأكيد الطلب، سيتم إرسال طلبك لمعالجته.
                </p>

                <Link
                  to="/cart"
                  className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#806D70] transition-colors hover:text-[#641F2B]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  العودة إلى السلة
                </Link>
              </div>
            </section>
          </aside>
        </form>

        {/* ========================================================
            TRUST FEATURES
        ========================================================= */}
        <div className="mt-10 grid gap-3 border-t border-[#E8D9D6] pt-7 sm:grid-cols-3">
          <div className="flex items-center justify-center gap-2.5 text-xs text-[#806D70]">
            <ShieldCheck className="h-4 w-4 text-[#A83F55]" />
            بياناتك محفوظة وآمنة
          </div>

          <div className="flex items-center justify-center gap-2.5 text-xs text-[#806D70]">
            <Truck className="h-4 w-4 text-[#A83F55]" />
            توصيل موثوق
          </div>

          <div className="flex items-center justify-center gap-2.5 text-xs text-[#806D70]">
            <PackageCheck className="h-4 w-4 text-[#A83F55]" />
            الدفع عند الاستلام
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

