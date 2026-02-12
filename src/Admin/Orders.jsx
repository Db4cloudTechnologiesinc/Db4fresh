
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TABS = [
  { label: "All Orders", value: "all" },
  { label: "PLACED", value: "PLACED" },
  { label: "CONFIRMED", value: "CONFIRMED" },
  { label: "DELIVERED", value: "DELIVERED" },
  { label: "CANCELLED", value: "CANCELLED" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        // 🔒 SAFETY: ensure array
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("ORDERS FETCH ERROR:", err);
        setOrders([]);
      });
  }, []);

  /* ================= FILTER ================= */
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.order_status === activeTab);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Orders</h2>

      {/* ===== STATUS TABS ===== */}
      <div className="flex gap-3 border-b pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-t ${
              activeTab === tab.value
                ? "bg-white border border-b-0 font-semibold"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== ORDERS TABLE ===== */}
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">User ID</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Payment</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3 font-medium">
                  #{String(order.id).padStart(4, "0")}
                </td>

                <td className="p-3">{order.user_id ?? "-"}</td>

                <td className="p-3 font-semibold">
                  ₹{order.total_amount}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.payment_status || "pending"}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.order_status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.order_status === "PLACED" ||
                          order.order_status === "CONFIRMED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
