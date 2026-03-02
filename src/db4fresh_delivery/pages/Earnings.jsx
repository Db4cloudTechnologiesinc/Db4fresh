import { useEffect, useState } from "react";
import axios from "axios";
import { IndianRupee, Package, Wallet } from "lucide-react";

export default function Earning() {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    todayEarnings: 0,
    totalOrders: 0,
    codAmount: 0,
    onlineAmount: 0,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token =
        localStorage.getItem("deliveryToken") ||
        localStorage.getItem("delivery_token");

      if (!token) {
        setError("Unauthorized. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:4000/api/delivery/earnings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Handle different backend response formats
      if (res.data.earnings) {
        setEarnings(res.data.earnings);
      } else {
        setEarnings(res.data);
      }

    } catch (error) {
      console.error("Earnings fetch error:", error);

      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("deliveryToken");
        localStorage.removeItem("delivery_token");
      } else {
        setError("Failed to load earnings.");
      }

    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading earnings...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💰 My Earnings</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Total Earnings */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center gap-4">
            <IndianRupee className="text-green-600" size={30} />
            <div>
              <p className="text-gray-500">Total Earnings</p>
              <h2 className="text-xl font-bold">
                ₹{earnings.totalEarnings || 0}
              </h2>
            </div>
          </div>
        </div>

        {/* Today's Earnings */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center gap-4">
            <Wallet className="text-blue-600" size={30} />
            <div>
              <p className="text-gray-500">Today's Earnings</p>
              <h2 className="text-xl font-bold">
                ₹{earnings.todayEarnings || 0}
              </h2>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center gap-4">
            <Package className="text-purple-600" size={30} />
            <div>
              <p className="text-gray-500">Completed Orders</p>
              <h2 className="text-xl font-bold">
                {earnings.totalOrders || 0}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* Payment Breakdown */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Payment Breakdown</h2>

        <div className="flex justify-between mb-2">
          <span>COD Collected</span>
          <span className="font-bold">
            ₹{earnings.codAmount || 0}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Online Payments</span>
          <span className="font-bold">
            ₹{earnings.onlineAmount || 0}
          </span>
        </div>
      </div>
    </div>
  );
}