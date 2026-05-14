// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function OrderDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:4000/api/orders/${id}`)
//       .then(res => res.json())
//       .then(data => setOrder(data))
//       .catch(err => console.error(err));
//   }, [id]);

//   if (!order) return <p>Loading order...</p>;

//   return (
//     <div className="bg-white p-6 rounded shadow">
//       <button
//         onClick={() => navigate(-1)}
//         className="text-sm text-blue-600 mb-4"
//       >
//         ← Back
//       </button>

//       <h2 className="text-xl font-semibold mb-4">
//         Order #{String(order.id).padStart(4, "0")}
//       </h2>

//       <div className="space-y-2">
//         <p><b>User:</b> {order.user_name}</p>
//         <p><b>Amount:</b> ₹{order.total_amount}</p>
//         <p><b>Status:</b> {order.order_status}</p>
//         <p><b>Payment:</b> {order.payment_method || "COD"}</p>
//         <p><b>Date:</b> {new Date(order.created_at).toLocaleString()}</p>
//       </div>
//     </div>
//   );
// }
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  // useEffect(() => {
  //   fetch(`http://localhost:4000/api/orders/${id}`)
  //     .then(res => res.json())
  //     .then(data => setOrder(data))
  //     .catch(err => console.error(err));
  // }, [id]);
  useEffect(() => {
  fetch(`http://localhost:4000/api/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("ORDER DETAILS:", data);
      setOrder(data);
    })
    .catch(err => console.error(err));
}, [id]);

  if (!order) return <p className="p-6">Loading order...</p>;

  return (
    <div className="flex gap-6 p-6">

      {/* LEFT SIDE */}
      <div className="flex-1 space-y-6">

        {/* Order Card */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Order #{String(order.id).padStart(4, "0")}
            </h2>

            <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 text-sm">
              {order.order_status}
            </span>
          </div>

          <p className="text-gray-500 mt-2">
            {new Date(order.created_at).toLocaleString()}
          </p>

          {/* ITEMS */}
          <h3 className="mt-6 font-semibold">Order Items</h3>

          <div className="mt-3 space-y-3">
            {order.items?.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border p-3 rounded-lg"
              >
                <img
                  src={item.image || "https://via.placeholder.com/60"}
                  alt=""
                  className="w-14 h-14 rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>

                <div className="bg-red-100 px-3 py-1 rounded font-semibold">
                  {item.quantity}
                </div>

                <div className="font-semibold">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="text-right mt-4 font-bold text-lg text-red-600">
            Total: ₹{order.total_amount}
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Customer Details</h3>
          <p><b>Name:</b> {order.user_name}</p>
          <p><b>Phone:</b> {order.phone || "N/A"}</p>
          <p><b>Address:</b> {order.address || "N/A"}</p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-80 space-y-6">

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <p>Subtotal: ₹{order.total_amount}</p>
          <p className="text-green-600">Delivery: FREE</p>

          <h2 className="text-xl font-bold text-red-600 mt-2">
            ₹{order.total_amount}
          </h2>
        </div>

        {/* STATUS UPDATE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Update Status</h3>

          <select
            value={order.order_status}
            onChange={(e) =>
              setOrder({ ...order, order_status: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option>PLACED</option>
            <option>CONFIRMED</option>
            <option>PACKED</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>

          <button className="w-full bg-red-500 text-white py-2 rounded mt-3">
            Update Status
          </button>
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="w-full border py-2 rounded"
        >
          ← Back
        </button>

      </div>

    </div>
  );
}