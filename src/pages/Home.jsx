import Hero from "../components/common/Hero";
import Categories from "../components/common/Categories";
import OffersSection from "../components/common/OffersSection";
import FeaturedProducts from "../components/common/FeaturedProducts";
import NewProducts from "../components/common/NewProducts";
import WhyUs from "../components/common/WhyUs";
import Newsletter from "../components/common/Newsletter";

import { useSettings } from "../hooks/useSettings";
import { useEffect } from "react";

export default function Home() {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = settings.seo?.title || settings.storeName || "سهرة ستور";

    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute(
        "content",
        settings.seo?.description ||
          "سهرة ستور - متجر يوفر لك منتجات مختارة بعناية وتجربة تسوق مميزة.",
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
              <Categories />
            </section>
          )}

          {/* =====================================================
              OFFERS
          ====================================================== */}
          {settings.discounts?.flashSaleEnabled && (
            <section id="offers">
              <OffersSection />
            </section>
          )}

          {/* =====================================================
              FEATURED PRODUCTS
          ====================================================== */}
          {settings.home?.showBestSellers && (
            <section id="featured-products">
              <FeaturedProducts />
            </section>
          )}

          {/* =====================================================
              WHY SAHRA
          ====================================================== */}
          <section id="why-sahra">
            <WhyUs />
          </section>

          {/* =====================================================
              NEW PRODUCTS
          ====================================================== */}
          {settings.home?.showLatestProducts && (
            <section id="new-products">
              <NewProducts />
            </section>
          )}

          {/* =====================================================
              NEWSLETTER
          ====================================================== */}
          {settings.popups?.newsletterEnabled && (
            <section id="newsletter">
              <Newsletter />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
