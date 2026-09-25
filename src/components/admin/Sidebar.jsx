import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlusSquare,
  FaShoppingCart,
  FaTags,
  FaCog,
  FaSignOutAlt,
  FaStar,
  FaImages,
  FaTimes,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";

function Sidebar({ newOrdersCount = 0, isOpen = false, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    navigate("/admin/login", {
      replace: true,
    });
  };

  const menu = [
    {
      name: "لوحة التحكم",
      icon: <FaTachometerAlt />,
      path: "/admin/dashboard",
    },
    {
      name: "المنتجات",
      icon: <FaBoxOpen />,
      path: "/admin/products",
    },
    {
      name: "إضافة منتج",
      icon: <FaPlusSquare />,
      path: "/admin/products/add",
    },
    {
      name: "الطلبات",
      icon: <FaShoppingCart />,
      path: "/admin/orders",
      badge: newOrdersCount,
    },
    {
      name: "التصنيفات",
      icon: <FaTags />,
      path: "/admin/categories",
    },
    {
      name: "التقييمات",
      icon: <FaStar />,
      path: "/admin/reviews",
    },
    {
      name: "آراء العملاء",
      icon: <FaImages />,
      path: "/admin/customer-testimonials",
    },
    {
      name: "الإعدادات",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  return (
    <aside
      dir="rtl"
      className={`         fixed right-0 top-0 z-50
        flex h-screen w-[280px] flex-col
        border-l border-slate-200
        bg-white
        shadow-[-8px_0_30px_rgba(15,23,42,0.06)]
        transition-transform duration-300 ease-out
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* Brand */}{" "}
      <div className="relative border-b border-slate-100 px-5 py-5">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <div className="flex min-w-0 items-center gap-3">
            {" "}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f2e4e1]">
              {" "}
              <img
                src="/logo.png"
                alt="سهرة"
                className="max-h-10 max-w-[44px] object-contain"
              />{" "}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-black tracking-tight text-[#641F2B]">
                سهرة
              </p>

              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                إدارة المتجر
              </p>
            </div>
          </div>
          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <FaTimes />
          </button>
        </div>
      </div>
      {/* Store status */}
      <div className="px-4 pt-5">
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <span className="text-xs font-semibold text-slate-600">
              المتجر نشط
            </span>
          </div>

          <span className="text-[10px] font-medium text-slate-400">SAHRA</span>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-2 text-[11px] font-bold text-slate-400">
          القائمة الرئيسية
        </p>

        <div className="space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#f2e4e1] text-[#641F2B]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-[15px] transition-colors ${
                        isActive
                          ? "bg-[#641F2B] text-white shadow-sm"
                          : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span>{item.name}</span>
                  </div>

                  {item.badge > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#A83F55] px-1.5 text-[10px] font-black text-white">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
      {/* Quick info */}
      <div className="px-4 pb-4">
        <div className="rounded-2xl border border-[#e8d9d6] bg-[#fbf6f1] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#641F2B] shadow-sm">
              <FaBoxOpen />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700">إدارة أسهل</p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                تحكم كامل بمتجرك
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Logout */}
      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors group-hover:bg-red-100 group-hover:text-red-500">
            <FaSignOutAlt />
          </span>

          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
