import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../features/cart/cartSlice";

export default function AddToCartButton({
  productId,
  variantId,
  name,
  price,
  image,
  variantLabel,
  stock = 0,
}) {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);

  const cartItem = cartItems.find(
    (i) =>
      i.productId === productId &&
      i.variantId === variantId
  );

  /* ❌ OUT OF STOCK */
  if (stock === 0) {
    return (
      <span className="text-xs text-red-600 font-semibold">
        Out of Stock
      </span>
    );
  }

  /* 🟢 STEP CONTROLLER (Blinkit Style) */
  if (cartItem) {
    return (
      <div className="flex items-center justify-between border border-red-600 rounded-lg w-[90px] h-[34px] bg-white">

        {/* MINUS */}
        <button
          onClick={() =>
            cartItem.qty === 1
              ? dispatch(removeFromCart({ productId, variantId }))
              : dispatch(decreaseQty({ productId, variantId }))
          }
          className="flex-1 text-red-700 text-lg font-bold"
        >
          −
        </button>

        {/* QUANTITY */}
        <span className="flex-1 text-center text-sm font-semibold">
          {cartItem.qty}
        </span>

        {/* PLUS */}
        <button
          onClick={() =>
            dispatch(increaseQty({ productId, variantId }))
          }
          disabled={cartItem.qty >= stock}
          className={`flex-1 text-lg font-bold ${
            cartItem.qty >= stock
              ? "text-gray-400"
              : "text-red-700"
          }`}
        >
          +
        </button>

      </div>
    );
  }

  /* 🟢 ADD BUTTON */
  return (
    <button
      onClick={() =>
        dispatch(
          addToCart({
            productId,
            variantId,
            name,
            price,
            image,
            variantLabel,
            stock,
            qty: 1,
          })
        )
      }
      className="w-[90px] h-[34px] border border-red-600 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition"
    >
      ADD
    </button>
  );
}