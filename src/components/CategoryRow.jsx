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
