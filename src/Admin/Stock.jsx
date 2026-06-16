import { useEffect, useState } from "react";
 
export default function Stock() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("all");
 
  useEffect(() => {
    // fetch("http://localhost:4000/api/products")
    fetch("http://localhost:4000/api/products/products")
      .then((res) => res.json())
//       .then((data) => {
//   console.log("API DATA:", data);
//   setProducts(data);
// })
.then((data) => {
  console.log("API DATA:", data);
 
  const zeroStock = data.filter(
    p => Number(p.stock) === 0
  );
 
  console.log("ZERO STOCK PRODUCTS:", zeroStock);
  console.log("ZERO STOCK COUNT:", zeroStock.length);
 
  setProducts(data);
})
      .catch((err) => console.error(err));
  }, []);
 
 let filteredProducts = [...products];
 
if (sort === "low-stock") {
  filteredProducts = filteredProducts
    .filter((p) => Number(p.stock) < 10)
    .sort((a, b) => Number(a.stock) - Number(b.stock));
}
 
else if (sort === "out-stock") {
  filteredProducts = filteredProducts
    .filter((p) => Number(p.stock) === 0);
}
 
else if (sort === "low-high") {
  filteredProducts.sort(
    (a, b) => Number(a.stock) - Number(b.stock)
  );
}
 
else if (sort === "high-low") {
  filteredProducts.sort(
    (a, b) => Number(b.stock) - Number(a.stock)
  );
}
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Stock Management</h2>
 
      {/* Filter & Sort */}
      <select
        className="border p-2 mb-4"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="all">All Products</option>
        <option value="low-stock">Low Stock Products</option>
        <option value="out-stock">Out Of Stock Products</option>
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
          {filteredProducts.map((p, i) => (
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
 
          {filteredProducts.length === 0 && (
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
 
 
 
 