import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaCheck,
  FaMinus,
  FaPlus,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { trackEvent } from "../../lib/metaPixel";

function ProductActions({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const stock = Number(product?.stock || 0);
  const price = Number(product?.price || 0);

  const outOfStock = stock <= 0;
  const inWishlist = isInWishlist(product.id);

  const totalPrice = price * quantity;

  const decrease = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const increase = () => {
    if (outOfStock) return;

    setQuantity((currentQuantity) => Math.min(stock, currentQuantity + 1));
  };

  const trackAddToCart = () => {
    trackEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: totalPrice,
      currency: "SAR",
    });
  };

  const handleAddToCart = () => {
    if (outOfStock) return;

    addToCart(product, quantity);
    trackAddToCart();

    window.dispatchEvent(
      new CustomEvent("cart-animation", {
        detail: {
          quantity,
        },
      }),
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;

    addToCart(product, quantity);
    trackAddToCart();

    navigate("/checkout");
  };

  return (
    <div className="mt-8">
      <div className="rounded-3xl border border-[#E8D9D6] bg-white p-5 shadow-[0_10px_35px_rgba(100,31,43,0.06)] sm:p-6">
        {/* Quantity + Wishlist */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#4A1821]">الكمية</p>

            <p className="mt-1 text-xs text-[#806D70]">اختر الكمية المطلوبة</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                border
                transition-all
                duration-200
                active:scale-95
                ${
                  inWishlist
                    ? "border-[#641F2B] bg-[#641F2B] text-white"
                    : "border-[#E8D9D6] bg-[#FBF6F1] text-[#806D70] hover:border-[#A83F55] hover:text-[#A83F55]"
                }
              `}
              aria-label={inWishlist ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            >
              {inWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>

            {/* Quantity */}
            <div className="flex h-12 items-center overflow-hidden rounded-xl border border-[#E8D9D6] bg-[#FBF6F1]">
              <button
                type="button"
                onClick={decrease}
                disabled={outOfStock || quantity <= 1}
                className="
                  flex
                  h-12
                  w-10
                  items-center
                  justify-center
                  text-[#641F2B]
                  transition
                  hover:bg-[#F2E4E1]
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                aria-label="تقليل الكمية"
              >
                <FaMinus className="text-xs" />
              </button>

              <span className="flex h-12 min-w-[42px] items-center justify-center border-x border-[#E8D9D6] text-sm font-bold text-[#4A1821]">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increase}
                disabled={outOfStock || quantity >= stock}
                className="
                  flex
                  h-12
                  w-10
                  items-center
                  justify-center
                  text-[#641F2B]
                  transition
                  hover:bg-[#F2E4E1]
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                aria-label="زيادة الكمية"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 flex items-end justify-between border-t border-[#F0E6E3] pt-5">
          <span className="text-sm text-[#806D70]">الإجمالي</span>

          <div className="text-right">
            <span className="text-2xl font-black text-[#641F2B]">
              {totalPrice} ر.س
            </span>
          </div>
        </div>

        {/* Main Actions */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="
              flex
              h-14
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#641F2B]
              text-sm
              font-bold
              text-white
              shadow-[0_8px_20px_rgba(100,31,43,0.16)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#4A1821]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            اشترِ الآن
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`
              flex
              h-14
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              text-sm
              font-bold
              transition-all
              duration-200
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50

              ${
                added
                  ? "border-[#641F2B] bg-[#641F2B] text-white"
                  : "border-[#E8D9D6] bg-[#FBF6F1] text-[#641F2B] hover:border-[#A83F55] hover:bg-[#F2E4E1]"
              }
            `}
          >
            {added ? (
              <>
                <FaCheck />
                تمت الإضافة
              </>
            ) : (
              <>
                <FaShoppingCart />
                أضف للسلة
              </>
            )}
          </button>
        </div>

        {/* Stock */}
        {!outOfStock && stock <= 5 && (
          <div className="mt-4 text-center text-xs font-semibold text-[#8F3046]">
            متبقي فقط {stock} {stock === 1 ? "قطعة" : "قطع"}
          </div>
        )}

        {outOfStock && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-600">
            المنتج غير متوفر حالياً
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductActions;
