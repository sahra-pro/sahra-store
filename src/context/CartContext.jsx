
import { useEffect, useState } from "react";

import { CartContext } from "./cart-context-instance";
import { useStore } from "../hooks/useStore";

const CART_KEY = "sahra_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// cartLines shape: [{ productId, quantity }]
export function CartProvider({ children }) {
  const { products } = useStore();

  const [cartLines, setCartLines] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartLines));
  }, [cartLines]);

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) return;

    const requestedQuantity = Math.max(1, Number(quantity) || 1);

    window.dispatchEvent(
      new CustomEvent("cart-animation", {
        detail: {
          quantity: requestedQuantity,
        },
      }),
    );

    setCartLines((prev) => {
      const existing = prev.find((line) => line.productId === product.id);

      if (existing) {
        return prev.map((line) =>
          line.productId === product.id
            ? {
                ...line,
                quantity: Number(line.quantity || 0) + requestedQuantity,
              }
            : line,
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          quantity: requestedQuantity,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartLines((prev) => prev.filter((line) => line.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const newQuantity = Number(quantity) || 0;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartLines((prev) =>
      prev.map((line) =>
        line.productId === productId
          ? {
              ...line,
              quantity: newQuantity,
            }
          : line,
      ),
    );
  };

  const clearCart = () => {
    setCartLines([]);
  };

  // ربط عناصر السلة ببيانات المنتجات الحالية
  // وإزالة العناصر التي لم تعد موجودة في Firebase
  const cartItems = cartLines
    .map((line) => {
      const product = products.find((item) => item.id === line.productId);

      if (!product) return null;

      return {
        ...product,
        quantity: Number(line.quantity || 1),
      };
    })
    .filter(Boolean);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  const cartTotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

