
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function SuggestedProducts({ productId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/products/${productId}/suggested`)
      .then((res) => setProducts(res.data || []))
      .catch((err) =>
        console.error("Suggested products error:", err)
      );
  }, [productId]);

  if (!products.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Frequently Bought Together
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
