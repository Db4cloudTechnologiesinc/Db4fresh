import React, { useEffect, useState } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-6 text-center">No orders found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow p-5 space-y-3"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                Order #{order.id}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <div className="border-t pt-3 space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between font-semibold border-t pt-3">
            <span>Total</span>
            <span>₹{order.total_amount}</span>
          </div>

          {/* ADDRESS */}
          {order.address && (
            <div className="text-sm text-gray-600 border-t pt-3">
              <p className="font-semibold">Delivery Address</p>
              <p>
                {order.address.name}, {order.address.house},{" "}
                {order.address.street}, {order.address.city} -{" "}
                {order.address.pincode}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
