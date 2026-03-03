


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Package, IndianRupee, Clock, Power } from "lucide-react";

// export default function DeliveryDashboard() {
//   const [isOnline, setIsOnline] = useState(false);

//   useEffect(() => {
//     fetchStatus();
//   }, []);

//   const fetchStatus = async () => {
//     try {
//       const token = localStorage.getItem("deliveryToken");

//       const res = await axios.get(
//         "http://localhost:4000/api/delivery/status",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setIsOnline(res.data.is_online === 1);
//     } catch (err) {
//       console.log("Status fetch error:", err.message);
//     }
//   };

//   const toggleStatus = async () => {
//     try {
//       const token = localStorage.getItem("deliveryToken");
//       const newStatus = !isOnline;

//       await axios.post(
//         "http://localhost:4000/api/delivery/status/update",
//         { is_online: newStatus ? 1 : 0 },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setIsOnline(newStatus);
//     } catch (err) {
//       console.log("Status update error:", err.message);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto">
      
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
//         <p className="text-gray-500 mt-1">
//           Here’s what’s happening today
//         </p>
//       </div>

//       {/* Status Card */}
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-8 flex items-center justify-between">
//         <div>
//           <p className="text-gray-500">Current Status</p>
//           <h2
//             className={`text-2xl font-bold mt-1 ${
//               isOnline ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {isOnline ? "Online" : "Offline"}
//           </h2>
//         </div>

//         <button
//           onClick={toggleStatus}
//           className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white transition ${
//             isOnline ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           <Power size={18} />
//           {isOnline ? "Go Offline" : "Go Online"}
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
//         <div className="bg-white shadow-md rounded-2xl p-6">
//           <Package className="text-blue-500 mb-4" size={28} />
//           <p className="text-gray-500">Today’s Orders</p>
//           <p className="text-3xl font-bold mt-2">0</p>
//         </div>

//         <div className="bg-white shadow-md rounded-2xl p-6">
//           <IndianRupee className="text-green-500 mb-4" size={28} />
//           <p className="text-gray-500">Today’s Earnings</p>
//           <p className="text-3xl font-bold mt-2">₹0</p>
//         </div>

//         <div className="bg-white shadow-md rounded-2xl p-6">
//           <Clock className="text-purple-500 mb-4" size={28} />
//           <p className="text-gray-500">Active Slot</p>
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
  const [activeSlot, setActiveSlot] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");

      const res = await axios.get(
        "http://localhost:4000/api/delivery/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      setTotalOrders(data.totalOrders || 0);
      setTotalEarnings(data.totalEarnings || 0);

      if (data.activeSlot) {
        setActiveSlot(
          `${data.activeSlot.start_time} - ${data.activeSlot.end_time}`
        );

        // 🔥 AUTO ONLINE IF SLOT ACTIVE
        setIsOnline(true);
      } else {
        setActiveSlot(null);
        setIsOnline(false);
      }

    } catch (err) {
      console.log("Dashboard fetch error:", err.message);
    }
  };

  const toggleStatus = () => {
    if (!activeSlot) {
      alert("You must book an active slot before going online.");
      return;
    }

    setIsOnline(!isOnline);
  };

  return (
    <div className="max-w-7xl mx-auto">
      
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
            isOnline
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
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
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <IndianRupee className="text-green-500 mb-4" size={28} />
          <p className="text-gray-500">Today’s Earnings</p>
          <p className="text-3xl font-bold mt-2">₹{totalEarnings}</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <Clock className="text-purple-500 mb-4" size={28} />
          <p className="text-gray-500">Active Slot</p>
          <p className="text-xl font-semibold mt-2">
            {activeSlot ? activeSlot : "No Active Slot"}
          </p>
        </div>

      </div>
    </div>
  );
}