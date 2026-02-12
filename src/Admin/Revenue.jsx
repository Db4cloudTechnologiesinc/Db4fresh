import { useEffect, useState } from "react";

export default function Revenue() {
  const [range, setRange] = useState("all");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    codRevenue: 0,
    onlineRevenue: 0,
  });

  const loadRevenue = (selectedRange) => {
    setRange(selectedRange);

    fetch(`http://localhost:4000/api/admin/revenue?range=${selectedRange}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        setStats({
          totalRevenue: data.totalRevenue ?? 0,
          totalOrders: data.totalOrders ?? 0,
          codRevenue: data.codRevenue ?? 0,
          onlineRevenue: data.onlineRevenue ?? 0,
        });
      })
      .catch(err => console.error("REVENUE FETCH ERROR:", err.message));
  };

  useEffect(() => {
    loadRevenue("all");
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Revenue Overview</h2>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Revenue" value={`₹${stats.totalRevenue}`} />
        <Card title="Total Orders" value={stats.totalOrders} />
        <Card title="COD Revenue" value={`₹${stats.codRevenue}`} />
        <Card title="Online Revenue" value={`₹${stats.onlineRevenue}`} />
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">
        <Filter label="Today" active={range==="today"} onClick={() => loadRevenue("today")} />
        <Filter label="Week" active={range==="week"} onClick={() => loadRevenue("week")} />
        <Filter label="Month" active={range==="month"} onClick={() => loadRevenue("month")} />
        <Filter label="Year" active={range==="year"} onClick={() => loadRevenue("year")} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">Total Revenue</td>
              <td className="p-3 font-semibold">₹{stats.totalRevenue}</td>
            </tr>
            <tr className="border-t">
              <td className="p-3">COD Revenue</td>
              <td className="p-3">₹{stats.codRevenue}</td>
            </tr>
            <tr className="border-t">
              <td className="p-3">Online Revenue</td>
              <td className="p-3">₹{stats.onlineRevenue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="bg-green-100 p-4 rounded-lg">
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const Filter = ({ label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 border rounded ${
      active ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);
