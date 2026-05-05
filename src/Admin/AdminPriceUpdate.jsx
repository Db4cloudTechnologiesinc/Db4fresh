
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPriceUpdate() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");

  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [priceHistory, setPriceHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* ================= CATEGORY → SUBCATEGORY ================= */
  const handleCategory = async (id) => {
    setCategoryId(id);

    setSubcategoryId("");
    setProductId("");
    setVariantId("");
    setProducts([]);
    setVariants([]);

    try {
      const res = await axios.get(
        `http://localhost:4000/api/subcategories/by-category/${id}`
      );
      setSubcategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SUBCATEGORY → PRODUCTS ================= */
  const handleSubcategory = async (id) => {
    setSubcategoryId(id);

    setProductId("");
    setVariantId("");
    setVariants([]);

    try {
      const res = await axios.get(
        `http://localhost:4000/api/products/subcategory/${id}`
      );
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= PRODUCT → VARIANTS ================= */
  const handleProduct = async (id) => {
    setProductId(id);
    setVariantId("");

    try {
      const res = await axios.get(
        `http://localhost:4000/api/products/${id}`
      );
      setVariants(res.data.variants || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= VARIANT SELECT ================= */
  // const handleVariant = (id) => {
  //   setVariantId(id);

  //   const selected = variants.find((v) => v.id == id);
  //   if (selected) {
  //     setPrice(selected.price);
  //     setMrp(selected.mrp);
  //   }
  // };
  const handleVariant = async (id) => {
  setVariantId(id);

  const selected = variants.find((v) => v.id == id);
  if (selected) {
    setPrice(selected.price);
    setMrp(selected.mrp);
  }

  // 🔥 FETCH PRICE HISTORY
  try {
    const res = await axios.get(
      `http://localhost:4000/api/products/price-history/${id}`
    );
    setPriceHistory(res.data);
  } catch (err) {
    console.error(err);
  }
};

  /* ================= UPDATE PRICE ================= */
  const handleUpdatePrice = async () => {
    if (!variantId || !price) {
      return alert("Please select variant and enter price");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:4000/api/products/update-price",
        {
          variant_id: variantId,
          price,
          mrp: mrp || price,
        }
      );

      alert("✅ Price updated successfully");

      // 🔥 Refresh variants (important)
      await handleProduct(productId);

      setVariantId("");
      setPrice("");
      setMrp("");

    } catch (err) {
      console.error(err);
      alert("❌ Error updating price");
    } finally {
      setLoading(false);
    }
  };
  const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "14px"
};
const thStyle = {
  padding: "8px",
  border: "1px solid #ddd",
  textAlign: "left"
};

const tdStyle = {
  padding: "8px",
  border: "1px solid #ddd"
};

  return (
    <div style={{
  maxWidth: "420px",
  margin: "40px auto",
  padding: "25px",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
}}>
  <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
    💰 Update Product Price
  </h2>

  {/* CATEGORY */}
  <div style={{ marginBottom: "15px" }}>
    <label style={{ fontWeight: "500" }}>Category</label>
    <select
      value={categoryId}
      onChange={(e) => handleCategory(e.target.value)}
      style={inputStyle}
    >
      <option value="">Select Category</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  </div>

  {/* SUBCATEGORY */}
  <div style={{ marginBottom: "15px" }}>
    <label>Subcategory</label>
    <select
      value={subcategoryId}
      onChange={(e) => handleSubcategory(e.target.value)}
      disabled={!categoryId}
      style={inputStyle}
    >
      <option value="">Select Subcategory</option>
      {subcategories.map((s) => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </select>
  </div>

  {/* PRODUCT */}
  <div style={{ marginBottom: "15px" }}>
    <label>Product</label>
    <select
      value={productId}
      onChange={(e) => handleProduct(e.target.value)}
      disabled={!subcategoryId}
      style={inputStyle}
    >
      <option value="">Select Product</option>
      {products.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  </div>

  {/* VARIANT */}
  <div style={{ marginBottom: "15px" }}>
    <label>Variant</label>
    <select
      value={variantId}
      onChange={(e) => handleVariant(e.target.value)}
      disabled={!productId}
      style={inputStyle}
    >
      <option value="">Select Variant</option>
      {variants.map((v) => (
        <option key={v.id} value={v.id}>
          {v.variant_label}
        </option>
      ))}
    </select>
  </div>

  {/* CURRENT PRICE */}
  {variantId && (
    <div style={{
      background: "#f8f9fa",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "15px",
      fontSize: "14px"
    }}>
      <div>Current Price: <b>₹{price}</b></div>
      <div>MRP: <b>₹{mrp}</b></div>
    </div>
  )}

  {/* NEW PRICE */}
  <div style={{ marginBottom: "15px" }}>
    <label>New Price</label>
    <input
      type="number"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      style={inputStyle}
    />
  </div>

  {/* MRP */}
  <div style={{ marginBottom: "20px" }}>
    <label>MRP</label>
    <input
      type="number"
      value={mrp}
      onChange={(e) => setMrp(e.target.value)}
      style={inputStyle}
    />
  </div>

  {/* BUTTON */}
  <button
    onClick={handleUpdatePrice}
    disabled={!variantId || !price || loading}
    style={{
      width: "100%",
      padding: "12px",
      background: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer"
    }}
  >
    {loading ? "Updating..." : "Update Price"}
  </button>
  {/* ================= PRICE HISTORY ================= */}
{priceHistory.length > 0 && (
  <div style={{ marginTop: "25px" }}>
    <h3 style={{ marginBottom: "10px" }}>📊 Price History</h3>

    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px"
    }}>
      <thead>
        <tr style={{ background: "#f1f1f1" }}>
          <th style={thStyle}>Price</th>
          <th style={thStyle}>MRP</th>
          <th style={thStyle}>Date</th>
        </tr>
      </thead>

      <tbody>
        {priceHistory.map((p, index) => (
          <tr
            key={index}
            style={{
              background: index === 0 ? "#e8f5e9" : "#fff"
            }}
          >
            <td style={tdStyle}>₹{p.price}</td>
            <td style={tdStyle}>₹{p.mrp}</td>
            <td style={tdStyle}>
              {new Date(p.created_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

  
</div>
 );
}