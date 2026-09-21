import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase/config";

import {
  FaBox,
  FaShoppingCart,
  FaMoneyBillWave,
  FaClock,
  FaTags,
  FaExclamationTriangle,
  FaEye,
  FaArrowLeft,
  FaChartLine,
  FaStore,
  FaBell,
} from "react-icons/fa";

import { useStore } from "../hooks/useStore";
import { useOrders } from "../hooks/useOrders";

import AdminLayout from "../components/layout/AdminLayout";

function Dashboard() {
  const { products, categories } = useStore();
  const { orders, totalRevenue } = useOrders();

  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [visits, setVisits] = useState(0);

  // عدد زيارات المتجر
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "stats", "visits"),
      (snapshot) => {
        setVisits(snapshot.data()?.total || 0);
      },
      (error) => {
        console.error("Visits Firebase Error:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  const previousOrdersCount = useRef(0);

  const notificationSound = useRef(null);
  const audioUnlocked = useRef(false);

  // تجهيز صوت إشعار الطلبات
  useEffect(() => {
    notificationSound.current = new Audio("/sounds/order.mp3");

    notificationSound.current.volume = 1;

    const unlockAudio = () => {
      if (audioUnlocked.current) return;

      notificationSound.current
        ?.play()
        .then(() => {
          notificationSound.current.pause();
          notificationSound.current.currentTime = 0;

          audioUnlocked.current = true;
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  // مراقبة الطلبات الجديدة
  useEffect(() => {
    if (previousOrdersCount.current === 0) {
      previousOrdersCount.current = orders.length;
      return;
    }

    if (orders.length > previousOrdersCount.current) {
      const diff = orders.length - previousOrdersCount.current;

      setNewOrdersCount((prev) => prev + diff);

      notificationSound.current?.play().catch(() => {});
    }

    previousOrdersCount.current = orders.length;
  }, [orders]);

  const lowStockProducts = products.filter(
    (product) => Number(product.stock || 0) <= 5,
  );

  const pendingOrdersCount = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const latestProducts = [...products].reverse().slice(0, 5);

  const latestOrders = [...orders].reverse().slice(0, 5);

  const stats = [
    {
      title: "المنتجات",
      value: products.length.toLocaleString("ar-SA"),
      icon: FaBox,
      iconBg: "bg-[#F2E4E1]",
      iconColor: "text-[#641F2B]",
    },
    {
      title: "زيارات المتجر",
      value: visits.toLocaleString("ar-SA"),
      icon: FaEye,
      iconBg: "bg-[#F4EDF0]",
      iconColor: "text-[#8F3046]",
    },
    {
      title: "إجمالي الطلبات",
      value: orders.length.toLocaleString("ar-SA"),
      icon: FaShoppingCart,
      iconBg: "bg-[#F7EEE9]",
      iconColor: "text-[#A83F55]",
      badge: newOrdersCount,
    },
    {
      title: "إجمالي المبيعات",
      value: `${totalRevenue.toLocaleString("ar-SA")} ر.س`,
      icon: FaMoneyBillWave,
      iconBg: "bg-[#F5EFE5]",
      iconColor: "text-[#9A6B28]",
    },
    {
      title: "طلبات قيد الانتظار",
      value: pendingOrdersCount.toLocaleString("ar-SA"),
      icon: FaClock,
      iconBg: "bg-[#FDF0F1]",
      iconColor: "text-[#A83F55]",
    },
  ];

  return (
    <AdminLayout newOrdersCount={newOrdersCount}>
      <div dir="rtl" className="min-h-full bg-[#FBF6F1] text-[#4A1821]">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-[#A83F55]">
              <FaStore />
              SAHRA ADMIN
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#4A1821] md:text-4xl">
              لوحة التحكم
            </h1>

            <p className="mt-2 text-sm leading-7 text-[#806D70]">
              نظرة شاملة على أداء متجر سهرة والطلبات والمنتجات.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#E8D9D6] bg-white px-4 py-3 shadow-[0_8px_25px_rgba(100,31,43,0.04)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
              <FaChartLine />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#806D70]">
                حالة المتجر
              </p>

              <p className="mt-0.5 text-sm font-black text-[#4A1821]">
                البيانات محدثة مباشرة
              </p>
            </div>

            <span className="mr-2 h-2.5 w-2.5 rounded-full bg-[#7A8B43] shadow-[0_0_0_4px_rgba(122,139,67,0.12)]" />
          </div>
        </div>

        {/* New orders notification */}
        {newOrdersCount > 0 && (
          <div className="relative mb-7 overflow-hidden rounded-[28px] border border-[#D8B8B9] bg-[#641F2B] p-5 text-white shadow-[0_15px_40px_rgba(100,31,43,0.16)]">
            <div className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-20 right-20 h-44 w-44 rounded-full bg-[#A83F55]/20" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#F2E4E1]">
                  <FaBell className="animate-pulse" />
                </div>

                <div>
                  <h3 className="font-black">لديك طلبات جديدة</h3>

                  <p className="mt-1 text-sm text-white/70">
                    وصل إليك {newOrdersCount} طلب جديد يحتاج إلى المراجعة.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNewOrdersCount(0)}
                className="rounded-xl border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
              >
                تم الاطلاع
              </button>
            </div>
          </div>
        )}

        {/* Main statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-[26px] border border-[#E8D9D6] bg-white p-5 shadow-[0_10px_35px_rgba(100,31,43,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8B8B9] hover:shadow-[0_18px_45px_rgba(100,31,43,0.09)]"
              >
                <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-[#F7EEE9] opacity-70 transition-transform duration-500 group-hover:scale-125" />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#806D70]">
                      {stat.title}
                    </p>

                    <p className="mt-3 text-2xl font-black tracking-tight text-[#4A1821]">
                      {stat.value}
                    </p>

                    {stat.badge > 0 && (
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#FDF0F1] px-2.5 py-1 text-[10px] font-black text-[#A83F55]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A83F55]" />
                        +{stat.badge} جديد
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.iconColor}`}
                  >
                    <Icon className="text-lg" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary statistics */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-[26px] border border-[#E8D9D6] bg-white p-5 shadow-[0_10px_35px_rgba(100,31,43,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#806D70]">
                  إجمالي التصنيفات
                </p>

                <p className="mt-2 text-3xl font-black text-[#4A1821]">
                  {categories.length.toLocaleString("ar-SA")}
                </p>

                <p className="mt-1 text-xs text-[#806D70]">
                  تصنيف متاح في المتجر
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B]">
                <FaTags className="text-xl" />
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-[#E8D9D6] bg-white p-5 shadow-[0_10px_35px_rgba(100,31,43,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#806D70]">
                  تنبيه المخزون
                </p>

                <p className="mt-2 text-3xl font-black text-[#A83F55]">
                  {lowStockProducts.length.toLocaleString("ar-SA")}
                </p>

                <p className="mt-1 text-xs text-[#806D70]">
                  منتجات تحتاج إلى متابعة
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF0F1] text-[#A83F55]">
                <FaExclamationTriangle className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Latest products + orders */}
        <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Latest products */}
          <div className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_10px_35px_rgba(100,31,43,0.05)]">
            <div className="flex items-center justify-between border-b border-[#E8D9D6] px-5 py-5 md:px-6">
              <div>
                <p className="text-xs font-bold text-[#A83F55]">المنتجات</p>

                <h2 className="mt-1 text-xl font-black text-[#4A1821]">
                  أحدث المنتجات
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                <FaBox />
              </div>
            </div>

            <div className="divide-y divide-[#E8D9D6]">
              {latestProducts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <FaBox className="mx-auto mb-3 text-2xl text-[#D8B8B9]" />
                  <p className="text-sm text-[#806D70]">
                    لا توجد منتجات حالياً.
                  </p>
                </div>
              ) : (
                latestProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#FBF6F1] md:px-6"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#4A1821]">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-[#806D70]">
                        {product.category || "بدون تصنيف"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="rounded-full bg-[#F2E4E1] px-3 py-1.5 text-xs font-black text-[#641F2B]">
                        {Number(product.price || 0).toLocaleString("ar-SA")} ر.س
                      </span>

                      <FaArrowLeft className="text-xs text-[#D8B8B9] transition-transform group-hover:-translate-x-1 group-hover:text-[#A83F55]" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest orders */}
          <div className="overflow-hidden rounded-[28px] border border-[#E8D9D6] bg-white shadow-[0_10px_35px_rgba(100,31,43,0.05)]">
            <div className="flex items-center justify-between border-b border-[#E8D9D6] px-5 py-5 md:px-6">
              <div>
                <p className="text-xs font-bold text-[#A83F55]">الطلبات</p>

                <h2 className="mt-1 text-xl font-black text-[#4A1821]">
                  أحدث الطلبات
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EEE9] text-[#A83F55]">
                <FaShoppingCart />
              </div>
            </div>

            <div className="divide-y divide-[#E8D9D6]">
              {latestOrders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <FaShoppingCart className="mx-auto mb-3 text-2xl text-[#D8B8B9]" />
                  <p className="text-sm text-[#806D70]">
                    لا توجد طلبات حالياً.
                  </p>
                </div>
              ) : (
                latestOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#FBF6F1] md:px-6"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#4A1821]">
                        {order.customer?.name || "عميل"}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            order.status === "pending"
                              ? "bg-[#D49B35]"
                              : "bg-[#7A8B43]"
                          }`}
                        />

                        <p className="text-xs text-[#806D70]">{order.status}</p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-[#F2E4E1] px-3 py-1.5 text-xs font-black text-[#641F2B]">
                      {Number(order.total || 0).toLocaleString("ar-SA")} ر.س
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom insight */}
        <div className="mt-5 overflow-hidden rounded-[28px] bg-[#4A1821] p-6 text-white shadow-[0_15px_45px_rgba(74,24,33,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#F2E4E1]">
                SAHRA STORE
              </p>

              <h2 className="mt-2 text-xl font-black">إدارة المتجر بكل وضوح</h2>

              <p className="mt-2 text-sm leading-7 text-white/60">
                تابع المنتجات والطلبات والمبيعات والمخزون من مكان واحد.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#F2E4E1]">
              <FaChartLine />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
