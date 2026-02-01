
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaTruck, FaFire, FaTags } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// import TopPicks from "../components/TopPicks";
// import CategoryRow from "../components/CategoryRow";

// const API_BASE = "http://localhost:4000";

// /* 🚧 COMING SOON (CLICK ONLY, NO UI INDICATOR) */
// const COMING_SOON = [
//   "beauty",
//   "gym freaks",
//   "fashion",
//   "electronics",
//   "pharmacy",
// ];

// export default function Home() {
//   const navigate = useNavigate();

//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [topPicks, setTopPicks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= LOAD DATA ================= */
//   useEffect(() => {
//     async function loadHome() {
//       try {
//         setLoading(true);

//         const [catRes, prodRes, topRes] = await Promise.all([
//           axios.get(`${API_BASE}/api/categories/with-subcategories`),
//           axios.get(`${API_BASE}/api/products`),
//           axios.get(`${API_BASE}/api/products/top-picks`),
//         ]);

//         setCategories(Array.isArray(catRes.data) ? catRes.data : []);
//         setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
//         setTopPicks(Array.isArray(topRes.data) ? topRes.data : []);
//       } catch (err) {
//         console.error("Home load error", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadHome();
//   }, []);

//   /* ================= CATEGORY CLICK ================= */
//   const onCategoryClick = (cat) => {
//     if (COMING_SOON.includes(cat.name.toLowerCase())) {
//       alert(`${cat.name} is coming soon 🚧`);
//       return;
//     }
//     navigate(`/category/${cat.id}`);
//   };

//   /* ================= PRODUCTS BY CATEGORY ================= */
//   const getProductsForCategory = (categoryId) => {
//     return products.filter(
//       (p) => String(p.category_id) === String(categoryId)
//     );
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* HERO */}
//       <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-4">
//         <h1 className="text-xl font-bold">Delivery in 30 Minutes ⚡</h1>
//         <p className="text-xs opacity-90">Fresh groceries at your doorstep</p>
//       </div>

//       {/* AD STRIP */}
//       <div className="bg-red-100 px-4 py-3">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
//             <FaTruck className="text-red-600 text-2xl" />
//             Free Delivery
//           </div>
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
//             <FaFire className="text-red-600 text-2xl" />
//             Today’s Deals
//           </div>
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
//             <FaTags className="text-red-600 text-2xl" />
//             Offer Zone
//           </div>
//         </div>
//       </div>

//       {/* CATEGORY BAR */}
//       <div className="bg-white px-4 py-4 shadow-sm">
//         <div className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-3 overflow-x-auto">
//           <button
//             onClick={() => navigate("/")}
//             className="px-5 py-2 rounded-full text-sm font-semibold bg-red-600 text-white"
//           >
//             All
//           </button>

//           {categories.map((cat) => (
//             <button
//               key={cat.id}
//               onClick={() => onCategoryClick(cat)}
//               className="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap
//                          bg-gray-100 text-gray-700 hover:bg-gray-200"
//             >
//               {cat.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* HOME CONTENT */}
//       <div className="px-4 py-6">
//         {loading ? (
//           <p className="text-gray-500">Loading products...</p>
//         ) : (
//           <>
//             <TopPicks products={topPicks} />

//             {categories.map((cat) => {
//               // ❌ hide coming-soon categories from home
//               if (COMING_SOON.includes(cat.name.toLowerCase())) return null;

//               const catProducts = getProductsForCategory(cat.id);
//               if (!catProducts.length) return null;

//               return (
//                 <CategoryRow
//                   key={cat.id}
//                   title={cat.name}
//                   categoryId={cat.id}
//                   products={catProducts}
//                 />
//               );
//             })}
//           </>
//         )}
//       </div>

//       <div className="mt-16 py-6 text-center text-sm text-gray-500">
//         © 2026 Db4fresh. All rights reserved.
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaFire, FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import TopPicks from "../components/TopPicks";
import CategoryRow from "../components/CategoryRow";

const API_BASE = "http://localhost:4000";

/* 🚧 COMING SOON */
const COMING_SOON = [
  "beauty",
  "gym freaks",
  "fashion",
  "electronics",
  "pharmacy",
];

/* ⭐ PRIORITY FOR HOME PAGE */
const PRIORITY_CATEGORIES = ["fruits", "vegetables"];

export default function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadHome() {
      try {
        setLoading(true);

        const [catRes, prodRes, topRes] = await Promise.all([
          axios.get(`${API_BASE}/api/categories/with-subcategories`),
          axios.get(`${API_BASE}/api/products`),
          axios.get(`${API_BASE}/api/products/top-picks`),
        ]);

        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        setTopPicks(Array.isArray(topRes.data) ? topRes.data : []);
      } catch (err) {
        console.error("Home load error", err);
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  /* ================= CATEGORY CLICK ================= */
  const onCategoryClick = (cat) => {
    if (COMING_SOON.includes(cat.name.toLowerCase())) {
      alert(`${cat.name} is coming soon 🚧`);
      return;
    }
    navigate(`/category/${cat.id}`);
  };

  /* ================= PRODUCTS BY CATEGORY ================= */
  const getProductsForCategory = (categoryId) => {
    return products.filter(
      (p) => String(p.category_id) === String(categoryId)
    );
  };

  /* ================= CATEGORY ORDER (🔥 IMPORTANT) ================= */
  const orderedCategories = [
    ...categories.filter((c) =>
      PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
    ),
    ...categories.filter(
      (c) => !PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
    ),
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO */}
      <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-4">
        <h1 className="text-xl font-bold">Delivery in 30 Minutes ⚡</h1>
        <p className="text-xs opacity-90">
          Fresh groceries at your doorstep
        </p>
      </div>

      {/* AD STRIP */}
      <div className="bg-red-100 px-4 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
            <FaTruck className="text-red-600 text-2xl" />
            Free Delivery
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
            <FaFire className="text-red-600 text-2xl" />
            Today’s Deals
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
            <FaTags className="text-red-600 text-2xl" />
            Offer Zone
          </div>
        </div>
      </div>

      {/* CATEGORY BAR */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-3 overflow-x-auto">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-red-600 text-white"
          >
            All
          </button>

          {orderedCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                         bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* HOME CONTENT */}
      <div className="px-4 py-6">
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <>
            <TopPicks products={topPicks} />

            {orderedCategories.map((cat) => {
              if (COMING_SOON.includes(cat.name.toLowerCase())) return null;

              const catProducts = getProductsForCategory(cat.id);
              if (!catProducts.length) return null;

              return (
                <CategoryRow
                  key={cat.id}
                  title={cat.name}
                  categoryId={cat.id}
                  products={catProducts}
                />
              );
            })}
          </>
        )}
      </div>

      <div className="mt-16 py-6 text-center text-sm text-gray-500">
        © 2026 Db4fresh. All rights reserved.
      </div>
    </div>
  );
}
