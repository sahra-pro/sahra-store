import { useEffect, useMemo, useState } from "react";
import { WishlistContext } from "./WishlistContext";

const STORAGE_KEY = "sahra_wishlist";

function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem(STORAGE_KEY);

      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Wishlist loading error:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Wishlist saving error:", error);
    }
  }, [wishlistItems]);

  const wishlistCount = wishlistItems.length;

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const addToWishlist = (product) => {
    if (!product?.id) {
      return;
    }

    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some((item) => item.id === product.id);

      if (alreadyExists) {
        return currentItems;
      }

      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  };

  const toggleWishlist = (product) => {
    if (!product?.id) {
      return;
    }

    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some((item) => item.id === product.id);

      if (alreadyExists) {
        return currentItems.filter((item) => item.id !== product.id);
      }

      return [...currentItems, product];
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [wishlistItems, wishlistCount],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
