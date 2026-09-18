import { FaStar, FaCheckCircle } from "react-icons/fa";

import { useReviews } from "../../hooks/useReviews";

function ProductInfo({ product }) {
  const { averageRating, reviews } = useReviews(product.id);

  const price = Number(product?.price || 0);
  const oldPrice = Number(product?.oldPrice || 0);
  const stock = Number(product?.stock || 0);

  const discount =
    oldPrice > price && oldPrice > 0
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const savings = oldPrice > price ? oldPrice - price : 0;

  return (
    <div>
      {/* Discount Banner */}
      {discount > 0 && (
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8F3046] to-[#A83F55] px-5 py-2 text-sm font-bold text-white shadow-lg">
            🔥 عرض لفترة محدودة • وفر {savings} ر.س
          </div>
        </div>
      )}

      {/* Category */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {product.category && (
          <span className="rounded-full bg-[#F2E4E1] px-4 py-2 text-sm font-semibold text-[#641F2B]">
            ⚡ {product.category}
          </span>
        )}

        {discount > 0 && (
          <span className="rounded-full bg-[#FBE9ED] px-4 py-2 text-sm font-bold text-[#8F3046]">
            خصم {discount}%
          </span>
        )}
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold leading-relaxed text-[#4A1821] lg:text-5xl">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-[#FFF7E8] px-4 py-2">
          <FaStar className="text-[#D49B35]" />

          <span className="font-bold text-[#4A1821]">
            {reviews.length > 0 ? averageRating : "منتج جديد"}
          </span>
        </div>

        <span className="text-[#806D70]">({reviews.length} تقييم)</span>
      </div>

      {/* Price */}
      <div className="mt-8 rounded-3xl bg-[#F7EEE9] p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-4xl font-bold text-[#641F2B]">{price} ر.س</span>

          {oldPrice > price && (
            <span className="text-2xl text-[#A99A9C] line-through">
              {oldPrice} ر.س
            </span>
          )}
        </div>

        {discount > 0 && (
          <div className="mt-4 inline-flex rounded-full bg-[#FBE9ED] px-4 py-2 text-sm font-bold text-[#8F3046]">
            🔥 وفر {savings} ر.س عند الشراء الآن
          </div>
        )}
      </div>

      {/* Stock */}
      <div className="mt-8">
        {stock > 0 ? (
          <div className="inline-flex items-center gap-3 rounded-2xl bg-[#F2E4E1] px-5 py-3 text-[#641F2B]">
            <FaCheckCircle />

            <span className="font-bold">متوفر بالمخزون</span>

            <span className="rounded-full bg-white px-3 py-1 text-sm">
              {stock} قطعة
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center rounded-2xl bg-[#FBE9ED] px-5 py-3 font-bold text-[#8F3046]">
            غير متوفر حالياً
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductInfo;
