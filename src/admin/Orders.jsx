import { useMemo, useState } from "react";
import {
  FaEye,
  FaShoppingBag,
  FaClock,
  FaCog,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaMoneyBillWave,
  FaChevronLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../components/layout/AdminLayout";
import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUSES } from "../context/order-statuses";

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_ICONS = {
  pending: FaClock,
  processing: FaCog,
  shipped: FaShoppingBag,
  completed: FaCheckCircle,
  cancelled: FaTimesCircle,
};

function Orders() {
  const { orders, updateOrderStatus } = useOrders();

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = !statusFilter || order.status === statusFilter;

      const text = `
        ${order.orderNumber || ""}
        ${order.customer?.name || ""}
        ${order.customer?.phone || ""}
      `.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  const totalSales = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "processing",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;

  const getStatusIcon = (status) => {
    return STATUS_ICONS[status] || FaShoppingBag;
  };

  const getStatusClass = (status) => {
    return STATUS_COLORS[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <AdminLayout>
      <div className="mx-auto mt-6 max-w-7xl space-y-6 pb-10">
        {/* Hero Header */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#641F2B] p-6 text-white shadow-[0_20px_55px_rgba(100,31,43,0.18)] md:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/[0.045]" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#A83F55]/20" />

          <div className="pointer-events-none absolute right-1/2 top-1/2 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full border border-white/5" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[#F2E4E1] backdrop-blur-sm">
                  <FaShoppingBag className="text-xl" />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#F2E4E1]">
                  SAHRA ADMIN
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                إدارة الطلبات
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/70 md:text-base">
                تابع الطلبات، راجع تفاصيل العملاء، وحدّث حالة كل طلب من مكان
                واحد.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <FaShoppingBag className="text-sm text-[#F2E4E1]" />
              </div>

              <div>
                <p className="text-xs text-white/60">الطلبات المعروضة</p>
                <p className="font-black">
                  {filteredOrders.length} من {orders.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Pending */}
          <div className="group rounded-[24px] border border-amber-100 bg-white p-5 shadow-[0_10px_30px_rgba(100,31,43,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(100,31,43,0.09)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#806D70]">
                  طلبات جديدة
                </p>
                <p className="mt-2 text-3xl font-black text-[#4A1821]">
                  {pendingOrders}
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  تحتاج إلى المراجعة
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                <FaClock />
              </div>
            </div>
          </div>

          {/* Processing */}
          <div className="group rounded-[24px] border border-blue-100 bg-white p-5 shadow-[0_10px_30px_rgba(100,31,43,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(100,31,43,0.09)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#806D70]">
                  قيد التنفيذ
                </p>
                <p className="mt-2 text-3xl font-black text-[#4A1821]">
                  {processingOrders}
                </p>
                <p className="mt-1 text-xs text-blue-600">طلبات قيد المعالجة</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                <FaCog />
              </div>
            </div>
          </div>

          {/* Sales */}
          <div className="group rounded-[24px] border border-[#E8D9D6] bg-white p-5 shadow-[0_10px_30px_rgba(100,31,43,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(100,31,43,0.09)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#806D70]">
                  إجمالي المبيعات
                </p>
                <p className="mt-2 text-2xl font-black text-[#4A1821]">
                  {totalSales.toFixed(2)}
                  <span className="mr-1 text-sm font-bold text-[#806D70]">
                    ر.س
                  </span>
                </p>
                <p className="mt-1 text-xs text-[#A83F55]">
                  باستثناء الطلبات الملغاة
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2E4E1] text-[#641F2B] transition-transform duration-300 group-hover:scale-110">
                <FaMoneyBillWave />
              </div>
            </div>
          </div>

          {/* All Orders */}
          <div className="group rounded-[24px] border border-[#E8D9D6] bg-white p-5 shadow-[0_10px_30px_rgba(100,31,43,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(100,31,43,0.09)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#806D70]">
                  جميع الطلبات
                </p>
                <p className="mt-2 text-3xl font-black text-[#4A1821]">
                  {orders.length}
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  {completedOrders} مكتملة
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBF6F1] text-[#A83F55] transition-transform duration-300 group-hover:scale-110">
                <FaShoppingBag />
              </div>
            </div>
          </div>
        </section>

        {/* Main Orders Card */}
        <section className="overflow-hidden rounded-[30px] border border-[#E8D9D6] bg-white shadow-[0_15px_45px_rgba(100,31,43,0.06)]">
          {/* Toolbar */}
          <div className="border-b border-[#E8D9D6] bg-[#FBF6F1] px-5 py-5 md:px-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
                    <FaShoppingBag />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-[#4A1821]">
                      قائمة الطلبات
                    </h2>
                    <p className="mt-1 text-xs text-[#806D70]">
                      إدارة ومتابعة جميع الطلبات الواردة
                    </p>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full xl:max-w-md">
                <FaSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#A83F55]" />

                <input
                  type="text"
                  placeholder="بحث برقم الطلب أو اسم العميل أو الهاتف..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-[#E8D9D6] bg-white py-3.5 pr-11 pl-4 text-sm text-[#4A1821] outline-none transition placeholder:text-[#A99A9C] focus:border-[#A83F55] focus:ring-4 focus:ring-[#F2E4E1]"
                />
              </div>
            </div>
          </div>

          {/* Status filters */}
          <div className="border-b border-[#E8D9D6] px-5 py-4 md:px-7">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                type="button"
                onClick={() => setStatusFilter("")}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${
                  !statusFilter
                    ? "border-[#641F2B] bg-[#641F2B] text-white shadow-md"
                    : "border-[#E8D9D6] bg-white text-[#806D70] hover:border-[#D8B8B9] hover:bg-[#FBF6F1] hover:text-[#641F2B]"
                }`}
              >
                الكل
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    !statusFilter
                      ? "bg-white/15 text-white"
                      : "bg-[#F2E4E1] text-[#641F2B]"
                  }`}
                >
                  {orders.length}
                </span>
              </button>

              {Object.entries(ORDER_STATUSES).map(([key, label]) => {
                const count = orders.filter(
                  (order) => order.status === key,
                ).length;

                const Icon = getStatusIcon(key);

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${
                      statusFilter === key
                        ? "border-[#641F2B] bg-[#641F2B] text-white shadow-md"
                        : "border-[#E8D9D6] bg-white text-[#806D70] hover:border-[#D8B8B9] hover:bg-[#FBF6F1] hover:text-[#641F2B]"
                    }`}
                  >
                    <Icon className="text-xs" />
                    {label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        statusFilter === key
                          ? "bg-white/15 text-white"
                          : "bg-[#F2E4E1] text-[#641F2B]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result summary */}
          <div className="flex items-center justify-between px-5 py-4 md:px-7">
            <p className="text-sm text-[#806D70]">
              عرض{" "}
              <span className="font-black text-[#4A1821]">
                {filteredOrders.length}
              </span>{" "}
              طلب
            </p>

            {(search || statusFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                }}
                className="text-xs font-bold text-[#A83F55] transition hover:text-[#641F2B]"
              >
                مسح الفلاتر
              </button>
            )}
          </div>

          {/* Mobile Orders */}
          <div className="space-y-3 px-4 pb-5 md:hidden">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#806D70]">رقم الطلب</p>
                        <p className="mt-1 font-black text-[#641F2B]">
                          #{order.orderNumber}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        <StatusIcon className="text-[10px]" />
                        {ORDER_STATUSES[order.status] || order.status}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-[#E8D9D6] pt-4">
                      <p className="font-bold text-[#4A1821]">
                        {order.customer?.name || "-"}
                      </p>

                      <p className="mt-1 text-sm text-[#806D70]">
                        {order.customer?.phone || "-"}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs text-[#806D70]">المنتجات</p>
                        <p className="mt-1 font-black text-[#4A1821]">
                          {order.items?.length || 0}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs text-[#806D70]">الإجمالي</p>
                        <p className="mt-1 font-black text-[#641F2B]">
                          {Number(order.total || 0).toFixed(2)} ر.س
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="mb-2 text-xs text-[#806D70]">تاريخ الطلب</p>
                      <p className="text-sm font-semibold text-[#4A1821]">
                        {order.createdAt?.toDate
                          ? order.createdAt.toDate().toLocaleDateString("ar-SA")
                          : "-"}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-[#E8D9D6] pt-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm font-bold outline-none ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#4A1821]"
                        title="عرض الطلب"
                      >
                        <FaEye />
                        عرض
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D8B8B9] bg-[#FBF6F1] px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2E4E1] text-xl text-[#641F2B]">
                  <FaShoppingBag />
                </div>

                <p className="mt-4 font-bold text-[#4A1821]">لا توجد طلبات</p>

                <p className="mt-1 text-sm text-[#806D70]">
                  لم يتم العثور على طلبات مطابقة للبحث أو الفلتر.
                </p>
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-y border-[#E8D9D6] bg-[#FBF6F1]">
                  <th className="px-6 py-4 text-right text-xs font-bold text-[#806D70]">
                    رقم الطلب
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold text-[#806D70]">
                    العميل
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-[#806D70]">
                    المنتجات
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold text-[#806D70]">
                    التاريخ
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-[#806D70]">
                    الإجمالي
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-[#806D70]">
                    الحالة
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-[#806D70]">
                    عرض
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-[#E8D9D6] transition-colors hover:bg-[#FBF6F1]"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <span className="font-black text-[#641F2B]">
                              #{order.orderNumber}
                            </span>

                            <p className="mt-1 text-[11px] text-[#A99A9C]">
                              ID: {order.id?.slice(0, 8)}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold text-[#4A1821]">
                            {order.customer?.name || "-"}
                          </p>

                          <p className="mt-1 text-xs text-[#806D70]">
                            {order.customer?.phone || "-"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-[#F2E4E1] px-3 py-1.5 text-sm font-bold text-[#641F2B]">
                            {order.items?.length || 0}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-[#806D70]">
                          {order.createdAt?.toDate
                            ? order.createdAt
                                .toDate()
                                .toLocaleDateString("ar-SA")
                            : "-"}
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span className="font-black text-[#4A1821]">
                            {Number(order.total || 0).toFixed(2)}
                          </span>

                          <span className="mr-1 text-xs font-bold text-[#806D70]">
                            ر.س
                          </span>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                            className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-bold outline-none transition focus:ring-4 focus:ring-[#F2E4E1] ${getStatusClass(
                              order.status,
                            )}`}
                          >
                            {Object.entries(ORDER_STATUSES).map(
                              ([key, label]) => (
                                <option key={key} value={key}>
                                  {label}
                                </option>
                              ),
                            )}
                          </select>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/orders/${order.id}`)
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#641F2B] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4A1821] hover:shadow-md"
                            title="عرض الطلب"
                          >
                            <FaEye className="text-sm" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2E4E1] text-2xl text-[#641F2B]">
                        <FaShoppingBag />
                      </div>

                      <p className="mt-5 font-bold text-[#4A1821]">
                        لا توجد طلبات
                      </p>

                      <p className="mt-1 text-sm text-[#806D70]">
                        لم يتم العثور على طلبات مطابقة للبحث أو الفلتر.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom note */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E8D9D6] bg-white px-5 py-4 text-sm text-[#806D70] shadow-[0_8px_25px_rgba(100,31,43,0.04)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F2E4E1] text-[#641F2B]">
              <FaCheckCircle className="text-sm" />
            </div>

            <p>يتم تحديث حالة الطلب مباشرة عند تغييرها من القائمة.</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="inline-flex items-center gap-2 font-bold text-[#641F2B] transition hover:text-[#A83F55]"
          >
            تحديث العرض
            <FaChevronLeft className="text-xs" />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Orders;
