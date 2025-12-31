// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../features/cart/cartSlice";
// import ProductCard from "../components/ProductCard";


// /**
//  * ✅ SAFELY GET IMAGE FOR HOME PAGE
//  * Priority:
//  * 1. p.image (single image sent by backend)
//  * 2. p.images[0] (multiple images)
//  * 3. placeholder
//  */
// const getHomeImage = (p) => {
//   if (p.image) return p.image;

//   if (Array.isArray(p.images) && p.images.length > 0) {
//     const img = p.images[0];
//     return typeof img === "string" ? img : img.url;
//   }

//   return "/placeholder.png";
// };

// export default function Home() {
//   const dispatch = useDispatch();
//   const [products, setProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");

//   // 🔹 Load products
//   useEffect(() => {
//     axios.get("http://localhost:4000/api/products")
//       .then((res) => {
//         setProducts(res.data);
//         setFiltered(res.data);
//         setCategories([...new Set(res.data.map((p) => p.category))]);
//       })
//       .catch((err) => {
//         console.error("Failed to load products", err);
//       });
//   }, []);

//   // 🔹 Category filter
//   const filterCategory = (cat) => {
//     if (cat === "All") {
//       setFiltered(products);
//     } else {
//       setFiltered(products.filter((p) => p.category === cat));
//     }
//   };

//   // 🔹 Search
//   const handleSearch = (value) => {
//     setSearch(value);
//     setFiltered(
//       products.filter((p) =>
//         p.name.toLowerCase().includes(value.toLowerCase())
//       )
//     );
//   };

//   // 🔹 Add to cart
//   const handleAdd = (p) => {
//   dispatch(
//     addToCart({
//       productId: p.id || p._id,
//       name: p.name,
//       price: p.variants?.[0]?.price || p.price,
//       image:
//         p.images?.[0]
//           ? typeof p.images[0] === "string"
//             ? p.images[0]
//             : p.images[0].url
//           : p.image,
//       qty: 1,
//     })
//   );
// };


//   return (
//     <div className="bg-gray-100 pb-20">

//       {/* Banner */}
//       <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white p-6 text-center rounded-b-3xl shadow">
//         <h1 className="text-2xl font-bold">Delivery in 10 Minutes ⚡</h1>
//         <p className="text-sm">Fresh products at your doorstep!</p>
//       </div>

//       {/* Category Slider */}
//       <div className="flex gap-3 overflow-x-auto px-4 py-2">
//         <button
//           onClick={() => filterCategory("All")}
//           className="bg-red-600 text-white px-4 py-2 rounded-full"
//         >
//           All
//         </button>

//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => filterCategory(cat)}
//             className="bg-white px-4 py-2 rounded-full border shadow text-sm"
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* Top Picks */}
//       <h2 className="px-4 text-lg font-bold mt-4">Top Picks For You</h2>

//       <div className="flex overflow-x-auto gap-4 px-4 py-3">
//         {filtered.slice(0, 8).map((p) => (
//   <ProductCard key={p.id} p={p} />
// ))}

//       </div>

//       {/* All Products */}
//       <h2 className="px-4 text-lg font-bold mt-4">All Products</h2>

//       <div className="grid grid-cols-2 gap-4 p-4">
//         {filtered.map((p) => (
//   <ProductCard key={p.id} p={p} />
// ))}

//       </div>

//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  /* LOAD PRODUCTS */
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/products")
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
        setCategories(["All", ...new Set(res.data.map((p) => p.category))]);
      })
      .catch((err) => console.error(err));
  }, []);

  /* FILTER */
  const filterCategory = (cat) => {
    if (cat === "All") setFiltered(products);
    else setFiltered(products.filter((p) => p.category === cat));
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-24">

      {/* 🔴 HERO BANNER */}
      <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-4 rounded-b-2xl">
        <h1 className="text-xl font-bold">Delivery in 10 Minutes ⚡</h1>
        <p className="text-xs opacity-90">
          Fresh groceries at your doorstep
        </p>
      </div>

      {/* 🟢 CATEGORY PILLS */}
      <div className="flex gap-3 overflow-x-auto px-4 py-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => filterCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              ${
                cat === "All"
                  ? "bg-red-600 text-white"
                  : "bg-white shadow text-gray-700"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ⭐ TOP PICKS */}
      <section className="mt-2">
        <h2 className="px-4 text-base font-bold">
          Top Picks For You
        </h2>

        <div className="flex gap-3 overflow-x-auto px-4 py-3">
          {filtered.slice(0, 8).map((p) => (
            <ProductCard key={p.id || p._id} p={p} />
          ))}
        </div>
      </section>

      {/* 🛒 ALL PRODUCTS */}
      <section className="mt-4">
        <h2 className="px-4 text-base font-bold">
          All Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 px-4 py-3">
          {filtered.map((p) => (
            <ProductCard key={p.id || p._id} p={p} />
          ))}
        </div>
      </section>

    </div>
  );
}
