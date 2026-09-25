import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { FaImages, FaHeart, FaExpandAlt } from "react-icons/fa";

import { db } from "../firebase/config";

function optimizeCloudinaryImage(url, width = 900) {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  if (!url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

function CustomerTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(
          collection(db, "customerTestimonials"),
          where("active", "==", true),
          orderBy("sortOrder", "asc"),
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTestimonials(data);
      } catch (error) {
        console.error("Customer testimonials error:", error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  const imageViewer =
    selectedImage &&
    createPortal(
      <div
        className="fixed inset-0 z-[2147483647] bg-[#241116]/95 backdrop-blur-md"
        onClick={() => setSelectedImage(null)}
        role="dialog"
        aria-modal="true"
        aria-label="عرض صورة تجربة العميل"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setSelectedImage(null)}
          className="
            fixed
            right-3
            top-3
            z-[2147483647]
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-black/30
            text-2xl
            font-light
            text-white
            shadow-lg
            backdrop-blur-md
            transition
            hover:bg-black/50
            active:scale-95
            sm:right-5
            sm:top-5
          "
          aria-label="إغلاق الصورة"
        >
          ×
        </button>

        {/* Image area */}
        <div
          className="
            flex
            h-[100dvh]
            w-full
            items-center
            justify-center
            px-3
            pb-4
            pt-16
            sm:px-6
            sm:pb-6
            sm:pt-20
          "
        >
          <img
            src={optimizeCloudinaryImage(selectedImage.url, 1600)}
            alt={selectedImage.title || "تجربة أحد عملاء سهرة"}
            onClick={(event) => event.stopPropagation()}
            className="
              max-h-[calc(100dvh-80px)]
              max-w-full
              rounded-2xl
              object-contain
              shadow-[0_25px_80px_rgba(0,0,0,0.4)]
              sm:max-h-[calc(100dvh-104px)]
            "
          />
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <div className="min-h-screen bg-[var(--sahra-ivory)] py-8 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* Hero */}
          <section className="relative mb-8 overflow-hidden rounded-[28px] bg-[#641F2B] px-5 py-12 text-center text-white shadow-[0_20px_60px_rgba(100,31,43,0.12)] md:mb-10 md:rounded-[32px] md:px-12 md:py-20">
            <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#A83F55]/20" />

            <div className="relative z-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#F2E4E1] backdrop-blur-sm md:mb-6 md:h-16 md:w-16">
                <FaImages className="text-xl md:text-2xl" />
              </div>

              <span className="text-[11px] font-bold tracking-[0.18em] text-[#F2E4E1] md:text-xs">
                تجارب حقيقية
              </span>

              <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                آراء العملاء
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 md:mt-5 md:text-base md:leading-8">
                نشارككم بعضًا من تجارب وآراء عملائنا التي وصلت إلينا، بكل تقدير
                وامتنان لثقتكم بسهرة.
              </p>
            </div>
          </section>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[20px] border border-[#E8D9D6] bg-white p-2 shadow-[0_8px_30px_rgba(100,31,43,0.05)] sm:rounded-[26px] sm:p-0"
                >
                  <div className="aspect-[4/5] animate-pulse rounded-[14px] bg-[#F2E4E1] sm:aspect-auto sm:rounded-none sm:min-h-[400px]" />
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="rounded-[26px] border border-[#E8D9D6] bg-white px-6 py-14 text-center shadow-[0_12px_40px_rgba(100,31,43,0.05)] md:py-16">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#A83F55]">
                <FaHeart className="text-2xl" />
              </div>

              <h2 className="text-xl font-black text-[#4A1821]">
                آراء عملائنا قريبًا
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#806D70]">
                نعمل على جمع وعرض تجارب عملائنا هنا. شكرًا لثقتكم بنا.
              </p>
            </div>
          ) : (
            <>
              {/* Testimonials */}
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {testimonials.map((testimonial) => {
                  const imageUrl = optimizeCloudinaryImage(
                    testimonial.imageUrl,
                    900,
                  );

                  return (
                    <article
                      key={testimonial.id}
                      className="
                        group
                        overflow-hidden
                        rounded-[20px]
                        border
                        border-[#E8D9D6]
                        bg-white
                        p-2
                        shadow-[0_8px_30px_rgba(100,31,43,0.06)]
                        transition-all
                        duration-300
                        active:scale-[0.985]
                        sm:rounded-[26px]
                        sm:p-0
                        sm:hover:-translate-y-1
                        sm:hover:shadow-[0_20px_50px_rgba(100,31,43,0.1)]
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImage({
                            url: testimonial.imageUrl,
                            title: testimonial.title,
                          })
                        }
                        className="
                          relative
                          block
                          w-full
                          overflow-hidden
                          rounded-[16px]
                          bg-[#FBF6F1]
                          text-right
                          outline-none
                          focus:ring-4
                          focus:ring-[#F2E4E1]
                          sm:rounded-none
                        "
                        aria-label="عرض صورة تجربة العميل"
                      >
                        <div className="relative flex max-h-[72vh] min-h-[220px] items-center justify-center sm:min-h-0">
                          <img
                            src={imageUrl}
                            alt={testimonial.title || "تجربة أحد عملاء سهرة"}
                            loading="lazy"
                            decoding="async"
                            className="
                              block
                              h-auto
                              max-h-[72vh]
                              w-full
                              object-contain
                              transition-transform
                              duration-500
                              sm:group-hover:scale-[1.015]
                            "
                          />

                          <span
                            className="
                              absolute
                              bottom-3
                              left-3
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-full
                              bg-[#641F2B]/85
                              text-white
                              opacity-100
                              shadow-lg
                              backdrop-blur-sm
                              sm:opacity-0
                              sm:transition-opacity
                              sm:duration-300
                              sm:group-hover:opacity-100
                            "
                          >
                            <FaExpandAlt className="text-xs" />
                          </span>
                        </div>
                      </button>

                      {testimonial.title && (
                        <div className="px-2 pb-2 pt-3 sm:px-5 sm:py-4">
                          <h2 className="text-xs font-bold leading-6 text-[#4A1821] sm:text-sm">
                            {testimonial.title}
                          </h2>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Bottom message */}
              <div className="mt-8 rounded-[22px] border border-[#E8D9D6] bg-[#F7EEE9] p-5 text-center md:mt-10 md:rounded-[26px] md:p-8">
                <FaHeart className="mx-auto mb-3 text-lg text-[#A83F55]" />

                <p className="text-sm leading-7 text-[#806D70]">
                  شكرًا لكل عميل شاركنا تجربته ومنحنا ثقته.
                  <span className="font-bold text-[#641F2B]">
                    {" "}
                    ثقتكم تعني لنا الكثير.
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {imageViewer}
    </>
  );
}

export default CustomerTestimonials;
