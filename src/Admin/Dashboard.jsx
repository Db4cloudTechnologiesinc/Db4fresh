import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function loadCounts() {
      // ===== 1️⃣ GET PRODUCTS =====
      try {
        const res = await fetch("http://localhost:4000/api/products");
        const data = await res.json();

        setCounts(prev => ({
          ...prev,
          products: Array.isArray(data) ? data.length : 0,
        }));

      } catch (err) {
        console.error("❌ Products API failed:", err);
      }

      // ===== 2️⃣ GET ORDERS =====
      try {
        const res = await fetch("http://localhost:4000/api/orders");
        if (!res.ok) throw new Error("Orders API failed");

        const data = await res.json();

        setCounts(prev => ({
          ...prev,
          orders: Array.isArray(data) ? data.length : 0,
          revenue: Array.isArray(data)
            ? data.reduce((sum, o) => sum + Number(o.total || 0), 0)
            : 0,
        }));

      } catch (err) {
        console.warn("⚠ Orders API not ready yet:", err);
      }

      // ===== 3️⃣ GET USERS =====
      try {
        const res = await fetch("http://localhost:4000/api/users");
        if (!res.ok) throw new Error("Users API failed");

        const data = await res.json();

        setCounts(prev => ({
          ...prev,
          users: Array.isArray(data) ? data.length : 0,
        }));

      } catch (err) {
        console.warn("⚠ Users API not ready yet:", err);
      }
    }

    loadCounts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-5 bg-white shadow rounded">
          <strong>Products:</strong> {counts.products}
        </div>

        <div className="p-5 bg-white shadow rounded">
          <strong>Orders:</strong> {counts.orders}
        </div>

        <div className="p-5 bg-white shadow rounded">
          <strong>Users:</strong> {counts.users}
        </div>

        <div className="p-5 bg-white shadow rounded">
          <strong>Revenue:</strong> ₹{counts.revenue}
        </div>

      </div>
    </div>
  );
}
