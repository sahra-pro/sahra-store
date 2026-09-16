import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#11100e]">
      {/* خلفية بسيطة */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,180,119,0.08),_transparent_60%)]" />

      <div className="relative mx-auto w-full max-w-[1920px]">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden"
        >
          <Link
            to="/products"
            aria-label="تسوق منتجات شهدان ستور"
            className="group block"
          >
            <img
              src="/banner.png"
              alt="شهدان ستور - منتجات طبيعية مختارة بعناية"
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />

            {/* لمعة خفيفة عند تمرير الماوس */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
