import { useState } from "react";
import { FaStar, FaCheck } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../../firebase/config";

function ReviewForm({ productId }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanComment = comment.trim();

    if (!cleanName || !cleanComment) {
      toast.error("الرجاء تعبئة جميع الحقول");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "reviews"), {
        productId,
        name: cleanName,
        comment: cleanComment,
        rating,
        approved: false,
        createdAt: serverTimestamp(),
      });

      toast.success("تم إرسال تقييمك وسيظهر بعد المراجعة");

      setName("");
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Review submission error:", error);

      toast.error("حدث خطأ أثناء إرسال التقييم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 rounded-[28px] border border-[#E8D9D6] bg-white p-6 shadow-[0_12px_40px_rgba(100,31,43,0.05)] sm:p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[#F0E6E3] pb-6">
        <span className="text-xs font-bold tracking-[0.15em] text-[#A83F55]">
          شاركنا تجربتك
        </span>

        <h3 className="mt-2 text-2xl font-black text-[#4A1821]">اكتب تقييمك</h3>

        <p className="mt-2 text-sm leading-7 text-[#806D70]">
          رأيك يساعدنا ويساعد العملاء الآخرين على معرفة تجربتك مع المنتج.
        </p>
      </div>

      <form onSubmit={submitReview}>
        {/* Name */}
        <div className="mb-5">
          <label
            htmlFor="review-name"
            className="mb-2 block text-sm font-bold text-[#4A1821]"
          >
            الاسم
          </label>

          <input
            id="review-name"
            type="text"
            placeholder="اكتب اسمك"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="
              h-14
              w-full
              rounded-2xl
              border
              border-[#E8D9D6]
              bg-[#FBF6F1]
              px-4
              text-sm
              text-[#4A1821]
              outline-none
              transition-all
              placeholder:text-[#A99A9D]
              focus:border-[#A83F55]
              focus:bg-white
              focus:ring-4
              focus:ring-[#F2E4E1]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* Rating */}
        <div className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-bold text-[#4A1821]">تقييمك</label>

            <span className="text-xs font-semibold text-[#806D70]">
              {rating} من 5
            </span>
          </div>

          <div className="flex w-fit items-center gap-1 rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] px-4 py-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                disabled={loading}
                aria-label={`تقييم ${star} من 5`}
                className="rounded-lg p-1 transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaStar
                  className={`text-2xl transition-colors duration-200 ${
                    star <= rating ? "text-[#D49B35]" : "text-[#E1D4D1]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label
            htmlFor="review-comment"
            className="mb-2 block text-sm font-bold text-[#4A1821]"
          >
            تجربتك
          </label>

          <textarea
            id="review-comment"
            placeholder="اكتب تجربتك مع المنتج..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            className="
              min-h-[150px]
              w-full
              resize-none
              rounded-2xl
              border
              border-[#E8D9D6]
              bg-[#FBF6F1]
              px-4
              py-4
              text-sm
              leading-8
              text-[#4A1821]
              outline-none
              transition-all
              placeholder:text-[#A99A9D]
              focus:border-[#A83F55]
              focus:bg-white
              focus:ring-4
              focus:ring-[#F2E4E1]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-[#641F2B]
            px-6
            text-sm
            font-bold
            text-white
            shadow-[0_8px_20px_rgba(100,31,43,0.14)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-[#4A1821]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:w-auto
            sm:min-w-[180px]
          "
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <FaCheck className="text-xs" />
              إرسال التقييم
            </>
          )}
        </button>

        <p className="mt-4 text-xs leading-6 text-[#806D70]">
          سيتم مراجعة التقييم قبل ظهوره للزوار.
        </p>
      </form>
    </section>
  );
}

export default ReviewForm;
