import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

import { db } from "../firebase/config";

export function useReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let q;

        if (productId) {
          q = query(
            collection(db, "reviews"),
            where("productId", "==", productId),
            where("approved", "==", true),
            orderBy("createdAt", "desc"),
          );
        } else {
          q = query(
            collection(db, "reviews"),
            where("approved", "==", true),
            orderBy("createdAt", "desc"),
          );
        }

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(data);
      } catch (error) {
        console.error("Reviews error:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return {
    reviews,
    loading,
    averageRating,
  };
}
