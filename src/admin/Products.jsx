import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaFileExcel,
  FaUpload,
  FaBoxOpen,
  FaTags
} from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";

import { useStore } from "../hooks/useStore";
import { downloadProductTemplate } from "../utils/excelTemplate";
import { readProductsExcel } from "../utils/importProducts";

function Products() {
  const navigate = useNavigate();

  const { products, categories, addProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return products.filter((product) => {
      const categoriesText = Array.isArray(product.categories)
        ? product.categories.join(" ")
        : product.category || "";

      const productName = product.name?.toLowerCase() || "";

      return (
        productName.includes(searchValue) ||
        categoriesText.toLowerCase().includes(searchValue)
      );
    });
  }, [products, search]);

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const importedProducts = await readProductsExcel(file);

      for (const product of importedProducts) {
        await addProduct(product);
      }

      alert(`تم رفع ${importedProducts.length} منتجات بنجاح`);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء قراءة أو رفع الملف");
    } finally {
      setUploading(false);

      // السماح برفع نفس الملف مرة أخرى
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء حذف المنتج");
    }
  };

  return (
    <AdminLayout>
      <main dir="rtl" className="min-h-full bg-[#FBF6F1] text-[#4A1821]">
        {/* Page header */}
        <section className="mb-6 overflow-hidden rounded-[30px] bg-[#641F2B] shadow-[0_18px_50px_rgba(100,31,43,0.14)]">
          <div className="relative px-5 py-7 md:px-7 md:py-8">
            <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-[#A83F55]/20" />

            <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-[#F2E4E1]">
                  <FaBoxOpen />
                  SAHRA ADMIN
                </div>

                <h1 className="text-3xl font-black text-white md:text-4xl">
                  إدارة المنتجات
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-7 text-white/65">
                  إدارة المنتجات والأسعار والمخزون والتصنيفات من مكان واحد.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#F2E4E1]">
                  <FaBoxOpen />
                </div>

                <div>
                  <p className="text-xs text-white/55">إجمالي المنتجات</p>

                  <p className="mt-0.5 text-xl font-black text-white">
                    {products.length.toLocaleString("ar-SA")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mb-6 rounded-[28px] border border-[#E8D9D6] bg-white p-4 shadow-[0_10px_35px_rgba(100,31,43,0.05)] md:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            {/* Search */}
            <div className="relative w-full xl:max-w-md">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A83F55]" />

              <input
                type="text"
                placeholder="ابحث باسم المنتج أو التصنيف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] py-3.5 pl-4 pr-11 text-sm text-[#4A1821] outline-none transition-all placeholder:text-[#B3A4A6] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1]"
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {/* Add */}
              <button
                type="button"
                onClick={() => navigate("/admin/products/add")}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-md"
              >
                <FaPlus className="text-xs" />
                إضافة منتج
              </button>

              {/* Download Excel */}
              <button
                type="button"
                onClick={() => downloadProductTemplate(categories)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] px-5 py-3.5 text-sm font-bold text-[#641F2B] transition-all duration-300 hover:border-[#D8B8B9] hover:bg-[#F7EEE9]"
              >
                <FaFileExcel className="text-[#7A8B43]" />
                قالب Excel
              </button>

              {/* Upload Excel */}
              <label
                className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
                  uploading
                    ? "cursor-not-allowed bg-[#D5CCCE] text-white"
                    : "cursor-pointer bg-[#F2E4E1] text-[#641F2B] hover:bg-[#EBD9D8]"
                }`}
              >
                <FaUpload className={uploading ? "" : "text-[#A83F55]"} />

                {uploading ? "جاري الرفع..." : "رفع Excel"}

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  hidden
                  disabled={uploading}
                  onChange={handleExcelUpload}
                />
              </label>
            </div>
          </div>

          {/* Result count */}
          <div className="mt-4 flex items-center justify-between border-t border-[#E8D9D6] pt-4">
            <p className="text-xs font-semibold text-[#806D70]">
              عرض{" "}
              <span className="font-black text-[#641F2B]">
                {filteredProducts.length.toLocaleString("ar-SA")}
              </span>{" "}
              من أصل{" "}
              <span className="font-black text-[#641F2B]">
                {products.length.toLocaleString("ar-SA")}
              </span>{" "}
              منتج
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs font-bold text-[#A83F55] transition hover:text-[#641F2B]"
              >
                مسح البحث
              </button>
            )}
          </div>
        </section>

        {/* Products table */}
        <section className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_12px_40px_rgba(100,31,43,0.06)]">
          <div className="border-b border-[#E8D9D6] px-5 py-5 md:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                <FaBoxOpen />
              </div>

              <div>
                <h2 className="text-lg font-black text-[#4A1821]">
                  قائمة المنتجات
                </h2>

                <p className="mt-0.5 text-xs text-[#806D70]">
                  جميع المنتجات المضافة إلى المتجر
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#E8D9D6] bg-[#FBF6F1]">
                  <th className="px-5 py-4 text-right text-xs font-black text-[#806D70]">
                    المنتج
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-black text-[#806D70]">
                    التصنيف
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-black text-[#806D70]">
                    السعر
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-black text-[#806D70]">
                    المخزون
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-black text-[#806D70]">
                    الحالة
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-black text-[#806D70]">
                    الإجراءات
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const productCategories =
                      Array.isArray(product.categories) &&
                      product.categories.length
                        ? product.categories
                        : product.category
                          ? [product.category]
                          : [];

                    const stock = Number(product.stock || 0);

                    return (
                      <tr
                        key={product.id}
                        className="group border-b border-[#E8D9D6] transition-colors duration-200 last:border-b-0 hover:bg-[#FBF6F1]"
                      >
                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex min-w-[260px] items-center gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#E8D9D6] bg-[#F7EEE9]">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name || "صورة المنتج"}
                                  className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-[#B3A4A6]">
                                  بدون صورة
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[300px] truncate text-sm font-black text-[#4A1821]">
                                {product.name}
                              </p>

                              <p className="mt-1 text-[11px] text-[#806D70]">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Categories */}
                        <td className="px-5 py-4">
                          <div className="flex max-w-[260px] flex-wrap gap-1.5">
                            {productCategories.length > 0 ? (
                              productCategories.map((category, index) => (
                                <span
                                  key={`${product.id}-${index}`}
                                  className="inline-flex items-center gap-1 rounded-full bg-[#F2E4E1] px-2.5 py-1 text-[11px] font-bold text-[#641F2B]"
                                >
                                  <FaTags className="text-[9px] text-[#A83F55]" />
                                  {category}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-[#B3A4A6]">
                                بدون تصنيف
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <span className="whitespace-nowrap text-sm font-black text-[#641F2B]">
                            {Number(product.price || 0).toLocaleString("ar-SA")}{" "}
                            <span className="text-[10px] text-[#806D70]">
                              ر.س
                            </span>
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex min-w-12 items-center justify-center rounded-full px-3 py-1.5 text-xs font-black ${
                              stock > 5
                                ? "bg-[#EEF3E5] text-[#65752F]"
                                : stock > 0
                                  ? "bg-[#FFF5DC] text-[#9A6B28]"
                                  : "bg-[#FDF0F1] text-[#A83F55]"
                            }`}
                          >
                            {stock}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-center">
                          {stock > 5 ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF3E5] px-3 py-1.5 text-[11px] font-bold text-[#65752F]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#7A8B43]" />
                              متوفر
                            </span>
                          ) : stock > 0 ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF5DC] px-3 py-1.5 text-[11px] font-bold text-[#9A6B28]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#D49B35]" />
                              مخزون منخفض
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF0F1] px-3 py-1.5 text-[11px] font-bold text-[#A83F55]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#A83F55]" />
                              غير متوفر
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/products/edit/${product.id}`)
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#641F2B] hover:text-white"
                              title="تعديل المنتج"
                            >
                              <FaEdit className="text-sm" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF0F1] text-[#A83F55] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#A83F55] hover:text-white"
                              title="حذف المنتج"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                          {search ? (
                            <FaSearch className="text-xl" />
                          ) : (
                            <FaBoxOpen className="text-xl" />
                          )}
                        </div>

                        <h3 className="text-lg font-black text-[#4A1821]">
                          {search
                            ? "لم يتم العثور على نتائج"
                            : "لا توجد منتجات حالياً"}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-[#806D70]">
                          {search
                            ? "جرّب البحث باستخدام اسم منتج أو تصنيف مختلف."
                            : "ابدأ بإضافة أول منتج إلى متجر سهرة."}
                        </p>

                        {search && (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="mt-5 rounded-xl bg-[#641F2B] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#4A1821]"
                          >
                            مسح البحث
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile hint */}
          <div className="border-t border-[#E8D9D6] bg-[#FBF6F1] px-5 py-3 text-center text-[11px] text-[#806D70] lg:hidden">
            اسحب الجدول أفقيًا لعرض جميع التفاصيل
          </div>
        </section>
      </main>
    </AdminLayout>
  );
}

export default Products;
