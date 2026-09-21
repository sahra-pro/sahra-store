import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBolt,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaShieldAlt,
} from "react-icons/fa";

import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login, isAuthenticated, authLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/admin/dashboard";

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    const result = await login(email, password);

    setSubmitting(false);

    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.message);
    }
  };

  if (!authLoading && isAuthenticated) {
    return null;
  }

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FBF6F1] px-4 py-10"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#F2E4E1]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#E8D9D6]/60" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#641F2B] text-[#F2E4E1] shadow-[0_15px_35px_rgba(100,31,43,0.20)]">
            <FaBolt className="text-2xl" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#A83F55]">
            SAHRA
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#4A1821]">
            لوحة تحكم سهرة
          </h1>

          <p className="mt-2 text-sm leading-7 text-[#806D70]">
            سجّل دخولك للوصول إلى إدارة المتجر
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-[30px] border border-[#E8D9D6] bg-white p-6 shadow-[0_20px_60px_rgba(100,31,43,0.10)] sm:p-8">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold leading-6 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#4A1821]">
                البريد الإلكتروني
              </label>

              <div className="relative">
                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A83F55]" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] py-3.5 pl-4 pr-11 text-sm text-[#4A1821] outline-none transition-all placeholder:text-[#B3A4A6] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1]"
                  placeholder="البريد الإلكتروني"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#4A1821]">
                كلمة المرور
              </label>

              <div className="relative">
                <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A83F55]" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] py-3.5 pl-4 pr-11 text-sm text-[#4A1821] outline-none transition-all placeholder:text-[#B3A4A6] focus:border-[#A83F55] focus:bg-white focus:ring-4 focus:ring-[#F2E4E1]"
                  placeholder="كلمة المرور"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="group mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#641F2B] py-4 text-sm font-bold text-white shadow-[0_12px_30px_rgba(100,31,43,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-[0_18px_38px_rgba(100,31,43,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                "جارِ التحقق..."
              ) : (
                <>
                  تسجيل الدخول
                  <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#E8D9D6] pt-5 text-xs text-[#806D70]">
            <FaShieldAlt className="text-[#7A8B43]" />
            <span>دخول آمن ومخصص لإدارة متجر سهرة</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#806D70]">
          © 2026 سهرة — لوحة الإدارة
        </p>
      </div>
    </main>
  );
}

export default Login;
