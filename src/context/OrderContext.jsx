import { useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../firebase/config";
import { OrderContext } from "./order-context-instance";

// عدّاد الطلبات: مستند واحد يحفظ آخر رقم طلب صادر، ونزيده بشكل
// آمن (transaction) حتى لو صار طلبين بنفس اللحظة بالضبط.
const counterRef = doc(db, "meta", "orderCounter");

async function getNextOrderNumber() {
  const nextValue = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);

    const current = snap.exists() ? Number(snap.data().value) || 1000 : 1000;

    const next = current + 1;

    transaction.set(counterRef, { value: next }, { merge: true });

    return next;
  });

  return `ORD-${nextValue}`;
}

// يطبّع رقم الطلب الذي يكتبه الزبون
function normalizeOrderNumber(input) {
  const trimmed = input.trim().toUpperCase();

  if (!trimmed) return "";

  return trimmed.startsWith("ORD-") ? trimmed : `ORD-${trimmed}`;
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [myOrderNumbers, setMyOrderNumbers] = useState(() => {
    try {
      const saved = localStorage.getItem("sahra_my_order_numbers");

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [myOrders, setMyOrders] = useState([]);
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);

  // القائمة الكاملة للطلبات: تفتح عند تسجيل دخول الأدمن فقط.
  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (!user) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }

      setOrdersLoading(true);

      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

      unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));

          setOrders(data);
          setOrdersLoading(false);
        },
        (error) => {
          console.error("Orders Firebase Error:", error);

          setOrdersLoading(false);
        },
      );
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sahra_my_order_numbers",
      JSON.stringify(myOrderNumbers),
    );
  }, [myOrderNumbers]);

  // جلب طلب واحد محدد بالرقم
  const fetchOrderByNumber = async (orderNumber) => {
    const normalized = normalizeOrderNumber(orderNumber);

    if (!normalized) return null;

    const snap = await getDoc(doc(db, "orders", normalized));

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    };
  };

  // تحميل طلباتي من هذا الجهاز
  useEffect(() => {
    let cancelled = false;

    async function loadMyOrders() {
      if (myOrderNumbers.length === 0) {
        setMyOrders([]);
        return;
      }

      setMyOrdersLoading(true);

      const results = await Promise.all(
        myOrderNumbers.map((number) =>
          fetchOrderByNumber(number).catch(() => null),
        ),
      );

      if (!cancelled) {
        setMyOrders(results.filter(Boolean));
        setMyOrdersLoading(false);
      }
    }

    loadMyOrders();

    return () => {
      cancelled = true;
    };
  }, [myOrderNumbers]);

  // إنشاء طلب
  const createOrder = async ({
    customer,
    items,
    subtotal,
    shipping,
    total,
  }) => {
    const orderNumber = await getNextOrderNumber();

    const newOrder = {
      orderNumber,

      date: new Date().toISOString(),

      status: "pending",

      history: [
        {
          status: "pending",
          date: new Date().toISOString(),
        },
      ],

      customer,
      items,

      subtotal,
      shipping,
      total,

      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "orders", orderNumber), newOrder);

    const savedOrder = {
      id: orderNumber,
      ...newOrder,
    };

    setMyOrderNumbers((prev) => [orderNumber, ...prev]);

    return savedOrder;
  };

  // تحديث حالة الطلب
  const updateOrderStatus = async (id, status) => {
    const order = orders.find((o) => o.id === id);

    if (!order) return;

    // خصم المخزون عند اكتمال الطلب
    if (status === "completed" && order.status !== "completed") {
      for (const item of order.items) {
        const productRef = doc(db, "products", item.id);

        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const product = productSnap.data();

          const currentStock = Number(product.stock || 0);

          const newStock = Math.max(0, currentStock - Number(item.quantity));

          await updateDoc(productRef, {
            stock: newStock,
            updatedAt: serverTimestamp(),
          });
        }
      }
    }

    const newHistory = [
      ...(order.history || []),
      {
        status,
        date: new Date().toISOString(),
      },
    ];

    await updateDoc(doc(db, "orders", id), {
      status,
      history: newHistory,
    });
  };

  // حذف طلب
  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));

    setOrders((prev) => prev.filter((order) => order.id !== id));

    setMyOrderNumbers((prev) =>
      prev.filter((number) => {
        const order = orders.find((o) => o.id === id);

        return number !== order?.orderNumber;
      }),
    );
  };

  // بحث الأدمن
  const getOrderByNumber = (orderNumber) =>
    orders.find((order) => order.orderNumber === orderNumber);

  const getOrderById = (id) => orders.find((order) => order.id === id);

  // بحث الزبون
  const findOrder = async (orderNumber, phone) => {
    const order = await fetchOrderByNumber(orderNumber);

    if (!order) return null;

    const cleanPhone = phone.trim().replace(/\s/g, "");

    const orderPhone = (order.customer?.phone || "").replace(/\s/g, "");

    if (orderPhone !== cleanPhone) {
      return null;
    }

    return order;
  };

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const value = {
    orders,
    ordersLoading,

    myOrders,
    myOrdersLoading,

    createOrder,
    updateOrderStatus,
    deleteOrder,

    getOrderByNumber,
    getOrderById,

    findOrder,
    fetchOrderByNumber,

    totalRevenue,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
