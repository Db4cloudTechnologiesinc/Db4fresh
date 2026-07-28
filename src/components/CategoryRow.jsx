import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const API_BASE = "http://localhost:4000";

export default function CategoryRow({ title, categoryId }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(
          `${API_BASE}/api/products/category/${categoryId}`
        );
        setProducts(res.data || []);
      } catch (err) {
        console.error("Category products error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId]);

  // Loading state
  if (loading) {
  return <p className="mb-6">Loading {title}...</p>;
}

  // Hide empty categories
  if (!products.length) return null;

  return (
    <div className="mb-8">

      {/* Heading + See All */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <Link
          to={`/category/${categoryId}`}
          className="text-red-600 font-medium hover:underline"
        >
          See All →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <div key={p.id} className="min-w-[220px]">
            <ProductCard p={p} />
          </div>
        ))}
      </div>

    </div>
  );
}