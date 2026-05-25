
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
  // ✅ HANDLE STRINGIFIED JSON (YOUR CASE)
  if (p.images && typeof p.images === "string") {
    try {
      const parsed = JSON.parse(p.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0].url; // ✅ Cloudinary URL
      }
    } catch (e) {
      console.error("Image parse error", e);
    }
  }

  // ✅ HANDLE NORMAL ARRAY
  if (Array.isArray(p.images) && p.images.length > 0) {
    const img = p.images[0];
    if (img.url) return img.url;
  }

  // ✅ FALLBACK (LOCAL IMAGE)
  if (p.image) {
    return `http://localhost:4000${p.image.startsWith("/") ? "" : "/"}${p.image}`;
  }

  return "/placeholder.png";
};
export default function ProductCard({ p , subcategoryName}) {
  const dispatch = useDispatch();
  const wishlist = useSelector((s) => s.wishlist.items);

  if (!p?.id) return null;

  const img = getImageUrl(p);
  const stock = Number(p.stock || 0);
  const price = Number(p.price || 0);
  const mrp = p.mrp || null;
  const variantLabel = p.variant_label || "";

  /* ================= COMBINED LOGIC ================= */

  const today = new Date();
  const expiry = p.expiry_date ? new Date(p.expiry_date) : null;

  let diffDays = null;
  let expiryDiscount = 0;

  if (expiry) {
    const diffTime = expiry - today;
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) expiryDiscount = 60;
    else if (diffDays <= 2) expiryDiscount = 50;
    else if (diffDays <= 3) expiryDiscount = 30;
  }

  // ✅ Existing MRP discount (KEEP THIS)
  const mrpDiscount =
    mrp && mrp > price
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

  // ✅ Final discount (take best)
  const finalDiscount = Math.max(mrpDiscount, expiryDiscount);

  // ✅ Final price
  const finalPrice =
    finalDiscount > 0
      ? Math.round(price - (price * finalDiscount) / 100)
      : price;

  /* ================= WISHLIST ================= */

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
          price: finalPrice,
          image: img,
          variantLabel,
        })
      );
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow hover:shadow-md transition p-3 w-[200px]">

      {/* IMAGE */}
      <Link
  to={`/product/${p.id}`}
  state={{
    subcategoryName,
  }}
>
        <div className="relative h-[150px] flex items-center justify-center mb-2">

          {/* 🔴 Expiry Badge */}
          {expiryDiscount > 0 && diffDays !== null && (
            <div className="absolute top-1 left-1 bg-red-100 text-red-600 text-[10px] px-2 py-[2px] rounded">
              {diffDays <= 1 ? "Expires Today" : `Expires in ${diffDays}d`}
            </div>
          )}

          {/* 🔵 Discount Badge */}
          {finalDiscount > 0 && (
            <div className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-[2px] rounded">
              {finalDiscount}% OFF
            </div>
          )}

          {/* 🧡 Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 left-2 bg-white rounded-full p-1 shadow"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500" size={14} />
            ) : (
              <FaRegHeart className="text-gray-400" size={14} />
            )}
          </button>

          <img
            src={img}
            alt={p.name}
            className="max-h-full object-contain hover:scale-105 transition"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />
        </div>
      </Link>

      {/* NAME */}
      <h3 className="text-sm font-semibold mt-2 line-clamp-2">
        {p.name}
      </h3>

      {/* VARIANT */}
      {variantLabel && (
        <p className="text-xs text-gray-500 mt-[2px]">
          {variantLabel}
        </p>
      )}

      {/* PRICE */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-lg font-bold text-black">
          ₹{finalPrice}
        </span>

        {finalDiscount > 0 && (
          <span className="text-sm text-gray-400 line-through">
            ₹{price}
          </span>
        )}

      </div>

      {/* ADD TO CART */}
      <div className="mt-auto">
        {stock > 0 ? (
          <AddToCartButton
            productId={p.id}
            name={p.name}
            price={finalPrice}
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