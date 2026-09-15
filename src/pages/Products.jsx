import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaSearch,
  FaCheck,
  FaHeart,
  FaTimes,
  FaSlidersH,
  FaChevronDown,
  FaFire,
  FaTags,
} from "react-icons/fa";

import { useStore } from "../hooks/useStore";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

export default function Products() {
  const { products, categories } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [addedId, setAddedId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "default";

  const handleSearchChange = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value.trim()) {
        next.set("search", value);
      } else {
        next.delete("search");
      }

      return next;
    });
  };

  const handleSortChange = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value === "default") {
        next.delete("sort");
      } else {
        next.set("sort", value);
      }

      return next;
    });
  };

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

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const productCategories = Array.isArray(product.categories)
        ? product.categories
        : product.category
          ? [product.category]
          : [];

      const matchesCategory = activeCategory
        ? productCategories.includes(activeCategory)
        : true;

      if (!query) {
        return matchesCategory;
      }

      const haystack = [
        product.name,
        ...productCategories,
        product.description,
        ...(product.ingredients || []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && haystack.includes(query);
    });

    return [...filtered].sort((a, b) => {
      const priceA = Number(a.price || 0);
      const priceB = Number(b.price || 0);

      const oldPriceA = Number(a.oldPrice || 0);
      const oldPriceB = Number(b.oldPrice || 0);

      const discountA =
        oldPriceA > priceA ? ((oldPriceA - priceA) / oldPriceA) * 100 : 0;

      const discountB =
        oldPriceB > priceB ? ((oldPriceB - priceB) / oldPriceB) * 100 : 0;

      switch (sort) {
        case "price-low":
          return priceA - priceB;

        case "price-high":
          return priceB - priceA;

        case "discount":
          return discountB - discountA;

        case "name":
          return (a.name || "").localeCompare(b.name || "", "ar");

        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );

        default:
          return 0;
      }
    });
  }, [products, activeCategory, search, sort]);

  const handleCategoryClick = (categoryName) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (!categoryName || categoryName === activeCategory) {
        next.delete("category");
      } else {
        next.set("category", categoryName);
      }

      return next;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = search || activeCategory || sort !== "default";

  return (
    <section className="min-h-screen bg-[#f8f3e8] py-8 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* =========================================================
            PAGE HEADER
        ========================================================== */}
        <div className="mb-8 text-center md:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#eadfca] bg-white px-4 py-2 text-xs font-semibold text-[#8a642f] shadow-sm">
            <FaTags className="text-[#b88a44]" />
            اكتشف تشكيلتنا
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#30291f] md:text-5xl">
            كل المنتجات
            <span className="mr-2 text-[#b88a44]">⚡</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#8a8175] md:text-base">
            اختر ما يناسبك من منتجات شهدان المختارة بعناية، واستمتع بتجربة تسوق
            سهلة ومميزة.
          </p>
        </div>

        {/* =========================================================
            CATEGORY CIRCLES
        ========================================================== */}
        {categories.length > 0 && (
          <div className="mb-8 md:mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#30291f] md:text-xl">
                  تصفح حسب التصنيف
                </h2>

                <p className="mt-1 text-xs text-[#8a8175] md:text-sm">
                  اختر التصنيف للوصول إلى المنتجات المناسبة
                </p>
              </div>

              <FaFire className="text-xl text-[#b88a44]" />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-hide md:flex-wrap md:justify-center md:overflow-visible">
              {/* ALL */}
              <button
                type="button"
                onClick={() => handleCategoryClick("")}
                className="group flex min-w-[78px] flex-shrink-0 flex-col items-center gap-2"
              >
                <div
                  className={`relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 transition-all duration-300 md:h-[82px] md:w-[82px] ${
                    !activeCategory
                      ? "border-[#b88a44] bg-[#f8f3e8] shadow-[0_8px_25px_rgba(184,138,68,0.25)]"
                      : "border-[#eadfca] bg-white group-hover:border-[#b88a44] group-hover:shadow-md"
                  }`}
                >
                  <div
                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-full transition md:h-[64px] md:w-[64px] ${
                      !activeCategory
                        ? "bg-gradient-to-br from-[#b88a44] to-[#8a642f] text-white"
                        : "bg-[#f8f3e8] text-[#8a642f]"
                    }`}
                  >
                    <FaTags className="text-xl md:text-2xl" />
                  </div>

                  {!activeCategory && (
                    <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-[#b88a44]" />
                  )}
                </div>

                <span
                  className={`text-xs font-bold transition md:text-sm ${
                    !activeCategory
                      ? "text-[#8a642f]"
                      : "text-[#5f574c] group-hover:text-[#8a642f]"
                  }`}
                >
                  الكل
                </span>
              </button>

              {categories.map((cat) => {
                const categoryImage =
                  cat.image || cat.imageUrl || cat.icon || "";

                const isActive = activeCategory === cat.name;

                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="group flex min-w-[78px] flex-shrink-0 flex-col items-center gap-2"
                  >
                    <div
                      className={`relative rounded-full p-[3px] transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-[#c7a15a] via-[#b88a44] to-[#8a642f] shadow-[0_8px_25px_rgba(184,138,68,0.28)]"
                          : "bg-[#eadfca] group-hover:bg-[#b88a44] group-hover:shadow-md"
                      }`}
                    >
                      <div className="relative h-[62px] w-[62px] overflow-hidden rounded-full bg-[#f8f3e8] md:h-[76px] md:w-[76px]">
                        {categoryImage ? (
                          <img
                            src={categoryImage}
                            alt={cat.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f5ead5] to-[#eadfca] text-[#b88a44]">
                            <FaTags className="text-xl md:text-2xl" />
                          </div>
                        )}

                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#30291f]/25">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8a642f] shadow-lg">
                              <FaCheck className="text-xs" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`max-w-[90px] truncate text-xs font-bold transition md:text-sm ${
                        isActive
                          ? "text-[#8a642f]"
                          : "text-[#5f574c] group-hover:text-[#8a642f]"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            SEARCH + SORT BAR
        ========================================================== */}
        <div className="mb-8 rounded-[24px] border border-[#eadfca] bg-white p-3 shadow-[0_10px_35px_rgba(92,67,35,0.07)] md:mb-10 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* SEARCH */}
            <div className="relative flex-1">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b88a44]" />

              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full rounded-2xl border border-[#eadfca] bg-[#fdfbf7] py-3.5 pr-11 pl-11 text-sm text-[#30291f] outline-none transition placeholder:text-[#aaa093] focus:border-[#b88a44] focus:bg-white focus:ring-4 focus:ring-[#b88a44]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute left-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#f8f3e8] text-[#8a8175] transition hover:bg-[#eadfca] hover:text-[#30291f]"
                  aria-label="مسح البحث"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* SORT */}
            <div className="relative md:w-64">
              <FaSlidersH className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#b88a44]" />

              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-[#eadfca] bg-[#fdfbf7] py-3.5 pl-10 pr-11 text-sm font-medium text-[#5f574c] outline-none transition focus:border-[#b88a44] focus:bg-white focus:ring-4 focus:ring-[#b88a44]/10"
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="newest">الأحدث أولًا</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="discount">الأكثر خصمًا</option>
                <option value="name">الاسم: أبجديًا</option>
              </select>

              <FaChevronDown className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#8a8175]" />
            </div>
          </div>

          {/* ACTIVE FILTERS */}
          {hasFilters && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-[#eee5d5] pt-3 md:justify-start">
              <span className="text-xs text-[#8a8175]">
                {filteredProducts.length} نتيجة
              </span>

              {activeCategory && (
                <span className="rounded-full bg-[#f8f3e8] px-3 py-1 text-xs font-semibold text-[#8a642f]">
                  التصنيف: {activeCategory}
                </span>
              )}

              {search && (
                <span className="rounded-full bg-[#f8f3e8] px-3 py-1 text-xs font-semibold text-[#8a642f]">
                  البحث: {search}
                </span>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#8a642f] underline decoration-[#c7a15a] underline-offset-4 transition hover:text-[#b88a44]"
              >
                مسح الفلاتر
              </button>
            </div>
          )}
        </div>

        {/* =========================================================
            PRODUCTS
        ========================================================== */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-[28px] border border-[#eadfca] bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f3e8] text-[#b88a44]">
              <FaSearch className="text-xl" />
            </div>

            <h2 className="text-xl font-bold text-[#30291f]">
              لم نجد منتجات مطابقة
            </h2>

            <p className="mt-2 text-sm text-[#8a8175]">
              جرّب تغيير كلمة البحث أو اختيار تصنيف آخر.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-[#b88a44] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#9d7337]"
            >
              عرض كل المنتجات
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8a8175] md:text-sm">
                  عرض{" "}
                  <span className="font-bold text-[#8a642f]">
                    {filteredProducts.length}
                  </span>{" "}
                  منتج
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs text-[#8a8175] sm:flex">
                <FaCheck className="text-[#b88a44]" />
                منتجات مختارة بعناية
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
              {filteredProducts.map((product) => {
                const productCategories = Array.isArray(product.categories)
                  ? product.categories
                  : product.category
                    ? [product.category]
                    : [];

                const oldPrice = Number(product.oldPrice || 0);
                const price = Number(product.price || 0);

                const discount =
                  oldPrice > price
                    ? Math.round(((oldPrice - price) / oldPrice) * 100)
                    : 0;

                const productUrl =
                  product.seoSlug || product.slug || product.id;

                const wished = isInWishlist(product.id);
                const isAdded = addedId === product.id;

                return (
                  <div
                    key={product.id}
                    className="group relative overflow-hidden rounded-[22px] border border-[#eadfca] bg-white shadow-[0_8px_25px_rgba(92,67,35,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c7a15a] hover:shadow-[0_18px_45px_rgba(92,67,35,0.13)]"
                  >
                    {/* DISCOUNT */}
                    {discount > 0 && (
                      <div className="absolute right-2 top-2 z-10 rounded-full bg-[red] px-2.5 py-1 text-[10px] font-black text-[white] shadow-md md:right-3 md:top-3 md:px-3 md:text-xs">
                        خصم {discount}%
                      </div>
                    )}

                    {/* WISHLIST */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, product.id)}
                      className={`absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-md backdrop-blur transition-all hover:scale-110 md:left-3 md:top-3 md:h-10 md:w-10 ${
                        wished
                          ? "border-red-100 text-red-500"
                          : "border-[#eadfca] text-[#8a8175]"
                      }`}
                      aria-label={
                        wished ? "إزالة من المفضلة" : "إضافة إلى المفضلة"
                      }
                    >
                      <FaHeart
                        size={14}
                        className={wished ? "fill-current" : ""}
                      />
                    </button>

                    {/* IMAGE */}
                    <Link to={`/product/${productUrl}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-[#f8f3e8]">
                        <img
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/500"
                          }
                          alt={product.name || "منتج شهدان"}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    </Link>

                    {/* CONTENT */}
                    <div className="p-3 md:p-5">
                      {/* RATING */}
                      <div className="mb-2 flex items-center gap-1">
                        <div className="flex gap-0.5 text-[9px] text-[#c7a15a] md:text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>

                        <span className="text-[9px] text-[#aaa093] md:text-xs">
                          تقييمات
                        </span>
                      </div>

                      {/* CATEGORY */}
                      {productCategories.length > 0 && (
                        <p className="mb-1 line-clamp-1 text-[10px] font-medium text-[#2f7559] md:text-xs">
                          {productCategories.join(" • ")}
                        </p>
                      )}

                      {/* NAME */}
                      <Link to={`/product/${productUrl}`}>
                        <h3 className="line-clamp-2 min-h-[38px] text-sm font-bold leading-5 text-[#30291f] transition-colors group-hover:text-[#8a642f] md:min-h-[48px] md:text-lg md:leading-6">
                          {product.name}
                        </h3>
                      </Link>

                      {/* PRICE */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 md:mt-3">
                        <p className="text-base font-black text-[#1b7f52] md:text-2xl">
                          {product.price}{" "}
                          <span className="text-[10px] font-bold md:text-sm">
                            ر.س
                          </span>
                        </p>

                        {discount > 0 && (
                          <span className="text-[10px] text-[red] line-through md:text-sm">
                            {product.oldPrice} ر.س
                          </span>
                        )}
                      </div>

                      {/* ADD TO CART */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 md:mt-5 md:py-3.5 md:text-sm ${
                          isAdded
                            ? "bg-[#6f572e]"
                            : "bg-gradient-to-r from-[#b88a44] to-[#9d7337] hover:-translate-y-0.5 hover:from-[#9d7337] hover:to-[#8a642f] hover:shadow-lg"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <FaCheck />
                            أضيف للسلة
                          </>
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
          </>
        )}
      </div>
    </section>
  );
}
