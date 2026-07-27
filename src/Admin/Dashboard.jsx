import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
  products: 0,
  orders: 0,
  users: 0,
  revenue: 0,

  todayOrders: 0,
  pendingOrders: 0,
  outOfStock: 0,
  lowStock: 0,
});

  const [notifications, setNotifications] = useState([]);
  const [showBox, setShowBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const unreadCount = notifications.filter(
  (n) => !n.is_read
).length;
const handleBellClick = async () => {
  setShowBox(!showBox);
};

const loadNotifications = async () => {
  try {
    const res = await fetch(
      "http://localhost:4000/api/admin/notifications"
    );

    const data = await res.json();

    console.log("🔔 Notifications:", data);

    setNotifications(data);
  } catch (err) {
    console.error("Notification error:", err);
  }
};

// const handleBellClick = async () => {
//   setShowBox(!showBox);

//   try {
//     await fetch(
//       "http://localhost:4000/api/admin/notifications/read",
//       {
//         method: "PUT",
//       }
//     );

//     // Clear notifications immediately
//     setNotifications([]);
//   } catch (err) {
//     console.error(err);
//   }
// };

 useEffect(() => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    navigate("/admin/login");
    return;
  }

  const loadStats = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setStats({
  products: Number(data.products) || 0,
  orders: Number(data.orders) || 0,
  users: Number(data.users) || 0,
  revenue: Number(data.revenue) || 0,

  todayOrders: Number(data.todayOrders) || 0,
  pendingOrders: Number(data.pendingOrders) || 0,
  outOfStock: Number(data.outOfStock) || 0,
  lowStock: Number(data.lowStock) || 0,
});
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  loadStats();
  loadNotifications();

  const interval = setInterval(() => {
    loadNotifications();
  }, 5000);

  return () => clearInterval(interval);

}, [navigate]);

  if (loading) {
  return <div className="p-6 text-gray-600">Loading dashboard...</div>;
}

const unreadNotifications = notifications.filter(
  (n) => !n.is_read
);

const readNotifications = notifications.filter(
  (n) => n.is_read
);

return (
    <div className="p-6 relative">
     {/* 🔔 NOTIFICATION ICON */}
<div className="fixed top-6 right-6 z-50">
  <button
    onClick={handleBellClick}
    className="relative text-xl bg-white p-2 rounded-full shadow"
  >
    🔔

    {unreadCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
        {unreadCount}
      </span>
    )}
  </button>

  {/* DROPDOWN */}
  {showBox && (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-xl rounded-lg p-3">
      <h4 className="font-semibold mb-2">
        Notifications
      </h4>

      {unreadNotifications.length === 0 &&
readNotifications.length === 0 ? (
  <p className="text-gray-500 text-sm">
    No notifications
  </p>
) : (
  <>
    {/* UNREAD */}
    {unreadNotifications.map((n, i) => {
      let details = {};

      try {
        details =
          typeof n.message === "string"
            ? JSON.parse(n.message)
            : n.message;
      } catch {
        details = {};
      }

      return (
        <div
          key={i}
          onClick={async () => {
            try {
              await fetch(
                `http://localhost:4000/api/admin/notifications/read/${n.id}`,
                {
                  method: "PUT",
                }
              );

              setNotifications((prev) =>
                prev.map((item) =>
                  item.id === n.id
                    ? { ...item, is_read: true }
                    : item
                )
              );

              if (details.orderId) {
                navigate(`/admin/orders/${details.orderId}`);
              }
            } catch (err) {
              console.error(err);
            }
          }}
          className="border-b py-3 text-sm cursor-pointer hover:bg-gray-100 rounded"
        >
          <p className="font-semibold">
            🛒 Order #{details.orderId || "N/A"}
          </p>

          <p>👤 User #{details.userId || "N/A"}</p>

          <p>💰 ₹{details.totalAmount || 0}</p>

          <p>💳 {details.paymentMethod || "-"}</p>

          <p className="text-xs text-gray-400 mt-1">
            {n.created_at}
          </p>
        </div>
      );
    })}

    {/* READ */}
    {readNotifications.length > 0 && (
      <>
        <hr className="my-3" />

        <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">
          Read Notifications
        </h5>

        {readNotifications.map((n, i) => {
          let details = {};

          try {
            details =
              typeof n.message === "string"
                ? JSON.parse(n.message)
                : n.message;
          } catch {
            details = {};
          }

          return (
            <div
              key={`read-${i}`}
              className="border-b py-3 text-sm opacity-60"
            >
              <p className="font-semibold">
                🛒 Order #{details.orderId || "N/A"}
              </p>

              <p>👤 User #{details.userId || "N/A"}</p>

              <p>💰 ₹{details.totalAmount || 0}</p>

              <p>💳 {details.paymentMethod || "-"}</p>

              <p className="text-xs text-gray-400 mt-1">
  {n.created_at}
</p>

<button
  onClick={() => {
    if (details.orderId) {
      navigate(`/admin/orders/${details.orderId}`);
    }
  }}
  className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
>
  View Details
</button>
            </div>
          );
        })}
      </>
    )}
  </>
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

  <DashboardCard
    title="Today's Orders"
    value={stats.todayOrders}
    onClick={() => navigate("/admin/orders?filter=today")}
  />

  <DashboardCard
    title="Pending Orders"
    value={stats.pendingOrders}
    onClick={() => navigate("/admin/orders?filter=pending")}
  />

  <DashboardCard
    title="Out of Stock"
    value={stats.outOfStock}
    valueClass="text-red-600"
    onClick={() => navigate("/admin/products?filter=outofstock")}
  />

  <DashboardCard
    title="Low Stock Alert"
    value={stats.lowStock}
    valueClass="text-orange-600"
    onClick={() => navigate("/admin/products?filter=lowstock")}
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