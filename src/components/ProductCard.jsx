
// import React from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addToWishlist,
//   removeFromWishlist,
// } from "../features/wishlist/wishlistSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import AddToCartButton from "./AddToCartButton";

// /* IMAGE HELPER */
// const getImageUrl = (p) => {
//   if (Array.isArray(p.images) && p.images.length > 0) {
//     const img = p.images[0];
//     if (typeof img === "string") return img;
//     if (typeof img === "object" && img.url) return img.url;
//   }
//   return "/placeholder.png";
// };

// export default function ProductCard({ p }) {
//   const dispatch = useDispatch();
//   const wishlist = useSelector((s) => s.wishlist.items);

//   if (!p?.id) return null;

//   const img = getImageUrl(p);

//   /* STOCK */
//   const stock = Number(p.stock || 0);

//   /* PRICE + MRP + QUANTITY */
//   const price = Number(p.price || 0);
//   const mrp = p.mrp ;
//   const variantLabel = p.variant_label || "";

//   /* WISHLIST CHECK */
//   const isWishlisted = wishlist.some(
//     (i) => i.productId === p.id
//   );

//   const handleWishlist = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (isWishlisted) {
//       dispatch(removeFromWishlist(p.id));
//     } else {
//       dispatch(
//         addToWishlist({
//           productId: p.id,
//           name: p.name,
//           price,
//           image: img,
//           variantLabel,
//         })
//       );
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow hover:shadow-md transition p-3 w-[200px]">

//       {/* IMAGE */}
//       <Link to={`/product/${p.id}`}>
//         <div className="relative h-[140px] flex items-center justify-center">

//           {/* Wishlist */}
//           <button
//             onClick={handleWishlist}
//             className="absolute top-1 left-1 bg-white rounded-full p-1 shadow"
//           >
//             {isWishlisted ? (
//               <FaHeart className="text-red-600" size={14} />
//             ) : (
//               <FaRegHeart className="text-gray-400" size={14} />
//             )}
//           </button>

//           <img
//             src={img}
//             alt={p.name}
//             className="max-h-full object-contain"
//             onError={(e) => (e.currentTarget.src = "/placeholder.png")}
//           />
//         </div>
//       </Link>

//       {/* PRODUCT NAME */}
//       <h3 className="text-sm font-semibold mt-2 line-clamp-2">
//         {p.name}
//       </h3>

//       {/* QUANTITY */}
//       {variantLabel && (
//         <p className="text-xs text-gray-500">{variantLabel}</p>
//       )}

//       {/* PRICE */}
//       <div className="flex items-center gap-2 mt-1">
//         <span className="text-lg font-bold text-black">
//           ₹{price}
//         </span>

//         {mrp && mrp > price && (
//           <span className="text-sm text-gray-400 line-through">
//             ₹{mrp}
//           </span>
//         )}
//       </div>

//       {/* ADD BUTTON */}
//       <div className="mt-3">
//         {stock > 0 ? (
//           <AddToCartButton
//             productId={p.id}
//             name={p.name}
//             price={price}
//             image={img}
//             variantId={null}
//             variantLabel={variantLabel}
//             stock={stock}
//           />
//         ) : (
//           <span className="text-xs text-red-500 font-semibold">
//             Out of Stock
//           </span>
//         )}
//       </div>

//     </div>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import AddToCartButton from "./AddToCartButton";

/* IMAGE HELPER */
const getImageUrl = (p) => {
  if (Array.isArray(p.images) && p.images.length > 0) {
    const img = p.images[0];
    if (typeof img === "string") return img;
    if (typeof img === "object" && img.url) return img.url;
  }
  return "/placeholder.png";
};

export default function ProductCard({ p }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((s) => s.wishlist.items);

  if (!p?.id) return null;

  const img = getImageUrl(p);

  const stock = Number(p.stock || 0);

  const price = Number(p.price || 0);
  const mrp = p.mrp || null;
  const variantLabel = p.variant_label || "";

  /* DISCOUNT CALCULATION */
  const discount =
    mrp && mrp > price
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

  const isWishlisted = wishlist.some(
    (i) => i.productId === p.id
  );

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(p.id));
    } else {
      dispatch(
        addToWishlist({
          productId: p.id,
          name: p.name,
          price,
          image: img,
          variantLabel,
        })
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-3 w-[200px]">

      {/* IMAGE */}
      <Link to={`/product/${p.id}`}>
        <div className="relative h-[140px] flex items-center justify-center">

          {/* DISCOUNT BADGE (TOP RIGHT) */}
          {discount > 0 && (
            <div className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-[2px] rounded">
              {discount}% OFF
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-1 left-1 bg-white rounded-full p-1 shadow"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-600" size={14} />
            ) : (
              <FaRegHeart className="text-gray-400" size={14} />
            )}
          </button>

          <img
            src={img}
            alt={p.name}
            className="max-h-full object-contain"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />
        </div>
      </Link>

      {/* PRODUCT NAME */}
      <h3 className="text-sm font-semibold mt-2 line-clamp-2">
        {p.name}
      </h3>

      {/* QUANTITY */}
      {variantLabel && (
        <p className="text-xs text-gray-500">{variantLabel}</p>
      )}

      {/* PRICE */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-lg font-bold text-black">
          ₹{price}
        </span>

        {mrp && mrp > price && (
          <span className="text-sm text-gray-400 line-through">
            ₹{mrp}
          </span>
        )}
      </div>

      {/* ADD BUTTON */}
      <div className="mt-3">
        {stock > 0 ? (
          <AddToCartButton
            productId={p.id}
            name={p.name}
            price={price}
            image={img}
            variantId={null}
            variantLabel={variantLabel}
            stock={stock}
          />
        ) : (
          <span className="text-xs text-red-500 font-semibold">
            Out of Stock
          </span>
        )}
      </div>

    </div>
  );
}