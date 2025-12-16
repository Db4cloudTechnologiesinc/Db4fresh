
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [qty, setQty] = useState(1);

  // 🔥 Variant state
  const [selectedVariant, setSelectedVariant] = useState(null);

  const touchStartX = useRef(0);

  // Normalize images
  const images =
    product?.images?.map((img) =>
      typeof img === "string" ? img : img.url
    ) || [];

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);

        // Set main image
        const firstImg =
          data.images?.length > 0
            ? typeof data.images[0] === "string"
              ? data.images[0]
              : data.images[0].url
            : data.image || "/placeholder.png";

        setMainImage(firstImg);
        setCurrentIndex(0);

        // ✅ Select lowest price variant by default
        if (data.variants?.length > 0) {
          const lowest = data.variants.reduce((min, v) =>
            v.price < min.price ? v : min
          );
          setSelectedVariant(lowest);
        }
      });
  }, [id]);

  const nextImage = () => {
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);
    setMainImage(images[next]);
    setZoom(1);
  };

  const prevImage = () => {
    const prev = (currentIndex - 1 + images.length) % images.length;
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

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT SIDE */}
        <div className="flex gap-4">

          {/* DESKTOP THUMBNAILS */}
          <div className="hidden md:flex flex-col gap-3 max-h-[420px] overflow-y-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => {
                  setMainImage(img);
                  setCurrentIndex(index);
                }}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2
                  ${
                    currentIndex === index
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                alt=""
              />
            ))}
          </div>

          {/* IMAGE */}
          <div className="flex-1 space-y-4">
            <div
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
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

            {/* QTY + ADD TO CART */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2"
                >
                  −
                </button>
                <span className="px-4 py-2 font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2"
                >
                  +
                </button>
              </div>

              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      productId: product.id || product._id,
                      name: product.name,
                      variantId: selectedVariant?.id,
                      variantLabel: selectedVariant?.label,
                      price: selectedVariant?.price,
                      image: mainImage,
                      qty,
                    })
                  )
                }
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-gray-500">{product.category}</p>

          {/* ✅ ZEPTO STYLE PRICE */}
          {selectedVariant && (
            <div className="text-3xl font-bold text-green-600">
              ₹{selectedVariant.price}
              <span className="text-sm text-gray-500 ml-2">
                / {selectedVariant.label}
              </span>
            </div>
          )}

          {/* ✅ VARIANT SELECTOR */}
          {product.variants?.length > 0 && (
            <div>
              <p className="font-medium mb-2">Select Variant</p>
              <div className="flex gap-3 flex-wrap">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg border text-sm
                      ${
                        selectedVariant?.id === v.id
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-300"
                      }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <hr />

          <p className="text-gray-600">
            {product.description || "No description available."}
          </p>
        </div>
      </div>

      {/* FULLSCREEN IMAGE */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-between p-4 text-white">
            <div className="flex gap-3">
              <button onClick={() => setZoom((z) => Math.min(z + 0.3, 3))}>
                <FiPlus size={22} />
              </button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.3, 1))}>
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
