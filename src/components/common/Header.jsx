import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronLeft,
} from "react-icons/fa";

import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useStore } from "../../hooks/useStore";
import { useSettings } from "../../hooks/useSettings";

import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { categories } = useStore();
  const { settings } = useSettings();

  const location = useLocation();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [cartAnimating, setCartAnimating] = useState(false);
  const [cartPopup, setCartPopup] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(0);

  // رسائل افتراضية لمتجر سهرة
  const messages = settings?.announcementBar?.messages ?? [
    "🚚 شحن سريع وآمن لجميع الطلبات",
    "💳 الدفع عند الاستلام متوفر",
    "✨ اكتشف اختيارات سهرة المميزة",
  ];

  const interval = settings?.announcementBar?.interval ?? 4000;

  useEffect(() => {
    if (messages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [messages.length, interval]);

  useEffect(() => {
    if (menuOpen) {
      const timer = setTimeout(() => {
        setDrawerVisible(true);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handler = (e) => {
      setCartAnimating(true);
      setCartPopup(e.detail?.quantity || 1);

      const animationTimer = setTimeout(() => {
        setCartAnimating(false);
      }, 700);

      const popupTimer = setTimeout(() => {
        setCartPopup(null);
      }, 1000);

      return () => {
        clearTimeout(animationTimer);
        clearTimeout(popupTimer);
      };
    };

    window.addEventListener("cart-animation", handler);

    return () => {
      window.removeEventListener("cart-animation", handler);
    };
  }, []);

  const closeMenu = () => {
    setDrawerVisible(false);

    setTimeout(() => {
      setMenuOpen(false);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchInput.trim();

    navigate(
      query ? `/products?search=${encodeURIComponent(query)}` : "/products",
    );

    closeMenu();
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);

    closeMenu();
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      {" "}
      <header className="fixed left-0 right-0 top-0 z-[99990]">
        {/* =========================================
Announcement Bar
========================================= */}
        {settings?.announcementBar?.enabled && (
          <div
            className="h-10 overflow-hidden"
            style={{
              backgroundColor:
                settings?.announcementBar?.backgroundColor || "#641F2B",
              color: settings?.announcementBar?.textColor || "#ffffff",
            }}
          >
            {" "}
            <div className="relative flex h-full items-center justify-center overflow-hidden px-4">
              {" "}
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentMessage}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 flex items-center justify-center will-change-transform"
                >
                  {" "}
                  <span className="whitespace-nowrap text-sm font-medium">
                    {messages[currentMessage]}{" "}
                  </span>
                </motion.div>{" "}
              </AnimatePresence>{" "}
            </div>{" "}
          </div>
        )}

        {/* =========================================
        Main Header
        ========================================= */}
        <div className="border-b border-[#E8D9D6] bg-[#FBF6F1]/95 shadow-sm backdrop-blur-xl transition-all duration-300">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(true);
                setDrawerVisible(false);
              }}
              className="text-2xl text-[#4A1821] transition hover:text-[#A83F55] md:hidden"
              aria-label="فتح القائمة"
            >
              <FaBars />
            </button>

            {/* =========================================
            Logo
            ========================================= */}
            <Link to="/" className="group flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-[#A83F55]/30 bg-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md sm:h-14 sm:w-14">
                <img
                  src="/logo.png"
                  alt="سهرة"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col leading-none">
                <h1 className="text-2xl font-bold tracking-tight text-[#4A1821] sm:text-3xl">
                  سهرة
                </h1>

                <span className="mt-1 text-[9px] font-semibold tracking-[0.28em] text-[#A83F55]">
                  SAHRA STORE
                </span>
              </div>
            </Link>

            {/* =========================================
            Desktop Navigation
            ========================================= */}
            <nav className="hidden gap-8 font-medium md:flex">
              <Link
                to="/"
                className={`relative py-2 transition ${
                  isActive("/")
                    ? "font-semibold text-[#8F3046]"
                    : "text-[#4A1821] hover:text-[#8F3046]"
                }`}
              >
                الرئيسية
              </Link>

              <Link
                to="/products"
                className={`relative py-2 transition ${
                  isActive("/products")
                    ? "font-semibold text-[#8F3046]"
                    : "text-[#4A1821] hover:text-[#8F3046]"
                }`}
              >
                كل المنتجات
              </Link>

              <Link
                to="/categories"
                className={`relative py-2 transition ${
                  isActive("/categories")
                    ? "font-semibold text-[#8F3046]"
                    : "text-[#4A1821] hover:text-[#8F3046]"
                }`}
              >
                التصنيفات
              </Link>

              <Link
                to="/customer-testimonials"
                className={`relative py-2 transition ${
                  isActive("/customer-testimonials")
                    ? "font-semibold text-[#8F3046]"
                    : "text-[#4A1821] hover:text-[#8F3046]"
                }`}
              >
                آراء العملاء
              </Link>

              <Link
                to="/about"
                className={`relative py-2 transition ${
                  isActive("/about")
                    ? "font-semibold text-[#8F3046]"
                    : "text-[#4A1821] hover:text-[#8F3046]"
                }`}
              >
                تواصل معنا
              </Link>
            </nav>

            {/* =========================================
            Desktop Search
            ========================================= */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden items-center overflow-hidden rounded-full border border-[#E8D9D6] bg-white lg:flex"
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-64 bg-transparent px-4 py-2 text-sm text-[#4A1821] outline-none placeholder:text-[#A28D8F]"
              />

              <button
                type="submit"
                className="bg-[#641F2B] px-4 py-3 text-white transition hover:bg-[#8F3046]"
                aria-label="بحث"
              >
                <FaSearch />
              </button>
            </form>

            {/* =========================================
            Icons
            ========================================= */}
            <div className="flex items-center gap-2 text-xl sm:gap-3">
              {/* Track order */}
              <Link
                to="/track-order"
                title="متابعة الطلب"
                aria-label="متابعة الطلب"
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#F2E4E1] hover:text-[#8F3046] hover:shadow-md active:scale-90 ${
                  isActive("/track-order")
                    ? "bg-[#F2E4E1] text-[#8F3046]"
                    : "text-[#4A1821]"
                }`}
              >
                <FaUser />
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                title="المفضلة"
                aria-label="المفضلة"
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#F2E4E1] hover:text-[#8F3046] hover:shadow-md active:scale-90 ${
                  isActive("/wishlist")
                    ? "bg-[#F2E4E1] text-[#8F3046]"
                    : "text-[#4A1821]"
                }`}
              >
                <FaHeart />

                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#A83F55] px-1 text-[11px] font-bold text-white shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                title="السلة"
                aria-label="السلة"
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#F2E4E1] hover:text-[#8F3046] hover:shadow-md active:scale-90 ${
                  isActive("/cart")
                    ? "bg-[#F2E4E1] text-[#8F3046]"
                    : "text-[#4A1821]"
                }`}
              >
                {cartPopup && (
                  <span className="pointer-events-none absolute -top-7 right-0 z-50 animate-[cartFly_1s_ease] rounded-full bg-[#A83F55] px-2 py-1 text-xs font-bold text-white">
                    +{cartPopup}
                  </span>
                )}

                <FaShoppingCart
                  className={`transition-all duration-500 ${
                    cartAnimating
                      ? "animate-[cartShake_800ms_cubic-bezier(.22,1,.36,1)]"
                      : ""
                  }`}
                />

                {cartCount > 0 && (
                  <span
                    className={`absolute -right-1 -top-1 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#A83F55] px-1 text-[11px] font-bold text-white shadow-md ${
                      cartAnimating ? "animate-[cartBadge_600ms_ease]" : ""
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* =========================================
      Mobile Drawer
      ========================================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-[2147483647] md:hidden">
          {/* Overlay */}
          <div
            onClick={closeMenu}
            className={`absolute inset-0 backdrop-blur-sm transition-all duration-300 ${
              drawerVisible ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
            }`}
          />

          {/* Drawer */}
          <div
            className={`absolute right-0 top-0 z-[2147483647] flex h-full w-80 max-w-[85%] flex-col overflow-y-auto rounded-l-3xl bg-[#FBF6F1] shadow-2xl transition-all duration-300 ease-out ${
              drawerVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#E8D9D6] bg-[#FBF6F1] px-5 py-4">
              {/* الشعار */}
              <Link
                to="/"
                onClick={closeMenu}
                className="group flex items-center gap-3"
              >
                <div className="h-11 w-11 overflow-hidden rounded-full border border-[#A83F55]/30 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/logo.png"
                    alt="سهرة"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col leading-none">
                  <span className="text-xl font-bold tracking-tight text-[#4A1821]">
                    سهرة
                  </span>

                  <span className="mt-1 text-[8px] font-semibold tracking-[0.25em] text-[#A83F55]">
                    SAHRA STORE
                  </span>
                </div>
              </Link>

              {/* زر الإغلاق */}
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-[#4A1821] transition hover:bg-[#F2E4E1] hover:text-[#8F3046]"
                aria-label="إغلاق القائمة"
              >
                <FaTimes />
              </button>
            </div>

            {/* Mobile Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 border-b border-[#E8D9D6] p-5"
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="flex-1 rounded-xl border border-[#E8D9D6] bg-white p-3 text-sm text-[#4A1821] outline-none transition focus:border-[#A83F55]"
              />

              <button
                type="submit"
                className="rounded-xl bg-[#641F2B] p-3 text-white transition hover:bg-[#8F3046]"
                aria-label="بحث"
              >
                <FaSearch />
              </button>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col border-b border-[#E8D9D6] p-3">
              <Link
                to="/"
                onClick={closeMenu}
                className={`rounded-2xl px-4 py-3 transition-all duration-300 active:scale-95 ${
                  isActive("/")
                    ? "bg-[#F2E4E1] font-semibold text-[#8F3046] shadow-sm"
                    : "text-[#4A1821] hover:bg-[#F2E4E1] hover:text-[#8F3046]"
                }`}
              >
                الرئيسية
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className={`rounded-2xl px-4 py-3 transition-all duration-300 active:scale-95 ${
                  isActive("/products")
                    ? "bg-[#F2E4E1] font-semibold text-[#8F3046] shadow-sm"
                    : "text-[#4A1821] hover:bg-[#F2E4E1] hover:text-[#8F3046]"
                }`}
              >
                كل المنتجات
              </Link>

              <Link
                to="/categories"
                onClick={closeMenu}
                className={`rounded-2xl px-4 py-3 transition-all duration-300 active:scale-95 ${
                  isActive("/categories")
                    ? "bg-[#F2E4E1] font-semibold text-[#8F3046] shadow-sm"
                    : "text-[#4A1821] hover:bg-[#F2E4E1] hover:text-[#8F3046]"
                }`}
              >
                التصنيفات
              </Link>

              <Link
                to="/customer-testimonials"
                onClick={closeMenu}
                className={`rounded-2xl px-4 py-3 transition-all duration-300 active:scale-95 ${
                  isActive("/customer-testimonials")
                    ? "bg-[#F2E4E1] font-semibold text-[#8F3046] shadow-sm"
                    : "text-[#4A1821] hover:bg-[#F2E4E1] hover:text-[#8F3046]"
                }`}
              >
                آراء العملاء
              </Link>

              <Link
                to="/wishlist"
                onClick={closeMenu}
                className={`rounded-2xl px-4 py-3 transition-all duration-300 active:scale-95 ${
                  isActive("/wishlist")
                    ? "bg-[#F2E4E1] font-semibold text-[#8F3046] shadow-sm"
                    : "text-[#4A1821] hover:bg-[#F2E4E1] hover:text-[#8F3046]"
                }`}
              >
                المفضلة
              </Link>

              <Link
                to="/track-order"
                onClick={closeMenu}
                className={`rounded-2xl px-4 py-3 transition-all duration-300 active:scale-95 ${
                  isActive("/track-order")
                    ? "bg-[#F2E4E1] font-semibold text-[#8F3046] shadow-sm"
                    : "text-[#4A1821] hover:bg-[#F2E4E1] hover:text-[#8F3046]"
                }`}
              >
                متابعة الطلب
              </Link>

              <Link
                to="/about"
                onClick={closeMenu}
                className={`rounded-2xl px-4 py-3 transition-all duration-300 active:scale-95 ${
                  isActive("/about")
                    ? "bg-[#F2E4E1] font-semibold text-[#8F3046] shadow-sm"
                    : "text-[#4A1821] hover:bg-[#F2E4E1] hover:text-[#8F3046]"
                }`}
              >
                تواصل معنا
              </Link>
            </nav>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="p-3">
                <p className="px-3 py-2 text-sm font-semibold text-[#8F3046]">
                  التصنيفات
                </p>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.name)}
                    className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-right text-[#4A1821] transition-all duration-300 hover:bg-[#F2E4E1] hover:text-[#8F3046]"
                  >
                    {/* صورة التصنيف */}
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E8D9D6] bg-white shadow-sm">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-[#A83F55]">
                          صورة
                        </div>
                      )}
                    </div>

                    {/* اسم التصنيف */}
                    <span className="flex-1 text-sm font-medium">
                      {cat.name}
                    </span>

                    <FaChevronLeft className="text-xs text-[#A83F55] transition-transform duration-300 group-hover:-translate-x-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Space for fixed header */}
      <div
        className={
          settings?.announcementBar?.enabled ? "h-[128px]" : "h-[88px]"
        }
      />
    </>
  );
}

export default Header;
