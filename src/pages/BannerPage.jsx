
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// function BannerPage() {
//   const { type } = useParams();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchProducts();
//   }, [type]);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:4000/api/banner-products/${type}`
//       );
//       setProducts(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="p-4">

//       {/* HEADER */}
//       <h2 className="text-2xl font-bold mb-6">
//         {type.replace("-", " ").toUpperCase()}
//       </h2>

//       {/* GRID */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

//         {products.map((p) => {
//           const finalPrice =
//             p.discount_percentage > 0
//               ? p.price - (p.price * p.discount_percentage) / 100
//               : p.price;

//           return (
//             <div
//               key={p.id}
//               className="bg-white rounded-xl shadow hover:shadow-lg transition p-3"
//             >
//               {/* IMAGE FIX */}
//               <img
//                 src={`http://localhost:4000/${p.image}`}
//                 alt={p.name}
//                 className="w-full h-32 object-cover rounded-md"
//               />

//               {/* NAME */}
//               <h3 className="text-sm font-semibold mt-2">{p.name}</h3>

//               {/* PRICE */}
//               <div className="mt-1">
//                 <span className="text-green-600 font-bold">
//                   ₹{finalPrice}
//                 </span>

//                 {p.discount_percentage > 0 && (
//                   <span className="text-gray-400 line-through ml-2 text-sm">
//                     ₹{p.price}
//                   </span>
//                 )}
//               </div>

//               {/* BUTTON */}
//               <button className="mt-2 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600">
//                 Add to Cart
//               </button>
//             </div>
//           );
//         })}

//       </div>
//     </div>
//   );
// }

// export default BannerPage;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function BannerPage() {
  const { type } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [type]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/banner-products/${type}`
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">
        {type.replace("-", " ").toUpperCase()}
      </h2>

      <div className="flex flex-wrap gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} p={product} />
        ))}
      </div>
    </div>
  );
}

export default BannerPage;