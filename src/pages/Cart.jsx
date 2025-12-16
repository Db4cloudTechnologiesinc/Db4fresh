import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../features/cart/cartSlice";
import { Link } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link
          to="/"
          className="bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* LEFT – CART ITEMS */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-semibold mb-4">My Cart</h2>

        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 bg-white rounded-xl shadow p-4"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />

            {/* INFO */}
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-green-600 font-bold mt-1">
                ₹{item.price}
              </p>

              {/* QTY CONTROLS */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => dispatch(decreaseQty(item.productId))}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  −
                </button>

                <span className="font-semibold">{item.qty}</span>

                <button
                  onClick={() => dispatch(increaseQty(item.productId))}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* REMOVE */}
            <button
              onClick={() => dispatch(removeFromCart(item.productId))}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT – SUMMARY */}
      <div className="bg-white rounded-xl shadow p-6 h-fit">
        <h3 className="text-lg font-semibold mb-4">Price Details</h3>

        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Delivery</span>
          <span className="text-green-600">Free</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{subtotal}</span>
        </div>

        {/* <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-lg font-semibold">
          
          Proceed to Checkout
        </button> */}
        <Link
  to="/checkout"
  className="block text-center w-full mt-6 bg-red-600 text-white py-3 rounded-xl text-lg font-semibold"
>
  Proceed to Checkout
</Link>
      </div>
    </div>
  );
}
