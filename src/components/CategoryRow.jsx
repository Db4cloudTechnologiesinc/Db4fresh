// // // import React from "react";
// // // import { Link } from "react-router-dom";
// // // import ProductCard from "./ProductCard";

// // // export default function CategoryRow({ title, products = [] }) {
// // //   if (!products || products.length === 0) return null;

// // //   return (
// // //     <section className="mb-10">
// // //       <div className="flex items-center justify-between mb-4">
// // //         <h2 className="text-lg font-bold">{title}</h2>

// // //         <Link
// // //           to={`/category/${title}`}
// // //           className="text-sm text-red-600 font-semibold"
// // //         >
// // //           →
// // //         </Link>
// // //       </div>

// // //       <div className="flex gap-4 overflow-x-auto pb-2">
// // //         {products.map((p) => (
// // //           <div key={p.id} className="min-w-[220px]">
// // //             <ProductCard p={p} />
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </section>
// // //   );
// // // }


// // export default function CategoryRow({ title, products = [], emptyText }) {
// //   return (
// //     <section className="mb-10">
// //       <div className="flex items-center justify-between mb-4">
// //         <h2 className="text-lg font-bold">{title}</h2>
// //       </div>

// //       {products.length === 0 ? (
// //         <div className="text-gray-400 italic px-2">
// //           {emptyText || "No products available"}
// //         </div>
// //       ) : (
// //         <div className="flex gap-4 overflow-x-auto pb-2">
// //           {products.map((p) => (
// //             <div key={p.id} className="min-w-[220px]">
// //               <ProductCard p={p} />
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </section>
// //   );
// // }




// // import React from "react";
// // import ProductCard from "./ProductCard";

// // export default function CategoryRow({
// //   title,
// //   products = [],
// //   emptyText = "Coming Soon",
// // }) {
// //   return (
// //     <section className="mb-10">
// //       {/* CATEGORY TITLE */}
// //       <div className="flex items-center justify-between mb-4">
// //         <h2 className="text-lg font-bold">{title}</h2>
// //       </div>

// //       {/* EMPTY STATE */}
// //       {products.length === 0 ? (
// //         <div className="text-gray-400 italic px-2">
// //           {emptyText}
// //         </div>
// //       ) : (
// //         /* PRODUCT ROW */
// //         <div className="flex gap-4 overflow-x-auto pb-3">
// //           {products.map((p) => (
// //             <div key={p.id} className="min-w-[220px]">
// //               <ProductCard p={p} />
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </section>
// //   );
// // }



// import React from "react";
// import ProductCard from "./ProductCard";

// export default function CategoryRow({
//   title,
//   products = [],
//   emptyText = "Coming Soon",
// }) {
//   return (
//     <section className="mb-10">
//       {/* CATEGORY TITLE */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-bold">{title}</h2>
//       </div>

//       {/* EMPTY STATE */}
//       {products.length === 0 ? (
//         <div className="text-gray-400 italic px-2">
//           {emptyText}
//         </div>
//       ) : (
//         /* PRODUCT ROW */
//         <div className="flex gap-4 overflow-x-auto pb-3">
//           {products.map((p) => (
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

export default function CategoryRow({
  title,
  categoryId,
  products = [],
  emptyText = "No products available",
}) {
  const navigate = useNavigate();

  return (
    <section className="mb-10">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>

        {/* SEE ALL BUTTON */}
        <button
          onClick={() => navigate(`/category/${categoryId}`)}
          className="text-sm font-semibold text-red-600 hover:underline"
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
        <div className="flex gap-4 overflow-x-auto pb-3">
          {products.slice(0, 8).map((p) => (
            <div key={p.id} className="min-w-[220px]">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
