import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000";

const statusColor = (status) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "PLACED":
      return "bg-blue-100 text-blue-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ORDERS ERROR:", err);
        setOrders([]);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-500 text-lg">
          Loading your orders...
        </div>
      </div>
    );
  }

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
  );

  const deliveredCount = orders.filter(
    (o) => o.order_status === "DELIVERED"
  ).length;

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );
  const handleReorder = async (orderId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token =
      user?.token || localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:4000/api/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!data.order) {
      alert("Unable to fetch order details");
      return;
    }

    localStorage.setItem(
      "checkout_data",
      JSON.stringify({
        items: data.items || [],
        address: data.order,
        deliverySlot: data.order.delivery_slot,
        totalAmount: data.order.total_amount,
        reorder: true,
      })
    );

    navigate("/checkout");
  } catch (err) {
    console.error("Reorder Error:", err);
    alert("Unable to reorder");
  }
};

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>

        <h2 className="text-2xl font-semibold mb-2">
          No Orders Yet
        </h2>

        <p className="text-gray-500 mb-6">
          Start shopping and your orders will appear here.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          My Orders
        </h2>
        <p className="text-gray-500">
          Track and manage your orders
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-3xl font-bold">
            {orders.length}
          </p>
          <p className="text-gray-500 mt-1">
            Total Orders
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-3xl font-bold text-green-600">
            {deliveredCount}
          </p>
          <p className="text-gray-500 mt-1">
            Delivered
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-3xl font-bold text-red-600">
            ₹{totalSpent.toFixed(0)}
          </p>
          <p className="text-gray-500 mt-1">
            Total Spent
          </p>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <div
            key={order.id}
            className="
              bg-white
              border
              rounded-2xl
              p-5
              hover:shadow-md
              transition
            "
          >
            {/* TOP */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div>
                <h3 className="font-semibold text-lg">
                  Order #{order.id}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <span
                className={`
                  px-3 py-1
                  rounded-full
                  text-sm
                  font-medium
                  w-fit
                  ${statusColor(order.order_status)}
                `}
              >
                {order.order_status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="text-gray-500 text-sm">
                  Payment Method
                </p>
                <p className="font-medium">
                  {order.payment_method}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Order Total
                </p>
                <p className="font-semibold text-lg">
                  ₹{order.total_amount}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Order Status
                </p>
                <p className="font-medium">
                  {order.order_status}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() =>
                  navigate(`/orders/${order.id}`)
                }
                className="
                  px-4 py-2
                  border
                  rounded-lg
                  hover:bg-gray-50
                "
              >
                View Details
              </button>

              <button
  onClick={() => handleReorder(order.id)}
  className="
    px-4 py-2
    bg-red-600
    text-white
    rounded-lg
    hover:bg-red-700
  "
>
  Reorder
</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}