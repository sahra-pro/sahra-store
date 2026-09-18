import { useReviews } from "../../hooks/useReviews";
import {
  FaStar,
  FaUserCircle,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

function ProductReviews({ productId }) {
  const { reviews, loading } = useReviews(productId);

  if (loading) {
    return (
      <section className="mt-12 rounded-[28px] border border-[#E8D9D6] bg-white p-6 shadow-[0_12px_40px_rgba(100,31,43,0.05)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8D9D6] border-t-[#641F2B]" />
          <span className="text-sm font-medium text-[#806D70]">
            جاري تحميل التقييمات...
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 rounded-[28px] border border-[#E8D9D6] bg-white p-6 shadow-[0_12px_40px_rgba(100,31,43,0.05)] sm:p-8 md:p-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 border-b border-[#F0E6E3] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-[0.15em] text-[#A83F55]">
            آراء العملاء
          </span>

          <h2 className="mt-2 text-2xl font-black text-[#4A1821] sm:text-3xl">
            تقييمات العملاء
          </h2>
        </div>

        <div className="rounded-full bg-[#F7EEE9] px-4 py-2 text-sm font-bold text-[#641F2B]">
          {reviews.length} {reviews.length === 1 ? "تقييم" : "تقييمات"}
        </div>
      </div>

      {reviews.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E8D9D6] bg-[#FBF6F1] px-6 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#A83F55] shadow-sm">
            <FaStar className="text-2xl" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-[#4A1821]">
            لا توجد تقييمات بعد
          </h3>

          <p className="mt-2 max-w-md text-sm leading-7 text-[#806D70]">
            كن أول من يشارك تجربته مع هذا المنتج.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const rating = Math.min(5, Math.max(0, Number(review.rating || 0)));

            return (
              <article
                key={review.id}
                className="rounded-3xl border border-[#F0E6E3] bg-[#FBF6F1]/70 p-5 transition-all duration-300 hover:border-[#E8D9D6] hover:bg-white sm:p-6"
              >
                {/* Customer Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2E4E1] text-[#641F2B]">
                      <FaUserCircle className="text-2xl" />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#4A1821]">
                        {review.name || "عميل"}
                      </h3>

                      {review.verified && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#7A8B43]">
                          <FaCheckCircle className="text-[11px]" />
                          <span>عميل موثق</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div
                    className="flex w-fit items-center gap-1 rounded-full bg-white px-3 py-2 shadow-sm"
                    aria-label={`التقييم ${rating} من 5`}
                  >
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`text-sm ${
                          index < rating ? "text-[#D49B35]" : "text-[#E8D9D6]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mt-5">
                  <p className="text-sm leading-8 text-[#5F5154] sm:text-base">
                    {review.comment || "لا يوجد تعليق"}
                  </p>
                </div>

                {/* Date */}
                {review.createdAt?.toDate && (
                  <div className="mt-5 flex items-center gap-2 border-t border-[#F0E6E3] pt-4 text-xs text-[#806D70]">
                    <FaCalendarAlt className="text-[#A83F55]" />

                    <span>
                      {review.createdAt.toDate().toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProductReviews;
