import { useEffect, useState } from "react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/api/orders", {
      headers: {
        "authorization": token
      }
    })
    .then(res => res.json())
    .then(data => setOrders(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <a
            href={`/order/${order.id}`}
            key={order.id}
            className="block p-4 bg-white shadow rounded"
          >
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {order.created_at}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
