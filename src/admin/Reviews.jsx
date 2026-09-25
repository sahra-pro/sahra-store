import { useEffect, useMemo, useState } from "react";
import {
collection,
onSnapshot,
updateDoc,
deleteDoc,
doc,
query,
orderBy,
} from "firebase/firestore";

import {
FaCheck,
FaCheckCircle,
FaClock,
FaCommentDots,
FaSearch,
FaStar,
FaTrash,
} from "react-icons/fa";

import { db } from "../firebase/config";

import AdminLayout from "../components/layout/AdminLayout";

function Reviews() {
const [reviews, setReviews] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");

useEffect(() => {
const reviewsQuery = query(
collection(db, "reviews"),
orderBy("createdAt", "desc"),
);


const unsubscribe = onSnapshot(
  reviewsQuery,
  (snapshot) => {
    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setReviews(data);
    setLoading(false);
  },
  (snapshotError) => {
    console.error("Reviews error:", snapshotError);

    setError("حدث خطأ أثناء تحميل التقييمات");
    setLoading(false);
  },
);

return () => unsubscribe();


}, []);

const approveReview = async (id) => {
try {
await updateDoc(doc(db, "reviews", id), {
approved: true,
});
} catch (error) {
console.error("Approve review error:", error);


  alert("حدث خطأ أثناء اعتماد التقييم");
}


};

const removeReview = async (id) => {
if (!window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) {
return;
}


try {
  await deleteDoc(doc(db, "reviews", id));
} catch (error) {
  console.error("Delete review error:", error);

  alert("حدث خطأ أثناء حذف التقييم");
}


};

const stats = useMemo(() => {
const approved = reviews.filter((review) => review.approved).length;
const pending = reviews.filter((review) => !review.approved).length;


const ratings = reviews
  .map((review) => Number(review.rating))
  .filter((rating) => rating >= 1 && rating <= 5);

const average =
  ratings.length > 0
    ? (
        ratings.reduce((total, rating) => total + rating, 0) /
        ratings.length
      ).toFixed(1)
    : "0.0";

return {
  total: reviews.length,
  approved,
  pending,
  average,
};


}, [reviews]);

const filteredReviews = useMemo(() => {
const normalizedSearch = search.trim().toLowerCase();


return reviews.filter((review) => {
  const matchesFilter =
    filter === "all" ||
    (filter === "approved" && review.approved) ||
    (filter === "pending" && !review.approved);

  if (!matchesFilter) {
    return false;
  }

  if (!normalizedSearch) {
    return true;
  }

  const name = String(review.name || "").toLowerCase();
  const comment = String(review.comment || "").toLowerCase();
  const productId = String(review.productId || "").toLowerCase();

  return (
    name.includes(normalizedSearch) ||
    comment.includes(normalizedSearch) ||
    productId.includes(normalizedSearch)
  );
});


}, [reviews, search, filter]);

const formatDate = (createdAt) => {
if (!createdAt) return "تاريخ غير متوفر";


try {
  const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "تاريخ غير متوفر";
  }

  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
} catch {
  return "تاريخ غير متوفر";
}


};

const renderStars = (rating) => {
const value = Number(rating) || 0;


return (
  <div className="flex items-center gap-1" dir="ltr">
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        className={star <= value ? "text-[#D49B35]" : "text-slate-200"}
      />
    ))}
  </div>
);


};

