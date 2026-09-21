
import { useEffect, useState } from "react";

import { WishlistContext } from "./wishlist-context-instance";

import { useStore } from "../hooks/useStore";

const WISHLIST_KEY = "sahra_wishlist";

function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// wishlistIds shape: [productId, productId, ...]
export function WishlistProvider({ children }) {
  const { products } = useStore();

  const [wishlistIds, setWishlistIds] = useState(loadWishlist);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  const toggleWishlist = (productId) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const removeFromWishlist = (productId) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  const wishlistItems = wishlistIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  const wishlistCount = wishlistItems.length;

  const value = {
    wishlistItems,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

