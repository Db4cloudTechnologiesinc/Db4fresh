import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        headers: { authorization: token },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert("Product deleted");
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Link
          to="/admin/add-product"
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => {
              const img =
  product.images?.length > 0
    ? typeof product.images[0] === "string"
      ? product.images[0]                // old data
      : product.images[0].url            // new data
    : product.image || "/placeholder.png";
 

              return (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3">
                    <img
                      src={img}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </td>

                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3">{product.category}</td>

                  <td className="p-3">
                    <div className="flex gap-4">
                      <Link
                        to={`/admin/edit-product/${product.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
