// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function OrderHistory() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     axios
//       .get("http://localhost:4000/api/orders", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         setOrders(res.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [token]);

//   const handleReorder = async (orderId) => {
//     try {
//       await axios.post(
//         `http://localhost:4000/api/reorder/${orderId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert("Items added to cart");
//       navigate("/cart");
//     } catch (err) {
//       alert("Reorder failed");
//     }
//   };

//   const handleCancel = async (orderId) => {
//     try {
//       await axios.put(
//         `http://localhost:4000/api/orders/cancel/${orderId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert("Order cancelled");
//       window.location.reload();
//     } catch (err) {
//       alert("Cancel failed");
//     }
//   };

//   if (loading) {
//     return <div className="p-6 text-center">Loading orders...</div>;
//   }

//   if (orders.length === 0) {
//     return <div className="p-6 text-center">No orders found</div>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
//       <h1 className="text-2xl font-bold">My Orders</h1>

//       {orders.map((order) => (
//         <div
//           key={order.id}
//           className="bg-white rounded-xl shadow p-5 space-y-4"
//         >
//           {/* HEADER */}
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="font-semibold">Order #{order.id}</p>
//               <p className="text-sm text-gray-500">
//                 {new Date(order.created_at).toLocaleString()}
//               </p>
//             </div>

//             <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
//               {order.status || order.order_status}
//             </span>
//           </div>

//           {/* ITEMS */}
//           <div className="border-t pt-3 space-y-2">
//             {order.items.map((item, idx) => (
//               <div key={idx} className="flex justify-between text-sm">
//                 <span>
//                   {item.name || item.product_name} × {item.qty}
//                 </span>
//                 <span>₹{item.price * item.qty}</span>
//               </div>
//             ))}
//           </div>

//           {/* TOTAL */}
//           <div className="flex justify-between font-semibold border-t pt-3">
//             <span>Total</span>
//             <span>₹{order.total_amount}</span>
//           </div>

//           {/* ADDRESS */}
//           {order.address && (
//             <div className="text-sm text-gray-600 border-t pt-3">
//               <p className="font-semibold">Delivery Address</p>
//               <p>
//                 {order.address.name},{" "}
//                 {order.address.house || order.address.address_line1},{" "}
//                 {order.address.street || order.address.address_line2},{" "}
//                 {order.address.city} - {order.address.pincode}
//               </p>
//             </div>
//           )}

//           {/* ACTION BUTTONS */}
//           <div className="flex gap-3 flex-wrap pt-3 border-t">
//             <button
//               onClick={() => navigate(`/order/${order.id}`)}
//               className="px-4 py-2 border rounded text-sm"
//             >
//               View Details
//             </button>

//             <a
//               href={`http://localhost:4000/api/invoice/${order.id}`}
//               className="px-4 py-2 border rounded text-sm"
//             >
//               Download Invoice
//             </a>

//             <button
//               onClick={() => handleReorder(order.id)}
//               className="px-4 py-2 bg-green-600 text-white rounded text-sm"
//             >
//               Reorder
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiChevronRight } from "react-icons/fi";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => {});
  }, [token]);

  const handleReorder = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:4000/api/reorder/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/cart");
    } catch {
      alert("Reorder failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-3 py-4 space-y-4">
      <h1 className="text-xl font-bold mb-2">Your Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow-sm border"
        >
          {/* TOP SECTION (clickable) */}
          <div
            onClick={() => navigate(`/order/${order.id}`)}
            className="p-4 flex justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  Order delivered
                </span>
                <span className="text-green-600">✔</span>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Placed at{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                ₹{order.total_amount}
              </span>
              <FiChevronRight />
            </div>
          </div>

          {/* PRODUCT IMAGES */}
          <div className="px-4 flex gap-2">
            {order.items.slice(0, 3).map((item, i) => (
              <img
                key={i}
                src={item.image || "/placeholder.png"}
                alt=""
                className="w-12 h-12 rounded object-cover border"
              />
            ))}
          </div>

          {/* ORDER AGAIN */}
          <div className="border-t mt-3">
            <button
              onClick={() => handleReorder(order.id)}
              className="w-full py-3 text-pink-600 font-semibold"
            >
              Order Again
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
