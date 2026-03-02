// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Package, IndianRupee, Clock, Power } from "lucide-react";

// export default function DeliveryDashboard() {
//   const [isOnline, setIsOnline] = useState(false);

//   const partnerId = 1; // 🔥 Replace with logged-in partner ID later

//   useEffect(() => {
//     fetchStatus();
//   }, []);

//   const fetchStatus = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:4000/api/delivery/status/${partnerId}`
//       );
//       setIsOnline(res.data.is_online === 1);
//     } catch (err) {
//       console.log("Status fetch error:", err.message);
//     }
//   };

//   const toggleStatus = async () => {
//     try {
//       const newStatus = !isOnline;

//       await axios.post(
//         "http://localhost:4000/api/delivery/status/update",
//         {
//           partnerId,
//           is_online: newStatus ? 1 : 0
//         }
//       );

//       setIsOnline(newStatus);
//     } catch (err) {
//       console.log("Status update error:", err.message);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">
//         Welcome Back 👋
//       </h1>

//       {/* 🔥 ONLINE / OFFLINE STATUS CARD */}
//       <div className="bg-white shadow rounded-xl p-6 mb-6 flex items-center justify-between">
//         <div>
//           <p className="text-gray-500">Current Status</p>
//           <h2
//             className={`text-xl font-bold ${
//               isOnline ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {isOnline ? "Online" : "Offline"}
//           </h2>
//         </div>

//         <button
//           onClick={toggleStatus}
//           className={`flex items-center gap-2 px-5 py-2 rounded text-white ${
//             isOnline ? "bg-red-600" : "bg-green-600"
//           }`}
//         >
//           <Power size={18} />
//           {isOnline ? "Go Offline" : "Go Online"}
//         </button>
//       </div>

//       {/* EXISTING DASHBOARD CARDS */}
//       <div className="grid md:grid-cols-3 gap-6">
        
//         <div className="bg-white shadow rounded-xl p-6">
//           <Package className="text-blue-500 mb-2" />
//           <h3 className="text-gray-500">Today’s Orders</h3>
//           <p className="text-3xl font-bold mt-2">0</p>
//         </div>

//         <div className="bg-white shadow rounded-xl p-6">
//           <IndianRupee className="text-green-500 mb-2" />
//           <h3 className="text-gray-500">Today’s Earnings</h3>
//           <p className="text-3xl font-bold mt-2">₹0</p>
//         </div>

//         <div className="bg-white shadow rounded-xl p-6">
//           <Clock className="text-purple-500 mb-2" />
//           <h3 className="text-gray-500">Active Slot</h3>
//           <p className="text-xl font-semibold mt-2">No Active Slot</p>
//         </div>

//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";
import { Package, IndianRupee, Clock, Power } from "lucide-react";

export default function DeliveryDashboard() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");

      const res = await axios.get(
        "http://localhost:4000/api/delivery/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsOnline(res.data.is_online === 1);
    } catch (err) {
      console.log("Status fetch error:", err.message);
    }
  };

  const toggleStatus = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");
      const newStatus = !isOnline;

      await axios.post(
        "http://localhost:4000/api/delivery/status/update",
        { is_online: newStatus ? 1 : 0 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsOnline(newStatus);
    } catch (err) {
      console.log("Status update error:", err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
        <p className="text-gray-500 mt-1">
          Here’s what’s happening today
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-gray-500">Current Status</p>
          <h2
            className={`text-2xl font-bold mt-1 ${
              isOnline ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </h2>
        </div>

        <button
          onClick={toggleStatus}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white transition ${
            isOnline ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <Power size={18} />
          {isOnline ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
        <div className="bg-white shadow-md rounded-2xl p-6">
          <Package className="text-blue-500 mb-4" size={28} />
          <p className="text-gray-500">Today’s Orders</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <IndianRupee className="text-green-500 mb-4" size={28} />
          <p className="text-gray-500">Today’s Earnings</p>
          <p className="text-3xl font-bold mt-2">₹0</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <Clock className="text-purple-500 mb-4" size={28} />
          <p className="text-gray-500">Active Slot</p>
          <p className="text-xl font-semibold mt-2">No Active Slot</p>
        </div>

      </div>

    </div>
  );
}