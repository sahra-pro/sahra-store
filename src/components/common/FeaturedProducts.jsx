import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaStar,
  FaShoppingCart,
  FaCheck,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";

import { useStore } from "../../hooks/useStore";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

function optimizeCloudinaryImage(url, width = 500) {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  if (!url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

function FeaturedProducts() {
  const { products } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [addedId, setAddedId] = useState(null);

  const featured = products.slice(0, 8);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);

    setAddedId(product.id);

    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  const handleToggleWishlist = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(productId);
  };

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-[#FBF6F1] py-16 md:py-24"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#A83F55]/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-[#641F2B]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A83F55]">
            SAHRA STORE
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#4A1821] md:text-4xl">
            منتجات مختارة
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#641F2B] to-[#A83F55]" />

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#806D70] md:text-base">
            اكتشف مجموعة من منتجاتنا المختارة بعناية لتناسب احتياجك.
          </p>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-3xl border border-[#E8D9D6] bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-semibold text-[#4A1821]">لا توجد منتجات بعد.</p>

            <p className="mt-2 text-sm text-[#806D70]">
              ستظهر المنتجات هنا عند إضافتها من لوحة التحكم.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {featured.map((product) => {
              const productImage =
                product.images?.[0] || "https://via.placeholder.com/500";

              const optimizedProductImage = optimizeCloudinaryImage(
                productImage,
                500,
              );

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.seoSlug || product.slug}`}
                  className="group relative overflow-hidden rounded-[24px] border border-[#E8D9D6] bg-white shadow-[0_8px_30px_rgba(74,24,33,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D6A5AD] hover:shadow-[0_20px_50px_rgba(74,24,33,0.13)]"
                >
                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(e, product.id)}
                    className={`absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 md:left-4 md:top-4 md:h-10 md:w-10 ${
                      isInWishlist(product.id)
                        ? "border-[#E8B8C1] text-[#A83F55]"
                        : "border-[#E8D9D6] text-[#9B8588] hover:border-[#D6A5AD] hover:text-[#A83F55]"
                    }`}
                    aria-label="إضافة إلى المفضلة"
                  >
                    <FaHeart size={13} />
                  </button>

                  {/* Discount */}
                  {product.oldPrice && (
                    <div className="absolute right-3 top-3 z-20 rounded-full bg-[#641F2B] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm md:right-4 md:top-4 md:text-xs">
                      خصم
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-[#F7EEE9]">
                    <img
                      src={optimizedProductImage}
                      alt={product.name || "منتج من سهرة"}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Image overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4A1821]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3 p-3.5 md:space-y-4 md:p-5">
                    {/* Category */}
                    {product.category && (
                      <span className="inline-flex rounded-full border border-[#E8D9D6] bg-[#FBF6F1] px-2.5 py-1 text-[10px] font-semibold text-[#A83F55] md:px-3 md:text-xs">
                        {product.category}
                      </span>
                    )}

                    {/* Name */}
                    <h3 className="line-clamp-2 min-h-[42px] text-sm font-bold leading-6 text-[#4A1821] transition-colors duration-300 group-hover:text-[#A83F55] md:min-h-[54px] md:text-lg md:leading-7">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <div className="flex gap-0.5 text-[10px] text-[#C9963E] md:text-sm">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>

                      <span className="text-[10px] text-[#9B8588] md:text-sm">
                        ({product.rating || 5})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-black text-[#641F2B] md:text-2xl">
                        {product.price} ر.س
                      </span>

                      {product.oldPrice && (
                        <span className="text-xs text-[#B5A5A7] line-through md:text-sm">
                          {product.oldPrice} ر.س
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    <div>
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6F7D45] md:text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#7A8B43]" />
                          متوفر بالمخزون
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#A83F55] md:text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#A83F55]" />
                          نفد المخزون
                        </span>
                      )}
                    </div>

                    {/* Add To Cart */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock <= 0}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-300 md:rounded-2xl md:py-3 md:text-base ${
                        product.stock <= 0
                          ? "cursor-not-allowed bg-[#D8CDCF] text-white"
                          : addedId === product.id
                            ? "bg-[#4A1821] text-white"
                            : "bg-[#641F2B] text-white shadow-sm hover:bg-[#4A1821] hover:shadow-md"
                      }`}
                    >
                      {addedId === product.id ? (
                        <>
                          <FaCheck />
                          تمت الإضافة
                        </>
                      ) : (
                        <>
                          <FaShoppingCart />
                          أضف للسلة
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-[#641F2B] to-[#A83F55] transition-all duration-500 group-hover:w-1/2" />
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Products */}
        {featured.length > 0 && (
          <div className="mt-10 text-center md:mt-12">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full border border-[#D6A5AD] bg-white px-6 py-3 text-sm font-bold text-[#641F2B] shadow-sm transition-all duration-300 hover:border-[#641F2B] hover:bg-[#641F2B] hover:text-white hover:shadow-md"
            >
              <span>عرض جميع المنتجات</span>

              <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
