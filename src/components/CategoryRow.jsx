<<<<<<< HEAD
=======

// import { useNavigate } from "react-router-dom";
// import ProductCard from "./ProductCard";
>>>>>>> 9014f7e7 (add kafka.js)


<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard"; // ✅ IMPORTANT

const API_BASE = "http://localhost:4000";

export default function CategoryRow({ title, categoryId }) {
=======
//   /* Categories that are not ready yet */
//   const comingSoonCategories = [
//     "beauty",
//     "electronics",
//     "fashion",
//     "gymfreak",
//     "healthy",
//     "pharmacy",
//   ];

//   const handleSeeAll = () => {
//     if (comingSoonCategories.includes(categoryId?.toLowerCase())) {
//       navigate(`/coming-soon/${categoryId}`);
//     } else {
//       navigate(`/category/${categoryId}`);
//     }
//   };

//   return (
//     <section className="mb-10">
//       {/* ================= HEADER ================= */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-bold">{title}</h2>

//         {/* SEE ALL BUTTON */}
//         <button
//           onClick={handleSeeAll}
//           className="text-sm font-semibold text-red-600 hover:underline"
//         >
//           See All →
//         </button>
//       </div>

//       {/* ================= CONTENT ================= */}
//       {products.length === 0 ? (
//         <div className="text-gray-400 italic px-2">
//           {emptyText}
//         </div>
//       ) : (
//         <div className="flex gap-4 overflow-x-auto pb-3">
//           {products.slice(0, 8).map((p) => (
//             <div key={p.id} className="min-w-[220px]">
//               <ProductCard p={p} />
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }

import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
>>>>>>> 9014f7e7 (add kafka.js)

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(
          `${API_BASE}/api/products/category/${categoryId}`
        );
        setProducts(res.data || []);
      } catch (err) {
        console.error("Category products error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId]);

  // ✅ Loading state
  if (loading) {
    return <p className="mb-6">Loading {title}...</p>;
  }

  // ✅ Optional: hide empty categories
  if (!products.length) return null;

  return (
<<<<<<< HEAD
    <div className="mb-8">

      <h2 className="text-xl font-semibold mb-3">
        {title}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
              {products.map((p) => (
                <div key={p.id} className="min-w-[220px]">
                  <ProductCard p={p} />
                </div>
  ))}


      </div>

    </div>
=======
    <section className="mb-12">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl font-semibold text-gray-800">
          {title}
        </h2>

        <button
          onClick={handleSeeAll}
          className="text-sm font-semibold text-red-600 hover:text-red-700 transition"
        >
          See All →
        </button>

      </div>

      {/* ================= CONTENT ================= */}

      {products.length === 0 ? (

        <div className="text-gray-400 italic px-2">
          {emptyText}
        </div>

      ) : (

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">

          {products.slice(0, 10).map((p) => (

            <div
              key={p.id}
              className="min-w-[210px] max-w-[210px] flex-shrink-0"
            >

              <ProductCard p={p} />

            </div>

          ))}

        </div>

      )}

    </section>
>>>>>>> 9014f7e7 (add kafka.js)
  );
}