import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

export default function FloatingCart() {
  const navigate = useNavigate();

  // get cart items from redux
  const items = useSelector((state) => state.cart.items);

  // total quantity (not just unique items)
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  // hide if cart empty
  if (totalQty === 0) return null;

  return (
    <button
      onClick={() => navigate("/cart")}
      className="fixed bottom-20 right-4 z-50
                 bg-red-600 hover:bg-red-700
                 text-white rounded-full
                 w-14 h-14 flex items-center justify-center
                 shadow-lg transition"
    >
      {/* CART ICON */}
      <FiShoppingCart size={22} />

      {/* COUNT BADGE */}
      <span
        className="absolute -top-1 -right-1
                   bg-white text-red-600
                   text-xs font-bold
                   w-5 h-5 rounded-full
                   flex items-center justify-center"
      >
        {totalQty}
      </span>
    </button>
  );
}
