import { Link } from "react-router-dom";
import { FaLayerGroup } from "react-icons/fa";

import { useStore } from "../../hooks/useStore";

function optimizeCloudinaryImage(url, width = 320) {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  if (!url.includes("/upload/")) {
    return url;
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

function Categories() {
  const { categories } = useStore();

  const sortedCategories = [...categories].sort((a, b) => {
    const orderA =
      typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;

    const orderB =
      typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return (a.name || "").localeCompare(b.name || "", "ar");
  });

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-gradient-to-b from-[#FBF6F1] via-[#F9F1ED] to-[#F5E7E3] py-16 md:py-20"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-[#A83F55]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#641F2B]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mt-2 text-3xl font-black text-[#4A1821] md:text-4xl">
            أقسام المتجر
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#641F2B] to-[#A83F55]" />

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#806D70] md:text-base">
            اكتشف منتجاتنا حسب احتياجك.
          </p>
        </div>

        {sortedCategories.length === 0 ? (
          <div className="rounded-3xl border border-[#E8D9D6] bg-white px-6 py-12 text-center shadow-sm">
            <FaLayerGroup className="mx-auto mb-4 text-3xl text-[#A83F55]" />

            <p className="font-semibold text-[#4A1821]">لا توجد تصنيفات بعد.</p>

            <p className="mt-2 text-sm text-[#806D70]">
              ستظهر التصنيفات هنا عند إضافتها من لوحة التحكم.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {sortedCategories.map((item) => {
              const categoryImage = item.image || item.imageUrl;

              const optimizedCategoryImage = optimizeCloudinaryImage(
                categoryImage,
                320,
              );

              return (
                <Link
                  to={`/products?category=${encodeURIComponent(item.name)}`}
                  key={item.id}
                  className="group relative overflow-hidden rounded-[26px] border border-[#E8D9D6] bg-white p-4 text-center shadow-[0_8px_30px_rgba(100,31,43,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#D6A5AD] hover:shadow-[0_18px_45px_rgba(100,31,43,0.13)] md:p-6 lg:p-7"
                >
                  {/* Burgundy corner accent */}
                  <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-[30px] bg-gradient-to-br from-[#F2E4E1] to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Category Image */}
                  <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#E8D9D6] bg-[#F9F1ED] p-1.5 shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:border-[#A83F55] group-hover:shadow-md md:h-28 md:w-28 lg:h-32 lg:w-32">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                      {optimizedCategoryImage ? (
                        <img
                          src={optimizedCategoryImage}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.innerHTML =
                              '<span class="text-3xl text-[#A83F55]">✦</span>';
                          }}
                        />
                      ) : (
                        <FaLayerGroup className="text-3xl text-[#A83F55] md:text-4xl" />
                      )}
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3 className="relative min-h-[28px] text-sm font-black text-[#4A1821] transition-colors duration-300 group-hover:text-[#A83F55] md:text-base lg:text-lg">
                    {item.name}
                  </h3>

                  {/* Bottom Arrow */}
                  <div className="mt-3 flex items-center justify-center gap-1 text-[11px] font-semibold text-[#9B8588] transition-all duration-300 group-hover:gap-2 group-hover:text-[#641F2B]">
                    <span>استكشف التصنيف</span>

                    <span className="transition-transform duration-300 group-hover:-translate-x-1">
                      ←
                    </span>
                  </div>

                  {/* Bottom burgundy line */}
                  <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-[#641F2B] to-[#A83F55] transition-all duration-300 group-hover:w-1/2" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
