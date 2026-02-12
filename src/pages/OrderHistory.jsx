import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000";

export default function OrderHistory() {
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
        console.error("ORDER HISTORY ERROR:", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading orders...</p>;

  if (orders.length === 0) {
    return <p className="p-4">No orders placed yet.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => navigate(`/orders/${order.id}`)}
          className="border p-4 rounded cursor-pointer hover:bg-gray-50"
        >
          <div className="flex justify-between">
            <span className="font-semibold">
              Order #{order.id}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between mt-2">
            <span>Status: {order.order_status}</span>
            <span className="font-semibold">
              ₹{order.total_amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
