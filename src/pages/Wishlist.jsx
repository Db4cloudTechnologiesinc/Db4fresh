import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist.items);

  if (items.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Your wishlist is empty ❤️
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">My Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p.productId} className="bg-white p-3 rounded-xl shadow">
            <Link to={`/product/${p.productId}`}>
              <img
                src={p.image}
                alt={p.name}
                className="h-32 w-full object-cover rounded"
              />
              <p className="mt-2 font-semibold">{p.name}</p>
              <p className="text-red-600">₹{p.price}</p>
            </Link>

            <button
              onClick={() =>
                dispatch(removeFromWishlist(p.productId))
              }
              className="mt-2 w-full text-sm bg-gray-100 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
