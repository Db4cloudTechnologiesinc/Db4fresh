// import React from "react";
// import ProductCard from "./ProductCard";

// export default function TopPicks({ products = [] }) {
//   if (!products.length) return null;

//   return (
//     <section className="mb-10">
//       <h2 className="text-lg font-bold mb-4">
//         Top Picks For You
//       </h2>

//       <div className="flex gap-4 overflow-x-auto pb-2">
//         {products.map((p) => (
//           <div key={p.id} className="min-w-[220px]">
//             <ProductCard p={p} />
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
import React from "react";
import ProductCard from "./ProductCard";

export default function TopPicks({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="mb-12">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          Top Picks For You
        </h2>
      </div>

      {/* PRODUCTS ROW */}
      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">

        {products.map((p) => (
          <div
            key={p.id}
            className="min-w-[210px] max-w-[210px] flex-shrink-0"
          >
            <ProductCard p={p} />
          </div>
        ))}

      </div>

    </section>
  );
}