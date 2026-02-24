import { useState, useEffect } from "react";
import axios from "axios";

export default function DeliveryHistory() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalEarnings: 0,
  });

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("/api/delivery/history", {
        params: { from, to },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(res.data.orders || []);
      setSummary({
        totalOrders: res.data.totalOrders || 0,
        totalEarnings: res.data.totalEarnings || 0,
      });

    } catch (err) {
      console.error("History Error:", err);
      setError("Failed to load delivery history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Delivery History</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Date Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          className="border p-2 rounded"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button
          onClick={fetchHistory}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold">{summary.totalOrders}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-gray-500">Total Earnings</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{summary.totalEarnings}
          </p>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white shadow rounded-xl p-6">
        {orders.length === 0 ? (
          <p>No completed deliveries found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border-b py-3 flex justify-between"
            >
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {order.delivered_at
                    ? new Date(order.delivered_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="text-green-600 font-bold">
                ₹{order.delivery_fee}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}