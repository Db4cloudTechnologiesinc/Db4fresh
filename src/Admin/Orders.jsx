// // // // // import React from 'react';
// // // // // export default function Orders(){ return <div><h2 className='text-2xl font-semibold mb-4'>Orders</h2></div>; }
// // import { useEffect, useState } from "react";

// // export default function Orders() {
// //   const [orders, setOrders] = useState([]);

// //   useEffect(() => {
// //     fetch("http://localhost:4000/api/orders")
// //       .then(res => res.json())
// //       .then(data => setOrders(data));
// //   }, []);

// //   return (
// //     <div>
// //       <h2 className="text-xl font-semibold mb-4">Orders</h2>

// //       {orders.length === 0 ? (
// //         <p>No orders found</p>
// //       ) : (
// //         <div className="space-y-3">
// //           {orders.map(o => (
// //             <div
// //               key={o.id}
// //               className="bg-white p-4 rounded shadow flex justify-between"
// //             >
// //               <div>
// //                 <p className="font-semibold">Order #{o.id}</p>
// //                 <p className="text-sm text-gray-500">{o.user_name}</p>
// //               </div>
// //               <p className="font-bold">₹{o.total_amount}</p>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// // export default function Orders() {
// //   return (
// //     <div className="space-y-6">

// //       <h2 className="text-xl font-semibold">Orders</h2>

// //       <table className="w-full bg-white rounded-lg shadow">
// //         <thead className="bg-gray-100">
// //           <tr>
// //             <th className="p-3">Order ID</th>
// //             <th className="p-3">User</th>
// //             <th className="p-3">Amount</th>
// //             <th className="p-3">Payment</th>
// //             <th className="p-3">Status</th>
// //             <th className="p-3">Actions</th>
// //           </tr>
// //         </thead>

// //         <tbody>
// //           <tr className="border-t">
// //             <td className="p-3">#1</td>
// //             <td className="p-3">Nikhil</td>
// //             <td className="p-3">₹499</td>
// //             <td className="p-3">
// //               <span className="bg-yellow-100 px-2 py-1 rounded">
// //                 COD
// //               </span>
// //             </td>
// //             <td className="p-3">
// //               <select className="border p-1 rounded">
// //                 <option>Pending</option>
// //                 <option>Accepted</option>
// //                 <option>Packed</option>
// //                 <option>Out for delivery</option>
// //                 <option>Delivered</option>
// //               </select>
// //             </td>
// //             <td className="p-3">
// //               <button className="text-blue-600">View</button>
// //             </td>
// //           </tr>
// //         </tbody>

// //       </table>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:4000/api/orders")
//       .then(res => res.json())
//       .then(data => setOrders(data))
//       .catch(err => console.error("Orders fetch error:", err));
//   }, []);

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">Orders</h2>

//       <table className="w-full bg-white rounded-lg shadow">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-3 text-left">Order ID</th>
//             <th className="p-3 text-left">User</th>
//             <th className="p-3 text-left">Amount</th>
//             <th className="p-3 text-left">Payment</th>
//             <th className="p-3 text-left">Status</th>
//             <th className="p-3 text-left">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {orders.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="p-4 text-center text-gray-500">
//                 No orders found
//               </td>
//             </tr>
//           ) : (
//             orders.map(order => (
//               <tr key={order.id} className="border-t">
                
//                 {/* ✅ 4-DIGIT ORDER ID */}
//                 <td className="p-3 font-medium">
//                   #{String(order.id).padStart(4, "0")}
//                 </td>

//                 <td className="p-3">
//                   {order.user_name || "Customer"}
//                 </td>

//                 <td className="p-3 font-semibold">
//                   ₹{order.total_amount}
//                 </td>

//                 <td className="p-3">
//                   <span className="bg-yellow-100 px-2 py-1 rounded text-sm">
//                     {order.payment_method || "COD"}
//                   </span>
//                 </td>

//                 <td className="p-3">
//                   <select
//                     className="border p-1 rounded"
//                     value={order.order_status}
//                     disabled
//                   >
//                     <option>Pending</option>
//                     <option>Accepted</option>
//                     <option>Packed</option>
//                     <option>Out for delivery</option>
//                     <option>Delivered</option>
//                   </select>
//                 </td>

//                 {/* ✅ VIEW ACTION WORKING */}
//                 <td className="p-3">
//                   <button
//                     onClick={() => navigate(`/admin/orders/${order.id}`)}
//                     className="text-blue-600 hover:underline"
//                   >
//                     View
//                   </button>
//                 </td>

//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TABS = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Refunded", value: "Refunded" }
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  // 🔹 Filter orders by status
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter(o => o.order_status === activeTab);

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">Orders</h2>

      {/* ===== STATUS TABS ===== */}
      <div className="flex gap-3 border-b pb-2">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-t ${
              activeTab === tab.value
                ? "bg-white border border-b-0 font-semibold"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== ORDERS TABLE ===== */}
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Payment</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          ) : (
            filteredOrders.map(order => (
              <tr key={order.id} className="border-t">

                <td className="p-3 font-medium">
                  #{String(order.id).padStart(4, "0")}
                </td>

                <td className="p-3">{order.user_name}</td>

                <td className="p-3 font-semibold">
                  ₹{order.total_amount}
                </td>

                <td className="p-3">
                  <span className="bg-yellow-100 px-2 py-1 rounded text-sm">
                    {order.payment_method || "COD"}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.order_status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.order_status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

