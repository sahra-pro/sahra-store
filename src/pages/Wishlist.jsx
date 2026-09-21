
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaCheck,
  FaArrowLeft,
} from "react-icons/fa";
import { useState } from "react";

import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [addedId, setAddedId] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product, 1);

    setAddedId(product.id);

    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  if (wishlistItems.length === 0) {
    return (
      <section
        dir="rtl"
        className="min-h-[75vh] bg-[var(--sahra-ivory)] px-4 py-16 md:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#F2E4E1]" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#E8D9D6] bg-white shadow-[0_15px_40px_rgba(100,31,43,0.10)]">
              <FaHeart className="text-3xl text-[#A83F55]" />
            </div>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-[#A83F55]">
            SAHRA
          </p>

          <h1 className="text-3xl font-black text-[#4A1821] md:text-4xl">
            قائمة المفضلة فارغة
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-[#806D70] md:text-base">
            لم تضف أي منتجات إلى المفضلة بعد. احتفظ بالمنتجات التي تعجبك هنا
            لتعود إليها بسهولة في أي وقت.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#641F2B] px-8 py-4 font-bold text-white shadow-[0_12px_30px_rgba(100,31,43,0.20)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#4A1821] hover:shadow-[0_18px_38px_rgba(100,31,43,0.25)]"
          >
            تصفح المنتجات
            <FaArrowLeft className="text-sm" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-[var(--sahra-ivory)] py-10 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="relative mb-10 overflow-hidden rounded-[32px] bg-[#641F2B] px-6 py-10 text-center shadow-[0_18px_50px_rgba(100,31,43,0.15)] md:px-10 md:py-12">
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#A83F55]/20" />

          <div className="relative z-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-sm">
              <FaHeart className="text-xl" />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#F2E4E1]">
              SAHRA
            </p>

            <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
              المفضلة
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/70">
              المنتجات التي اخترتها واحتفظت بها لتعود إليها عندما ترغب.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white/90">
              <FaHeart className="text-[#F2E4E1]" />
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "منتج" : "منتجات"} في المفضلة
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {wishlistItems.map((product) => {
            const productUrl = `/product/${product.seoSlug || product.slug}`;

            const isOutOfStock = Number(product.stock || 0) <= 0;
            const isAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_10px_35px_rgba(100,31,43,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#D8B8B9] hover:shadow-[0_22px_50px_rgba(100,31,43,0.13)]"
              >
                {/* Product Image */}
                <Link
                  to={productUrl}
                  className="relative block overflow-hidden bg-[#F7EEE9]"
                >
                  <div className="flex h-64 items-center justify-center p-5 md:h-72">
                    <img
                      src={
                        product.images?.[0] ||
                        "https://via.placeholder.com/500"
                      }
                      alt={product.name || "منتج من سهرة"}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#4A1821]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(product.id)}
                  className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D9D6] bg-white/95 text-[#A83F55] shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#FDF4F5] hover:text-[#8F3046]"
                  aria-label="إزالة من المفضلة"
                  title="إزالة من المفضلة"
                >
                  <FaTrash className="text-sm" />
                </button>

                {/* Content */}
                <div className="p-5 md:p-6">
                  {product.category && (
                    <p className="mb-1.5 text-xs font-semibold text-[#806D70]">
                      {product.category}
                    </p>
                  )}

                  <Link to={productUrl}>
                    <h3 className="line-clamp-2 min-h-[52px] text-lg font-black leading-7 text-[#4A1821] transition-colors duration-300 hover:text-[#A83F55]">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xl font-black text-[#641F2B]">
                      {Number(product.price || 0).toFixed(2)}{" "}
                      <span className="text-xs font-bold text-[#806D70]">
                        ر.س
                      </span>
                    </p>

                    {isOutOfStock && (
                      <span className="rounded-full bg-[#F2E4E1] px-2.5 py-1 text-[10px] font-bold text-[#806D70]">
                        غير متوفر
                      </span>
                    )}
                  </div>

                  {/* Add To Cart */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-300 disabled:cursor-not-allowed disabled:bg-[#B8AEB0] ${
                      isAdded
                        ? "bg-[#4A1821] shadow-md"
                        : "bg-[#641F2B] hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-lg"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <FaCheck />
                        أُضيف للسلة
                      </>
                    ) : isOutOfStock ? (
                      "غير متوفر"
                    ) : (
                      <>
                        <FaShoppingCart />
                        أضف للسلة
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-[#E8D9D6] bg-white px-5 py-4 text-center shadow-[0_8px_25px_rgba(100,31,43,0.04)]">
          <p className="text-xs leading-6 text-[#806D70]">
            احتفظ بمنتجاتك المفضلة هنا لتعود إليها بسهولة وتضيفها إلى سلة
            مشترياتك في الوقت المناسب.
          </p>
        </div>
      </div>
    </section>
  );
}

