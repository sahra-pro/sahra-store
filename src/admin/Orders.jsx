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
  FaFileExcel,
  FaCheckSquare,
  FaSquare,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

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
  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const [selectedOrders, setSelectedOrders] = useState([]);

  const [bulkAction, setBulkAction] = useState("");
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const navigate = useNavigate();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = !statusFilter || order.status === statusFilter;

      const text = `
        ${order.orderNumber || ""}
        ${order.customer?.name || ""}
        ${order.customer?.phone || ""}
        ${order.customer?.city || ""}
        ${order.customer?.neighborhood || ""}
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

  const selectedCount = selectedOrders.length;

  const allFilteredSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedOrders.includes(order.id));

  const getStatusIcon = (status) => {
    return STATUS_ICONS[status] || FaShoppingBag;
  };

  const getStatusClass = (status) => {
    return STATUS_COLORS[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedOrders((prev) =>
        prev.filter((id) => !filteredOrders.some((order) => order.id === id)),
      );

      return;
    }

    setSelectedOrders((prev) => {
      const next = new Set(prev);

      filteredOrders.forEach((order) => {
        next.add(order.id);
      });

      return Array.from(next);
    });
  };

  const clearSelection = () => {
    setSelectedOrders([]);
    setBulkAction("");
  };

  const getSelectedOrderObjects = () => {
    return orders.filter((order) => selectedOrders.includes(order.id));
  };

  const formatDate = (value, withTime = false) => {
    if (!value) return "-";

    try {
      const date = value?.toDate ? value.toDate() : new Date(value);

      if (Number.isNaN(date.getTime())) {
        return "-";
      }

      return date.toLocaleString("ar-SA", {
        dateStyle: "short",
        ...(withTime ? { timeStyle: "short" } : {}),
      });
    } catch {
      return "-";
    }
  };

  const getCustomerData = (order) => {
    const customer = order.customer || {};

    const city = customer.city || order.city || "";

    const neighborhood = customer.neighborhood || order.neighborhood || "";

    const shortAddress =
      customer.address ||
      customer.shortAddress ||
      order.address ||
      order.shortAddress ||
      "";

    const notes =
      customer.notes ||
      customer.deliveryNotes ||
      order.notes ||
      order.deliveryNotes ||
      "";

    const latitude =
      customer.latitude ?? order.latitude ?? order.location?.latitude ?? "";

    const longitude =
      customer.longitude ?? order.longitude ?? order.location?.longitude ?? "";

    const shippingMethod =
      order.shippingMethod ||
      order.shippingCompany ||
      order.shipping?.method ||
      order.shipping?.company ||
      null;

    const shippingMethodName =
      typeof shippingMethod === "string"
        ? shippingMethod
        : shippingMethod?.name ||
          shippingMethod?.title ||
          order.shippingMethodName ||
          order.shippingCompanyName ||
          "";

    return {
      city,
      neighborhood,
      shortAddress,
      notes,
      latitude,
      longitude,
      shippingMethodName,
    };
  };

  const exportOrdersToExcel = (ordersToExport, filePrefix = "sahra-orders") => {
    if (!ordersToExport.length) {
      window.alert("لا توجد طلبات لتصديرها.");
      return;
    }

    const rows = ordersToExport.map((order) => {
      const customer = order.customer || {};
      const delivery = getCustomerData(order);

      const products = Array.isArray(order.items)
        ? order.items
            .map((item) => {
              const quantity = Number(item.quantity || 0);
              const price = Number(item.price || 0);

              return `${item.name || "منتج"} × ${quantity} = ${(
                price * quantity
              ).toFixed(2)} ر.س`;
            })
            .join(" | ")
        : "";

      const totalItems = Array.isArray(order.items)
        ? order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
        : 0;

      const shippingAmount = Number(
        order.shippingCost ?? order.shippingFee ?? order.shipping ?? 0,
      );

      const paymentMethod =
        order.paymentMethod === "cod" ||
        order.paymentMethod === "cash_on_delivery" ||
        !order.paymentMethod
          ? "الدفع عند الاستلام"
          : order.paymentMethod;

      return {
        "رقم الطلب": order.orderNumber || "",
        "حالة الطلب": ORDER_STATUSES[order.status] || order.status || "",
        "اسم العميل": customer.name || "",
        "رقم الهاتف": customer.phone || "",
        المدينة: delivery.city,
        الحي: delivery.neighborhood,
        "العنوان المختصر": delivery.shortAddress,
        "ملاحظات التوصيل": delivery.notes,
        "خط العرض": delivery.latitude,
        "خط الطول": delivery.longitude,
        "شركة الشحن": delivery.shippingMethodName,
        "طريقة الدفع": paymentMethod,
        "عدد المنتجات": totalItems,
        المنتجات: products,
        "إجمالي المنتجات": Number(order.subtotal ?? order.total ?? 0).toFixed(
          2,
        ),
        "رسوم الشحن": shippingAmount.toFixed(2),
        "الإجمالي النهائي": Number(order.total || 0).toFixed(2),
        "تاريخ الطلب": formatDate(order.createdAt, true),
        "معرف الطلب": order.id || "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 16 },
      { wch: 16 },
      { wch: 24 },
      { wch: 18 },
      { wch: 18 },
      { wch: 22 },
      { wch: 30 },
      { wch: 35 },
      { wch: 15 },
      { wch: 15 },
      { wch: 24 },
      { wch: 20 },
      { wch: 14 },
      { wch: 60 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
      { wch: 22 },
      { wch: 32 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "الطلبات");

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10);

    XLSX.writeFile(workbook, `${filePrefix}-${datePart}.xlsx`);
  };

  const exportSelectedOrders = () => {
    const selected = getSelectedOrderObjects();

    exportOrdersToExcel(selected, "sahra-selected-orders");
  };

  const exportFilteredOrders = () => {
    exportOrdersToExcel(filteredOrders, "sahra-orders");
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedCount === 0) {
      return;
    }

    const selected = getSelectedOrderObjects();

    setIsBulkProcessing(true);

    try {
      if (bulkAction.startsWith("status:")) {
        const newStatus = bulkAction.replace("status:", "");

        await Promise.all(
          selected.map((order) => updateOrderStatus(order.id, newStatus)),
        );

        clearSelection();
        return;
      }

      if (bulkAction === "delete") {
        const confirmed = window.confirm(
          `هل أنت متأكد من حذف ${selected.length} طلب؟\n\nهذا الإجراء لا يمكن التراجع عنه.`,
        );

        if (!confirmed) {
          return;
        }

        await Promise.all(selected.map((order) => deleteOrder(order.id)));

        clearSelection();
      }
    } catch (error) {
      console.error("Bulk order action error:", error);

      window.alert("حدث خطأ أثناء تنفيذ الإجراء. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsBulkProcessing(false);
      setBulkAction("");
    }
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

          {/* Bulk Actions */}
          <div className="border-b border-[#E8D9D6] bg-white px-5 py-4 md:px-7">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E8D9D6] bg-[#FBF6F1] px-4 py-2.5 text-sm font-bold text-[#4A1821] transition hover:border-[#A83F55] hover:bg-[#F2E4E1]"
                >
                  {allFilteredSelected ? <FaCheckSquare /> : <FaSquare />}

                  {allFilteredSelected ? "إلغاء تحديد الكل" : "تحديد الكل"}
                </button>

                {selectedCount > 0 && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E8D9D6] bg-white px-4 py-2.5 text-sm font-bold text-[#806D70] transition hover:border-[#A83F55] hover:text-[#641F2B]"
                  >
                    <FaTimes />
                    إلغاء التحديد
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={exportSelectedOrders}
                  disabled={selectedCount === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaFileExcel />
                  تصدير المحدد
                  {selectedCount > 0 && <span>({selectedCount})</span>}
                </button>

                <button
                  type="button"
                  onClick={exportFilteredOrders}
                  disabled={filteredOrders.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8B8B9] bg-[#F2E4E1] px-4 py-2.5 text-sm font-bold text-[#641F2B] transition hover:bg-[#E8D9D6] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaFileExcel />
                  تصدير المعروض
                </button>
              </div>
            </div>

            {selectedCount > 0 && (
              <div className="mt-4 rounded-2xl border border-[#E8D9D6] bg-[#FBF6F1] p-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#4A1821]">
                    <FaCheckCircle className="text-[#A83F55]" />
                    تم تحديد{" "}
                    <span className="text-[#641F2B]">{selectedCount}</span> طلب
                  </div>

                  <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                    <select
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value)}
                      disabled={isBulkProcessing}
                      className="min-w-0 flex-1 rounded-xl border border-[#E8D9D6] bg-white px-4 py-2.5 text-sm font-bold text-[#4A1821] outline-none focus:border-[#A83F55] focus:ring-4 focus:ring-[#F2E4E1]"
                    >
                      <option value="">اختر إجراءً...</option>

                      {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                        <option key={key} value={`status:${key}`}>
                          تغيير الحالة إلى: {label}
                        </option>
                      ))}

                      <option value="delete">حذف الطلبات المحددة</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleBulkAction}
                      disabled={!bulkAction || isBulkProcessing}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4A1821] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isBulkProcessing ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          جارٍ التنفيذ...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          تنفيذ
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                const isSelected = selectedOrders.includes(order.id);

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-[#A83F55] bg-[#FDF5F3] shadow-[0_8px_25px_rgba(100,31,43,0.08)]"
                        : "border-[#E8D9D6] bg-[#FBF6F1]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleOrderSelection(order.id)}
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#E8D9D6] bg-white text-[#641F2B]"
                        title={isSelected ? "إلغاء تحديد الطلب" : "تحديد الطلب"}
                      >
                        {isSelected ? <FaCheckSquare /> : <FaSquare />}
                      </button>

                      <div className="min-w-0 flex-1">
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
                          <p className="mb-2 text-xs text-[#806D70]">
                            تاريخ الطلب
                          </p>

                          <p className="text-sm font-semibold text-[#4A1821]">
                            {order.createdAt?.toDate
                              ? order.createdAt
                                  .toDate()
                                  .toLocaleDateString("ar-SA")
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
                            {Object.entries(ORDER_STATUSES).map(
                              ([key, label]) => (
                                <option key={key} value={key}>
                                  {label}
                                </option>
                              ),
                            )}
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/orders/${order.id}`)
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#641F2B] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#4A1821]"
                            title="عرض الطلب"
                          >
                            <FaEye />
                            عرض
                          </button>
                        </div>
                      </div>
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
            <table className="w-full min-w-[1150px]">
              <thead>
                <tr className="border-y border-[#E8D9D6] bg-[#FBF6F1]">
                  <th className="w-14 px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#641F2B] transition hover:bg-[#F2E4E1]"
                      title={
                        allFilteredSelected ? "إلغاء تحديد الكل" : "تحديد الكل"
                      }
                    >
                      {allFilteredSelected ? <FaCheckSquare /> : <FaSquare />}
                    </button>
                  </th>

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
                    const isSelected = selectedOrders.includes(order.id);

                    return (
                      <tr
                        key={order.id}
                        className={`border-b border-[#E8D9D6] transition-colors ${
                          isSelected ? "bg-[#FDF5F3]" : "hover:bg-[#FBF6F1]"
                        }`}
                      >
                        <td className="px-4 py-5 text-center">
                          <button
                            type="button"
                            onClick={() => toggleOrderSelection(order.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#641F2B] transition hover:bg-[#F2E4E1]"
                            title={
                              isSelected ? "إلغاء تحديد الطلب" : "تحديد الطلب"
                            }
                          >
                            {isSelected ? <FaCheckSquare /> : <FaSquare />}
                          </button>
                        </td>

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
                    <td colSpan="8" className="px-6 py-16 text-center">
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
