
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
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [sortByRating, setSortByRating] = useState("");
 
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
 

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");
 
  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products");
      // const data = await res.json();
      // setProducts(data);
      // setFiltered(data);
      const data = await res.json();

const productArray = Array.isArray(data)
  ? data
  : Array.isArray(data.products)
  ? data.products
  : [];

setProducts(productArray);
setFiltered(productArray);

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
 

  /* ================= FILTER + SORT LOGIC ================= */
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
 

    if (manufactureDate) {
      data = data.filter(
        p => p.manufacture_date && p.manufacture_date >= manufactureDate
      );
    }
 

    if (expiryDate) {
      data = data.filter(
        p => p.expiry_date && p.expiry_date <= expiryDate
      );
    }
 

    // ⭐ SORT BY RATING
    if (sortByRating === "high") {
      data.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    }
 
    if (sortByRating === "low") {
      data.sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0));
    }
 

    if (sortByRating === "low") {
      data.sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0));
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [
    search,
    brand,
    minPrice,
    maxPrice,
    manufactureDate,
    expiryDate,
    sortByRating,
    products,
  ]);
 

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, endIndex);
 
  /* ================= HELPERS ================= */
  const today = new Date();
 

  /* ================= HELPERS ================= */
  const today = new Date();

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < today;
  };
 

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const diffDays =
      (new Date(date) - today) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 7;
  };
 

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
 
    try {
      const res = await fetch(
        `http://localhost:4000/api/products/${id}`,
        {
          method: "DELETE",
          headers: { authorization: token },
        }
      );
 

      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert("Product deleted");
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
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-7 gap-3">
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
 

        <select
          value={sortByRating}
          onChange={(e) => setSortByRating(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort by Rating</option>
          <option value="high">⭐ High → Low</option>
          <option value="low">⭐ Low → High</option>
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
 

        <input
          type="date"
          value={manufactureDate}
          onChange={(e) => setManufactureDate(e.target.value)}
          className="border p-2 rounded"
        />
 

        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border p-2 rounded"
        />
 

        <button
          onClick={() => {
            setSearch("");
            setBrand("");
            setMinPrice("");
            setMaxPrice("");
            setManufactureDate("");
            setExpiryDate("");
            setSortByRating("");
          }}
          className="bg-gray-200 rounded px-4 col-span-1 md:col-span-7"
        >
          Clear Filters
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
              <th className="p-3">MFG</th>
              <th className="p-3">EXP</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
 
          <tbody>
            {paginatedProducts.map((product, index) => (
              <tr
                key={product.id}
                className={`border-b ${
                  isExpired(product.expiry_date)
                    ? "bg-red-50 text-red-700"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="p-3">{startIndex + index + 1}</td>
 
                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                </td>
 

                <td className="p-3">{product.brand || "—"}</td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.category}</td>
 
                <td className="p-3 text-pink-600 font-semibold">
                  ₹{product.price}
                </td>
 
                <td className="p-3">{product.stock}</td>
 
                <td className="p-3">
                  {product.manufacture_date
                    ? new Date(product.manufacture_date).toLocaleDateString("en-IN")
                    : "—"}
                </td>
 
                <td className="p-3">
                  {product.expiry_date
                    ? new Date(product.expiry_date).toLocaleDateString("en-IN")
                    : "—"}
                </td>
 
                {/* ⭐ RATINGS COLUMN */}
                <td className="p-3">
                  {product.totalReviews > 0 ? (
                    <div>
                      <span className="text-yellow-600 font-semibold">
                        ⭐ {product.avgRating}
                      </span>
                      <div className="text-xs text-gray-500">
                        ({product.totalReviews})
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No ratings</span>
                  )}
                </td>
 
                <td className="p-3">
                  {product.manufacture_date
                    ? new Date(product.manufacture_date).toLocaleDateString("en-IN")
                    : "—"}
                </td>

                <td className="p-3">
                  {product.expiry_date
                    ? new Date(product.expiry_date).toLocaleDateString("en-IN")
                    : "—"}
                </td>

                {/* ⭐ RATINGS COLUMN */}
                <td className="p-3">
                  {product.totalReviews > 0 ? (
                    <div>
                      <span className="text-yellow-600 font-semibold">
                        ⭐ {product.avgRating}
                      </span>
                      <div className="text-xs text-gray-500">
                        ({product.totalReviews})
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No ratings</span>
                  )}
                </td>

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
                <td colSpan="11" className="p-6 text-center text-gray-500">
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
