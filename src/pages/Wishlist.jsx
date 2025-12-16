import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeWishlistItem } from "../features/wishlist/wishlistSlice";

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist.items);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">❤️ Your Wishlist</h2>

      {items.length === 0 && <p>No wishlist items yet.</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded-lg shadow">
            <img src={p.image} className="h-32 w-full object-cover rounded" />

            <h3 className="font-semibold mt-2">{p.name}</h3>
            <p className="text-red-600 font-bold">₹{p.price}</p>

            <button
              className="mt-2 bg-gray-300 px-3 py-1 rounded text-sm"
              onClick={() => dispatch(removeWishlistItem(p.id))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
