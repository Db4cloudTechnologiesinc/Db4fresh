import { useEffect, useState } from "react";
import axios from "axios";

export default function BulkPriceUpdate() {
  const [products, setProducts] = useState([]);

  /* LOAD PRODUCTS */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:4000/api/products");
    setProducts(res.data);
  };

  /* HANDLE CHANGE */
  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  /* SAVE ALL */
  const handleSave = async () => {
    try {
      const payload = products.map((p) => ({
        variant_id: p.variant_id,
        price: p.price,
        mrp: p.mrp
      }));

      await axios.post(
        "http://localhost:4000/api/products/bulk-update-price",
        payload
      );

      alert("✅ Bulk update successful");

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Error updating");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Bulk Price Update</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Product</th>
            <th style={th}>Variant</th>
            <th style={th}>Price</th>
            <th style={th}>MRP</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <tr key={i}>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.variant_label}</td>

              <td style={td}>
                <input
                  type="number"
                  value={p.price || ""}
                  onChange={(e) =>
                    handleChange(i, "price", e.target.value)
                  }
                />
              </td>

              <td style={td}>
                <input
                  type="number"
                  value={p.mrp || ""}
                  onChange={(e) =>
                    handleChange(i, "mrp", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "green",
          color: "#fff",
          border: "none"
        }}
      >
        Save All
      </button>
    </div>
  );
}

const th = {
  border: "1px solid #ddd",
  padding: "10px",
  background: "#f5f5f5"
};

const td = {
  border: "1px solid #ddd",
  padding: "10px"
};