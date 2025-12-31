import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:4000/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("ORDER API RESPONSE:", data);

        // 🛑 HARD SAFETY FIX
        const safeOrder = {
          ...data,
          items: Array.isArray(data?.items) ? data.items : [],
          address:
            typeof data?.address === "object" && data.address !== null
              ? data.address
              : {},
        };

        setOrder(safeOrder);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Order fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-4">Loading order details...</p>;
  if (!order) return <p className="p-4">Order not found</p>;

  const itemsTotal = order.items.reduce(
    (sum, i) => sum + Number(i.price || 0) * Number(i.qty || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">

      {/* HEADER */}
      <div className="bg-white p-4 rounded shadow flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Order #{order.id}</h2>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          {order.status}
        </span>
      </div>

      {/* ADDRESS */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Delivery Address</h3>
        <p>{order.address?.name}</p>
        <p>{order.address?.phone}</p>
        <p className="text-gray-600">{order.address?.address}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Items</h3>

        {order.items.length === 0 && (
          <p className="text-gray-500">No items found for this order.</p>
        )}

        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b py-2"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.qty}
              </p>
            </div>

            <p className="font-medium">
              ₹{item.price * item.qty}
            </p>
          </div>
        ))}
      </div>

      {/* PAYMENT */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between">
          <span>Items total</span>
          <span>₹{itemsTotal}</span>
        </div>

        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
          <span>Total Paid</span>
          <span>₹{order.total_amount}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/reorder/${order.id}`)}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Re-order
        </button>

        <button
          onClick={() =>
            window.open(
              `http://localhost:4000/api/invoice/${order.id}`,
              "_blank"
            )
          }
          className="px-4 py-2 border rounded"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
}
