
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import BulkUpload from "./BulkUpload";

// export default function ProductList() {
//   /* ================= STATES ================= */
//   const [products, setProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showBulk, setShowBulk] = useState(false);

//   const [search, setSearch] = useState("");
//   const [brand, setBrand] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [sortByRating, setSortByRating] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const token = localStorage.getItem("token");

//   /* ================= FETCH ================= */
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/api/products");
//       const data = await res.json();

//       const arr = Array.isArray(data)
//         ? data
//         : Array.isArray(data.products)
//         ? data.products
//         : [];

//       setProducts(arr);
//       setFiltered(arr);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   /* ================= FILTER ================= */
//   useEffect(() => {
//     let data = [...products];

//     if (search) {
//       data = data.filter(p =>
//         p.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (brand) {
//       data = data.filter(p => p.brand === brand);
//     }

//     if (minPrice) {
//       data = data.filter(p => p.price >= minPrice);
//     }

//     if (maxPrice) {
//       data = data.filter(p => p.price <= maxPrice);
//     }

//     if (sortByRating === "high") {
//       data.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
//     }

//     if (sortByRating === "low") {
//       data.sort((a, b) => (a.avgRating || 0) - (b.avgRating || 0));
//     }

//     setFiltered(data);
//     setCurrentPage(1);
//   }, [search, brand, minPrice, maxPrice, sortByRating, products]);

//   /* ================= PAGINATION ================= */
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

//   /* ================= DELETE ================= */
//   const deleteProduct = async (id) => {
//     if (!window.confirm("Delete this product?")) return;

//     await fetch(`http://localhost:4000/api/products/${id}`, {
//       method: "DELETE",
//       headers: { authorization: token },
//     });

//     setProducts(prev => prev.filter(p => p.id !== id));
//   };

//   if (loading) return <p className="p-6">Loading...</p>;

//   const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">

//       {/* ================= HEADER ================= */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold">Products</h2>
//           <p className="text-sm text-gray-500">Manage store products</p>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={() => setShowBulk(!showBulk)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//           >
//             📤 Bulk Upload
//           </button>

//           <Link
//             to="/admin/products/add"
//             className="bg-green-600 text-white px-4 py-2 rounded-lg"
//           >
//             ➕ Add Product
//           </Link>
//         </div>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-xl shadow">
//           <p className="text-gray-500 text-sm">Total Products</p>
//           <h3 className="text-xl font-bold">{products.length}</h3>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow">
//           <p className="text-gray-500 text-sm">Low Stock</p>
//           <h3 className="text-xl font-bold text-red-500">
//             {products.filter(p => p.stock < 10).length}
//           </h3>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow">
//           <p className="text-gray-500 text-sm">Out of Stock</p>
//           <h3 className="text-xl font-bold">
//             {products.filter(p => p.stock === 0).length}
//           </h3>
//         </div>
//       </div>

//       {/* ================= BULK UPLOAD ================= */}
//       {showBulk && (
//         <div className="bg-white p-5 rounded-xl shadow mb-6">
//           <BulkUpload />
//         </div>
//       )}

//       {/* ================= FILTER ================= */}
//       <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-5 gap-3">

//         <input
//           type="text"
//           placeholder="🔍 Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border p-2 rounded-lg"
//         />

//         <select
//           value={brand}
//           onChange={(e) => setBrand(e.target.value)}
//           className="border p-2 rounded-lg"
//         >
//           <option value="">All Brands</option>
//           {brands.map(b => (
//             <option key={b}>{b}</option>
//           ))}
//         </select>

//         <input
//           type="number"
//           placeholder="Min ₹"
//           value={minPrice}
//           onChange={(e) => setMinPrice(e.target.value)}
//           className="border p-2 rounded-lg"
//         />

//         <input
//           type="number"
//           placeholder="Max ₹"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//           className="border p-2 rounded-lg"
//         />

//         <button
//           onClick={() => {
//             setSearch("");
//             setBrand("");
//             setMinPrice("");
//             setMaxPrice("");
//           }}
//           className="bg-gray-200 rounded-lg"
//         >
//           Clear
//         </button>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="p-3">#</th>
//               <th className="p-3">Image</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Brand</th>
//               <th className="p-3">Price</th>
//               <th className="p-3">Stock</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginated.map((p, i) => (
//               <tr key={p.id} className="border-b hover:bg-gray-50">
//                 <td className="p-3">{startIndex + i + 1}</td>

