
import { useState } from "react";
import * as XLSX from "xlsx";
import {
  FaDownload,
  FaUpload,
  FaCheck,
  FaTimes,
  FaFileExcel,
  FaCloudUploadAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBoxOpen,
} from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";

import { useStore } from "../hooks/useStore";
import {
  readProductsExcel,
  validateProducts,
} from "../utils/importProducts";

export default function ImportProducts() {
  const { addProduct } = useStore();

  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // تحميل قالب Excel
  const downloadTemplate = () => {
    const headers = [
      "name",
      "price",
      "oldPrice",
      "stock",
      "categories",
      "description",
      "usage",
      "ingredients",
      "seoTitle",
      "seoDescription",
      "seoSlug",
      "images",
    ];

    const example = [
      "اسم المنتج",
      50,
      70,
      10,
      "مكملات غذائية, تعزيز الحيوية",
      "وصف المنتج",
      "طريقة الاستخدام",
      "المكونات",
      "عنوان SEO",
      "وصف SEO",
      "product-slug",
      "https://example.com/product-image-1.jpg,https://example.com/product-image-2.jpg",
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers, example]);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "sahra-products-template.xlsx");
  };

  // قراءة ملف Excel
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setMessage("");
      setErrors([]);

      const data = await readProductsExcel(file);

      const result = validateProducts(data);

      setProducts(result.validProducts);
      setErrors(result.errors);

      setMessage(`تم قراءة ${data.length} منتج`);
    } catch (error) {
      console.error(error);
      setMessage("حدث خطأ أثناء قراءة الملف");
    }
  };

  // رفع المنتجات إلى Firebase
  const handleImport = async () => {
    if (!products.length) return;

    setLoading(true);

    try {
      for (const product of products) {
        await addProduct(product);
      }

      setMessage(`تم رفع ${products.length} منتج بنجاح`);

      setProducts([]);
      setErrors([]);
    } catch (error) {
      console.error(error);

      setMessage("حدث خطأ أثناء رفع المنتجات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1450px] pb-10">
        {/* Hero */}
        <div className="mt-6 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#641F2B] via-[#711F31] to-[#4A1821] px-5 py-7 text-white shadow-[0_18px_50px_rgba(74,24,33,0.12)] md:px-8 md:py-9">
          <div className="relative">
            <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-white/5" />

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-white/60">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    SAHRA ADMIN
                  </span>

                  <span>إدارة المنتجات</span>
                </div>

                <h1 className="text-3xl font-black md:text-4xl">
                  استيراد المنتجات
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70">
                  أضف مجموعة من المنتجات إلى المتجر دفعة واحدة باستخدام ملف
                  Excel.
                </p>
              </div>

              <div className="hidden h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-3xl md:flex">
                <FaFileExcel />
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Import Area */}
          <div className="min-w-0 rounded-[30px] border border-[#E8D9D6] bg-white p-5 shadow-[0_15px_45px_rgba(74,24,33,0.05)] md:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2E4E1] text-xl text-[#641F2B]">
                <FaCloudUploadAlt />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#4A1821]">
                  إضافة المنتجات
                </h2>

                <p className="mt-1 text-xs text-[#806D70]">
                  اختر الطريقة المناسبة للبدء.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={downloadTemplate}
                className="group rounded-3xl border border-[#E8D9D6] bg-[#FBF6F1] p-5 text-right transition hover:-translate-y-0.5 hover:border-[#A83F55]/40 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-[#641F2B] shadow-sm ring-1 ring-[#E8D9D6]">
                    <FaDownload />
                  </div>

                  <div>
                    <p className="font-black text-[#4A1821]">
                      تحميل قالب Excel
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#806D70]">
                      استخدم القالب الجاهز لإدخال بيانات المنتجات.
                    </p>
                  </div>
                </div>
              </button>

              <label className="group cursor-pointer rounded-3xl border border-[#E8D9D6] bg-[#641F2B] p-5 text-right text-white transition hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
                    <FaUpload />
                  </div>

                  <div>
                    <p className="font-black">
                      اختيار ملف Excel
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/65">
                      يدعم ملفات XLSX و XLS.
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  accept=".xlsx,.xls"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Message */}
            {message && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4">
                <FaInfoCircle className="mt-0.5 flex-shrink-0 text-[#A83F55]" />

                <p className="text-sm font-semibold leading-6 text-[#4A1821]">
                  {message}
                </p>
              </div>
            )}

            {/* Ready Products */}
            {products.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50">
                <div className="p-5 md:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-xl text-emerald-600 shadow-sm">
                        <FaCheck />
                      </div>

                      <div>
                        <h2 className="font-black text-emerald-800">
                          المنتجات جاهزة للاستيراد
                        </h2>

                        <p className="mt-1 text-sm text-emerald-700/70">
                          تم التحقق من {products.length} منتج بنجاح.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleImport}
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-5 py-3 font-bold text-white shadow-lg shadow-[#641F2B]/10 transition hover:bg-[#4A1821] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaCloudUploadAlt />

                      {loading
                        ? "جاري الرفع..."
                        : "بدء استيراد المنتجات"}
                    </button>
                  </div>
                </div>

                <div className="border-t border-emerald-200 bg-white/50 px-5 py-3 text-xs font-semibold text-emerald-700">
                  سيتم إضافة المنتجات إلى المتجر عند بدء الاستيراد.
                </div>
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-3xl border border-rose-200 bg-rose-50">
                <div className="flex items-center gap-3 border-b border-rose-200 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
                    <FaExclamationTriangle />
                  </div>

                  <div>
                    <h2 className="font-black text-rose-800">
                      أخطاء في الملف
                    </h2>

                    <p className="mt-0.5 text-xs text-rose-700/70">
                      راجع الأخطاء التالية قبل إعادة الاستيراد.
                    </p>
                  </div>
                </div>

                <ul className="max-h-72 space-y-2 overflow-y-auto p-5">
                  {errors.map((error, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-xl bg-white p-3 text-sm leading-6 text-rose-700"
                    >
                      <FaTimes className="mt-1 flex-shrink-0 text-rose-500" />

                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            <div className="rounded-[30px] border border-[#E8D9D6] bg-white p-6 shadow-[0_15px_45px_rgba(74,24,33,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                  <FaInfoCircle />
                </div>

                <div>
                  <h2 className="font-black text-[#4A1821]">
                    قبل الاستيراد
                  </h2>

                  <p className="mt-0.5 text-xs text-[#806D70]">
                    نقاط مهمة
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <InfoItem
                  number="01"
                  text="حمّل قالب Excel الجاهز."
                />

                <InfoItem
                  number="02"
                  text="أدخل بيانات المنتجات في الأعمدة المحددة."
                />

                <InfoItem
                  number="03"
                  text="أضف روابط الصور مفصولة بفواصل."
                />

                <InfoItem
                  number="04"
                  text="اختر الملف وانتظر التحقق من البيانات."
                />

                <InfoItem
                  number="05"
                  text="ابدأ الاستيراد بعد ظهور المنتجات الجاهزة."
                />
              </div>
            </div>

            <div className="rounded-[30px] bg-[#FBF6F1] p-6 ring-1 ring-[#E8D9D6]">
              <div className="flex items-start gap-3">
                <FaBoxOpen className="mt-1 text-xl text-[#A83F55]" />

                <div>
                  <h3 className="font-black text-[#4A1821]">
                    الحقول المدعومة
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#806D70]">
                    الاسم، السعر، السعر السابق، المخزون، التصنيفات،
                    الوصف، الاستخدام، المكونات، بيانات SEO وروابط الصور.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}

function InfoItem({ number, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#F2E4E1] text-[10px] font-black text-[#641F2B]">
        {number}
      </span>

      <p className="text-sm leading-6 text-[#4A1821]">
        {text}
      </p>
    </div>
  );
}

