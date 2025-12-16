import React, { useState } from "react";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
  });

  // ⭐ Multiple images
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // ⭐ Product variants
  const [variants, setVariants] = useState([
    { label: "", price: "", mrp: "", stock: "", sku: "" },
  ]);

  // =============================
  // IMAGE UPLOAD (MULTIPLE)
  // =============================
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadImagesToBackend = async () => {
    try {
      const data = new FormData();
      imageFiles.forEach((img) => data.append("images", img));

      const res = await fetch("http://localhost:4000/api/products/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        console.error("Upload failed", await res.text());
        return [];
      }

      const json = await res.json();
      return json.images || [];
    } catch (err) {
      console.error("Upload error:", err);
      return [];
    }
  };

  // =============================
  // VARIANT HANDLER FUNCTIONS
  // =============================
  const handleVariantChange = (idx, field, value) => {
    const updated = [...variants];
    updated[idx][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { label: "", price: "", mrp: "", stock: "", sku: "" },
    ]);
  };

  const removeVariant = (idx) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== idx));
  };

  // =============================
  // FORM SUBMIT
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload all images first
    let imageUrls = [];
    if (imageFiles.length > 0) {
      imageUrls = await uploadImagesToBackend();
    }

    const payload = {
  name: form.name,
  category: form.category,
  description: form.description,
  images: imageUrls,                        // [{url, public_id}]
image: imageUrls?.[0]?.url || null,       // backward compatibility
  active: 1,
  variants: variants.map((v) => ({
    label: v.label,
    price: parseFloat(v.price),
    mrp: v.mrp ? parseFloat(v.mrp) : null,
    stock: v.stock ? parseInt(v.stock) : 0,
    sku: v.sku || null,
  })),
};


    try {
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        alert("Error: " + (json.message || "Failed to add product"));
        return;
      }

      alert("Product + variants added successfully!");
      window.location.href = "/admin/products";
    } catch (err) {
      alert("Network error: Cannot reach backend");
      console.error(err);
    }
  };

  // =============================
  // UI RETURN
  // =============================
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Product Name */}
        <div>
          <label className="block font-medium text-red-600">Product Name</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium text-red-600">Category</label>
          <select
            className="w-full p-3 border rounded-lg"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select category</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Snacks">Snacks</option>
            <option value="Beverages">Beverages</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-red-600">Description</label>
          <textarea
            rows="4"
            className="w-full p-3 border rounded-lg"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Multiple Images */}
        <div>
          <label className="block font-medium text-red-600">
            Product Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full p-3 border rounded-lg"
            onChange={handleImageUpload}
          />

          {/* Previews */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-24 h-24 object-cover rounded border"
                  alt=""
                />
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Variants</h3>

          {variants.map((v, idx) => (
            <div key={idx} className="p-3 border rounded mb-3 space-y-2">
              <input
                type="text"
                placeholder="Variant label (e.g., 500g, 1kg)"
                className="w-full p-2 border rounded"
                value={v.label}
                onChange={(e) =>
                  handleVariantChange(idx, "label", e.target.value)
                }
                required
              />

              <input
                type="number"
                placeholder="Price"
                className="w-full p-2 border rounded"
                value={v.price}
                onChange={(e) =>
                  handleVariantChange(idx, "price", e.target.value)
                }
                required
              />

              <input
                type="number"
                placeholder="MRP (optional)"
                className="w-full p-2 border rounded"
                value={v.mrp}
                onChange={(e) =>
                  handleVariantChange(idx, "mrp", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Stock"
                className="w-full p-2 border rounded"
                value={v.stock}
                onChange={(e) =>
                  handleVariantChange(idx, "stock", e.target.value)
                }
              />

              <input
                type="text"
                placeholder="SKU"
                className="w-full p-2 border rounded"
                value={v.sku}
                onChange={(e) =>
                  handleVariantChange(idx, "sku", e.target.value)
                }
              />

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  className="text-red-500"
                >
                  Remove Variant
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            + Add Another Variant
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-lg text-lg font-semibold"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
