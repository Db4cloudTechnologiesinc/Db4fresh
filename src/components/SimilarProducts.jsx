// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";

// // export default function SimilarProducts({ productId }) {
// //   const [items, setItems] = useState([]);

// //   useEffect(() => {
// //     fetch(`http://localhost:4000/api/products/${productId}/similar`)
// //       .then(res => res.json())
// //       .then(data => {
// //         if (Array.isArray(data)) setItems(data);
// //         else if (Array.isArray(data?.data)) setItems(data.data);
// //         else setItems([]);
// //       });
// //   }, [productId]);

// //   if (!items.length) return null;

// //   return (
// //     <div className="max-w-6xl mx-auto px-4 mt-10">
// //       <h3 className="font-semibold mb-3">Similar Products</h3>

// //       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// //         {items.map(p => {
// //           const BACKEND_URL = "http://localhost:4000";

// //           const productImage =
// //           p.images?.length
// //           ? typeof p.images[0] === "string"
// //           ? `${BACKEND_URL}/${p.images[0]}`
// //           : p.images[0].url
// //           : "/placeholder.png";

// //           return (
// //             <Link key={p.id} to={`/product/${p.id}`}>
// //               <img
// //                 src={productImage}
// //                 alt={p.name}
// //                 className="h-32 w-full object-contain"
// //               />
// //               <p className="text-sm mt-1">{p.name}</p>
// //             </Link>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function SimilarProducts({ productId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/products/${productId}/similar`)
      .then((res) => setProducts(res.data || []))
      .catch((err) =>
        console.error("Similar products error:", err)
      );
  }, [productId]);

  if (!products.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Similar Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
