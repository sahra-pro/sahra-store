import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  FaCloudUploadAlt,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { db } from "../firebase/config";
import { uploadToCloudinary } from "../services/cloudinary";
import AdminLayout from "../components/layout/AdminLayout";

const COLLECTION_NAME = "customerTestimonials";

function CustomerTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadTestimonials = async () => {
      try {
        const q = query(
          collection(db, COLLECTION_NAME),
          orderBy("sortOrder", "asc"),
        );

        const snapshot = await getDocs(q);

        if (cancelled) {
          return;
        }

        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setItems(data);
      } catch (error) {
        if (!cancelled) {
          console.error("Customer testimonials error:", error);
          toast.error("حدث خطأ أثناء تحميل آراء العملاء");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTestimonials();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const activeItems = useMemo(
    () => items.filter((item) => item.active !== false),
    [items],
  );

  const reloadTestimonials = async () => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("sortOrder", "asc"),
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setItems(data);
    } catch (error) {
      console.error("Customer testimonials reload error:", error);
      toast.error("حدث خطأ أثناء تحديث القائمة");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار ملف صورة فقط");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("حجم الصورة يجب ألا يتجاوز 10 ميجابايت");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview("");
    setTitle("");
    setSortOrder("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("الرجاء اختيار صورة");
      return;
    }

    try {
      setUploading(true);

      const imageUrl = await uploadToCloudinary(selectedFile);

      const nextSortOrder =
        sortOrder.trim() !== ""
          ? Number(sortOrder)
          : items.length > 0
            ? Math.max(...items.map((item) => Number(item.sortOrder) || 0)) + 1
            : 1;

      await addDoc(collection(db, COLLECTION_NAME), {
        title: title.trim(),
        imageUrl,
        sortOrder: Number.isFinite(nextSortOrder) ? nextSortOrder : 1,
        active: true,
        createdAt: serverTimestamp(),
      });

      toast.success("تم رفع رأي العميل بنجاح");

      resetForm();
      await reloadTestimonials();
    } catch (error) {
      console.error("Customer testimonial upload error:", error);
      toast.error(error?.message || "حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      setUpdatingId(item.id);

      await updateDoc(doc(db, COLLECTION_NAME, item.id), {
        active: item.active === false,
      });

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                active: item.active === false,
              }
            : entry,
        ),
      );

      toast.success(
        item.active === false ? "تم إظهار الصورة" : "تم إخفاء الصورة",
      );
    } catch (error) {
      console.error("Toggle testimonial error:", error);
      toast.error("حدث خطأ أثناء تحديث الحالة");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف صورة رأي العميل؟\n\nسيتم حذف السجل من قاعدة البيانات.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);

      await deleteDoc(doc(db, COLLECTION_NAME, item.id));

      setItems((current) => current.filter((entry) => entry.id !== item.id));

      toast.success("تم حذف رأي العميل");
    } catch (error) {
      console.error("Delete testimonial error:", error);
      toast.error("حدث خطأ أثناء حذف الصورة");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      {" "}
      <div className="min-h-screen bg-[#FBF6F1] p-4 sm:p-6 lg:p-8">
        {" "}
        <div className="mx-auto max-w-7xl">
          {/* Header */}{" "}
          <div className="mb-8">
            {" "}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              {" "}
              <div>
                {" "}
                <span className="text-xs font-bold tracking-[0.18em] text-[#A83F55]">
                  CUSTOMER TESTIMONIALS{" "}
                </span>
                <h1 className="mt-2 text-3xl font-black text-[#4A1821]">
                  آراء العملاء
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#806D70]">
                  ارفع صور محادثات وتجارب العملاء لعرضها في صفحة آراء العملاء
                  بشكل مستقل عن تقييمات المنتجات.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[#E8D9D6] bg-white px-5 py-3 shadow-sm">
                  <div className="text-xs font-semibold text-[#806D70]">
                    إجمالي الصور
                  </div>

                  <div className="mt-1 text-2xl font-black text-[#641F2B]">
                    {items.length}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E8D9D6] bg-white px-5 py-3 shadow-sm">
                  <div className="text-xs font-semibold text-[#806D70]">
                    المعروضة
                  </div>

                  <div className="mt-1 text-2xl font-black text-[#641F2B]">
                    {activeItems.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Upload Card */}
          <section className="mb-8 rounded-[28px] border border-[#E8D9D6] bg-white p-5 shadow-[0_12px_40px_rgba(100,31,43,0.05)] sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F2E4E1] text-xl text-[#641F2B]">
                <FaCloudUploadAlt />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#4A1821]">
                  إضافة رأي عميل
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#806D70]">
                  اختر صورة لمحادثة أو تجربة عميل، ثم ارفعها إلى Cloudinary.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpload}>
              <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr_0.5fr]">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#4A1821]">
                    صورة المحادثة
                  </label>

                  <label
                    htmlFor="testimonial-image"
                    className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E8D9D6] bg-[#FBF6F1] p-5 text-center transition hover:border-[#A83F55] hover:bg-[#F7EEE9]"
                  >
                    {preview ? (
                      <div className="relative w-full">
                        <img
                          src={preview}
                          alt="معاينة صورة رأي العميل"
                          className="mx-auto max-h-[220px] max-w-full rounded-xl object-contain"
                        />

                        <div className="mt-3 text-xs font-semibold text-[#806D70]">
                          اضغط لاختيار صورة أخرى
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-[#A83F55] shadow-sm">
                          <FaImage />
                        </div>

                        <div className="text-sm font-bold text-[#4A1821]">
                          اختر صورة المحادثة
                        </div>

                        <div className="mt-1 text-xs text-[#806D70]">
                          PNG / JPG / WEBP — حتى 10 ميجابايت
                        </div>
                      </>
                    )}

                    <input
                      id="testimonial-image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="testimonial-title"
                    className="mb-2 block text-sm font-bold text-[#4A1821]"
                  >
                    عنوان اختياري
                  </label>

                  <input
                    id="testimonial-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="مثال: تجربة عميلة"
                    disabled={uploading}
                    className="h-14 w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] px-4 text-sm text-[#4A1821] outline-none transition placeholder:text-[#A99A9D] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs leading-5 text-[#806D70]">
                    يمكن تركه فارغًا إذا لم تكن بحاجة إلى عنوان.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="testimonial-sort"
                    className="mb-2 block text-sm font-bold text-[#4A1821]"
                  >
                    الترتيب
                  </label>

                  <input
                    id="testimonial-sort"
                    type="number"
                    min="1"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    placeholder="تلقائي"
                    disabled={uploading}
                    className="h-14 w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] px-4 text-sm text-[#4A1821] outline-none transition placeholder:text-[#A99A9D] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs leading-5 text-[#806D70]">
                    الأقل يظهر أولًا.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-[#F0E6E3] pt-6 sm:flex-row">
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#641F2B] px-7 text-sm font-bold text-white shadow-[0_8px_20px_rgba(100,31,43,0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#4A1821] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-xs" />
                      رفع رأي العميل
                    </>
                  )}
                </button>

                {(selectedFile || title || sortOrder) && !uploading && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="h-14 rounded-2xl border border-[#E8D9D6] bg-white px-7 text-sm font-bold text-[#641F2B] transition hover:bg-[#FBF6F1]"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </section>
          {/* Gallery */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-black text-[#4A1821]">
                الصور المضافة
              </h2>

              <p className="mt-1 text-sm text-[#806D70]">
                الصور المفعلة ستظهر لاحقًا في صفحة آراء العملاء.
              </p>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[360px] animate-pulse rounded-[28px] border border-[#E8D9D6] bg-white"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[#E8D9D6] bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2E4E1] text-2xl text-[#A83F55]">
                  <FaImage />
                </div>

                <h3 className="mt-5 text-lg font-black text-[#4A1821]">
                  لا توجد آراء عملاء حتى الآن
                </h3>

                <p className="mt-2 text-sm text-[#806D70]">
                  ارفع أول صورة لمحادثة عميل من النموذج أعلاه.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const isActive = item.active !== false;
                  const isDeleting = deletingId === item.id;
                  const isUpdating = updatingId === item.id;

                  return (
                    <article
                      key={item.id}
                      className={`overflow-hidden rounded-[28px] border bg-white shadow-[0_12px_40px_rgba(100,31,43,0.05)] transition ${
                        isActive
                          ? "border-[#E8D9D6]"
                          : "border-[#E8D9D6] opacity-60"
                      }`}
                    >
                      <div className="relative bg-[#F7EEE9]">
                        <img
                          src={item.imageUrl}
                          alt={item.title || "رأي عميل"}
                          loading="lazy"
                          decoding="async"
                          className="h-[330px] w-full object-contain"
                        />

                        <div
                          className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm ${
                            isActive
                              ? "bg-white text-[#641F2B]"
                              : "bg-[#4A1821] text-white"
                          }`}
                        >
                          {isActive ? "مفعّل" : "مخفي"}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-black text-[#4A1821]">
                              {item.title || "رأي عميل"}
                            </h3>

                            <p className="mt-1 text-xs text-[#806D70]">
                              ترتيب العرض: {Number(item.sortOrder) || 0}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-xl bg-[#FBF6F1] px-3 py-1.5 text-xs font-bold text-[#806D70]">
                            #{Number(item.sortOrder) || 0}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => toggleActive(item)}
                            disabled={isUpdating || isDeleting}
                            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] text-xs font-bold text-[#641F2B] transition hover:bg-[#F2E4E1] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdating ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#641F2B]/20 border-t-[#641F2B]" />
                            ) : isActive ? (
                              <>
                                <FaEyeSlash />
                                إخفاء
                              </>
                            ) : (
                              <>
                                <FaEye />
                                إظهار
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={isDeleting || isUpdating}
                            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FFF1F2] text-xs font-bold text-[#B4233C] transition hover:bg-[#FDE4E7] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#B4233C]/20 border-t-[#B4233C]" />
                            ) : (
                              <>
                                <FaTrash />
                                حذف
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

export default CustomerTestimonials;
