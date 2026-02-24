import { useEffect, useState } from "react";
import axios from "axios";

export default function DeliveryAssignedOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await axios.get(
      "/api/delivery/assigned-orders",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("deliveryToken")}`,
        },
      }
    );
    setOrders(data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const collectCOD = async (orderId) => {
    await axios.post(
      "/api/delivery/collect-cod",
      { order_id: orderId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("deliveryToken")}`,
        },
      }
    );

    alert("COD Collected Successfully");
    fetchOrders();
  };

  const markDelivered = async (orderId) => {
    await axios.put(
      `/api/orders/${orderId}/deliver`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("deliveryToken")}`,
        },
      }
    );

    alert("Order Delivered");
    fetchOrders();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Assigned Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white shadow-lg rounded-xl p-5 mb-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">
              Order #{order.id}
            </h2>

            {order.payment_method === "COD" ? (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                COD
              </span>
            ) : (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                ONLINE
              </span>
            )}
          </div>

          <p className="mt-2 text-gray-600">
            Amount: ₹{order.total_amount}
          </p>

          <p className="text-gray-600">
            Payment Status: {order.payment_status}
          </p>

          <div className="mt-4 flex gap-3">

            {order.payment_method === "COD" &&
              order.payment_status === "pending" && (
                <button
                  onClick={() => collectCOD(order.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Collect COD
                </button>
              )}

            {(order.payment_method === "ONLINE" ||
              order.payment_status === "paid") && (
              <button
                onClick={() => markDelivered(order.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Mark Delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}