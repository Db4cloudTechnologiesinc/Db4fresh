
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:4000/api/admin/users/${id}/history`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading user history...</p>;
  if (error) return <p className="text-red-500">Failed to load history</p>;
  if (!data || !data.user) return <p>No user data found</p>;

  // ✅ FORMAT JOIN DATE SAFELY
  const joinedDate = data.user.created_at
    ? new Date(data.user.created_at).toLocaleDateString()
    : "N/A";

  return (
    <div className="space-y-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(`/admin/users/${id}`)}
        className="bg-gray-200 px-3 py-1 rounded"
      >
        ← Back to User
      </button>

      {/* ================= USER INFO ================= */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold text-lg mb-2">User Info</h2>
        <p><b>ID:</b> {data.user.id}</p>
        <p><b>Name:</b> {data.user.name}</p>
        <p><b>Email:</b> {data.user.email}</p>
        <p><b>Joined:</b> {joinedDate}</p>
      </div>

      {/* ================= ORDERS ================= */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold text-lg mb-2">Orders</h2>

        {data.orders && data.orders.length === 0 && (
          <p>No Orders</p>
        )}

        {data.orders && data.orders.map(order => (
          <div
            key={order.id}
            className="border-b py-2 text-sm"
          >
            <p>
              <b>Order #{order.id}</b> – ₹{order.total_amount}
            </p>
            <p>Status: {order.order_status}</p>
          </div>
        ))}
      </div>

      {/* ================= CANCELLATIONS (OPTIONAL) ================= */}
      {data.cancellations && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Cancellations</h2>

          {data.cancellations.length === 0
            ? "No Cancellations"
            : data.cancellations.map(c => (
                <div key={c.id} className="text-sm">
                  Order #{c.order_id} – {c.reason}
                </div>
              ))}
        </div>
      )}

      {/* ================= REFUNDS (OPTIONAL) ================= */}
      {data.refunds && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-2">Refunds</h2>

          {data.refunds.length === 0
            ? "No Refunds"
            : data.refunds.map(r => (
                <div key={r.id} className="text-sm">
                  ₹{r.amount} – {r.refund_status}
                </div>
              ))}
        </div>
      )}

    </div>
  );
}

