

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000";

const statusColor = (status) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "PLACED":
      return "bg-blue-100 text-blue-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ORDERS TAB ERROR:", err);
        setOrders([]);
        setLoading(false);
      });
  }, [token]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="text-gray-500 text-center py-10">
        Loading your orders...
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium">No orders yet 🛒</p>
        <p className="text-gray-500 mt-2">
          Looks like you haven’t placed any orders.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  /* ================= ORDERS LIST ================= */
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg p-4 bg-white shadow-sm hover:shadow transition"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">
                Order #{order.id}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                order.order_status
              )}`}
            >
              {order.order_status}
            </span>
          </div>

          {/* INFO */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-600">
              Payment:{" "}
              <span className="font-medium">
                {order.payment_method}
              </span>
            </p>

            <p className="text-lg font-semibold">
              ₹{order.total_amount}
            </p>
          </div>

          {/* ACTION */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigate(`/orders/${order.id}`)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
