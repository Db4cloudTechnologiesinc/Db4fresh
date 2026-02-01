import React from "react";
import ProductCard from "./ProductCard";

export default function TopPicks({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-4">
        Top Picks For You
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <div key={p.id} className="min-w-[220px]">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
