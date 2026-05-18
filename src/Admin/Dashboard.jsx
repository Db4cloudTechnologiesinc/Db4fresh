import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [showBox, setShowBox] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    const loadStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/admin/dashboard", // ✅ FIXED URL
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        console.log("📊 Dashboard stats:", data);

        setStats({
          products: Number(data.products) || 0,
          orders: Number(data.orders) || 0,
          users: Number(data.users) || 0,
          revenue: Number(data.revenue) || 0,
        });

      } catch (error) {
        console.error("❌ Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [navigate]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 relative">
      {/* 🔔 NOTIFICATION ICON */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setShowBox(!showBox)}
          className="relative text-xl bg-white p-2 rounded-full shadow"
        >
          🔔
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {/* 🔔 DROPDOWN */}
        {showBox && (
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-xl rounded-lg p-3">
            <h4 className="font-semibold mb-2">Notifications</h4>

            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No notifications
              </p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="border-b py-2 text-sm">
                  {/* Order Info */}
                  <p className="font-semibold">
                    🛒 Order #{n.orderId || "N/A"}
                  </p>

                  <p>👤 {n.user || "Customer"}</p>

                  <p>💰 ₹{n.total || 0}</p>

                  {/* Products */}
                  {n.products?.length > 0 && (
                    <ul className="text-xs text-gray-600 mt-1">
                      {n.products.map((p, idx) => (
                        <li key={idx}>
                          • {p.name} × {p.qty}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Time */}
                  <p className="text-xs text-gray-400 mt-1">
                    {n.time}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* DASHBOARD CONTENT */}
      <h2 className="text-2xl font-semibold mb-6">
        Dashboard Overview
      </h2>

      <p className="text-xs text-gray-400 mb-4">
        Products: {stats.products} | Orders: {stats.orders} | Users:{" "}
        {stats.users} | Revenue: ₹{stats.revenue}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard
          title="Products"
          value={stats.products}
          onClick={() => navigate("/admin/products")}
        />

        <DashboardCard
          title="Orders"
          value={stats.orders}
          onClick={() => navigate("/admin/orders")}
        />

        <DashboardCard
          title="Users"
          value={stats.users}
          onClick={() => navigate("/admin/users")}
        />

        <DashboardCard
          title="Revenue"
          value={`₹${stats.revenue}`}
          valueClass="text-green-600"
          onClick={() => navigate("/admin/revenue")}
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, onClick, valueClass = "" }) {
  return (
    <div
      onClick={onClick}
      className="p-5 bg-white shadow rounded cursor-pointer
                 hover:shadow-lg hover:scale-[1.02] transition"
    >
      <p className="text-gray-500">{title}</p>
      <p className={`text-xl font-bold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}