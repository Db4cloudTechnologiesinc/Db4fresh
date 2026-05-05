import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000";

export default function SuperStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        // 👉 You can change this API later
        const res = await axios.get(`${API_BASE}/api/products`);

        // Example filter (customize based on your DB)
        const superStoreProducts = res.data.filter(
          (p) => p.tag === "super-store"
        );

        setProducts(superStoreProducts);

      } catch (err) {
        console.error("Error loading SuperStore products", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Super Store</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products available</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[140px] object-contain"
              />

              <h3 className="mt-2 font-semibold">{product.name}</h3>

              <p className="text-green-600 font-bold">
                ₹{product.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}