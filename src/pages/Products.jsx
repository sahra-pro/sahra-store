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
  FaTags,
  FaArrowLeft,
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
    <main dir="rtl" className="min-h-screen bg-[#FBF6F1] text-[#4A1821]">
      <section className="relative overflow-hidden py-6 md:py-10">
        <div className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-[#A83F55]/5 blur-3xl" />

        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#641F2B]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-3 sm:px-6">
          {/* SEARCH / SORT */}
          <div className="mb-6 rounded-[20px] border border-[#E8D9D6] bg-white p-2.5 shadow-[0_8px_30px_rgba(74,24,33,0.05)] md:mb-8 md:rounded-[24px] md:p-4">
            <div className="flex flex-col gap-2.5 md:flex-row md:gap-3">
              {/* SEARCH */}
              <div className="relative flex-1">
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#A83F55]" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="ابحث عن منتج..."
                  className="h-12 w-full rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] pl-11 pr-11 text-sm text-[#4A1821] outline-none transition placeholder:text-[#B5A5A7] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#A83F55]/10 md:h-14 md:rounded-2xl"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#F2E4E1] text-[#806D70]"
                    aria-label="مسح البحث"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                )}
              </div>

              {/* SORT */}
              <div className="relative md:w-64">
                <FaSlidersH className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#A83F55]" />

                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] pl-10 pr-11 text-sm font-semibold text-[#4A1821] outline-none transition focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#A83F55]/10 md:h-14 md:rounded-2xl"
                >
                  <option value="default">الترتيب الافتراضي</option>
                  <option value="newest">الأحدث أولًا</option>
                  <option value="price-low">السعر: من الأقل للأعلى</option>
                  <option value="price-high">السعر: من الأعلى للأقل</option>
                  <option value="discount">الأكثر خصمًا</option>
                  <option value="name">الاسم: أبجديًا</option>
                </select>

                <FaChevronDown className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#806D70]" />
              </div>
            </div>

            {hasFilters && (
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 border-t border-[#F0E5E1] pt-2.5 md:justify-start md:pt-3">
                <span className="text-[11px] text-[#806D70]">
                  {filteredProducts.length} نتيجة
                </span>

                {activeCategory && (
                  <span className="rounded-full bg-[#F2E4E1] px-3 py-1 text-[10px] font-bold text-[#641F2B]">
                    {activeCategory}
                  </span>
                )}

                {search && (
                  <span className="max-w-[160px] truncate rounded-full bg-[#F2E4E1] px-3 py-1 text-[10px] font-bold text-[#641F2B]">
                    البحث: {search}
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[10px] font-bold text-[#A83F55] underline underline-offset-4"
                >
                  مسح الفلاتر
                </button>
              </div>
            )}
          </div>

          {/* CATEGORIES */}
          {categories.length > 0 && (
            <div className="mb-7 md:mb-10">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#A83F55] md:text-xs">
                    CATEGORIES
                  </p>

                  <h2 className="mt-1 text-xl font-black text-[#4A1821] md:text-2xl">
                    أقسام المنتجات
                  </h2>
                </div>

                <span className="hidden text-xs text-[#9B8588] sm:block">
                  اختر القسم المناسب لك
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto px-1 pb-3 scrollbar-hide md:flex-wrap md:justify-center md:overflow-visible">
                {/* ALL */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick("")}
                  className={`group flex h-[105px] w-max min-w-[82px] flex-shrink-0 flex-col overflow-hidden rounded-xl border bg-white transition-all duration-300 sm:h-[115px] sm:min-w-[90px] md:h-[125px] md:min-w-[100px] md:rounded-2xl ${
                    !activeCategory
                      ? "border-[#641F2B] shadow-[0_6px_18px_rgba(100,31,43,0.12)]"
                      : "border-[#E8D9D6] hover:-translate-y-1 hover:border-[#D6A5AD] hover:shadow-md"
                  }`}
                >
                  <div className="relative flex h-[72px] w-full items-center justify-center bg-[#F2E4E1] sm:h-[78px] md:h-[88px]">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all sm:h-11 sm:w-11 md:h-12 md:w-12 ${
                        !activeCategory
                          ? "bg-[#641F2B] text-white"
                          : "bg-white text-[#641F2B]"
                      }`}
                    >
                      <FaTags className="text-base md:text-lg" />
                    </div>

                    {!activeCategory && (
                      <div className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#641F2B] shadow-sm">
                        <FaCheck className="text-[8px]" />
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex flex-1 items-center justify-center whitespace-nowrap px-3 text-[10px] font-bold sm:text-[11px] md:text-xs ${
                      !activeCategory ? "text-[#641F2B]" : "text-[#806D70]"
                    }`}
                  >
                    الكل
                  </div>
                </button>

                {/* CATEGORIES */}
                {categories.map((cat) => {
                  const categoryImage =
                    cat.image || cat.imageUrl || cat.icon || "";

                  const isActive = activeCategory === cat.name;

                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`group flex h-[105px] w-max min-w-[82px] flex-shrink-0 flex-col overflow-hidden rounded-xl border bg-white transition-all duration-300 sm:h-[115px] sm:min-w-[90px] md:h-[125px] md:min-w-[100px] md:rounded-2xl ${
                        isActive
                          ? "border-[#641F2B] shadow-[0_6px_18px_rgba(100,31,43,0.12)]"
                          : "border-[#E8D9D6] hover:-translate-y-1 hover:border-[#D6A5AD] hover:shadow-md"
                      }`}
                    >
                      <div className="relative h-[72px] w-full flex-shrink-0 overflow-hidden bg-[#F7EEE9] sm:h-[78px] md:h-[88px]">
                        {categoryImage ? (
                          <img
                            src={categoryImage}
                            alt={cat.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#F2E4E1] text-[#641F2B]">
                            <FaTags className="text-lg md:text-xl" />
                          </div>
                        )}

                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#4A1821]/25">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#641F2B] shadow-lg">
                              <FaCheck className="text-[9px]" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className={`flex flex-1 items-center justify-center whitespace-nowrap px-3 text-center text-[10px] font-bold sm:text-[11px] md:text-xs ${
                          isActive
                            ? "text-[#641F2B]"
                            : "text-[#806D70] group-hover:text-[#A83F55]"
                        }`}
                      >
                        {cat.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* RESULTS HEADER */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#4A1821] md:text-2xl">
                المنتجات
              </h2>

              <p className="mt-0.5 text-[10px] text-[#806D70] md:text-xs">
                {filteredProducts.length} منتج متاح
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#806D70] shadow-sm sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#7A8B43]" />
              منتجات مختارة بعناية
            </div>
          </div>

          {/* EMPTY */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-[26px] border border-[#E8D9D6] bg-white px-5 py-16 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2E4E1] text-[#641F2B]">
                <FaSearch />
              </div>

              <h2 className="text-xl font-black text-[#4A1821]">
                لم نجد منتجات مطابقة
              </h2>

              <p className="mt-2 text-sm text-[#806D70]">
                جرّب تغيير كلمة البحث أو اختيار تصنيف آخر.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[#641F2B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4A1821]"
              >
                عرض كل المنتجات
              </button>
            </div>
          ) : (
            /* PRODUCTS */
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
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
                  <article
                    key={product.id}
                    className="group relative overflow-hidden rounded-[18px] border border-[#E8D9D6] bg-white shadow-[0_5px_20px_rgba(74,24,33,0.045)] transition-all duration-500 hover:-translate-y-1 hover:border-[#D6A5AD] hover:shadow-[0_16px_40px_rgba(74,24,33,0.11)] md:rounded-[24px]"
                  >
                    {discount > 0 && (
                      <div className="absolute right-2 top-2 z-20 rounded-full bg-[#641F2B] px-2 py-1 text-[8px] font-black text-white shadow-sm md:right-3 md:top-3 md:px-3 md:py-1.5 md:text-xs">
                        خصم {discount}%
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, product.id)}
                      className={`absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-sm backdrop-blur transition-all hover:scale-110 md:left-3 md:top-3 md:h-10 md:w-10 ${
                        wished
                          ? "border-[#E8B8C1] text-[#A83F55]"
                          : "border-[#E8D9D6] text-[#9B8588] hover:border-[#D6A5AD] hover:text-[#A83F55]"
                      }`}
                      aria-label={
                        wished ? "إزالة من المفضلة" : "إضافة إلى المفضلة"
                      }
                    >
                      <FaHeart
                        size={12}
                        className={wished ? "fill-current" : ""}
                      />
                    </button>

                    <Link to={`/product/${productUrl}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-[#F7EEE9]">
                        <img
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/500"
                          }
                          alt={product.name || "منتج من سهرة"}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    <div className="p-2.5 md:p-5">
                      {productCategories.length > 0 && (
                        <p className="mb-1 line-clamp-1 text-[8px] font-bold text-[#A83F55] md:mb-2 md:text-xs">
                          {productCategories.join(" • ")}
                        </p>
                      )}

                      <Link to={`/product/${productUrl}`}>
                        <h3 className="line-clamp-2 min-h-[36px] text-[12px] font-black leading-5 text-[#4A1821] transition-colors group-hover:text-[#A83F55] md:min-h-[50px] md:text-lg md:leading-6">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-1.5 flex items-center gap-1 md:mt-2">
                        <div className="flex gap-[2px] text-[7px] text-[#C9963E] md:text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>

                        <span className="text-[8px] text-[#B5A5A7] md:text-xs">
                          تقييمات
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5 md:mt-4 md:gap-3">
                        <span className="text-[14px] font-black text-[#641F2B] md:text-2xl">
                          {product.price}
                          <span className="mr-0.5 text-[8px] font-bold md:mr-1 md:text-sm">
                            ر.س
                          </span>
                        </span>

                        {discount > 0 && (
                          <span className="text-[8px] text-[#B5A5A7] line-through md:text-sm">
                            {product.oldPrice} ر.س
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 md:mt-3">
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[8px] font-semibold text-[#6F7D45] md:text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#7A8B43]" />
                            متوفر
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[8px] font-semibold text-[#A83F55] md:text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#A83F55]" />
                            نفد المخزون
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock <= 0}
                        className={`mt-2.5 flex w-full items-center justify-center gap-1 rounded-xl py-2.5 text-[9px] font-bold text-white transition-all duration-300 md:mt-5 md:gap-2 md:rounded-2xl md:py-3.5 md:text-sm ${
                          product.stock <= 0
                            ? "cursor-not-allowed bg-[#D8CDCF]"
                            : isAdded
                              ? "bg-[#4A1821]"
                              : "bg-[#641F2B] hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-lg"
                        }`}
                      >
                        {product.stock <= 0 ? (
                          "غير متوفر"
                        ) : isAdded ? (
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

                    <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-[#641F2B] to-[#A83F55] transition-all duration-500 group-hover:w-1/2" />
                  </article>
                );
              })}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="mt-9 flex justify-center md:mt-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D9D6] bg-white px-4 py-2.5 text-[10px] font-semibold text-[#806D70] shadow-sm md:px-5 md:text-xs">
                <FaCheck className="text-[#7A8B43]" />
                عرض جميع المنتجات المتاحة
                <FaArrowLeft className="text-[9px] text-[#A83F55]" />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
