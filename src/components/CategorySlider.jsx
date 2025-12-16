import { Link } from "react-router-dom";
 
export default function CategorySlider({ categories = [] }) {
  return (
    <div className="flex gap-4 overflow-x-auto py-3">
      {categories.map((c, i) => (
        <Link
          to={`/category/${c.name}`}
          key={i}
          className="flex flex-col items-center min-w-[80px]  p-3 
                       transition-all hover:bg-red-300 cursor-pointer"
        >
          <img
            src={c.image}
            alt={c.name}
            className="w-14 h-14 rounded-full object-cover border"
          />
          <span className="mt-1 text-sm">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}
 