import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";


/**
 * ✅ SAFELY GET IMAGE FOR HOME PAGE
 * Priority:
 * 1. p.image (single image sent by backend)
 * 2. p.images[0] (multiple images)
 * 3. placeholder
 */
const getHomeImage = (p) => {
  if (p.image) return p.image;

  if (Array.isArray(p.images) && p.images.length > 0) {
    const img = p.images[0];
    return typeof img === "string" ? img : img.url;
  }

  return "/placeholder.png";
};

export default function Home() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // 🔹 Load products
  useEffect(() => {
    axios.get("http://localhost:4000/api/products")
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
        setCategories([...new Set(res.data.map((p) => p.category))]);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
      });
  }, []);

  // 🔹 Category filter
  const filterCategory = (cat) => {
    if (cat === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category === cat));
    }
  };

  // 🔹 Search
  const handleSearch = (value) => {
    setSearch(value);
    setFiltered(
      products.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // 🔹 Add to cart
  const handleAdd = (p) => {
  dispatch(
    addToCart({
      productId: p.id || p._id,
      name: p.name,
      price: p.variants?.[0]?.price || p.price,
      image:
        p.images?.[0]
          ? typeof p.images[0] === "string"
            ? p.images[0]
            : p.images[0].url
          : p.image,
      qty: 1,
    })
  );
};


  return (
    <div className="bg-gray-100 pb-20">

      {/* Banner */}
      <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white p-6 text-center rounded-b-3xl shadow">
        <h1 className="text-2xl font-bold">Delivery in 10 Minutes ⚡</h1>
        <p className="text-sm">Fresh products at your doorstep!</p>
      </div>

      {/* Category Slider */}
      <div className="flex gap-3 overflow-x-auto px-4 py-2">
        <button
          onClick={() => filterCategory("All")}
          className="bg-red-600 text-white px-4 py-2 rounded-full"
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => filterCategory(cat)}
            className="bg-white px-4 py-2 rounded-full border shadow text-sm"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Top Picks */}
      <h2 className="px-4 text-lg font-bold mt-4">Top Picks For You</h2>

      <div className="flex overflow-x-auto gap-4 px-4 py-3">
        {filtered.slice(0, 8).map((p) => (
          <div
            key={p.id}
            className="min-w-[150px] bg-white rounded-xl shadow p-3"
          >
            <Link to={`/product/${p.id}`} className="block">
              <img
                src={getHomeImage(p)}
                alt={p.name}
                className="h-24 w-full object-cover rounded-md"
              />
              <p className="font-semibold mt-2">{p.name}</p>
              <p className="text-red-600 font-bold">₹{p.price}</p>
            </Link>

            <button
              className="bg-red-600 text-white mt-2 w-full py-1 rounded-lg text-sm"
              onClick={() => handleAdd(p)}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* All Products */}
      <h2 className="px-4 text-lg font-bold mt-4">All Products</h2>

      <div className="grid grid-cols-2 gap-4 p-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-3">
            <Link to={`/product/${p.id}`} className="block">
              <img
                src={getHomeImage(p)}
                alt={p.name}
                className="h-28 w-full object-cover rounded-lg"
              />
              <p className="font-semibold mt-2">{p.name}</p>
              <p className="text-gray-700">₹{p.price}</p>
            </Link>

            <button
              className="bg-red-600 text-white w-full mt-2 py-1 rounded-lg text-sm"
              onClick={() => handleAdd(p)}
            >
              Add
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
