
import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaTags,
  FaBoxOpen,
  FaImage,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";
import { useStore } from "../hooks/useStore";
import { uploadToCloudinary } from "../services/cloudinary";

const emptyForm = {
  name: "",
  image: "",
};

function Categories() {
  const { categories, products, addCategory, updateCategory, deleteCategory } =
    useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [reordering, setReordering] = useState(false);

  const sortedCategories = [...categories].sort((a, b) => {
    const orderA =
      typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;

    const orderB =
      typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return (a.name || "").localeCompare(b.name || "", "ar");
  });

  const productCount = (categoryName) =>
    products.filter((product) => product.category === categoryName).length;

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setForm({
      name: category.name,
      image: category.image || "",
    });

    setEditingId(category.id);
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setUploadingImage(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("يرجى اختيار ملف صورة صالح.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يجب ألا يتجاوز 5 ميجابايت.");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const imageUrl = await uploadToCloudinary(file);

      setForm((current) => ({
        ...current,
        image: imageUrl,
      }));
    } catch (error) {
      console.error("Category image upload error:", error);
      setError("حدث خطأ أثناء رفع صورة التصنيف.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("اسم التصنيف مطلوب.");
      return;
    }

    const nameExists = categories.some(
      (category) =>
        category.name === form.name.trim() && category.id !== editingId,
    );

    if (nameExists) {
      setError("يوجد تصنيف بنفس الاسم.");
      return;
    }

    if (uploadingImage) {
      setError("انتظر حتى يكتمل رفع الصورة.");
      return;
    }

    try {
      if (editingId) {
        const currentCategory = categories.find(
          (category) => category.id === editingId,
        );

        await updateCategory(editingId, {
          name: form.name.trim(),
          image: form.image,
          sortOrder: currentCategory?.sortOrder ?? 0,
        });
      } else {
        const nextSortOrder =
          categories.length > 0
            ? Math.max(
                ...categories.map((category, index) =>
                  typeof category.sortOrder === "number"
                    ? category.sortOrder
                    : index,
                ),
              ) + 1
            : 0;

        await addCategory({
          name: form.name.trim(),
          image: form.image,
          sortOrder: nextSortOrder,
        });
      }

      closeForm();
    } catch (error) {
      console.error("Category save error:", error);
      setError("حدث خطأ أثناء حفظ التصنيف.");
    }
  };

  const handleDelete = async (category) => {
    const count = productCount(category.name);

    const message =
      count > 0
        ? `يوجد ${count} منتج مرتبط بهذا التصنيف. هل تريد حذفه فعلاً؟`
        : "هل أنت متأكد من حذف هذا التصنيف؟";

    if (!window.confirm(message)) return;

    try {
      await deleteCategory(category.id);
    } catch (error) {
      console.error("Category delete error:", error);
      alert("حدث خطأ أثناء حذف التصنيف.");
    }
  };

  const moveCategory = async (index, direction) => {
    if (reordering) return;

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= sortedCategories.length) {
      return;
    }

    const reordered = [...sortedCategories];
    const [movedCategory] = reordered.splice(index, 1);

    reordered.splice(newIndex, 0, movedCategory);

    try {
      setReordering(true);
      setError("");

      await Promise.all(
        reordered.map((category, newOrder) =>
          updateCategory(category.id, {
            sortOrder: newOrder,
          }),
        ),
      );
    } catch (error) {
      console.error("Category reorder error:", error);
      setError("حدث خطأ أثناء إعادة ترتيب التصنيفات.");
    } finally {
      setReordering(false);
    }
  };

  const totalProducts = products.length;

  return (
    <AdminLayout>
      <div className="mx-auto mt-6 max-w-7xl space-y-6 pb-8">
        {/* Page header */}
        <div className="relative overflow-hidden rounded-[30px] bg-[#641F2B] p-6 text-white shadow-[0_18px_45px_rgba(100,31,43,0.16)] md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#A83F55]/20" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F2E4E1] backdrop-blur-sm">
                  <FaTags className="text-xl" />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#F2E4E1]">
                  SAHRA ADMIN
                </span>
              </div>

              <h1 className="text-2xl font-black md:text-3xl">
                إدارة التصنيفات
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-7 text-white/70">
                أنشئ تصنيفات متناسقة مع هوية سهرة، أضف صورها ونظّم منتجات المتجر
                بسهولة.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-[#641F2B] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF6F1]"
            >
              <FaPlus className="text-sm" />
              إضافة تصنيف
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[#E8D9D6] bg-white p-5 shadow-[0_10px_30px_rgba(100,31,43,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#806D70]">
                  إجمالي التصنيفات
                </p>
                <p className="mt-2 text-3xl font-black text-[#4A1821]">
                  {categories.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                <FaTags />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E8D9D6] bg-white p-5 shadow-[0_10px_30px_rgba(100,31,43,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#806D70]">
                  إجمالي المنتجات
                </p>
                <p className="mt-2 text-3xl font-black text-[#4A1821]">
                  {totalProducts}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBF6F1] text-[#A83F55]">
                <FaBoxOpen />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_15px_45px_rgba(100,31,43,0.08)]"
          >
            <div className="flex items-center justify-between border-b border-[#E8D9D6] bg-[#FBF6F1] px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-[#4A1821]">
                  {editingId ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
                </h2>

                <p className="mt-1 text-sm text-[#806D70]">
                  أضف اسم التصنيف وصورته ليظهر بشكل أنيق في المتجر.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8D9D6] bg-white text-[#806D70] transition hover:border-[#A83F55] hover:bg-[#F2E4E1] hover:text-[#641F2B]"
                title="إغلاق"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 md:p-8">
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
                    !
                  </span>
                  {error}
                </div>
              )}

              <div className="grid gap-7 lg:grid-cols-2">
                {/* Category name */}
                <div>
                  <label className="mb-2.5 block text-sm font-bold text-[#4A1821]">
                    اسم التصنيف <span className="text-[#A83F55]">*</span>
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] px-4 py-3.5 text-sm text-[#4A1821] outline-none transition focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1]"
                    placeholder="مثال: المكملات الغذائية"
                  />
                </div>

                {/* Category image */}
                <div>
                  <label className="mb-2.5 block text-sm font-bold text-[#4A1821]">
                    صورة التصنيف
                  </label>

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                      className="w-full cursor-pointer rounded-2xl border border-dashed border-[#D8B8B9] bg-[#FBF6F1] p-3.5 text-sm text-[#806D70] outline-none transition hover:border-[#A83F55] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <p className="mt-2 text-xs leading-6 text-[#806D70]">
                    PNG أو JPG أو WEBP — الحد الأقصى 5 ميجابايت
                  </p>

                  {uploadingImage && (
                    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E8D9D6] bg-[#F2E4E1] p-4 text-sm font-medium text-[#641F2B]">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#641F2B] border-t-transparent" />
                      جاري رفع الصورة إلى Cloudinary...
                    </div>
                  )}

                  {form.image && !uploadingImage && (
                    <div className="mt-5">
                      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-[#4A1821]">
                        <FaImage className="text-[#A83F55]" />
                        معاينة الصورة
                      </p>

                      <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] shadow-sm">
                        <img
                          src={form.image}
                          alt="معاينة التصنيف"
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#641F2B] text-white shadow-md">
                          <FaCheckCircle className="text-xs" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form buttons */}
              <div className="mt-8 flex flex-wrap gap-3 border-t border-[#E8D9D6] pt-6">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-7 py-3.5 font-bold text-white shadow-[0_10px_25px_rgba(100,31,43,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaCheckCircle className="text-sm" />
                  {editingId ? "حفظ التعديلات" : "إضافة التصنيف"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E8D9D6] bg-white px-7 py-3.5 font-bold text-[#806D70] transition-all duration-300 hover:border-[#D8B8B9] hover:bg-[#FBF6F1] hover:text-[#641F2B]"
                >
                  <FaTimes className="text-sm" />
                  إلغاء
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Categories */}
        <div className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_15px_45px_rgba(100,31,43,0.06)]">
          <div className="border-b border-[#E8D9D6] px-6 py-5 md:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                <FaTags />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#4A1821]">
                  التصنيفات الحالية
                </h2>

                <p className="mt-1 text-sm text-[#806D70]">
                  إدارة وتنظيم أقسام منتجات سهرة.
                </p>
              </div>
            </div>

            {categories.length > 1 && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#FBF6F1] px-4 py-3 text-xs font-semibold text-[#806D70]">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F2E4E1] text-[#641F2B]">
                  ↕
                </span>
                استخدم الأسهم لترتيب التصنيفات حسب ترتيب ظهورها في المتجر.
              </div>
            )}
          </div>

          {categories.length > 0 ? (
            <>
              {/* Mobile cards */}
              <div className="grid gap-4 p-4 md:hidden">
                {sortedCategories.map((category, index) => {
                  const count = productCount(category.name);

                  return (
                    <div
                      key={category.id}
                      className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4"
                    >
                      <div className="flex items-center gap-4">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            loading="lazy"
                            className="h-16 w-16 shrink-0 rounded-2xl border border-[#E8D9D6] object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#E8D9D6] bg-white text-[#806D70]">
                            <FaImage />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-[#641F2B] px-2 text-[10px] font-black text-white">
                              {index + 1}
                            </span>

                            <h3 className="truncate font-bold text-[#4A1821]">
                              {category.name}
                            </h3>
                          </div>

                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F2E4E1] px-3 py-1 text-xs font-bold text-[#641F2B]">
                            <FaBoxOpen />
                            {count} منتج
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 border-t border-[#E8D9D6] pt-4">
                        <button
                          type="button"
                          onClick={() => moveCategory(index, -1)}
                          disabled={index === 0 || reordering}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8D9D6] bg-white text-[#641F2B] transition hover:bg-[#F2E4E1] disabled:cursor-not-allowed disabled:opacity-30"
                          title="نقل للأعلى"
                        >
                          <FaArrowUp />
                        </button>

                        <button
                          type="button"
                          onClick={() => moveCategory(index, 1)}
                          disabled={
                            index === sortedCategories.length - 1 ||
                            reordering
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8D9D6] bg-white text-[#641F2B] transition hover:bg-[#F2E4E1] disabled:cursor-not-allowed disabled:opacity-30"
                          title="نقل للأسفل"
                        >
                          <FaArrowDown />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-[#641F2B] shadow-sm transition hover:bg-[#F2E4E1]"
                        >
                          <FaEdit />
                          تعديل
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm transition hover:bg-red-50"
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[820px]">
                  <thead>
                    <tr className="border-b border-[#E8D9D6] bg-[#FBF6F1]">
                      <th className="w-20 px-6 py-4 text-center text-xs font-bold text-[#806D70]">
                        الترتيب
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold text-[#806D70]">
                        الصورة
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold text-[#806D70]">
                        اسم التصنيف
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-bold text-[#806D70]">
                        عدد المنتجات
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-bold text-[#806D70]">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedCategories.map((category, index) => {
                      const count = productCount(category.name);

                      return (
                        <tr
                          key={category.id}
                          className="border-b border-[#E8D9D6] last:border-b-0 transition-colors hover:bg-[#FBF6F1]"
                        >
                          <td className="px-6 py-5">
                            <div className="flex flex-col items-center gap-2">
                              <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#641F2B] px-2 text-xs font-black text-white">
                                {index + 1}
                              </span>

                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveCategory(index, -1)}
                                  disabled={index === 0 || reordering}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8D9D6] bg-white text-[#641F2B] transition hover:bg-[#F2E4E1] disabled:cursor-not-allowed disabled:opacity-25"
                                  title="نقل للأعلى"
                                >
                                  <FaArrowUp className="text-[10px]" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => moveCategory(index, 1)}
                                  disabled={
                                    index === sortedCategories.length - 1 ||
                                    reordering
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8D9D6] bg-white text-[#641F2B] transition hover:bg-[#F2E4E1] disabled:cursor-not-allowed disabled:opacity-25"
                                  title="نقل للأسفل"
                                >
                                  <FaArrowDown className="text-[10px]" />
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                loading="lazy"
                                className="h-16 w-16 rounded-2xl border border-[#E8D9D6] object-cover shadow-sm"
                              />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] text-[#806D70]">
                                <FaImage />
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <span className="font-bold text-[#4A1821]">
                              {category.name}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-center">
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#F2E4E1] px-4 py-2 text-sm font-bold text-[#641F2B]">
                              <FaBoxOpen className="text-xs" />
                              {count}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditForm(category)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8D9D6] bg-white text-[#641F2B] transition-all duration-200 hover:border-[#D8B8B9] hover:bg-[#F2E4E1]"
                                title="تعديل"
                              >
                                <FaEdit />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(category)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50"
                                title="حذف"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2E4E1] text-2xl text-[#641F2B]">
                <FaTags />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#4A1821]">
                لا توجد تصنيفات بعد
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-[#806D70]">
                ابدأ بإضافة أول تصنيف لتنظيم منتجات متجر سهرة.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#641F2B] px-6 py-3 font-bold text-white transition hover:bg-[#4A1821]"
              >
                <FaPlus />
                إضافة تصنيف
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Categories;

