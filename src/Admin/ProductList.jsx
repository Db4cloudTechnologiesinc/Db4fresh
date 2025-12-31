import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  /* ================= STATES ================= */
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // change to 10 if needed

  const token = localStorage.getItem("token");

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products");
      const data = await res.json();
      setProducts(data);
      setFiltered(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= BRAND LIST ================= */
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let data = [...products];

    if (search) {
      data = data.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (brand) {
      data = data.filter(p => p.brand === brand);
    }

    if (minPrice) {
      data = data.filter(p => Number(p.price) >= Number(minPrice));
    }

    if (maxPrice) {
      data = data.filter(p => Number(p.price) <= Number(maxPrice));
    }

    setFiltered(data);
    setCurrentPage(1); // reset page on filter change
  }, [search, brand, minPrice, maxPrice, products]);

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, endIndex);

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          authorization: token,
        },
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
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
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>

        <Link
          to="/admin/products/add"
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Add Product
        </Link>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Brands</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={() => {
            setSearch("");
            setBrand("");
            setMinPrice("");
            setMaxPrice("");
          }}
          className="bg-gray-200 rounded px-4"
        >
          Clear
        </button>
      </div>

      {/* ================= PRODUCT TABLE ================= */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product, index) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{startIndex + index + 1}</td>

                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                </td>

                <td className="p-3 font-medium">{product.brand}</td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.category}</td>

                <td className="p-3 text-pink-600 font-semibold">
                  ₹{product.price}
                </td>

                <td className="p-3">{product.stock}</td>

                <td className="p-3">
                  <div className="flex gap-4">
                    <Link
                      to={`/admin/products/update/${product.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Update
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
            ))}

            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage(p => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
