import { useEffect, useState } from "react";
import { getAssignedOrders } from "../services/deliveryApi";
import { useNavigate } from "react-router-dom";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("deliveryToken");

  useEffect(() => {
    getAssignedOrders(token)
      .then((res) => setOrders(res.data))
      .catch(() => alert("Failed to load orders"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Assigned Orders
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/delivery/order/${order.id}`)}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">
                Order #{order.id}
              </h3>
              <p className="text-gray-500">
                {order.customer_name}
              </p>
            </div>

            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
