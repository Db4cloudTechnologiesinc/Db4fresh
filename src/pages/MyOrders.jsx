import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000";

export default function MyOrders() {
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
        console.error("MY ORDERS ERROR:", err);
        setOrders([]);
        setLoading(false);
      });
  }, [token]);

  /* ================= REORDER ================= */
  const handleReorder = (order) => {
    // store reorder data
    localStorage.setItem(
      "checkout_data",
      JSON.stringify({
        items: order.items,
        address: order.delivery_address,
        deliverySlot: order.delivery_slot,
        totalAmount: order.total_amount,
        reorder: true,
      })
    );

    // ✅ ONLY navigate to checkout
    navigate("/checkout");
  };

  if (loading) return <p className="p-4">Loading orders...</p>;
  if (orders.length === 0)
    return <p className="p-4">No orders placed yet</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-4 rounded shadow hover:bg-gray-50"
        >
          <div className="flex justify-between">
            <span className="font-medium">Order #{order.id}</span>
            <span className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between items-center mt-3">
            <span>Status: {order.order_status}</span>
            <span className="font-semibold">
              ₹{order.total_amount}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(`/orders/${order.id}`)}
              className="px-3 py-1 text-sm border rounded"
            >
              View Details
            </button>

            <button
              type="button"
              onClick={() => handleReorder(order)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Reorder
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
