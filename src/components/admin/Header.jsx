import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";

function Header({ onMenuClick }) {
  const { adminName } = useAuth();

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"
    >
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Right side */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#e2cdd0] hover:bg-[#fbf6f1] hover:text-[#641F2B] lg:hidden"
            aria-label="فتح القائمة"
          >
            <FaBars />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-wide text-[#A83F55] sm:text-xs">
              لوحة الإدارة
            </p>

            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              مرحبًا بك في سهرة
            </h1>
          </div>
        </div>

        {/* Left side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative hidden lg:block">
            <FaSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

            <input
              type="text"
              placeholder="بحث سريع..."
              className="h-10 w-56 rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#A83F55]/10 xl:w-64"
            />
          </div>

          {/* Mobile search */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#e2cdd0] hover:bg-[#fbf6f1] hover:text-[#641F2B] lg:hidden"
            aria-label="البحث"
          >
            <FaSearch />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#e2cdd0] hover:bg-[#fbf6f1] hover:text-[#641F2B]"
            aria-label="الإشعارات"
          >
            <FaBell className="text-[15px]" />

            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#A83F55] ring-2 ring-white" />
          </button>

          {/* Divider */}
          <span className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Admin profile */}
          <div className="flex items-center gap-2.5 rounded-xl px-1.5 py-1">
            <div className="hidden text-right sm:block">
              <p className="max-w-[130px] truncate text-sm font-bold text-slate-800">
                {adminName || "المدير"}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">مدير المتجر</p>
            </div>

            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2e4e1] text-[#641F2B]">
                <FaUserCircle className="text-2xl" />
              </div>

              <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <FaChevronDown className="hidden text-[10px] text-slate-400 sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
