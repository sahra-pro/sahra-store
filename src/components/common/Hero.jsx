import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Hero() {
  const banners = ["/banner.png", "/banner-2.png", "/banner-3.png"];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <section className="relative overflow-hidden bg-[#641F2B]">
      <div className="relative mx-auto w-full max-w-[1920px]">
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={currentBanner}
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
                to="/products"
                aria-label="تسوق منتجات سهرة"
                className="group block"
              >
                <img
                  src={banners[currentBanner]}
                  alt={`سهرة ستور - بانر ${currentBanner + 1}`}
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                />

                {/* لمعة خفيفة عند تمرير الماوس */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* نقاط التنقل */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentBanner(index)}
                  aria-label={`عرض البانر ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentBanner === index
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
