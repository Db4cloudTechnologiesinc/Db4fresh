import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    fetch("http://localhost:4000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const reorder = async (orderId) => {
    await fetch(`http://localhost:4000/api/reorder/${orderId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Items added to cart");
    navigate("/cart");
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">My Orders</h3>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders placed yet.</p>
      )}

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Order #{o.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(o.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Status:{" "}
                <span className="font-semibold text-blue-600">
                  {o.status}
                </span>
              </p>
              <p className="text-sm font-medium">₹{o.total_amount}</p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <button
  onClick={() => navigate(`/order/${o.id}`)}
  className="text-blue-600 hover:underline"
>
  View Details
</button>


              <button
                onClick={() => reorder(o.id)}
                className="text-red-600"
              >
                Re-order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
