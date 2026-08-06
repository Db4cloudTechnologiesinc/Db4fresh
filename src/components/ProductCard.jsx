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
  // Handle stringified JSON
  if (p.images && typeof p.images === "string") {
    try {
      const parsed = JSON.parse(p.images);

      if (Array.isArray(parsed) && parsed.length > 0) {
        let url = parsed[0].url || "";

        if (!url) return "/placeholder.png";

        // Already full URL (Cloudinary / localhost)
        if (url.startsWith("http")) {
          return url;
        }

        // Relative path
        return `http://localhost:4000${url}`;
      }
    } catch (e) {
      console.error("Image parse error", e);
    }
  }

  // Handle array
  if (Array.isArray(p.images) && p.images.length > 0) {
    let url = p.images[0].url || "";

    if (!url) return "/placeholder.png";

    if (url.startsWith("http")) {
      return url;
    }

    return `http://localhost:4000${url}`;
  }

  // Handle image column
  if (p.image) {
    if (p.image.startsWith("http")) {
      return p.image;
    }

    return `http://localhost:4000${p.image.startsWith("/") ? "" : "/"}${p.image}`;
  }

  return "/placeholder.png";
};

export default function ProductCard({ p, subcategoryName }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((s) => s.wishlist.items);

  if (!p?.id) return null;

  const img = getImageUrl(p);

  const stock = Number(p.stock || 0);
  const price = Number(p.price || 0);
  const mrp = p.mrp || null;
  const variantLabel = p.variant_label || "";

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

  const mrpDiscount =
    mrp && mrp > price
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

  const finalDiscount = Math.max(mrpDiscount, expiryDiscount);

  const finalPrice =
    finalDiscount > 0
      ? Math.round(price - (price * finalDiscount) / 100)
      : price;

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

      <Link
        to={`/product/${p.id}`}
        state={{
          subcategoryName,
        }}
      >
        {p.buy_qty && p.free_qty && (
          <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            BUY {Number(p.buy_qty)} GET {Number(p.free_qty)}
          </div>
        )}

        <div className="relative h-[150px] flex items-center justify-center mb-2">

          {expiryDiscount > 0 && diffDays !== null && (
            <div className="absolute top-1 left-1 bg-red-100 text-red-600 text-[10px] px-2 py-[2px] rounded">
              {diffDays <= 1 ? "Expires Today" : `Expires in ${diffDays}d`}
            </div>
          )}

          {finalDiscount > 0 && (
            <div className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-[2px] rounded">
              {finalDiscount}% OFF
            </div>
          )}

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

      <h3 className="text-sm font-semibold mt-2 line-clamp-2">
        {p.name}
      </h3>

      {variantLabel && (
        <p className="text-xs text-gray-500 mt-[2px]">
          {variantLabel}
        </p>
      )}

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

      <div className="mt-auto">
        {stock > 0 ? (
          <AddToCartButton
            productId={p.id}
            name={p.name}
            price={finalPrice}
            image={img}
            variantId={p.variant_id}
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