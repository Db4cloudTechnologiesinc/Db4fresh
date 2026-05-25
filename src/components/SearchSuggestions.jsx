
// import { Link } from "react-router-dom";

// export default function SearchSuggestions({
//   results = [],
//   search = "",
//   onSelect,
// }) {
//   /* CLEAN SEARCH TEXT */
//   const query = search.trim().toLowerCase();

//   /* HIDE IF EMPTY */
//   if (!query) return null;

//   /* FILTER PRODUCTS */
//   const filteredResults = results.filter((p) => {
//     const name =
//       p.name?.toLowerCase() || "";

//     const category =
//       p.category_name?.toLowerCase() || "";

//     const subcategory =
//       p.subcategory_name?.toLowerCase() || "";

//     return (
//       name.includes(query) ||
//       category.includes(query) ||
//       subcategory.includes(query)
//     );
//   });

//   return (
//     <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">

//       {/* RESULTS */}
//       {filteredResults.length > 0 ? (
//         <div className="max-h-[400px] overflow-y-auto">

//           {filteredResults.map((p) => (
//             <Link
//               key={p.id}
//               to={`/product/${p.id}`}
//               onClick={() => onSelect(p.name)}
//               className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b last:border-b-0"
//             >
//               {/* PRODUCT IMAGE */}
//               <img
//                 src={
//                   p.image ||
//                   (Array.isArray(p.images) &&
//                   p.images[0]?.url)
//                     ? p.images[0]?.url
//                     : "/placeholder.png"
//                 }
//                 alt={p.name}
//                 className="w-12 h-12 object-cover rounded-lg border"
//               />

//               {/* PRODUCT DETAILS */}
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-800">
//                   {p.name}
//                 </p>

//                 <p className="text-xs text-gray-500">
//                   {p.category_name ||
//                     p.subcategory_name ||
//                     "Product"}
//                 </p>
//               </div>

//               {/* PRICE */}
//               <div>
//                 <p className="text-sm font-bold text-green-600">
//                   ₹{p.price}
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       ) : (
//         /* NO RESULTS */
//         <div className="p-5 text-center">
//           <p className="text-gray-500 text-sm">
//             No products found for
//           </p>

//           <p className="font-semibold mt-1 text-gray-700">
//             "{search.trim()}"
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }




import { Link } from "react-router-dom";

export default function SearchSuggestions({
  results = [],
  search = "",
  onSelect,
}) {

  if (!search.trim()) return null;

  return (

    <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">

      {results.length > 0 ? (

        <div className="max-h-[400px] overflow-y-auto">

          {results.map((p) => (

            <Link
              key={p.id}

              to={`/product/${p.id}`}

              onClick={() =>
                onSelect(p.name)
              }

              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b"
            >


              <div className="flex-1">

                <p className="text-sm font-medium">
                  {p.name}
                </p>


              </div>


            </Link>

          ))}

        </div>

      ) : (

        <div className="p-4 text-sm text-gray-500 text-center">
          No products found
        </div>

      )}

    </div>

  );
}