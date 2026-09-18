import { Link } from "react-router-dom";
import { FaArrowLeft, FaClock } from "react-icons/fa";

import { useStore } from "../../hooks/useStore";

function NewProducts() {
  const { products } = useStore();

  const latestProducts = [...products]
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;

      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;

      return dateB - dateA;
    })
    .slice(0, 4);

  if (latestProducts.length === 0) {
    return null;
  }

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-white py-16 md:py-24"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-[#A83F55]/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#641F2B]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center md:mb-14">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
            <FaClock className="text-sm" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A83F55]">
            SAHRA STORE
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#4A1821] md:text-4xl">
            أحدث المنتجات
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#641F2B] to-[#A83F55]" />

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#806D70] md:text-base">
            اكتشف أحدث ما أضفناه إلى متجر سهرة.
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {latestProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.seoSlug || product.slug}`}
              className="group relative overflow-hidden rounded-[24px] border border-[#E8D9D6] bg-[#FBF6F1] shadow-[0_8px_30px_rgba(74,24,33,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D6A5AD] hover:bg-white hover:shadow-[0_20px_50px_rgba(74,24,33,0.12)]"
            >
              {/* New Badge */}
              <div className="absolute right-3 top-3 z-10 rounded-full bg-[#641F2B] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm md:right-4 md:top-4 md:text-xs">
                جديد
              </div>

              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-[#F7EEE9]">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/500"}
                  alt={product.name || "منتج من سهرة"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="p-3.5 md:p-5">
                {product.category && (
                  <p className="mb-2 truncate text-[10px] font-semibold text-[#A83F55] md:text-xs">
                    {product.category}
                  </p>
                )}

                <h3 className="line-clamp-2 min-h-[42px] text-sm font-bold leading-6 text-[#4A1821] transition-colors duration-300 group-hover:text-[#A83F55] md:min-h-[54px] md:text-lg md:leading-7">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center justify-between gap-2 md:mt-4">
                  <p className="text-base font-black text-[#641F2B] md:text-2xl">
                    {product.price} ر.س
                  </p>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8D9D6] bg-white text-[#641F2B] transition-all duration-300 group-hover:border-[#641F2B] group-hover:bg-[#641F2B] group-hover:text-white md:h-9 md:w-9">
                    <FaArrowLeft className="text-[10px]" />
                  </span>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-[#641F2B] to-[#A83F55] transition-all duration-500 group-hover:w-1/2" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewProducts;
