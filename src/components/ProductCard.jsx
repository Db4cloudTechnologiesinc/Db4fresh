
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

  const defaultVariant =
    Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants[0]
      : null;

  const price = defaultVariant?.price || p.price || 0;
  const mrp = defaultVariant?.mrp || p.mrp;
  const stock = defaultVariant?.stock ?? Number(p.stock) ?? 0;
  const variantLabel = defaultVariant?.variant_label || "";

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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">

      {/* IMAGE SECTION */}
      <Link to={`/product/${p.id}`}>
        <div className="relative w-full h-[200px] bg-white overflow-hidden">

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 left-2 bg-white rounded-full p-1 shadow z-10"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-600" size={14} />
            ) : (
              <FaRegHeart className="text-gray-400" size={14} />
            )}
          </button>

          {/* Product Image */}
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            className="w-full h-full object-cover block"
          />
        </div>
      </Link>

      {/* DETAILS */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="bg-green-700 text-white text-sm font-bold px-4 py-[2px] rounded-md">
              ₹{price}
            </span>
            {mrp && mrp > price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{mrp}
              </span>
            )}
          </div>

          {stock > 0 && (
            <AddToCartButton
              productId={p.id}
              name={p.name}
              price={price}
              image={img}
              variantId={defaultVariant?.id}
              variantLabel={variantLabel}
              stock={stock}
              small
            />
          )}
        </div>

        {mrp && mrp > price && (
          <p className="text-xs text-green-700 font-semibold mt-0.5">
            ₹{mrp - price} OFF
          </p>
        )}

        <h3 className="text-base font-semibold mt-3 line-clamp-2">
          {p.name}
        </h3>

        {variantLabel && (
          <p className="text-xs text-gray-500">
            {variantLabel}
          </p>
        )}

        <div className="mt-1 text-xs">
          {stock <= 0 ? (
            <span className="text-red-500 font-semibold">
              Out of Stock
            </span>
          ) : (
            <span className="text-gray-600">
              Delivery in 30mins
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

