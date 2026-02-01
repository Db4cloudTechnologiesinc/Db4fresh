
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "../components/ProductCard";

// export default function SubcategoryProducts() {
//   const { id } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `http://localhost:4000/api/products/subcategory/${id}`
//         );
//         setProducts(res.data || []);
//       } catch (err) {
//         console.error("Subcategory fetch error:", err);
//         setError("Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="text-center py-10 text-gray-500">
//         Loading products…
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10 text-red-500">
//         {error}
//       </div>
//     );
//   }

//   if (!products.length) {
//     return (
//       <div className="text-center py-10 text-gray-400">
//         No products found in this subcategory
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
//       {products.map((p) => (
//         <ProductCard key={p.id} p={p} />
//       ))}
//     </div>
//   );
// }



import React from "react";
import { Link } from "react-router-dom";

export default function SubcategoryCard({ subcategory }) {
  return (
    <Link to={`/subcategory/${subcategory.id}`}>
      <div className="relative w-[220px] h-[220px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">

        {/* FULL IMAGE */}
        <img
          src={subcategory.image || "/placeholder.png"}
          alt={subcategory.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY (readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        {/* TITLE */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white text-base font-semibold leading-tight line-clamp-2">
            {subcategory.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
