
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: "",
    status: "active"
  });

  const [imageFile, setImageFile] = useState(null);

  // 🔹 Load product data
  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  // 🔹 Update product
  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("adminToken");

  const payload = {
    name: product.name,
    price: Number(product.price),
    category: product.category,
    stock: Number(product.stock),
    description: product.description,
    active: 1,
  };

  const res = await fetch(`http://localhost:4000/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Update failed");
    return;
  }

  alert("✅ Product updated successfully");
  navigate("/admin/products");
};


  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
      <h2 className="text-xl font-semibold mb-6">Update Product</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {/* Name */}
        <input
          className="border p-2 rounded"
          placeholder="Product Name"
          value={product.name}
          onChange={e => setProduct({ ...product, name: e.target.value })}
        />

        {/* Price */}
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Price"
          value={product.price}
          onChange={e => setProduct({ ...product, price: e.target.value })}
        />

        {/* Category */}
        <select
          className="border p-2 rounded"
          value={product.category}
          onChange={e => setProduct({ ...product, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="Snacks">Snacks</option>
          <option value="Dairy">Dairy</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
        </select>

        {/* Stock */}
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Stock"
          value={product.stock}
          onChange={e => setProduct({ ...product, stock: e.target.value })}
        /> 



        {/* Description */}
        <textarea
          className="border p-2 rounded col-span-2"
          placeholder="Description"
          value={product.description}
          onChange={e =>
            setProduct({ ...product, description: e.target.value })
          }
        />

        {/* Existing Image */}
        {product.image && (
          <img
            src={product.image}
            alt="product"
            className="h-20 col-span-2"
          />
        )}

        {/* Image Upload */}
        <input
          type="file"
          className="col-span-2"
          onChange={e => setImageFile(e.target.files[0])}
        />

        <button
          type="submit"
          className="col-span-2 bg-pink-600 text-white py-2 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