return ( <AdminLayout> <div className="min-h-screen bg-[#f8fafc]"> <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
{/* Header */} <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"> <div> <div className="mb-2 flex items-center gap-2 text-sm text-slate-500"> <span>لوحة التحكم</span> <span>/</span> <span className="text-[#641F2B]">التقييمات</span> </div>


          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            تقييمات العملاء
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
            راجع تقييمات العملاء وتحكم في التقييمات التي تظهر في المتجر.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2e4e1] text-[#641F2B]">
            <FaCommentDots />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">
              إجمالي التقييمات
            </p>

            <p className="text-lg font-bold text-slate-900">
              {stats.total}
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-[#e2cdd0] bg-[#fbf6f1] p-5">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#641F2B] shadow-sm">
            <FaCheckCircle />
          </div>

          <div>
            <h2 className="font-bold text-[#4A1821]">
              تقييمات العملاء الأصلية
            </h2>

            <p className="mt-1 text-sm leading-7 text-[#806D70]">
              التقييمات هنا يتم إرسالها مباشرة من العملاء من صفحات المنتجات،
              ولا تظهر في المتجر إلا بعد اعتمادها.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">كل التقييمات</p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.total}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <FaCommentDots />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">التقييمات المعتمدة</p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {stats.approved}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">بانتظار المراجعة</p>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {stats.pending}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FaClock />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">متوسط التقييم</p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {stats.average}
                </span>

                <FaStar className="text-[#D49B35]" />
              </div>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[#D49B35]">
              <FaStar />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث باسم العميل أو التعليق..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-11 pl-4 text-sm text-slate-800 outline-none transition focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#A83F55]/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              {
                value: "all",
                label: "الكل",
                count: stats.total,
              },
              {
                value: "pending",
                label: "بانتظار المراجعة",
                count: stats.pending,
              },
              {
                value: "approved",
                label: "معتمد",
                count: stats.approved,
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                  filter === item.value
                    ? "bg-[#641F2B] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#A83F55] hover:text-[#641F2B]"
                }`}
              >
                <span>{item.label}</span>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    filter === item.value
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-slate-200" />

                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                    <div className="h-3 w-20 rounded bg-slate-100" />
                  </div>
                </div>

                <div className="h-8 w-24 rounded-full bg-slate-100" />
              </div>

              <div className="mt-6 space-y-2">
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-4/5 rounded bg-slate-100" />
              </div>

              <div className="mt-6 h-10 rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <FaCommentDots />
          </div>

          <h2 className="mt-4 font-bold text-red-800">
            تعذر تحميل التقييمات
          </h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FaCommentDots className="text-2xl" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-800">
            {reviews.length === 0
              ? "لا توجد تقييمات حاليًا"
              : "لا توجد نتائج مطابقة"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {reviews.length === 0
              ? "ستظهر تقييمات العملاء هنا عند وصولها."
              : "جرّب تغيير البحث أو الفلتر المستخدم."}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">التقييمات</h2>

              <p className="mt-1 text-sm text-slate-500">
                عرض {filteredReviews.length} من أصل {reviews.length}
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredReviews.map((review) => {
              const rating = Number(review.rating) || 0;

              return (
                <article
                  key={review.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e2cdd0] hover:shadow-md sm:p-6"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2e4e1] font-bold text-[#641F2B]">
                        {(review.name || "ع").trim().charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-900">
                          {review.name || "عميل"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        review.approved
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {review.approved ? <FaCheckCircle /> : <FaClock />}

                      {review.approved ? "معتمد" : "بانتظار المراجعة"}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mt-5 flex items-center gap-3">
                    {renderStars(rating)}

                    <span className="text-sm font-bold text-slate-700">
                      {rating}/5
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm leading-7 text-slate-600">
                      {review.comment || "لا يوجد تعليق"}
                    </p>
                  </div>

                  {/* Product */}
                  {review.productId && (
                    <div className="mt-4 text-xs text-slate-400">
                      معرف المنتج: {review.productId}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row">
                    {!review.approved && (
                      <button
                        type="button"
                        onClick={() => approveReview(review.id)}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-4 text-sm font-semibold text-white transition hover:bg-[#4A1821]"
                      >
                        <FaCheck />
                        اعتماد التقييم
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removeReview(review.id)}
                      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 ${
                        review.approved ? "w-full" : "sm:w-auto"
                      }`}
                    >
                      <FaTrash />
                      حذف
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  </div>
</AdminLayout>


);
}

export default Reviews;
