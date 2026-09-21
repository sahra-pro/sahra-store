import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaImage,
  FaBoxOpen,
  FaTags,
  FaSearch,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";
import { useStore } from "../hooks/useStore";
import ProductEditor from "../components/admin/ProductEditor";
import { uploadToCloudinary } from "../services/cloudinary";

const emptyProduct = {
  name: "",
  slug: "",

  seoTitle: "",
  seoDescription: "",
  seoSlug: "",

  price: "",
  oldPrice: "",
  stock: "",

  category: "",
  categories: [],

  description: "",
  usage: "",
  ingredients: [""],
  images: [],
};

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const { categories, addProduct, updateProduct, getProductById } = useStore();

  const existingProduct = isEditing ? getProductById(id) : null;

  const [form, setForm] = useState(() => {
    if (existingProduct) {
      return {
        ...existingProduct,

        ingredients: existingProduct.ingredients?.length
          ? existingProduct.ingredients
          : [""],

        images: existingProduct.images?.length ? existingProduct.images : [],

        categories:
          existingProduct.categories ||
          (existingProduct.category ? [existingProduct.category] : []),
      };
    }

    return emptyProduct;
  });

  const [error, setError] = useState("");

  if (isEditing && !existingProduct) {
    return (
      <AdminLayout>
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
            <FaBoxOpen />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            المنتج غير موجود
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            لم نتمكن من العثور على المنتج المطلوب.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="mt-6 rounded-xl bg-[#641F2B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4A1821]"
          >
            العودة إلى المنتجات
          </button>
        </div>
      </AdminLayout>
    );
  }

  const handleChange = (field, value) => {
    if (field === "name") {
      const slug = value.toLowerCase().trim().replace(/\s+/g, "-");

      setForm((prev) => ({
        ...prev,
        name: value,
        slug,
        seoTitle: prev.seoTitle || value,
        seoSlug: prev.seoSlug || slug,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleListChange = (field, index, value) => {
    setForm((prev) => {
      const arr = [...prev[field]];

      arr[index] = value;

      return {
        ...prev,
        [field]: arr,
      };
    });
  };

  const addListItem = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeListItem = (field, index) => {
    setForm((prev) => {
      const arr = prev[field].filter((_, i) => i !== index);

      return {
        ...prev,
        [field]: arr.length > 0 ? arr : [""],
      };
    });
  };

  const handleImages = async (files) => {
    if (!files?.length) return;

    try {
      setError("");

      const fileArray = Array.from(files);

      const uploadedImages = await Promise.all(
        fileArray.map((file) => uploadToCloudinary(file)),
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (error) {
      console.error(error);
      setError("حدث خطأ أثناء رفع الصور");
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim() || !form.price || !form.categories.length) {
      setError("يرجى تعبئة الحقول المطلوبة");
      return;
    }

    const payload = {
      ...form,

      categories: form.categories,

      category: form.categories[0] || "",

      price: Number(form.price),

      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,

      stock: Number(form.stock) || 0,

      ingredients: form.ingredients.filter((item) => item.trim()),

      images: form.images || [],
    };

    if (isEditing) {
      updateProduct(existingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    navigate("/admin/products");
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="min-w-0 pb-24">
        {/* الصفحة العلوية */}
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>المنتجات</span>
              <span>/</span>
              <span className="text-slate-600">
                {isEditing ? "تعديل المنتج" : "إضافة منتج"}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "قم بتحديث بيانات المنتج ومعلوماته."
                : "أضف منتجًا جديدًا إلى متجرك."}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <FaTimes />
              إلغاء
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#4A1821]"
            >
              <FaSave />
              {isEditing ? "حفظ التعديلات" : "إضافة المنتج"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <FaInfoCircle />
            {error}
          </div>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* العمود الرئيسي */}
          <div className="min-w-0 space-y-6">
            {/* معلومات المنتج */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                    <FaBoxOpen />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">معلومات المنتج</h2>

                    <p className="mt-1 text-xs text-slate-500">
                      البيانات الأساسية للمنتج
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    اسم المنتج <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="مثال: اسم المنتج"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    السعر <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-14 text-sm text-slate-800 outline-none transition focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                    />

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      ر.س
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    السعر قبل الخصم
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={form.oldPrice}
                      onChange={(e) => handleChange("oldPrice", e.target.value)}
                      placeholder="اختياري"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-14 text-sm text-slate-800 outline-none transition focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                    />

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      ر.س
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    المخزون
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                  />
                </div>
              </div>
            </section>

            {/* وصف المنتج */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <h2 className="font-bold text-slate-900">وصف المنتج</h2>

                <p className="mt-1 text-xs text-slate-500">
                  أضف وصفًا واضحًا ومفصلًا للمنتج.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <ProductEditor
                  value={form.description}
                  onChange={(value) => handleChange("description", value)}
                />
              </div>
            </section>

            {/* الاستخدام والمكونات */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <h2 className="font-bold text-slate-900">معلومات إضافية</h2>

                <p className="mt-1 text-xs text-slate-500">
                  طريقة الاستخدام والمكونات
                </p>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    طريقة الاستخدام
                  </label>

                  <textarea
                    rows={4}
                    value={form.usage}
                    onChange={(e) => handleChange("usage", e.target.value)}
                    placeholder="اكتب طريقة الاستخدام..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        المكونات
                      </label>

                      <p className="mt-1 text-xs text-slate-500">
                        كل مكون في خانة مستقلة.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => addListItem("ingredients")}
                      className="flex items-center gap-2 rounded-lg bg-[#F2E4E1] px-3 py-2 text-xs font-bold text-[#641F2B] transition hover:bg-[#E8D9D6]"
                    >
                      <FaPlus />
                      إضافة
                    </button>
                  </div>

                  <div className="space-y-2">
                    {form.ingredients.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleListChange(
                              "ingredients",
                              index,
                              e.target.value,
                            )
                          }
                          placeholder={`المكون ${index + 1}`}
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                        />

                        <button
                          type="button"
                          onClick={() => removeListItem("ingredients", index)}
                          aria-label="حذف المكون"
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* صور المنتج */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <h2 className="font-bold text-slate-900">صور المنتج</h2>

                <p className="mt-1 text-xs text-slate-500">
                  ارفع صورًا واضحة للمنتج.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <label className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-[#A83F55] hover:bg-[#FBF6F1]">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-[#641F2B] shadow-sm">
                    <FaImage />
                  </div>

                  <span className="text-sm font-bold text-slate-700">
                    اسحب الصور هنا أو اضغط للاختيار
                  </span>

                  <span className="mt-2 text-xs text-slate-400">
                    يمكنك اختيار عدة صور
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImages(e.target.files)}
                  />
                </label>

                {form.images.length > 0 && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {form.images.map((image, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={image}
                          alt={`صورة المنتج ${index + 1}`}
                          className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
                          <span className="text-xs font-semibold text-white">
                            الصورة {index + 1}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label="حذف الصورة"
                          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white shadow-md transition hover:bg-red-600"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* SEO */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <FaSearch />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      تحسين محركات البحث
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      إعدادات ظهور المنتج في محركات البحث.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    عنوان SEO
                  </label>

                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) => handleChange("seoTitle", e.target.value)}
                    placeholder="مثال: اسم المنتج | سهرة"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    وصف SEO
                  </label>

                  <textarea
                    rows={4}
                    value={form.seoDescription}
                    onChange={(e) =>
                      handleChange("seoDescription", e.target.value)
                    }
                    placeholder="وصف مختصر للمنتج يظهر في نتائج البحث..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    رابط SEO
                  </label>

                  <input
                    type="text"
                    value={form.seoSlug}
                    onChange={(e) => handleChange("seoSlug", e.target.value)}
                    placeholder="product-name"
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-800 outline-none transition focus:border-[#A83F55] focus:ring-4 focus:ring-[#A83F55]/10"
                  />

                  <div
                    dir="ltr"
                    className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-left text-xs text-slate-500"
                  >
                    /product/
                    <span className="font-semibold text-[#641F2B]">
                      {form.seoSlug || "product-slug"}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* الشريط الجانبي */}
          <aside className="space-y-6 xl:sticky xl:top-6">
            {/* التصنيفات */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2E4E1] text-[#641F2B]">
                    <FaTags />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      تصنيفات المنتج
                    </h2>

                    <p className="mt-1 text-[11px] text-slate-400">
                      اختر تصنيفًا واحدًا أو أكثر
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-h-[360px] overflow-y-auto p-4">
                {categories.length > 0 ? (
                  <div className="space-y-1.5">
                    {categories.map((cat) => {
                      const selected = form.categories.includes(cat.name);

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setForm((prev) => {
                              const exists = prev.categories.includes(cat.name);

                              const updated = exists
                                ? prev.categories.filter(
                                    (item) => item !== cat.name,
                                  )
                                : [...prev.categories, cat.name];

                              return {
                                ...prev,
                                categories: updated,
                                category: updated[0] || "",
                              };
                            });
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right text-sm transition ${
                            selected
                              ? "bg-[#F2E4E1] font-bold text-[#641F2B]"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span>{cat.name}</span>

                          {selected && (
                            <FaCheckCircle className="text-[#A83F55]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-5 text-center text-xs text-slate-400">
                    لا توجد تصنيفات.
                  </div>
                )}
              </div>
            </section>

            {/* ملخص المنتج */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">
                  ملخص المنتج
                </h2>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">السعر</span>
                  <span className="font-bold text-slate-800">
                    {form.price || "0"} ر.س
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">المخزون</span>
                  <span className="font-bold text-slate-800">
                    {form.stock || "0"}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">الصور</span>
                  <span className="font-bold text-slate-800">
                    {form.images.length}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">التصنيفات</span>
                  <span className="font-bold text-slate-800">
                    {form.categories.length}
                  </span>
                </div>
              </div>
            </section>

            {/* ملاحظة */}
            <div className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#641F2B] shadow-sm">
                  <FaInfoCircle />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#4A1821]">ملاحظة</h3>

                  <p className="mt-2 text-xs leading-6 text-[#806D70]">
                    تأكد من مراجعة السعر والمخزون والصور قبل حفظ المنتج.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* شريط الحفظ السفلي */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:right-72">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <FaCheckCircle className="text-emerald-500" />
              جميع التغييرات محفوظة عند الضغط على زر الحفظ
            </div>

            <div className="flex w-full gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:flex-none"
              >
                <FaTimes />
                إلغاء
              </button>

              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#4A1821] sm:flex-none"
              >
                <FaSave />
                {isEditing ? "حفظ التعديلات" : "إضافة المنتج"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

export default ProductForm;
