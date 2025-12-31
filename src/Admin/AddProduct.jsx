import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
    unit: "",
    weight: "",
    highlights: "",
    return_policy: "",
    seller_id: "",
  });

  // ⭐ Multiple images
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // ⭐ Product variants
  const [variants, setVariants] = useState([
    { variant_label: "", price: "", mrp: "", stock: "", sku: "" },
  ]);
  const navigate = useNavigate();
const token = localStorage.getItem("adminToken");

  /* =============================
     IMAGE UPLOAD
  ============================== */
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.images || [];
  } catch (err) {
    console.error("Upload error:", err);
    return [];
  }
};

  /* =============================
     VARIANT HANDLERS
  ============================== */
  const handleVariantChange = (idx, field, value) => {
    const updated = [...variants];
    updated[idx][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { variant_label: "", price: "", mrp: "", stock: "", sku: "" },
    ]);
  };

  const removeVariant = (idx) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== idx));
  };

  /* =============================
     SUBMIT
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrls = [];
    if (imageFiles.length > 0) {
      imageUrls = await uploadImagesToBackend();
    }

    const payload = {
      name: form.name,
      category: form.category,
      brand: form.brand,
      description: form.description,

      unit: form.unit,
      weight: form.weight || null,
      highlights: form.highlights || null,
      return_policy: form.return_policy || null,
      seller_id: form.seller_id || null,

      images: imageUrls,
      active: 1,

      variants: variants.map((v) => ({
        variant_label: v.variant_label,
        price: Number(v.price),
        mrp: v.mrp ? Number(v.mrp) : null,
        stock: v.stock ? Number(v.stock) : 0,
        sku: v.sku || null,
      })),
    };

    console.log("🟢 ADMIN PAYLOAD:", payload);

    try {
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
         alert(json.message || "Failed to add product");
         return;
      }

        alert("✅ Product added successfully!");
        navigate("/admin/products"); 

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  /* =============================
     UI
  ============================== */
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-red-600">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* PRODUCT NAME */}
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-3 border rounded-lg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        {/* CATEGORY */}
        <select
          className="w-full p-3 border rounded-lg"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Dairy">Dairy</option>
          <option value="Snacks">Snacks</option>
          <option value="Beverages">Beverages</option>
        </select>

        {/* BRAND */}
        <input
          type="text"
          placeholder="Brand (e.g. Amul)"
          className="w-full p-3 border rounded-lg"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />

        {/* DESCRIPTION */}
        <textarea
          rows="3"
          placeholder="Product Description"
          className="w-full p-3 border rounded-lg"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* WEIGHT + UNIT */}
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Weight / Quantity"
            className="w-full p-3 border rounded-lg"
            value={form.weight}
            onChange={(e) =>
              setForm({ ...form, weight: e.target.value })
            }
          />

          <select
            className="w-full p-3 border rounded-lg"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          >
            <option value="">Unit</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="L">L</option>
            <option value="pcs">pcs</option>
          </select>
        </div>

        {/* HIGHLIGHTS */}
        <textarea
          rows="3"
          placeholder="Key Highlights (use | to separate)"
          className="w-full p-3 border rounded-lg"
          value={form.highlights}
          onChange={(e) =>
            setForm({ ...form, highlights: e.target.value })
          }
        />

        {/* RETURN POLICY */}
        <textarea
          rows="2"
          placeholder="Return Policy"
          className="w-full p-3 border rounded-lg"
          value={form.return_policy}
          onChange={(e) =>
            setForm({ ...form, return_policy: e.target.value })
          }
        />

        {/* SELLER */}
        <input
          type="text"
          placeholder="Seller ID"
          className="w-full p-3 border rounded-lg"
          value={form.seller_id}
          onChange={(e) =>
            setForm({ ...form, seller_id: e.target.value })
          }
        />

        {/* IMAGES */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />

        {/* IMAGE PREVIEWS */}
        <div className="flex gap-2 flex-wrap">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="preview"
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>

        {/* VARIANTS */}
        <h3 className="font-semibold text-red-600">Variants</h3>

        {variants.map((v, idx) => (
          <div key={idx} className="border p-3 rounded space-y-2">
            <input
              type="text"
              placeholder="Variant Label (500 g, 1 kg)"
              value={v.variant_label}
              onChange={(e) =>
                handleVariantChange(idx, "variant_label", e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={v.price}
              onChange={(e) =>
                handleVariantChange(idx, "price", e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="MRP"
              value={v.mrp}
              onChange={(e) =>
                handleVariantChange(idx, "mrp", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={(e) =>
                handleVariantChange(idx, "stock", e.target.value)
              }
            />

            <input
              type="text"
              placeholder="SKU"
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
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          + Add Variant
        </button>

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-lg font-semibold"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
