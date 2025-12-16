// import React from "react";
// import { Link } from "react-router-dom";
// import { FaHeart } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { addWishlistItem } from "../features/wishlist/wishlistSlice";

// /**
//  * ✅ SAFELY EXTRACT IMAGE URL
//  * Handles:
//  * - images as array of strings
//  * - images as array of objects { url }
//  * - images as JSON string
//  * - old `image` field
//  */
// const getImageUrl = (product) => {
//   // Case 1: images is array
//   if (Array.isArray(product.images) && product.images.length > 0) {
//     const img = product.images[0];
//     if (typeof img === "string") return img;
//     if (typeof img === "object" && img?.url) return img.url;
//   }

//   // Case 2: images is JSON string
//   if (typeof product.images === "string") {
//     try {
//       const parsed = JSON.parse(product.images);
//       if (Array.isArray(parsed) && parsed.length > 0) {
//         const img = parsed[0];
//         if (typeof img === "string") return img;
//         if (typeof img === "object" && img?.url) return img.url;
//       }
//     } catch (e) {}
//   }

//   // Case 3: fallback old image field
//   if (product.image) return product.image;

//   // Final fallback
//   return "/placeholder.png";
// };

// export default function ProductCard({ p }) {
//   const dispatch = useDispatch();
//   const productId = p.id || p._id;

//   const img = getImageUrl(p);

//   return (
//     <div className="bg-white rounded-lg shadow hover:shadow-lg transition relative">
//       {/* Wishlist */}
//       <button
//         onClick={() => dispatch(addWishlistItem(productId))}
//         className="absolute right-2 top-2 bg-white p-2 rounded-full shadow z-10"
//       >
//         <FaHeart className="text-red-600" size={16} />
//       </button>

//       {/* Product */}
//       <Link to={`/product/${productId}`}>
//         <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
//           <img
//             src={img}
//             alt={p.name}
//             onError={(e) => (e.target.src = "/placeholder.png")}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         <div className="p-3">
//           <h3 className="text-sm font-semibold line-clamp-2">
//             {p.name}
//           </h3>

//           <div className="mt-2 text-red-600 font-bold">
//             ₹{p.price || p.variants?.[0]?.price || "—"}
//           </div>
//         </div>
//       </Link>

//       <div className="px-3 pb-3">
//         <button className="w-full bg-red-600 text-white py-2 rounded">
//           Add
//         </button>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

/**
 * SAFELY GET IMAGE
 * supports:
 * - images: string[]
 * - images: [{ url }]
 * - old image field
 */
const getImageUrl = (product) => {
  if (Array.isArray(product.images) && product.images.length > 0) {
    const img = product.images[0];
    if (typeof img === "string") return img;
    if (img?.url) return img.url;
  }
  return product.image || "/placeholder.png";
};

export default function ProductCard({ p }) {
  const dispatch = useDispatch();
  const productId = p.id || p._id;

  const img = getImageUrl(p);
  const price = p.variants?.[0]?.price || p.price || "—";

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">

      {/* PRODUCT CLICK */}
      <Link to={`/product/${productId}`}>
        <div className="w-full h-44 bg-gray-100 overflow-hidden">
          <img
            src={img}
            alt={p.name}
            onError={(e) => (e.target.src = "/placeholder.png")}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-3">
          <h3 className="text-sm font-semibold line-clamp-2">
            {p.name}
          </h3>

          <div className="mt-1 text-red-600 font-bold">
            ₹{price}
          </div>
        </div>
      </Link>

      {/* ADD TO CART */}
      <div className="px-3 pb-3">
        <button
          onClick={() =>
            dispatch(
              addToCart({
                productId,
                name: p.name,
                price,
                image: img,
              })
            )
          }
          className="w-full bg-red-600 text-white py-2 rounded text-sm"
        >
          Add
        </button>
      </div>

    </div>
  );
}
