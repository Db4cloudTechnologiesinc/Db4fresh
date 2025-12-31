// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import ProductCard from '../components/ProductCard';

// export default function CategoryPage(){
//   const { name } = useParams();
//   const items = useSelector(s=>s.products.items);
//   const filtered = items.filter(p=> p.title.toLowerCase().includes(name.toLowerCase()));
//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">{name} Products</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//         {filtered.map(p=> <ProductCard key={p._id} p={p} />)}
//       </div>
//     </div>
//   );
// }


import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { name } = useParams();

  const items = useSelector((s) => s.products.items);

  // ✅ FIXED FILTER (name instead of title)
  const filtered = items.filter((p) =>
    p.name?.toLowerCase().includes(name.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen pb-24">

      {/* HEADER */}
      <div className="px-4 py-4 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-lg font-bold capitalize">
          {name} Products
        </h1>
        <p className="text-xs text-gray-500">
          {filtered.length} items
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 px-4 py-4">
        {filtered.map((p) => (
          <ProductCard key={p._id || p.id} p={p} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No products found
        </p>
      )}
    </div>
  );
}
