
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:4000/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder({
          order: data.order,
          items: Array.isArray(data.items) ? data.items : [],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  // ✅ DOWNLOAD INVOICE FUNCTION
  const downloadInvoice = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/orders/invoice/${order.order.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Invoice download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${order.order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to download invoice");
    }
  };

  if (loading) return <p className="p-4">Loading order...</p>;
  if (!order?.order) return <p className="p-4">Order not found</p>;

  const itemsTotal = order.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">

      {/* HEADER */}
      <div className="bg-white rounded-lg p-4 shadow flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Order #{order.order.id}
          </h2>
          <p className="text-sm text-gray-500">
            {new Date(order.order.created_at).toLocaleString()}
          </p>
        </div>

        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          {order.order.order_status}
        </span>
      </div>

      {/* ITEMS */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-semibold mb-3">Items</h3>

        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 border-b py-3 last:border-none"
          >
            <img
              src={
                item.image
                  ? item.image.startsWith("http")
                    ? item.image
                    : `http://localhost:4000/${item.image}`
                  : "/placeholder.png"
              }
              alt={item.name}
              className="w-16 h-16 object-cover rounded border"
            />

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} × ₹{item.price}
              </p>
            </div>

            <p className="font-semibold">
              ₹{item.quantity * item.price}
            </p>
          </div>
        ))}
      </div>

      {/* DELIVERY ADDRESS */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-semibold mb-2">Delivery Address</h3>

        <div className="border-l-4 border-red-500 pl-3 text-sm text-gray-700 space-y-1">
          <p className="font-medium text-gray-900">
            {order.order.address_name || "Home"}
          </p>

          <p className="text-gray-600">
            {[
              order.order.house_no,
              order.order.street,
              order.order.area,
              order.order.city,
              order.order.state,
              order.order.pincode,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          {order.order.phone && (
            <p className="mt-1 text-gray-500">
              📞 {order.order.phone}
            </p>
          )}
        </div>
      </div>

      {/* BILL SUMMARY */}
      <div className="bg-white rounded-lg p-4 shadow space-y-2">
        <h3 className="font-semibold mb-2">Bill Summary</h3>

        <div className="flex justify-between text-sm">
          <span>Items total</span>
          <span>₹{itemsTotal}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Delivery fee</span>
          <span className="text-green-600">FREE</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Platform fee</span>
          <span>₹0</span>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total Paid</span>
          <span>₹{order.order.total_amount}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/reorder/${order.order.id}`)}
          className="flex-1 py-2 bg-red-600 text-white rounded"
        >
          Re-order
        </button>

        <button
          onClick={downloadInvoice}
          className="flex-1 py-2 border rounded hover:bg-gray-50"
        >
          📄 Download Invoice
        </button>
      </div>
    </div>
  );
}
