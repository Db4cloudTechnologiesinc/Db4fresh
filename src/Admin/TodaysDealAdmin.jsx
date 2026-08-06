import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TodaysDealAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [syncAt, setSyncAt] = useState("");
  const [syncing, setSyncing] = useState(false);

  // Per-row draft values for the "add" form (productId -> {discount, expiresAt})
  const [drafts, setDrafts] = useState({});

  const token = localStorage.getItem("adminToken");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getDraft = (id) => drafts[id] || { discount_percent: "", expires_at: "" };

  const updateDraft = (id, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...getDraft(id), [field]: value },
    }));
  };

  const addToDeal = async (product) => {
    const draft = getDraft(product.id);
    const discount = Number(draft.discount_percent);

    if (!discount || discount <= 0 || discount >= 100) {
      alert("Enter a discount percentage between 1 and 99");
      return;
    }
    if (!draft.expires_at) {
      alert("Pick an expiry date and time");
      return;
    }

    try {
      setBusyId(product.id);

      const res = await fetch(`http://localhost:4000/api/products/${product.id}/deal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  discount: discount,
  expiresAt: draft.expires_at,
}),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("ADD TO DEAL FAILED:", res.status, data);
        alert(data.message || `Failed to add deal (status ${res.status})`);
        return;
      }

      // clear this row's draft now that it's saved
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });

      await fetchProducts();
    } catch (err) {
      console.error("ADD TO DEAL ERROR:", err);
      alert("Network error while adding to deal. Check your connection or the server.");
    } finally {
      setBusyId(null);
    }
  };

  const removeFromDeal = async (product) => {
    try {
      setBusyId(product.id);

      const res = await fetch(`http://localhost:4000/api/products/${product.id}/deal`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("REMOVE FROM DEAL FAILED:", res.status, data);
        alert(data.message || `Failed to remove deal (status ${res.status})`);
        return;
      }

      await fetchProducts();
    } catch (err) {
      console.error("REMOVE FROM DEAL ERROR:", err);
      alert("Network error while removing from deal. Check your connection or the server.");
    } finally {
      setBusyId(null);
    }
  };

  const syncAllExpiry = async () => {
    if (!syncAt) {
      alert("Pick a date and time first");
      return;
    }
    try {
      setSyncing(true);

      const res = await fetch("http://localhost:4000/api/products/today-deal/sync-expiry", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expires_at: syncAt }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("SYNC EXPIRY FAILED:", res.status, data);
        alert(data.message || `Failed to sync expiry (status ${res.status})`);
        return;
      }

      await fetchProducts();
    } catch (err) {
      console.error("SYNC EXPIRY ERROR:", err);
      alert("Network error while syncing expiry. Check your connection or the server.");
    } finally {
      setSyncing(false);
    }
  };

  const getImageUrl = (p) => {
    if (p.image) {
      return p.image.startsWith("http") ? p.image : `http://localhost:4000${p.image}`;
    }
    try {
      const imgs = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
      return imgs?.[0]?.url || "/placeholder.png";
    } catch {
      return "/placeholder.png";
    }
  };

  const formatExpiry = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString() : "-");

  if (loading) return <p className="p-6">Loading...</p>;

  const dealProducts = products.filter(
  (p) => Number(p.today_deal) === 1
);

  const nonDealProducts = products
  .filter((p) => Number(p.today_deal) !== 1)
    .filter((p) => (search ? p.name.toLowerCase().includes(search.toLowerCase()) : true));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Today's Deal</h2>
        <p className="text-sm text-gray-500">
          Set a discount % and an exact expiry date/time per product. This never changes the
          product's real price — the discount only applies to the Today's Deal display and turns
          off automatically once the expiry passes.
        </p>
      </div>

      {/* ================= CURRENT DEAL PRODUCTS ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
        <div className="p-4 border-b flex justify-between items-center flex-wrap gap-3">
          <h3 className="font-semibold">Currently in Today's Deal ({dealProducts.length})</h3>

          {dealProducts.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Set all to expire at</span>
              <input
                type="datetime-local"
                step="1"
                value={syncAt}
                onChange={(e) => setSyncAt(e.target.value)}
                className="border p-1 rounded text-sm"
              />
              <button
                onClick={syncAllExpiry}
                disabled={syncing}
                className="bg-purple-100 text-purple-600 px-3 py-1 rounded text-xs disabled:opacity-50"
              >
                {syncing ? "Syncing..." : "Sync All to Same Expiry"}
              </button>
            </div>
          )}
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Real Price</th>
              <th className="p-3">Deal Discount</th>
              <th className="p-3">Expires At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dealProducts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img src={getImageUrl(p)} className="w-16 h-16 object-contain mx-auto" alt={p.name} />
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-gray-600">₹{p.price}</td>
                <td className="p-3 text-blue-600 font-semibold">{p.deal_discount}% OFF</td>
                <td className="p-3 text-xs text-gray-500">{formatExpiry(p.deal_expires_at)}</td>
                <td className="p-3 flex gap-2">
                  <button
                    disabled={busyId === p.id}
                    onClick={() => removeFromDeal(p)}
                    className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs disabled:opacity-50"
                  >
                    {busyId === p.id ? "..." : "Remove from Deal"}
                  </button>
                  <Link
                    to={`/admin/products/update/${p.id}`}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
                  >
                    Edit Product
                  </Link>
                </td>
              </tr>
            ))}

            {dealProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No products are currently marked as Today's Deal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MORE PRODUCTS ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Add products to Today's Deal</h3>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-64"
          />
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Real Price</th>
              <th className="p-3">Discount %</th>
              <th className="p-3">Expires At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nonDealProducts.slice(0, 20).map((p) => {
              const draft = getDraft(p.id);
              return (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img src={getImageUrl(p)} className="w-16 h-16 object-contain mx-auto" alt={p.name} />
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-gray-600">₹{p.price}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      placeholder="e.g. 30"
                      value={draft.discount_percent}
                      onChange={(e) => updateDraft(p.id, "discount_percent", e.target.value)}
                      className="border p-1 rounded w-20"
                    />
                    %
                  </td>
                  <td className="p-3">
                    <input
                      type="datetime-local"
                      value={draft.expires_at}
                      onChange={(e) => updateDraft(p.id, "expires_at", e.target.value)}
                      className="border p-1 rounded"
                    />
                  </td>
                  <td className="p-3">
                    <button
                      disabled={busyId === p.id}
                      onClick={() => addToDeal(p)}
                      className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs disabled:opacity-50"
                    >
                      {busyId === p.id ? "..." : "Add to Deal"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {nonDealProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No matching products.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {nonDealProducts.length > 20 && (
          <p className="text-xs text-gray-400 p-3">
            Showing first 20 results — refine your search to narrow further.
          </p>
        )}
      </div>
    </div>
  );
}
