import { useEffect, useState } from "react";
import axios from "axios";

export default function Earnings() {
  const [data, setData] = useState({
    today: 0,
    weekly: 0,
    total: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);

  const partnerId = 1; // temporary static

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/delivery/earnings/${partnerId}`
      );

      setData(res.data || {});
    } catch (err) {
      console.log("API ERROR:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading earnings...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Earnings Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p>Today's Earnings</p>
          <h2 className="text-xl font-bold">₹ {data.today}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Weekly Earnings</p>
          <h2 className="text-xl font-bold">₹ {data.weekly}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Earnings</p>
          <h2 className="text-xl font-bold">₹ {data.total}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Completed Orders</p>
          <h2 className="text-xl font-bold">{data.orders}</h2>
        </div>
      </div>
    </div>
  );
}