//                 <td className="p-3">
//                   <img
//                     src={p.image}
//                     className="w-14 h-14 rounded-lg object-cover"
//                     alt=""
//                   />
//                 </td>

//                 <td className="p-3 font-medium">{p.name}</td>
//                 <td className="p-3">{p.brand || "-"}</td>

//                 <td className="p-3 text-green-600 font-semibold">
//                   ₹{p.price}
//                 </td>

//                 <td className="p-3">{p.stock}</td>

//                 <td className="p-3 flex gap-2">
//                   <Link
//                     to={`/admin/products/update/${p.id}`}
//                     className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
//                   >
//                     Edit
//                   </Link>

//                   <button
//                     onClick={() => deleteProduct(p.id)}
//                     className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {paginated.length === 0 && (
//               <tr>
//                 <td colSpan="7" className="p-6 text-center text-gray-500">
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BulkUpload from "./BulkUpload";

export default function ProductList() {
  /* ================= STATES ================= */
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBulk, setShowBulk] = useState(false);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

const startIndex = (currentPage - 1) * itemsPerPage;

const paginated = filtered.slice(
  startIndex,
  startIndex + itemsPerPage
);

const totalPages = Math.ceil(filtered.length / itemsPerPage);
  /* ================= FETCH ================= */
  const token = localStorage.getItem("adminToken"); // ✅ FIXED

const fetchProducts = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      "http://localhost:4000/api/admin/products",
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ IMPORTANT
        },
      }
    );
    

    const data = await res.json();
  

    console.log("ADMIN PRODUCTS:", data); // 🔥 DEBUG

    setProducts(data || []);
    setFiltered(data || []);
    
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchProducts();
  }, []);


  /* ================= FILTER ================= */
  useEffect(() => {
    let data = [...products];

    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (brand) {
      data = data.filter((p) => p.brand === brand);
    }

    if (minPrice) {
      data = data.filter((p) => p.price >= minPrice);
    }

    if (maxPrice) {
      data = data.filter((p) => p.price <= maxPrice);
    }

    setFiltered(data);
  }, [search, brand, minPrice, maxPrice, products]);

  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`http://localhost:4000/api/products/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`, // ✅ FIXED
  },
});

    fetchProducts();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-sm text-gray-500">Manage store products</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowBulk(!showBulk)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            📤 Bulk Upload
          </button>

          <Link
            to="/admin/products/add"
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            ➕ Add Product
          </Link>
        </div>
      </div>

      {/* ================= BULK ================= */}
      {showBulk && (
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <BulkUpload />
        </div>
      )}

      {/* ================= FILTER ================= */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <button
          onClick={() => {
            setSearch("");
            setBrand("");
            setMinPrice("");
            setMaxPrice("");
          }}
          className="bg-gray-200 rounded-lg"
        >
          Clear
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((p, i) => (
              
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
  {startIndex + i + 1}
</td>
                {/* <td className="p-3">
                <img
  src={p.image || "/placeholder.png"}
  className="w-16 h-16 object-contain mx-auto"
  alt=""
/>
                </td> */}
                <td className="p-3">
  <img
    src={
      p.image
        ? p.image.startsWith("http")
          ? p.image
          : `http://localhost:4000${p.image}`
        : (() => {
            try {
              const imgs =
                typeof p.images === "string"
                  ? JSON.parse(p.images)
                  : p.images;

              return imgs?.[0]?.url || "/placeholder.png";
            } catch {
              return "/placeholder.png";
            }
          })()
    }
    className="w-16 h-16 object-contain mx-auto"
    alt={p.name}
  />
</td>
                

                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.brand || "-"}</td>

                <td className="p-3 text-green-600 font-semibold">
                  ₹{p.price}
                </td>

                <td className="p-3">{p.stock}</td>

                <td className="p-3 flex gap-2">
                  <Link
                    to={`/admin/products/update/${p.id}`}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No products found
                </td>

              </tr>
              
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center mt-4 gap-2">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
    className="px-3 py-1 bg-gray-200 rounded"
  >
    ◀
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i + 1)}
      className={`px-3 py-1 rounded ${
        currentPage === i + 1
          ? "bg-blue-500 text-white"
          : "bg-gray-200"
      }`}
    >
      {i + 1}
    </button>
  ))}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
    className="px-3 py-1 bg-gray-200 rounded"
  >
    ▶
  </button>
</div>
    </div>
  );
}
