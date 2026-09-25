import Hero from "../components/common/Hero";
import Categories from "../components/common/Categories";
import OffersSection from "../components/common/OffersSection";
import FeaturedProducts from "../components/common/FeaturedProducts";
import NewProducts from "../components/common/NewProducts";
import WhyUs from "../components/common/WhyUs";
import Newsletter from "../components/common/Newsletter";

import { useSettings } from "../hooks/useSettings";
import { useReviews } from "../hooks/useReviews";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaQuoteRight,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

function ScrollReveal({ children, delay = 0, direction = "up" }) {
  const initial =
    direction === "right"
      ? { opacity: 0, x: 60 }
      : direction === "left"
        ? { opacity: 0, x: -60 }
        : { opacity: 0, y: 50 };

  return (
    <motion.div
      initial={initial}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function optimizeReviewImage(url, width = 700) {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  if (!url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

function CustomerReviews() {
  const { reviews, loading, averageRating } = useReviews();

  if (loading || !reviews.length) {
    return null;
  }

  const visibleReviews = reviews.slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section Header */}{" "}
      <div className="mx-auto mb-10 max-w-3xl text-center">
        {" "}
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E8D9D6] bg-white px-4 py-2 text-xs font-bold tracking-wide text-[#A83F55] shadow-sm">
          {" "}
          <FaQuoteRight className="text-[10px]" />
          آراء عملائنا{" "}
        </span>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-[#4A1821] sm:text-4xl">
          تجارب حقيقية من عملائنا
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-[#806D70] sm:text-base">
          نعتز بثقة عملائنا، وهذه بعض التجارب والتقييمات التي شاركوها معنا.
        </p>
      </div>
      {/* Rating Summary */}
      <div className="mb-8 flex flex-col items-center justify-center gap-5 rounded-[28px] border border-[#E8D9D6] bg-white p-6 shadow-[0_16px_50px_rgba(100,31,43,0.06)] sm:flex-row sm:gap-8">
        <div className="text-center">
          <div className="text-4xl font-black text-[#641F2B]">
            {averageRating}
          </div>

          <div
            className="mt-2 flex items-center justify-center gap-1"
            dir="ltr"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={
                  star <= Math.round(Number(averageRating))
                    ? "text-[#D49B35]"
                    : "text-[#E1D4D1]"
                }
              />
            ))}
          </div>
        </div>

        <div className="hidden h-12 w-px bg-[#E8D9D6] sm:block" />

        <div className="text-center sm:text-right">
          <p className="text-sm font-bold text-[#4A1821]">تقييمات العملاء</p>

          <p className="mt-1 text-xs text-[#806D70]">
            {reviews.length} تقييم موثّق من عملائنا
          </p>
        </div>
      </div>
      {/* Reviews Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleReviews.map((review, index) => {
          const rating = Math.min(5, Math.max(0, Number(review.rating) || 0));

          const reviewImages = Array.isArray(review.images)
            ? review.images
            : review.image
              ? [review.image]
              : [];

          const avatarLetter = (review.name || "ع").trim().charAt(0) || "ع";

          return (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#E8D9D6] bg-white shadow-[0_12px_40px_rgba(100,31,43,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#d9c0c5] hover:shadow-[0_18px_50px_rgba(100,31,43,0.09)]"
            >
              {/* Customer Header */}
              <div className="flex items-center justify-between gap-4 p-5 pb-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F2E4E1] text-lg font-black text-[#641F2B]">
                    {avatarLetter}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-black text-[#4A1821]">
                        {review.name || "عميل سهرة"}
                      </h3>

                      <FaCheckCircle className="shrink-0 text-xs text-[#7A8B43]" />
                    </div>

                    <p className="mt-1 text-[11px] font-medium text-[#9B8A8D]">
                      عميل موثّق
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#FBF6F1] px-3 py-1.5">
                  <span className="text-xs font-bold text-[#4A1821]">
                    {rating}
                  </span>

                  <FaStar className="text-xs text-[#D49B35]" />
                </div>
              </div>

              {/* Stars */}
              <div className="px-5 pt-4">
                <div className="flex items-center gap-1" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        star <= rating ? "text-[#D49B35]" : "text-[#E1D4D1]"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="relative flex-1 px-5 py-5">
                <FaQuoteRight className="absolute right-5 top-4 text-3xl text-[#F2E4E1]" />

                <p className="relative z-10 pt-5 text-sm leading-8 text-[#66575A]">
                  {review.comment || "تجربة رائعة مع سهرة."}
                </p>
              </div>

              {/* Review Images */}
              {reviewImages.length > 0 && (
                <div className="px-5 pb-5">
                  <div
                    className={`grid gap-2 ${
                      reviewImages.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {reviewImages.slice(0, 4).map((image, imageIndex) => (
                      <a
                        key={`${image}-${imageIndex}`}
                        href={image}
                        target="_blank"
                        rel="noreferrer"
                        className="group/image relative overflow-hidden rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1]"
                      >
                        <img
                          src={optimizeReviewImage(
                            image,
                            reviewImages.length === 1 ? 700 : 400,
                          )}
                          alt={`صورة تجربة ${review.name || "العميل"}`}
                          loading="lazy"
                          decoding="async"
                          className={`w-full object-cover transition duration-500 group-hover/image:scale-105 ${
                            reviewImages.length === 1
                              ? "aspect-[16/10]"
                              : "aspect-square"
                          }`}
                        />

                        {imageIndex === 3 && reviewImages.length > 4 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#4A1821]/60 text-sm font-bold text-white">
                            +{reviewImages.length - 4} صور
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom */}
              <div className="border-t border-[#F0E6E3] px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#9B8A8D]">
                    رأي معتمد من إدارة سهرة
                  </span>

                  <FaCheckCircle className="text-sm text-[#7A8B43]" />
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
      {/* More Reviews */}
      {reviews.length > 6 && (
        <div className="mt-8 text-center">
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#E8D9D6] bg-white px-5 py-3 text-sm font-bold text-[#641F2B] shadow-sm transition hover:border-[#A83F55] hover:bg-[#FBF6F1]"
          >
            عرض المزيد من آراء العملاء
            <FaArrowLeft className="text-xs" />
          </a>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = settings.seo?.title || settings.storeName || "سهرة ";

    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute(
        "content",
        settings.seo?.description ||
          "سهرة متجر متخصص في المنتجات الأصلية للعناية الزوجية والمقويات الطبيعية، نختارها بعناية من تركيا ودول مختلفة حسب نوع المنتج. وجهتنا الأولى: السعودية ودول الخليج",
      );
    }
  }, [settings]);

  return (
    <main
      className={`min-h-screen ${
        settings.theme?.darkMode
          ? "bg-[#4A1821] text-white"
          : "bg-[#FBF6F1] text-[#4A1821]"
      }`}
      style={{
        "--primary": settings.theme?.primaryColor || "#641F2B",

        "--sahra-burgundy": "#641F2B",
        "--sahra-burgundy-dark": "#4A1821",
        "--sahra-rose": "#A83F55",
        "--sahra-rose-dark": "#8F3046",
        "--sahra-rose-pale": "#F2E4E1",
        "--sahra-ivory": "#FBF6F1",
        "--sahra-cream": "#F7EEE9",
        "--sahra-text": "#4A1821",
        "--sahra-text-soft": "#806D70",
        "--sahra-border": "#E8D9D6",
      }}
    >
      {/* =========================================================
      HERO
  ========================================================== */}
      {settings.home?.showHero && (
        <section id="hero" className="relative">
          <Hero />
        </section>
      )}

      {/* =========================================================
      HOME SECTIONS
  ========================================================== */}
      <div
        className={`relative overflow-hidden ${
          settings.theme?.darkMode ? "bg-[#4A1821]" : "bg-[#FBF6F1]"
        }`}
      >
        {/* Decorative background elements */}
        {!settings.theme?.darkMode && (
          <>
            <div className="pointer-events-none absolute right-[-120px] top-[180px] h-72 w-72 rounded-full bg-[#A83F55]/5 blur-3xl" />

            <div className="pointer-events-none absolute left-[-140px] top-[700px] h-80 w-80 rounded-full bg-[#641F2B]/5 blur-3xl" />

            <div className="pointer-events-none absolute right-[-100px] top-[1500px] h-72 w-72 rounded-full bg-[#A83F55]/5 blur-3xl" />
          </>
        )}

        <div className="relative space-y-16 py-10 md:space-y-24 md:py-16">
          {/* =====================================================
          CATEGORIES
      ====================================================== */}
          {settings.home?.showCategories && (
            <section id="categories" className="scroll-mt-28">
              <ScrollReveal direction="right">
                <Categories />
              </ScrollReveal>
            </section>
          )}

          {/* =====================================================
          OFFERS
      ====================================================== */}
          {settings.discounts?.flashSaleEnabled && (
            <section id="offers">
              <ScrollReveal delay={0.05} direction="left">
                <OffersSection />
              </ScrollReveal>
            </section>
          )}

          {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}
          {settings.home?.showBestSellers && (
            <section id="featured-products">
              <ScrollReveal delay={0.05}>
                <FeaturedProducts />
              </ScrollReveal>
            </section>
          )}

          {/* =====================================================
          WHY SAHRA
      ====================================================== */}
          <section id="why-sahra">
            <ScrollReveal delay={0.05} direction="right">
              <WhyUs />
            </ScrollReveal>
          </section>

          {/* =====================================================
          NEW PRODUCTS
      ====================================================== */}
          {settings.home?.showLatestProducts && (
            <section id="new-products">
              <ScrollReveal delay={0.05} direction="left">
                <NewProducts />
              </ScrollReveal>
            </section>
          )}

          {/* =====================================================
          CUSTOMER REVIEWS
      ====================================================== */}
          <section id="customer-reviews">
            <ScrollReveal delay={0.05} direction="right">
              <CustomerReviews />
            </ScrollReveal>
          </section>

          {/* =====================================================
          NEWSLETTER
      ====================================================== */}
          {settings.popups?.newsletterEnabled && (
            <section id="newsletter">
              <ScrollReveal delay={0.05}>
                <Newsletter />
              </ScrollReveal>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
