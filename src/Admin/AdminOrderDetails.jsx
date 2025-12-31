import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/orders/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!order) return <p>Loading order...</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 mb-4"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold mb-4">
        Order #{String(order.id).padStart(4, "0")}
      </h2>

      <div className="space-y-2">
        <p><b>User:</b> {order.user_name}</p>
        <p><b>Amount:</b> ₹{order.total_amount}</p>
        <p><b>Status:</b> {order.order_status}</p>
        <p><b>Payment:</b> {order.payment_method || "COD"}</p>
        <p><b>Date:</b> {new Date(order.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
