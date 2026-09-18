import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaChevronLeft,
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaCheck,
  FaShoppingCart,
  FaStar,
  FaArrowLeft,
  FaTags,
} from "react-icons/fa";

import { useStore } from "../hooks/useStore";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductActions from "../components/product/ProductActions";
import ReviewForm from "../components/product/ReviewForm";
import ProductReviews from "../components/product/ProductReviews";

import { trackEvent } from "../lib/metaPixel";
import { trackTikTok } from "../lib/tiktokPixel";
import SEO from "../components/SEO/SEO";

function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [showFloatingProduct, setShowFloatingProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const { products, getProductBySlug, loading } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = getProductBySlug(slug);

  // =========================
  // Floating product
  // =========================
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingProduct(window.scrollY > 650);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================
  // Tracking
  // =========================
  useEffect(() => {
    if (!product) return;

    const price = Number(product.price || 0);

    trackEvent("ViewContent", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: price,
      currency: "SAR",
    });

    trackTikTok("ViewContent", {
      content_id: product.id,
      content_name: product.name,
      content_type: "product",
      value: price,
      currency: "SAR",
    });
  }, [product]);

  // =========================
  // SEO slug redirect
  // =========================
  useEffect(() => {
    if (!product) return;

    if (
      product.seoSlug &&
      slug === product.slug &&
      product.slug !== product.seoSlug
    ) {
      navigate(`/product/${product.seoSlug}`, {
        replace: true,
      });
    }
  }, [product, slug, navigate]);

  // =========================
  // Loading
  // =========================
  const isStoreLoading = loading || (products.length === 0 && !product);

  if (isStoreLoading) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#FBF6F1] py-8 md:py-14">
        <div className="mx-auto max-w-7xl animate-pulse px-3 sm:px-6">
          <div className="mb-6 h-4 w-44 rounded-full bg-[#E8D9D6]" />

          <div className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_15px_50px_rgba(74,24,33,0.06)]">
            <div className="grid lg:grid-cols-2">
              <div className="bg-[#F7EEE9] p-4 sm:p-6 md:p-10">
                <div className="aspect-square w-full rounded-[24px] bg-[#E8D9D6]" />
              </div>

              <div className="p-5 sm:p-7 md:p-10">
                <div className="mb-4 h-3 w-24 rounded-full bg-[#E8D9D6]" />
                <div className="mb-3 h-9 w-4/5 rounded-xl bg-[#E8D9D6]" />
                <div className="mb-8 h-5 w-1/3 rounded-lg bg-[#E8D9D6]" />

                <div className="my-7 h-px bg-[#F0E5E1]" />

                <div className="mb-7 grid grid-cols-2 gap-3">
                  <div className="h-24 rounded-2xl bg-[#F7EEE9]" />
                  <div className="h-24 rounded-2xl bg-[#F7EEE9]" />
                </div>

                <div className="h-14 w-full rounded-2xl bg-[#E8D9D6]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // Product not found
  // =========================
  if (!product) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[600px] items-center justify-center bg-[#FBF6F1] px-4"
      >
        <div className="w-full max-w-md rounded-[30px] border border-[#E8D9D6] bg-white p-8 text-center shadow-[0_20px_60px_rgba(74,24,33,0.08)] md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F2E4E1] text-[#641F2B]">
            <FaTags className="text-2xl" />
          </div>

          <h2 className="mt-6 text-2xl font-black text-[#4A1821] md:text-3xl">
            المنتج غير موجود
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#806D70]">
            يبدو أن المنتج الذي تبحث عنه غير متوفر أو تم نقله.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#641F2B] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-lg"
          >
            العودة للمنتجات
            <FaArrowLeft className="text-xs" />
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // Product data
  // =========================
  const productCategories = Array.isArray(product.categories)
    ? product.categories
    : product.category
      ? [product.category]
      : [];

  const relatedProducts = products
    .filter((item) => {
      if (item.id === product.id) return false;

      const itemCategories = Array.isArray(item.categories)
        ? item.categories
        : item.category
          ? [item.category]
          : [];

      return productCategories.some((category) =>
        itemCategories.includes(category),
      );
    })
    .slice(0, 4);

  const wished = isInWishlist(product.id);

  const oldPrice = Number(product.oldPrice || 0);
  const currentPrice = Number(product.price || 0);

  const discount =
    oldPrice > currentPrice
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : 0;

  // =========================
  // Wishlist
  // =========================
  const handleWishlist = () => {
    toggleWishlist(product.id);
  };

  // =========================
  // Floating cart
  // =========================
  const handleFloatingCart = () => {
    addToCart(product);

    const price = Number(product.price || 0);

    trackEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: price,
      currency: "SAR",
    });

    trackTikTok("AddToCart", {
      content_id: product.id,
      content_name: product.name,
      content_type: "product",
      value: price,
      currency: "SAR",
    });
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#FBF6F1] text-[#4A1821]"
    >
      <SEO product={product} />

      {/* =========================
          Breadcrumb
      ========================= */}
      <div className="mx-auto max-w-7xl px-3 pt-5 sm:px-6 md:pt-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#9B8588] md:text-sm">
          <Link
            to="/"
            className="font-semibold transition-colors hover:text-[#A83F55]"
          >
            الرئيسية
          </Link>

          <FaChevronLeft className="text-[8px] text-[#C6A1A7]" />

          <Link
            to="/products"
            className="font-semibold transition-colors hover:text-[#A83F55]"
          >
            المنتجات
          </Link>

          <FaChevronLeft className="text-[8px] text-[#C6A1A7]" />

          <span className="max-w-[220px] truncate font-bold text-[#641F2B]">
            {product.name}
          </span>
        </div>
      </div>

      {/* =========================
          Main Product
      ========================= */}
      <section className="relative py-5 md:py-8">
        <div className="pointer-events-none absolute right-[-180px] top-10 h-96 w-96 rounded-full bg-[#A83F55]/5 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-[-180px] h-96 w-96 rounded-full bg-[#641F2B]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-3 sm:px-6">
          <div className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_15px_60px_rgba(74,24,33,0.07)] md:rounded-[34px]">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
              {/* =========================
                  Gallery
              ========================= */}
              <div className="relative bg-gradient-to-br from-[#F7EEE9] via-[#FBF6F1] to-white p-3 sm:p-5 md:p-8 lg:p-10">
                {discount > 0 && (
                  <div className="absolute right-5 top-5 z-20 rounded-full bg-[#641F2B] px-3 py-1.5 text-[10px] font-black text-white shadow-lg md:right-8 md:top-8 md:px-4 md:py-2 md:text-xs">
                    خصم {discount}%
                  </div>
                )}

                <div className="absolute left-5 top-5 z-20 md:left-8 md:top-8">
                  <button
                    type="button"
                    onClick={handleWishlist}
                    aria-label={
                      wished
                        ? "إزالة المنتج من المفضلة"
                        : "إضافة المنتج إلى المفضلة"
                    }
                    className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white/95 shadow-md backdrop-blur transition-all duration-300 hover:scale-105 md:h-12 md:w-12 ${
                      wished
                        ? "border-[#E4B2BC] text-[#A83F55]"
                        : "border-[#E8D9D6] text-[#806D70] hover:border-[#D6A5AD] hover:text-[#A83F55]"
                    }`}
                  >
                    {wished ? (
                      <FaHeart className="text-sm" />
                    ) : (
                      <FaRegHeart className="text-sm" />
                    )}
                  </button>
                </div>

                <div className="overflow-hidden rounded-[22px] bg-white/70 p-2 shadow-[0_10px_35px_rgba(74,24,33,0.05)] md:rounded-[28px] md:p-4">
                  <ProductGallery key={product.id} product={product} />
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-semibold text-[#806D70] md:mt-5 md:text-xs">
                  <FaCheck className="text-[#7A8B43]" />
                  صور المنتج كما هي معروضة
                </div>
              </div>

              {/* =========================
                  Product Information
              ========================= */}
              <div className="flex flex-col border-t border-[#E8D9D6] p-5 sm:p-7 md:p-10 lg:border-r lg:border-t-0 lg:p-12">
                {productCategories.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {productCategories.map((category) => (
                      <Link
                        key={category}
                        to={`/products?category=${encodeURIComponent(category)}`}
                        className="rounded-full bg-[#F2E4E1] px-3 py-1.5 text-[10px] font-bold text-[#641F2B] transition-colors hover:bg-[#EAD1D5] md:text-xs"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}

                <ProductInfo product={product} />

                {/* Trust Features */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="group rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A5AD] hover:bg-white hover:shadow-md">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#641F2B] shadow-sm transition-colors group-hover:bg-[#641F2B] group-hover:text-white">
                      <FaTruck className="text-sm" />
                    </div>

                    <p className="mt-2 text-xs font-black text-[#4A1821] md:text-sm">
                      شحن سريع
                    </p>

                    <span className="mt-1 block text-[9px] text-[#806D70] md:text-[11px]">
                      توصيل موثوق
                    </span>
                  </div>

                  <div className="group rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A5AD] hover:bg-white hover:shadow-md">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#641F2B] shadow-sm transition-colors group-hover:bg-[#641F2B] group-hover:text-white">
                      <FaShieldAlt className="text-sm" />
                    </div>

                    <p className="mt-2 text-xs font-black text-[#4A1821] md:text-sm">
                      شراء آمن
                    </p>

                    <span className="mt-1 block text-[9px] text-[#806D70] md:text-[11px]">
                      تجربة موثوقة
                    </span>
                  </div>
                </div>

                <ProductActions product={product} />

                <div className="mt-5 flex items-center justify-center gap-2 border-t border-[#F0E5E1] pt-5 text-[10px] text-[#806D70] md:text-xs">
                  <FaHeadset className="text-[#A83F55]" />
                  تحتاج مساعدة؟ نحن هنا لخدمتك
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Product Details
      ========================= */}
      <section className="relative py-6 md:py-10">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_10px_40px_rgba(74,24,33,0.05)] md:rounded-[32px]">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-[#E8D9D6] bg-[#FBF6F1]/70">
              {[
                ["description", "تفاصيل المنتج"],
                ["usage", "طريقة الاستخدام"],
                ["ingredients", "المكونات"],
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative min-w-[120px] flex-1 px-4 py-4 text-xs font-black transition-colors md:px-6 md:py-5 md:text-sm ${
                    activeTab === tab
                      ? "text-[#641F2B]"
                      : "text-[#806D70] hover:text-[#A83F55]"
                  }`}
                >
                  {label}

                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-t-full bg-[#641F2B]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 sm:p-7 md:p-10">
              {activeTab === "description" && (
                <div>
                  <h2 className="text-lg font-black text-[#4A1821] md:text-2xl">
                    عن المنتج
                  </h2>

                  <div
                    className="
                      product-description
                      mt-4
                      max-w-4xl
                      text-sm
                      leading-8
                      text-[#5F5154]
                      md:text-base
                      md:leading-9

                      [&_h1]:mb-5
                      [&_h1]:mt-7
                      [&_h1]:text-2xl
                      [&_h1]:font-bold
                      [&_h1]:leading-relaxed
                      [&_h1]:text-[#641F2B]

                      [&_h2]:mb-4
                      [&_h2]:mt-7
                      [&_h2]:text-xl
                      [&_h2]:font-bold
                      [&_h2]:leading-relaxed
                      [&_h2]:text-[#641F2B]

                      [&_h3]:mb-3
                      [&_h3]:mt-6
                      [&_h3]:text-lg
                      [&_h3]:font-bold
                      [&_h3]:text-[#8F3046]

                      [&_p]:mb-4
                      [&_p]:leading-8

                      [&_strong]:font-bold
                      [&_strong]:text-[#4A1821]

                      [&_ul]:my-5
                      [&_ul]:list-disc
                      [&_ul]:pr-6

                      [&_ol]:my-5
                      [&_ol]:list-decimal
                      [&_ol]:pr-6

                      [&_li]:mb-2

                      [&_hr]:my-7
                      [&_hr]:border-[#E8D9D6]

                      [&_a]:font-semibold
                      [&_a]:text-[#8F3046]
                      [&_a]:underline

                      [&_img]:my-6
                      [&_img]:rounded-2xl
                    "
                  >
                    {product.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    ) : (
                      <p>تعرف على تفاصيل المنتج ومميزاته قبل إتمام طلبك.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "usage" && (
                <div>
                  <h2 className="text-lg font-black text-[#4A1821] md:text-2xl">
                    طريقة الاستخدام
                  </h2>

                  <div className="mt-4 rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-5 text-sm leading-8 text-[#806D70] md:p-6 md:text-base">
                    {product.usage ? (
                      <p className="whitespace-pre-line">{product.usage}</p>
                    ) : (
                      <p>
                        يرجى الرجوع إلى تعليمات المنتج الموضحة على العبوة واتباع
                        طريقة الاستخدام الموصى بها.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "ingredients" && (
                <div>
                  <h2 className="text-lg font-black text-[#4A1821] md:text-2xl">
                    المكونات
                  </h2>

                  {Array.isArray(product.ingredients) &&
                  product.ingredients.length > 0 ? (
                    <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {product.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] px-4 py-3 text-sm text-[#806D70]"
                        >
                          <FaCheck className="flex-shrink-0 text-xs text-[#7A8B43]" />
                          <span>{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-8 text-[#806D70]">
                      لم تتم إضافة تفاصيل المكونات لهذا المنتج.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Reviews
      ========================= */}
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="mb-7 text-center md:mb-10">
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#A83F55] md:text-xs">
              CUSTOMER REVIEWS
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#4A1821] md:text-3xl">
              تجارب العملاء
            </h2>

            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#641F2B] to-[#A83F55]" />
          </div>

          <ProductReviews productId={product.id} />

          <div className="mt-6 md:mt-8">
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </section>

      {/* =========================
          Related Products
      ========================= */}
      {relatedProducts.length > 0 && (
        <section className="relative overflow-hidden py-10 md:py-16">
          <div className="pointer-events-none absolute right-[-120px] top-0 h-72 w-72 rounded-full bg-[#A83F55]/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-3 sm:px-6">
            <div className="mb-7 flex items-end justify-between md:mb-10">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-[#A83F55] md:text-xs">
                  YOU MAY ALSO LIKE
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#4A1821] md:text-3xl">
                  منتجات قد تعجبك
                </h2>

                <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#641F2B] to-[#A83F55]" />
              </div>

              <Link
                to="/products"
                className="hidden items-center gap-2 rounded-full border border-[#E8D9D6] bg-white px-4 py-2 text-xs font-bold text-[#641F2B] transition-all hover:border-[#D6A5AD] hover:shadow-sm sm:flex"
              >
                كل المنتجات
                <FaArrowLeft className="text-[9px]" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.map((item) => {
                const itemOldPrice = Number(item.oldPrice || 0);
                const itemPrice = Number(item.price || 0);

                const itemDiscount =
                  itemOldPrice > itemPrice
                    ? Math.round(
                        ((itemOldPrice - itemPrice) / itemOldPrice) * 100,
                      )
                    : 0;

                return (
                  <Link
                    key={item.id}
                    to={`/product/${item.seoSlug || item.slug}`}
                    className="group relative overflow-hidden rounded-[18px] border border-[#E8D9D6] bg-white shadow-[0_5px_20px_rgba(74,24,33,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#D6A5AD] hover:shadow-[0_15px_35px_rgba(74,24,33,0.1)] md:rounded-[22px]"
                  >
                    {itemDiscount > 0 && (
                      <span className="absolute right-2 top-2 z-10 rounded-full bg-[#641F2B] px-2 py-1 text-[8px] font-black text-white md:right-3 md:top-3 md:text-[10px]">
                        خصم {itemDiscount}%
                      </span>
                    )}

                    <div className="aspect-square overflow-hidden bg-[#F7EEE9]">
                      <img
                        src={item.images?.[0] || "/logo.png"}
                        alt={item.name || "منتج من سهرة"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-3 md:p-4">
                      {item.category && (
                        <span className="text-[8px] font-bold text-[#A83F55] md:text-[10px]">
                          {item.category}
                        </span>
                      )}

                      <h3 className="mt-1.5 line-clamp-2 min-h-[34px] text-[11px] font-black leading-5 text-[#4A1821] transition-colors group-hover:text-[#A83F55] md:min-h-[44px] md:text-sm">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex gap-[2px] text-[7px] text-[#C9963E] md:text-[9px]">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <FaStar key={index} />
                          ))}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-[#641F2B] md:text-lg">
                          {item.price}{" "}
                          <span className="text-[8px] md:text-[10px]">ر.س</span>
                        </span>

                        {itemDiscount > 0 && (
                          <span className="text-[8px] text-[#B5A5A7] line-through md:text-xs">
                            {item.oldPrice} ر.س
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-[#641F2B] to-[#A83F55] transition-all duration-500 group-hover:w-1/2" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================
          Floating Product
      ========================= */}
      {showFloatingProduct && (
        <div className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-20px)] max-w-xl -translate-x-1/2 animate-[fadeIn_.3s] md:bottom-5">
          <div className="rounded-[20px] border border-[#E8D9D6] bg-white/95 p-2.5 shadow-[0_15px_50px_rgba(65,45,20,0.18)] backdrop-blur-xl md:rounded-2xl md:p-3">
            <div className="flex items-center gap-2.5 md:gap-3">
              <img
                src={product.images?.[0] || "/logo.png"}
                alt={product.name || "منتج من سهرة"}
                loading="lazy"
                className="h-12 w-12 flex-shrink-0 rounded-xl object-cover md:h-14 md:w-14"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[11px] font-black text-[#4A1821] md:text-sm">
                  {product.name}
                </h3>

                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs font-black text-[#641F2B] md:text-sm">
                    {product.price} ر.س
                  </span>

                  {discount > 0 && (
                    <span className="text-[9px] text-[#B5A5A7] line-through md:text-xs">
                      {product.oldPrice} ر.س
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleFloatingCart}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-[#641F2B] px-3 py-2.5 text-[10px] font-bold text-white transition-all duration-300 hover:bg-[#4A1821] hover:shadow-lg active:scale-95 md:gap-2 md:px-5 md:py-3 md:text-xs"
              >
                <FaShoppingCart />
                <span>أضف للسلة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductDetails;
