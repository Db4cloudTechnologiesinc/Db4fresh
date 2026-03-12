import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { FaHeart, FaRegHeart, FaShareAlt, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";
import AddToCartButton from "../components/AddToCartButton";
import ReviewsSection from "../components/ReviewSection";
import SimilarProducts from "../components/SimilarProducts";
import SuggestedProducts from "../components/SuggestedProducts";


export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const wishlist = useSelector((s) => s.wishlist.items);
  const touchStartX = useRef(0);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);

        const imgs =
          data.images?.map((img) =>
            typeof img === "string" ? img : img.url
          ) || [];

        setImages(imgs);
        setMainImage(imgs[0] || "/placeholder.png");
        setCurrentIndex(0);

        if (data.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      });
  }, [id]);

  if (!product) return null;
const price = selectedVariant?.price ?? product.price ?? 0;
const mrp = selectedVariant?.mrp ?? product.mrp ?? null;

const discount =
  mrp && mrp > price
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;
  const isWishlisted = wishlist.some(
    (i) => i.productId === product.id
  );

  /* ================= IMAGE NAV ================= */
  const nextImage = () => {
    if (!images.length) return;
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);
    setMainImage(images[next]);
    setZoom(1);
  };

  const prevImage = () => {
    if (!images.length) return;
    const prev =
      (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prev);
    setMainImage(images[prev]);
    setZoom(1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    if (touchStartX.current - endX > 50) nextImage();
    if (endX - touchStartX.current > 50) prevImage();
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT IMAGE SECTION */}
        <div className="flex gap-4">

          {/* THUMBNAILS */}
          <div className="hidden md:flex flex-col gap-3 max-h-[420px] overflow-y-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => {
                  setMainImage(img);
                  setCurrentIndex(index);
                }}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${
                  currentIndex === index
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                alt=""
              />
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div className="flex-1">
            {/* <div
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            > */}
            <div
  className="relative"
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>

  {/* DISCOUNT BADGE */}
  {discount > 0 && (
    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded z-10">
      {discount}% OFF
    </div>
  )}
              {/* ❤️ + 🔗 ON IMAGE */}
              <div className="absolute top-4 right-4 flex gap-3 z-10">

                {/* SHARE */}
                <button
                  onClick={() =>
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    })
                  }
                  className="bg-white p-2 rounded-full shadow"
                >
                  <FaShareAlt size={16} />
                </button>

                {/* WISHLIST */}
                <button
                  onClick={() =>
                    dispatch(
                      isWishlisted
                        ? removeFromWishlist(product.id)
                        : addToWishlist({
                            productId: product.id,
                            name: product.name,
                            price:
                              selectedVariant?.price ??
                              product.price,
                            image: mainImage,
                            variantLabel:
                              selectedVariant?.variant_label,
                          })
                    )
                  }
                  className="bg-white p-2 rounded-full shadow"
                >
                  {isWishlisted ? (
                    <FaHeart
                      className="text-red-600"
                      size={16}
                    />
                  ) : (
                    <FaRegHeart
                      className="text-gray-400"
                      size={16}
                    />
                  )}
                </button>
              </div>

              <img
                src={mainImage}
                alt={product.name}
                onClick={() => setFullscreen(true)}
                className="w-full h-[420px] object-cover rounded-2xl shadow cursor-zoom-in"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                  >
                    <FiChevronLeft size={22} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                  >
                    <FiChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT DETAILS SECTION */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4 sticky top-24 h-fit">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          {product.brand && (
  <p className="text-gray-500">
    Brand: <span className="font-medium">{product.brand}</span>
  </p>
)}

          {/* RATING */}
          <div className="flex items-center gap-2">
            <FaStar className="text-green-600" />
            <span className="font-medium">
              {product.avgRating || "4.2"}
            </span>
            <span className="text-gray-500 text-sm">
              ({product.totalReviews || 0} reviews)
            </span>
          </div>

          {/* PRICE */}
        
          {/* <div className="flex items-center gap-3 text-3xl font-bold">

  <span className="text-green-600">
    ₹{price}
  </span>

  {mrp && mrp > price && (
    <span className="text-gray-400 line-through text-xl">
      ₹{mrp}
    </span>
  )}

</div>

{mrp && mrp > price && (
  <p className="text-green-600 text-sm font-medium">
    You save ₹{mrp - price}
  </p>
)} */}
<div className="flex items-center gap-3 mt-2">

  <span className="text-3xl font-bold text-green-600">
    ₹{price}
  </span>

  {mrp && mrp > price && (
    <>
      <span className="text-xl text-gray-400 line-through">
        ₹{mrp}
      </span>

      <span className="text-green-600 text-sm font-semibold">
        {discount}% OFF
      </span>
    </>
  )}

</div>

{mrp && mrp > price && (
  <p className="text-green-600 text-sm">
    You save ₹{mrp - price}
  </p>
)}

          <p className="text-gray-600">
            {product.description}
          </p>
          {/* VARIANT SELECTOR */}
{product.variants?.length > 0 && (
  <div>
    <p className="font-medium mb-2">Select Quantity</p>
    <div className="flex gap-3 flex-wrap">
      {product.variants.map((v) => (
        <button
          key={v.id}
          onClick={() => setSelectedVariant(v)}
          className={`px-4 py-2 rounded-lg border text-sm transition ${
            selectedVariant?.id === v.id
              ? "border-red-600 bg-red-50 text-red-600"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          {v.variant_label}
        </button>
      ))}
    </div>
  </div>
)}

          {/* HIGHLIGHTS */}
          {product.highlights && (
            <div>
              <h3 className="font-semibold mb-2">
                Highlights
              </h3>
              <ul className="list-disc pl-5 text-sm">
                {product.highlights
                  .split("|")
                  .map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
              </ul>
            </div>
          )}

          {/* SELLER */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="font-medium">
              Sold by {product.seller_name}
            </p>
            <p className="text-sm text-gray-500">
              {product.seller_location}
            </p>
          </div>

          {/* RETURN POLICY */}
          <p className="text-sm text-gray-600">
            Return Policy: {product.return_policy}
          </p>

          {/* ADD TO CART */}
        
           <AddToCartButton
  productId={product.id}
  variantId={selectedVariant?.id ?? "default"}
  name={product.name}
  price={selectedVariant?.price ?? product.price}
  image={mainImage}
  variantLabel={selectedVariant?.variant_label}
  stock={selectedVariant?.stock ?? product.stock}
/> 

        </div>
      </div>

      {/* OTHER SECTIONS */}
      <SimilarProducts productId={product.id} />
      <SuggestedProducts productId={product.id} />
      <ReviewsSection productId={product.id} />

      {/* FULLSCREEN IMAGE */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-between p-4 text-white">
            <div className="flex gap-3">
              <button onClick={() => setZoom(z => Math.min(z + 0.3, 3))}>
                <FiPlus size={22} />
              </button>
              <button onClick={() => setZoom(z => Math.max(z - 0.3, 1))}>
                <FiMinus size={22} />
              </button>
            </div>
            <button onClick={() => setFullscreen(false)}>
              <FiX size={26} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <img
              src={mainImage}
              alt=""
              style={{ transform: `scale(${zoom})` }}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
