import { useEffect, useState } from "react";

export default function SupportTab() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: "ORDER",
    subject: "",
    message: "",
  });

  // ✅ SAFE TOKEN HANDLING
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || localStorage.getItem("token");

  /* =========================
     LOAD SUPPORT TICKETS
  ========================== */
  const loadTickets = async () => {
    if (!token) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/support", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Support API error:", err);
        setTickets([]); // ✅ prevent crash
        setLoading(false);
        return;
      }

      const data = await res.json();

      // ✅ ENSURE ARRAY
      setTickets(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Network error:", err);
      setTickets([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [token]);

  /* =========================
     SUBMIT SUPPORT TICKET
  ========================== */
  const submitTicket = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login to raise a support request");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit request");
        return;
      }

      alert(data.message || "Support request submitted");

      setForm({ category: "ORDER", subject: "", message: "" });
      loadTickets();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error");
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Help & Support</h3>

      {/* FAQs */}
      <div className="mb-6 bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">FAQs</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• How to cancel an order?</li>
          <li>• How do refunds work?</li>
          <li>• Wallet & reward points usage</li>
          <li>• Payment issues</li>
        </ul>
      </div>

      {/* CREATE TICKET */}
      <form onSubmit={submitTicket} className="space-y-3 max-w-md">
        <select
          className="w-full border p-2 rounded"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="ORDER">Order Issue</option>
          <option value="PAYMENT">Payment Issue</option>
          <option value="DELIVERY">Delivery Issue</option>
          <option value="APP">App Issue</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          className="w-full border p-2 rounded"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value })
          }
          required
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Describe your issue"
          rows="4"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Submit Request
        </button>
      </form>

      {/* MY TICKETS */}
      <div className="mt-8">
        <h4 className="font-semibold mb-3">My Support Requests</h4>

        {loading && (
          <p className="text-gray-500">Loading support requests...</p>
        )}

        {!loading && tickets.length === 0 && (
          <p className="text-gray-500">No support requests yet.</p>
        )}

        <div className="space-y-3">
          {Array.isArray(tickets) &&
            tickets.map((t) => (
              <div
                key={t.id}
                className="border p-3 rounded flex justify-between"
              >
                <div>
                  <p className="font-medium">{t.subject}</p>
                  <p className="text-sm text-gray-500">
                    {t.category} •{" "}
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold ${
                    t.status === "RESOLVED"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
