// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:4000";

// export default function OfferZone() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${API_BASE}/api/products/offer-zone`)
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Offer Zone</h1>
      

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//         {products.map((p) => (
//           <div key={p.id} className="bg-white p-3 rounded shadow">
//             <img
//               src={p.image}
//               className="h-[120px] w-full object-contain"
//             />

//             <p>{p.name}</p>

//             <p className="text-red-500 font-bold">
//               ₹{Math.round(p.price * 0.5)}
//             </p>

//             <p className="text-xs text-gray-500 line-through">
//               ₹{p.price}
//             </p>

//             <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
//               Near Expiry
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCard";

const API_BASE = "http://localhost:4000";

export default function OfferZone() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products/offer-zone`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-bold mb-4">
        🔥 Offer Zone
      </h2>

      {/* 🔄 Loading */}
      {loading && <p className="text-sm text-gray-500">Loading offers...</p>}

      {/* ❌ No products */}
      {!loading && products.length === 0 && (
        <p className="text-sm text-gray-500">
          No offers available right now
        </p>
      )}

      {/* ✅ Products */}
      {products.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {products.map((p) => (
            <div key={p.id} className="min-w-[220px]">
              <ProductCard p={p} isOffer={true} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}