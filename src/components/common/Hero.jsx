import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";

function getOptimizedImageUrl(url, width = 1920) {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  if (url.includes("/upload/")) {
    return url.replace(
      "/upload/",
      `/upload/f_auto,q_auto,dpr_auto,w_${width}/`,
    );
  }

  return url;
}

function Hero() {
  const { settings } = useSettings();

  const savedBanners = Array.isArray(settings?.banners)
    ? settings.banners
        .filter((banner) => banner?.active !== false && banner?.image)
        .map((banner) => ({
          ...banner,
          image: getOptimizedImageUrl(banner.image, 1920),
        }))
    : [];

  const banners =
    savedBanners.length > 0
      ? savedBanners
      : ["/banner.png", "/banner-2.png", "/banner-3.png"].map(
          (image, index) => ({
            id: `fallback-${index + 1}`,
            image,
            link: "/products",
          }),
        );

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const safeBannerIndex = currentBanner >= banners.length ? 0 : currentBanner;

  const activeBanner = banners[safeBannerIndex];

  if (!activeBanner) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#641F2B]">
      <div className="relative mx-auto w-full max-w-[1920px]">
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={activeBanner.id || safeBannerIndex}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative w-full"
            >
              <Link
                to={activeBanner.link || "/products"}
                aria-label="تسوق منتجات سهرة"
                className="group block"
              >
                <img
                  src={activeBanner.image}
                  alt={`سهرة ستور - بانر ${safeBannerIndex + 1}`}
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  loading={safeBannerIndex === 0 ? "eager" : "lazy"}
                  fetchPriority={safeBannerIndex === 0 ? "high" : "auto"}
                  decoding="async"
                />

                {/* لمعة خفيفة عند تمرير الماوس */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* نقاط التنقل */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
              {banners.map((banner, index) => (
                <button
                  key={banner.id || index}
                  type="button"
                  onClick={() => setCurrentBanner(index)}
                  aria-label={`عرض البانر ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    safeBannerIndex === index
                      ? "w-8 bg-white"
                      : "w-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
