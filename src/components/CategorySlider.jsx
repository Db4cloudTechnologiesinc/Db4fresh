// import { Link } from "react-router-dom";
 
// export default function CategorySlider({ categories = [] }) {
//   return (
//     <div className="flex gap-4 overflow-x-auto py-3">
//       {categories.map((c, i) => (
//         <Link
//           to={`/category/${c.name}`}
//           key={i}
//           className="flex flex-col items-center min-w-[80px]  p-3 
//                        transition-all hover:bg-red-300 cursor-pointer"
//         >
//           <img
//             src={c.image}
//             alt={c.name}
//             className="w-14 h-14 rounded-full object-cover border"
//           />
//           <span className="mt-1 text-sm">{c.name}</span>
//         </Link>
//       ))}
//     </div>
//   );
// }
 import { Link } from "react-router-dom";

export default function CategorySlider({ categories = [] }) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-3">

      {categories.map((c, i) => (
        <Link
          to={`/category/${c.name}`}
          key={i}
          className="
            flex flex-col items-center
            min-w-[72px]
            bg-white
            rounded-xl
            p-2
            shadow-sm
            hover:shadow
            transition
          "
        >
          {/* IMAGE */}
          <div className="bg-gray-50 rounded-full p-2">
            <img
              src={c.image}
              alt={c.name}
              className="w-12 h-12 object-contain"
            />
          </div>

          {/* NAME */}
          <span className="mt-1 text-xs font-medium text-gray-700">
            {c.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
