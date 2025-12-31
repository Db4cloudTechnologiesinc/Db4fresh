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

  /* ➕ STEPPER (ITEM EXISTS IN CART) */
  if (cartItem) {
    return (
      <div className="flex items-center border rounded-lg overflow-hidden">
        <button
          onClick={() =>
            cartItem.qty === 1
              ? dispatch(
                  removeFromCart({ productId, variantId })
                )
              : dispatch(
                  decreaseQty({ productId, variantId })
                )
          }
          className="px-2 py-1 bg-gray-100"
        >
          −
        </button>

        <span className="px-3 text-sm font-semibold">
          {cartItem.qty}
        </span>

        <button
          onClick={() =>
            dispatch(
              increaseQty({ productId, variantId })
            )
          }
          disabled={cartItem.qty >= stock}
          className={`px-2 py-1 ${
            cartItem.qty >= stock
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-100"
          }`}
        >
          +
        </button>
      </div>
    );
  }

  /* 🟢 ADD BUTTON (NOT IN CART) */
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
      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
    >
      ADD
    </button>
  );
}
