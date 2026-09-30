import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCheckCircle,
  FaMinus,
  FaPlus,
  FaSearch,
  FaShoppingBag,
  FaTrash,
  FaTruck,
  FaUser,
  FaMoneyBillWave,
  FaStickyNote,
} from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";
import { useStore } from "../hooks/useStore";
import { useSettings } from "../hooks/useSettings";
import { useOrders } from "../hooks/useOrders";

const EMPTY_CUSTOMER = {
  name: "",
  phone: "",
  city: "",
  neighborhood: "",
  shortAddress: "",
  deliveryNotes: "",
  latitude: "",
  longitude: "",
};

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString("ar-SA")} ر.س`;
}

function getShippingMethodFee(method) {
  return Number(method?.extraFee ?? method?.price ?? 0);
}

export default function CreateOrder() {
  const navigate = useNavigate();

  const { products, loading: productsLoading } = useStore();
  const { settings } = useSettings();
  const { createAdminOrder } = useOrders();

  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER);
  const [selectedShippingId, setSelectedShippingId] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  const shippingSettings = settings?.shipping || {};

  const shippingMethods = useMemo(() => {
    const methods = Array.isArray(shippingSettings.methods)
      ? shippingSettings.methods
      : [];

    return methods.filter((method) => method?.active !== false);
  }, [shippingSettings.methods]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products.slice(0, 12);

    return products
      .filter((product) => {
        const name = String(product?.name || "").toLowerCase();
        const sku = String(product?.sku || "").toLowerCase();

        return name.includes(query) || sku.includes(query);
      })
      .slice(0, 12);
  }, [products, search]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }, [cartItems]);

  const hasFreeShippingProduct = useMemo(() => {
    return cartItems.some((item) => item?.freeShipping === true);
  }, [cartItems]);

  const freeShippingThreshold = Number(
    shippingSettings.freeShippingThreshold || 0,
  );

  const qualifiesForFreeShipping =
    hasFreeShippingProduct ||
    (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold);

  const baseShippingFee = Number(shippingSettings.shippingFee || 0);

  const selectedShippingMethod = useMemo(() => {
    if (!selectedShippingId) return null;

    return (
      shippingMethods.find(
        (method) => String(method.id) === String(selectedShippingId),
      ) || null
    );
  }, [selectedShippingId, shippingMethods]);

  const shippingExtraFee = getShippingMethodFee(selectedShippingMethod);

  const shippingCost =
    (qualifiesForFreeShipping ? 0 : baseShippingFee) + shippingExtraFee;

  const total = subtotal + shippingCost;

  const updateCustomer = (field, value) => {
    setCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addProduct = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  Number(item.quantity) + 1,
                  Number(product.stock || 999999),
                ),
              }
            : item,
        ),
      );

      return;
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      return;
    }

    setCartItems((prev) => [
      ...prev,
      {
        id: product.id,
        name: product.name || "",
        price: Number(product.price || 0),
        quantity: 1,
        image: product.images?.[0] || "",
        freeShipping: product.freeShipping === true,
        stock,
      },
    ]);
  };

  const updateQuantity = (id, quantity) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);

    if (!item) return;

    const nextQuantity = Math.max(1, Number(quantity) || 1);

    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              quantity: Math.min(nextQuantity, cartItem.stock || 999999),
            }
          : cartItem,
      ),
    );
  };

  const increaseQuantity = (id) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);

    if (!item) return;

    updateQuantity(id, Number(item.quantity) + 1);
  };

  const decreaseQuantity = (id) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);

    if (!item) return;

    if (Number(item.quantity) <= 1) {
      removeItem(id);
      return;
    }

    updateQuantity(id, Number(item.quantity) - 1);
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (cartItems.length === 0) {
      setError("أضف منتجًا واحدًا على الأقل إلى الطلب.");
      return;
    }

    if (!customer.name.trim()) {
      setError("يرجى إدخال اسم العميل.");
      return;
    }

    if (!customer.phone.trim()) {
      setError("يرجى إدخال رقم جوال العميل.");
      return;
    }

    if (!customer.city.trim()) {
      setError("يرجى إدخال مدينة العميل.");
      return;
    }

    if (settings?.orders?.minOrderAmount) {
      const minOrderAmount = Number(settings.orders.minOrderAmount);

      if (subtotal < minOrderAmount) {
        setError(`الحد الأدنى للطلب هو ${formatPrice(minOrderAmount)}.`);
        return;
      }
    }

    try {
      setSaving(true);

      const orderItems = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        image: item.image || "",
        freeShipping: item.freeShipping === true,
      }));

      const order = await createAdminOrder({
        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          city: customer.city.trim(),
          neighborhood: customer.neighborhood.trim(),
          shortAddress: customer.shortAddress.trim(),
          deliveryNotes: customer.deliveryNotes.trim(),
          latitude: customer.latitude ? Number(customer.latitude) : null,
          longitude: customer.longitude ? Number(customer.longitude) : null,
        },

        items: orderItems,

        subtotal,

        shipping: shippingCost,

        total,

        shippingCompany: selectedShippingMethod
          ? {
              id: selectedShippingMethod.id,
              name: selectedShippingMethod.name,
              extraFee: shippingExtraFee,
              totalFee: shippingCost,
              price: selectedShippingMethod.price ?? 0,
              logo:
                selectedShippingMethod.logo ||
                selectedShippingMethod.image ||
                "",
            }
          : null,

        hasFreeShippingProduct,

        paymentMethod: "cod",

        notes: notes.trim(),
      });

      setSuccessOrder(order);
    } catch (submitError) {
      console.error("Create admin order error:", submitError);

      setError(
        submitError?.message || "حدث خطأ أثناء إنشاء الطلب. حاول مرة أخرى.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (successOrder) {
    return (
      <AdminLayout>
        <div className="min-h-[70vh] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-[#E8D9D6] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F7E9EC] text-4xl text-[#641F2B]">
              <FaCheckCircle />
            </div>

            <h1 className="text-2xl font-black text-[#3E2429] sm:text-3xl">
              تم إنشاء الطلب بنجاح
            </h1>

            <p className="mt-3 text-sm font-bold text-[#806D70]">
              تم حفظ الطلب في قاعدة البيانات ويمكنك الآن متابعته من صفحة
              الطلبات.
            </p>

            <div className="mt-6 rounded-2xl bg-[#FBF6F1] px-8 py-5">
              <p className="text-xs font-bold text-[#806D70]">رقم الطلب</p>

              <p
                dir="ltr"
                className="mt-1 text-2xl font-black tracking-wide text-[#641F2B]"
              >
                {successOrder.orderNumber}
              </p>
            </div>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(`/admin/orders/${successOrder.id}`)}
                className="flex-1 rounded-2xl bg-[#641F2B] px-5 py-3 text-sm font-black text-white transition hover:bg-[#4A1821]"
              >
                عرض الطلب
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/orders")}
                className="flex-1 rounded-2xl border border-[#E8D9D6] bg-white px-5 py-3 text-sm font-black text-[#641F2B] transition hover:bg-[#FBF6F1]"
              >
                العودة للطلبات
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessOrder(null);
                  setCartItems([]);
                  setCustomer(EMPTY_CUSTOMER);
                  setSelectedShippingId("");
                  setNotes("");
                  setSearch("");
                }}
                className="flex-1 rounded-2xl border border-[#E8D9D6] bg-white px-5 py-3 text-sm font-black text-[#806D70] transition hover:bg-[#FBF6F1]"
              >
                إنشاء طلب آخر
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#FBF8F5] px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => navigate("/admin/orders")}
                className="mb-3 inline-flex items-center gap-2 text-sm font-black text-[#806D70] transition hover:text-[#641F2B]"
              >
                <FaArrowRight />
                العودة للطلبات
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#641F2B] text-xl text-white shadow-sm">
                  <FaShoppingBag />
                </div>

                <div>
                  <h1 className="text-2xl font-black text-[#3E2429] sm:text-3xl">
                    إنشاء طلب جديد
                  </h1>

                  <p className="mt-1 text-sm font-bold text-[#806D70]">
                    إنشاء طلب يدوي للعميل من لوحة التحكم
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* Main */}
            <div className="space-y-6">
              {/* Products */}
              <section className="rounded-[2rem] border border-[#E8D9D6] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7E9EC] text-[#641F2B]">
                    <FaBoxOpen />
                  </div>

                  <div>
                    <h2 className="font-black text-[#3E2429]">المنتجات</h2>
                    <p className="text-xs font-bold text-[#806D70]">
                      اختر المنتجات والكميات المطلوبة
                    </p>
                  </div>
                </div>

                <div className="relative mb-5">
                  <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#A99699]" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF8F5] py-3.5 pl-4 pr-11 text-sm font-bold text-[#3E2429] outline-none transition focus:border-[#A83F55] focus:ring-2 focus:ring-[#A83F55]/10"
                  />
                </div>

                {productsLoading ? (
                  <div className="py-10 text-center text-sm font-bold text-[#806D70]">
                    جاري تحميل المنتجات...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="rounded-2xl bg-[#FBF8F5] px-5 py-10 text-center">
                    <FaBoxOpen className="mx-auto text-3xl text-[#C8B7BA]" />
                    <p className="mt-3 text-sm font-black text-[#806D70]">
                      لا توجد منتجات مطابقة
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => {
                      const stock = Number(product.stock || 0);
                      const selected = cartItems.some(
                        (item) => item.id === product.id,
                      );

                      return (
                        <button
                          key={product.id}
                          type="button"
                          disabled={stock <= 0}
                          onClick={() => addProduct(product)}
                          className={`group rounded-2xl border p-3 text-right transition ${
                            stock <= 0
                              ? "cursor-not-allowed border-[#E8D9D6] bg-gray-50 opacity-60"
                              : selected
                                ? "border-[#A83F55] bg-[#FFF8F9] shadow-sm"
                                : "border-[#E8D9D6] bg-white hover:-translate-y-0.5 hover:border-[#A83F55] hover:shadow-sm"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FBF6F1]">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-[#C8B7BA]">
                                  <FaBoxOpen />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="line-clamp-2 text-sm font-black text-[#3E2429]">
                                {product.name}
                              </h3>

                              <p className="mt-1 text-sm font-black text-[#641F2B]">
                                {formatPrice(product.price)}
                              </p>

                              <p
                                className={`mt-1 text-[11px] font-bold ${
                                  stock > 0
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                المخزون: {stock}
                              </p>
                            </div>

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7E9EC] text-[#641F2B] transition group-hover:bg-[#641F2B] group-hover:text-white">
                              <FaPlus className="text-xs" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {cartItems.length > 0 && (
                  <div className="mt-6 border-t border-[#EEE4E1] pt-5">
                    <h3 className="mb-4 text-sm font-black text-[#3E2429]">
                      المنتجات في الطلب ({cartItems.length})
                    </h3>

                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 rounded-2xl border border-[#E8D9D6] bg-[#FBF8F5] p-3 sm:flex-row sm:items-center"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-[#C8B7BA]">
                                  <FaBoxOpen />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-[#3E2429]">
                                {item.name}
                              </p>

                              <p className="mt-1 text-xs font-bold text-[#806D70]">
                                {formatPrice(item.price)} للقطعة
                              </p>

                              {item.freeShipping && (
                                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-black text-emerald-600">
                                  <FaTruck />
                                  شحن مجاني
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <div className="flex items-center rounded-xl border border-[#E8D9D6] bg-white">
                              <button
                                type="button"
                                onClick={() => increaseQuantity(item.id)}
                                className="flex h-9 w-9 items-center justify-center text-[#641F2B] transition hover:bg-[#F7E9EC]"
                              >
                                <FaPlus className="text-[10px]" />
                              </button>

                              <span className="w-10 text-center text-sm font-black text-[#3E2429]">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => decreaseQuantity(item.id)}
                                className="flex h-9 w-9 items-center justify-center text-[#641F2B] transition hover:bg-[#F7E9EC]"
                              >
                                <FaMinus className="text-[10px]" />
                              </button>
                            </div>

                            <div className="min-w-[90px] text-left">
                              <p className="text-sm font-black text-[#641F2B]">
                                {formatPrice(
                                  Number(item.price) * Number(item.quantity),
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50"
                              title="حذف"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Customer */}
              <section className="rounded-[2rem] border border-[#E8D9D6] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7E9EC] text-[#641F2B]">
                    <FaUser />
                  </div>

                  <div>
                    <h2 className="font-black text-[#3E2429]">بيانات العميل</h2>
                    <p className="text-xs font-bold text-[#806D70]">
                      بيانات التواصل والتوصيل
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="اسم العميل"
                    required
                    value={customer.name}
                    onChange={(value) => updateCustomer("name", value)}
                    placeholder="مثال: محمد أحمد"
                  />

                  <Field
                    label="رقم الجوال"
                    required
                    type="tel"
                    value={customer.phone}
                    onChange={(value) => updateCustomer("phone", value)}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                  />

                  <Field
                    label="المدينة"
                    required
                    value={customer.city}
                    onChange={(value) => updateCustomer("city", value)}
                    placeholder="مثال: الرياض"
                  />

                  <Field
                    label="الحي"
                    value={customer.neighborhood}
                    onChange={(value) => updateCustomer("neighborhood", value)}
                    placeholder="اسم الحي"
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="العنوان المختصر"
                      value={customer.shortAddress}
                      onChange={(value) =>
                        updateCustomer("shortAddress", value)
                      }
                      placeholder="العنوان أو وصف مكان التوصيل"
                    />
                  </div>

                  <Field
                    label="خط العرض"
                    value={customer.latitude}
                    onChange={(value) => updateCustomer("latitude", value)}
                    placeholder="اختياري"
                    dir="ltr"
                  />

                  <Field
                    label="خط الطول"
                    value={customer.longitude}
                    onChange={(value) => updateCustomer("longitude", value)}
                    placeholder="اختياري"
                    dir="ltr"
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="ملاحظات التوصيل"
                      value={customer.deliveryNotes}
                      onChange={(value) =>
                        updateCustomer("deliveryNotes", value)
                      }
                      placeholder="مثال: الاتصال قبل الوصول"
                    />
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section className="rounded-[2rem] border border-[#E8D9D6] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7E9EC] text-[#641F2B]">
                    <FaStickyNote />
                  </div>

                  <div>
                    <h2 className="font-black text-[#3E2429]">ملاحظات الطلب</h2>
                    <p className="text-xs font-bold text-[#806D70]">
                      ملاحظات داخلية تظهر للأدمن
                    </p>
                  </div>
                </div>

                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  placeholder="أضف ملاحظات خاصة بهذا الطلب..."
                  className="w-full resize-none rounded-2xl border border-[#E8D9D6] bg-[#FBF8F5] px-4 py-3 text-sm font-bold text-[#3E2429] outline-none transition focus:border-[#A83F55] focus:ring-2 focus:ring-[#A83F55]/10"
                />
              </section>
            </div>

            {/* Summary */}
            <aside className="xl:sticky xl:top-6 xl:self-start">
              <div className="rounded-[2rem] border border-[#E8D9D6] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#641F2B] text-white">
                    <FaMoneyBillWave />
                  </div>

                  <div>
                    <h2 className="font-black text-[#3E2429]">ملخص الطلب</h2>

                    <p className="text-xs font-bold text-[#806D70]">
                      الدفع عند الاستلام
                    </p>
                  </div>
                </div>

                {/* Shipping */}
                <div className="mb-5 rounded-2xl bg-[#FBF8F5] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FaTruck className="text-[#641F2B]" />
                    <p className="text-sm font-black text-[#3E2429]">
                      شركة الشحن
                    </p>
                  </div>

                  {shippingMethods.length === 0 ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs font-bold text-amber-700">
                      لا توجد شركات شحن مفعلة. سيتم استخدام رسوم الشحن الأساسية
                      فقط.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {shippingMethods.map((method) => {
                        const fee = getShippingMethodFee(method);
                        const checked =
                          String(selectedShippingId) === String(method.id);

                        return (
                          <label
                            key={method.id}
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition ${
                              checked
                                ? "border-[#A83F55] bg-[#FFF8F9]"
                                : "border-[#E8D9D6] bg-white hover:border-[#C7A9AE]"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <input
                                type="radio"
                                name="shippingCompany"
                                value={method.id}
                                checked={checked}
                                onChange={(event) =>
                                  setSelectedShippingId(event.target.value)
                                }
                                className="accent-[#641F2B]"
                              />

                              {(method.logo || method.image) && (
                                <img
                                  src={method.logo || method.image}
                                  alt={method.name}
                                  className="h-9 w-9 rounded-lg object-contain"
                                />
                              )}

                              <span className="text-xs font-black text-[#3E2429]">
                                {method.name}
                              </span>
                            </div>

                            <span className="shrink-0 text-xs font-black text-[#641F2B]">
                              {fee > 0
                                ? `+${formatPrice(fee)}`
                                : "بدون رسوم إضافية"}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Free shipping */}
                {qualifiesForFreeShipping && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                    <FaCheckCircle className="mt-0.5 shrink-0" />

                    <div>
                      <p className="text-xs font-black">
                        الطلب مؤهل للشحن المجاني
                      </p>

                      <p className="mt-1 text-[11px] font-bold leading-5">
                        تم إلغاء رسوم الشحن الأساسية، وتبقى رسوم شركة الشحن
                        الإضافية إن وجدت.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <SummaryRow
                    label="المجموع الفرعي"
                    value={formatPrice(subtotal)}
                  />

                  <SummaryRow
                    label="الشحن الأساسي"
                    value={
                      qualifiesForFreeShipping
                        ? "مجاني"
                        : formatPrice(baseShippingFee)
                    }
                    valueClassName={
                      qualifiesForFreeShipping
                        ? "text-emerald-600"
                        : "text-[#3E2429]"
                    }
                  />

                  {shippingExtraFee > 0 && (
                    <SummaryRow
                      label="رسوم شركة الشحن"
                      value={formatPrice(shippingExtraFee)}
                    />
                  )}

                  <div className="border-t border-[#EEE4E1] pt-4">
                    <SummaryRow
                      label="الإجمالي النهائي"
                      value={formatPrice(total)}
                      large
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#E8D9D6] bg-[#FBF8F5] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#806D70]">
                      عدد المنتجات
                    </span>

                    <span className="text-sm font-black text-[#3E2429]">
                      {cartItems.reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0,
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#806D70]">
                      طريقة الدفع
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7E9EC] px-3 py-1.5 text-[11px] font-black text-[#641F2B]">
                      <FaMoneyBillWave />
                      الدفع عند الاستلام
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving || cartItems.length === 0}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-5 py-4 text-sm font-black text-white shadow-lg shadow-[#641F2B]/10 transition hover:bg-[#4A1821] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    "جاري إنشاء الطلب..."
                  ) : (
                    <>
                      <FaCheckCircle />
                      إنشاء الطلب
                    </>
                  )}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function Field({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  type = "text",
  dir,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-[#3E2429]">
        {label}
        {required && <span className="mr-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF8F5] px-4 py-3 text-sm font-bold text-[#3E2429] outline-none transition placeholder:text-[#B7A7AA] focus:border-[#A83F55] focus:ring-2 focus:ring-[#A83F55]/10"
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName = "text-[#3E2429]",
  large = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          large
            ? "text-base font-black text-[#3E2429]"
            : "text-sm font-bold text-[#806D70]"
        }
      >
        {label}
      </span>

      <span
        className={
          large
            ? `text-xl font-black text-[#641F2B]`
            : `text-sm font-black ${valueClassName}`
        }
      >
        {value}
      </span>
    </div>
  );
}
