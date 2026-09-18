import { useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaTimes,
} from "react-icons/fa";

function ProductGallery({ product }) {
  const images = useMemo(() => {
    return product.images?.length
      ? product.images
      : ["https://via.placeholder.com/800x800?text=No+Image"];
  }, [product.images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const selectedImage = images[currentIndex] || images[0];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <div className="w-full">
        <div
          className={
            images.length > 1
              ? "grid gap-4 md:grid-cols-[88px_minmax(0,1fr)]"
              : "grid grid-cols-1"
          }
        >
          {/* Thumbnails - Desktop */}
          {images.length > 1 && (
            <div className="order-2 hidden max-h-[560px] flex-col gap-3 overflow-y-auto md:order-1 md:flex">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`عرض الصورة ${index + 1}`}
                  aria-current={currentIndex === index ? "true" : undefined}
                  className={`
            group
            relative
            h-[82px]
            w-[82px]
            shrink-0
            overflow-hidden
            rounded-2xl
            border
            bg-[#FBF6F1]
            transition-all
            duration-300
            ${
              currentIndex === index
                ? "border-[#641F2B] shadow-[0_6px_20px_rgba(100,31,43,0.10)]"
                : "border-[#E8D9D6] hover:border-[#C99BA3]"
            }
          `}
                >
                  <img
                    src={image}
                    alt={`${product.name || "منتج سهرة"} - صورة ${index + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {currentIndex === index && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#641F2B]" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="order-1 min-w-0 md:order-2">
            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-[#E8D9D6]
                bg-[white]
                shadow-[0_18px_50px_rgba(100,31,43,0.07)]
              "
            >
              {/* Decorative background */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#E8C8CD]/20 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#EBDDD8]/40 blur-3xl" />

              {/* Image */}
              <div className="relative flex h-[390px] items-center justify-center sm:h-[480px] md:h-[560px]">
                <img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name || "منتج سهرة"}
                  onClick={() => setShowPreview(true)}
                  className="
                    relative
                    z-10
                    h-full
                    w-full
                    cursor-zoom-in
                    object-contain
                    p-6
                    transition-all
                    duration-500
                    ease-out
                    sm:p-10
                  "
                />

                {/* Expand */}
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  aria-label="تكبير الصورة"
                  className="
                    absolute
                    right-5
                    top-5
                    z-20
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#E8D9D6]
                    bg-white/90
                    text-[#641F2B]
                    shadow-sm
                    backdrop-blur
                    transition-all
                    duration-300
                    hover:bg-white
                    hover:shadow-md
                    active:scale-95
                  "
                >
                  <FaExpand className="text-xs" />
                </button>

                {/* Previous */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="الصورة السابقة"
                    className="
                      absolute
                      left-4
                      top-1/2
                      z-20
                      flex
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E8D9D6]
                      bg-white/90
                      text-[#641F2B]
                      opacity-0
                      shadow-sm
                      backdrop-blur
                      transition-all
                      duration-300
                      hover:bg-white
                      hover:shadow-md
                      group-hover:opacity-100
                      active:scale-95
                    "
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                )}

                {/* Next */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="الصورة التالية"
                    className="
                      absolute
                      right-4
                      top-1/2
                      z-20
                      flex
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E8D9D6]
                      bg-white/90
                      text-[#641F2B]
                      opacity-0
                      shadow-sm
                      backdrop-blur
                      transition-all
                      duration-300
                      hover:bg-white
                      hover:shadow-md
                      group-hover:opacity-100
                      active:scale-95
                    "
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                )}

                {/* Counter */}
                {images.length > 1 && (
                  <div
                    className="
                      absolute
                      bottom-5
                      left-1/2
                      z-20
                      -translate-x-1/2
                      rounded-full
                      bg-white/90
                      px-3
                      py-1.5
                      text-[11px]
                      font-semibold
                      text-[#641F2B]
                      shadow-sm
                      backdrop-blur
                    "
                  >
                    {currentIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 md:hidden">
                {images.map((image, index) => (
                  <button
                    key={`${image}-mobile-${index}`}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`عرض الصورة ${index + 1}`}
                    className={`
                      h-[70px]
                      w-[70px]
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      border
                      bg-[#FBF6F1]
                      transition-all
                      duration-300
                      ${
                        currentIndex === index
                          ? "border-[#641F2B] shadow-sm"
                          : "border-[#E8D9D6]"
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt={`${product.name || "منتج سهرة"} - صورة ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Minimal image info */}
            {images.length > 1 && (
              <div className="mt-3 text-center text-xs text-[#806D70]">
                اختر صورة لمشاهدة المنتج من زاوية مختلفة
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowPreview(false)}
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-[#2B1A1F]/95
            p-4
            backdrop-blur-sm
            sm:p-8
          "
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            aria-label="إغلاق المعاينة"
            className="
              absolute
              right-5
              top-5
              z-30
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur
              transition
              hover:bg-white/20
              active:scale-95
            "
          >
            <FaTimes />
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                prevImage();
              }}
              aria-label="الصورة السابقة"
              className="
                absolute
                left-4
                top-1/2
                z-30
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                backdrop-blur
                transition
                hover:bg-white/20
                active:scale-95
                sm:left-8
              "
            >
              <FaChevronLeft />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              aria-label="الصورة التالية"
              className="
                absolute
                right-4
                top-1/2
                z-30
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                backdrop-blur
                transition
                hover:bg-white/20
                active:scale-95
                sm:right-8
              "
            >
              <FaChevronRight />
            </button>
          )}

          {/* Image */}
          <img
            src={selectedImage}
            alt={product.name || "منتج سهرة"}
            onClick={(event) => event.stopPropagation()}
            className="
              max-h-[88vh]
              max-w-[92vw]
              rounded-2xl
              object-contain
              shadow-[0_30px_100px_rgba(0,0,0,0.35)]
            "
          />

          {/* Counter */}
          {images.length > 1 && (
            <div
              className="
                absolute
                bottom-5
                left-1/2
                -translate-x-1/2
                rounded-full
                bg-white/10
                px-4
                py-2
                text-xs
                font-semibold
                text-white
                backdrop-blur
              "
            >
              {currentIndex + 1} من {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ProductGallery;
