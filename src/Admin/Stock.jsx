
import { useEffect, useState } from "react";

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("all");

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low-high") return a.stock - b.stock;
    if (sort === "high-low") return b.stock - a.stock;
    return 0;
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Stock Management</h2>

      {/* Sort */}
      <select
        className="border p-2 mb-4"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="all">All Products</option>
        <option value="low-high">Stock: Low → High</option>
        <option value="high-low">Stock: High → Low</option>
      </select>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {sortedProducts.map((p, i) => (
            <tr key={p.id} className="border-t">
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td
                className={`font-bold ${
                  p.stock === 0
                    ? "text-red-600"
                    : p.stock <= 5
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                {p.stock}
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


