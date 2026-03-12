 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 
export default function AddProduct() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
 
  /* =============================
     FORM STATE
  ============================== */
  const [form, setForm] = useState({
    name: "",
   
    category_id: "",
    subcategory_id: "",
    brand: "",
    description: "",
    unit: "",
    weight: "",
    highlights: "",
    return_policy: "",
    seller_id: "",
    manufactureDate: "",
    expiryDate: "",
  });
 
  /* =============================
     CATEGORY / SUBCATEGORY
  ============================== */
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
 
  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);
 
  useEffect(() => {
    if (!form.category_id) {
      setSubCategories([]);
      return;
    }
 
    fetch(
      `http://localhost:4000/api/subcategories/${form.category_id}`
    )
      .then((res) => res.json())
      .then(setSubCategories)
      .catch(console.error);
  }, [form.category_id]);
 
  /* =============================
     IMAGES
  ============================== */
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
 
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };
 
  const uploadImages = async () => {
    if (!imageFiles.length) return [];
 
    const data = new FormData();
    imageFiles.forEach((img) => data.append("images", img));
 
    const res = await fetch(
      "http://localhost:4000/api/products/upload",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      }
    );
 
    const json = await res.json();
    return json.images || [];
  };
 
  /* =============================
     VARIANTS
  ============================== */
  const [variants, setVariants] = useState([
    { variant_label: "", price: "", mrp: "", stock: "", sku: "" },
  ]);
 
  const updateVariant = (i, key, value) => {
    const copy = [...variants];
    copy[i][key] = value;
    setVariants(copy);
  };
 
  const addVariant = () =>
    setVariants([
      ...variants,
      { variant_label: "", price: "", mrp: "", stock: "", sku: "" },
    ]);
 
  const removeVariant = (i) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, idx) => idx !== i));
  };
 
  /* =============================
     SUBMIT
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (
      new Date(form.expiryDate) <=
      new Date(form.manufactureDate)
    ) {
      alert("Expiry date must be after manufacture date");
      return;
    }
 
    if (!form.category_id || !form.subcategory_id) {
      alert("Category and Subcategory are required");
      return;
    }
 
    const images = await uploadImages();
 
    const payload = {
      name: form.name,
      category_id: Number(form.category_id),
      subcategory_id: Number(form.subcategory_id),
      brand: form.brand || null,
      description: form.description || null,
      unit: form.unit || null,
      weight: form.weight || null,
      highlights: form.highlights || null,
      return_policy: form.return_policy || null,
      seller_id: form.seller_id || null,
      manufacture_date: form.manufactureDate,
      expiry_date: form.expiryDate,
      images,
      active: 1,
      variants: variants
        .filter((v) => v.variant_label && v.price)
        .map((v) => ({
          variant_label: v.variant_label,
          price: Number(v.price),
          mrp: v.mrp ? Number(v.mrp) : null,
          stock: v.stock ? Number(v.stock) : 0,
          sku: v.sku || null,
        })),
    };
 
    const res = await fetch(
      "http://localhost:4000/api/products",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
 
    const json = await res.json();
    if (!res.ok) {
      alert(json.message || "Failed to add product");
      return;
    }
 
    alert("✅ Product added successfully");
    navigate("/admin/products");
  };
 
  /* =============================
     UI
  ============================== */
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-red-600">
        Add Product
      </h2>
 
      <form onSubmit={handleSubmit} className="space-y-4">
 
        <input
          className="w-full p-3 border rounded"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />
 
        {/* CATEGORY */}
        <select
          className="w-full p-3 border rounded"
          value={form.category_id}
          onChange={(e) =>
            setForm({
              ...form,
              category_id: e.target.value,
              subcategory_id: "",
            })
          }
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
 
        {/* SUBCATEGORY (DEPENDENT DROPDOWN) */}
        <select
          className="w-full p-3 border rounded"
          value={form.subcategory_id}
          onChange={(e) =>
            setForm({
              ...form,
              subcategory_id: e.target.value,
            })
          }
          disabled={!form.category_id}
          required
        >
          <option value="">
            {form.category_id
              ? "Select Subcategory"
              : "Select Category First"}
          </option>
 
          {subCategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
 
        <input
          className="w-full p-3 border rounded"
          placeholder="Brand"
          value={form.brand}
          onChange={(e) =>
            setForm({ ...form, brand: e.target.value })
          }
        />
 
        <textarea
          className="w-full p-3 border rounded"
          placeholder="Description"
          rows="3"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
 
        <input
          type="date"
          className="w-full p-3 border rounded"
          value={form.manufactureDate}
          onChange={(e) =>
            setForm({ ...form, manufactureDate: e.target.value })
          }
          required
        />
 
        <input
          type="date"
          className="w-full p-3 border rounded"
          value={form.expiryDate}
          onChange={(e) =>
            setForm({ ...form, expiryDate: e.target.value })
          }
          required
        />
 
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
 
        <div className="flex gap-2 flex-wrap">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-20 h-20 rounded"
            />
          ))}
        </div>
 
        {/* VARIANTS
        <h3 className="font-semibold text-red-600">
          Variants
        </h3>
 
        {variants.map((v, i) => (
          <div key={i} className="border p-3 rounded space-y-2">
            <input
              placeholder="Label"
              value={v.variant_label}
              onChange={(e) =>
                updateVariant(
                  i,
                  "variant_label",
                  e.target.value
                )
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={v.price}
              onChange={(e) =>
                updateVariant(i, "price", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={(e) =>
                updateVariant(i, "stock", e.target.value)
              }
            />
            {variants.length > 1 && (
              <button
                type="button"
                className="text-red-500"
                onClick={() => removeVariant(i)}
              >
                Remove
              </button>
            )}
          </div>
        ))} */}
 {/* VARIANTS */}
<h3 className="font-semibold text-red-600">Variants</h3>

{variants.map((v, i) => (
  <div key={i} className="border p-4 rounded-lg space-y-3">

    <div className="grid grid-cols-4 gap-3">

      {/* VARIANT LABEL */}
      <input
        className="border p-2 rounded"
        placeholder="Label (ex: 500 g)"
        value={v.variant_label}
        onChange={(e) =>
          updateVariant(i, "variant_label", e.target.value)
        }
      />

      {/* MRP */}
      <input
        type="number"
        className="border p-2 rounded"
        placeholder="MRP"
        value={v.mrp}
        onChange={(e) =>
          updateVariant(i, "mrp", e.target.value)
        }
      />

      {/* PRICE */}
      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Price"
        value={v.price}
        onChange={(e) =>
          updateVariant(i, "price", e.target.value)
        }
      />

      {/* STOCK */}
      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Stock"
        value={v.stock}
        onChange={(e) =>
          updateVariant(i, "stock", e.target.value)
        }
      />

    </div>

    {/* REMOVE BUTTON */}
    {variants.length > 1 && (
      <button
        type="button"
        className="text-red-500 text-sm"
        onClick={() => removeVariant(i)}
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
 
        <button className="w-full bg-black text-white p-3 rounded">
          Save Product
        </button>
      </form>
    </div>
  );
}
 
 
 