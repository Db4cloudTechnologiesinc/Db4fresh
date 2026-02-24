// // import { NavLink } from "react-router-dom";
// // import {
// //   LayoutDashboard,
// //   IndianRupee,
// //   Clock,
// //   User,
// //   Gift
// // } from "lucide-react";

// // import "./sidebar.css";

// // export default function Sidebar() {
// //   return (
// //     <div className="sidebar">
// //       <h2 className="logo">DB4Fresh</h2>

// //       <NavLink to="/delivery/dashboard">
// //         <LayoutDashboard size={18} /> Dashboard
// //       </NavLink>

// //       <NavLink to="/delivery/earnings">
// //         <IndianRupee size={18} /> Earnings
// //       </NavLink>

// //       <NavLink to="/delivery/slots">
// //         <Clock size={18} /> Slots
// //       </NavLink>

// //       <NavLink to="/delivery/refer">
// //         <Gift size={18} /> Refer & Earn
// //       </NavLink>

// //       <NavLink to="/delivery/profile">
// //         <User size={18} /> Profile
// //       </NavLink>
// //     </div>
// //   );
// // }


// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   IndianRupee,
//   Clock,
//   User,
//   Gift,
//   History   // ✅ add this icon
// } from "lucide-react";

// import "./sidebar.css";

// export default function Sidebar() {
//   return (
//     <div className="sidebar">
//       <h2 className="logo">DB4Fresh</h2>

//       <NavLink to="/delivery/dashboard">
//         <LayoutDashboard size={18} /> Dashboard
//       </NavLink>

//       <NavLink to="/delivery/earnings">
//         <IndianRupee size={18} /> Earnings
//       </NavLink>

//       {/* ✅ NEW DELIVERY HISTORY OPTION */}
//       <NavLink to="/delivery/history">
//         <History size={18} /> Delivery History
//       </NavLink>

//       <NavLink to="/delivery/slots">
//         <Clock size={18} /> Slots
//       </NavLink>

//       <NavLink to="/delivery/refer">
//         <Gift size={18} /> Refer & Earn
//       </NavLink>

//       <NavLink to="/delivery/profile">
//         <User size={18} /> Profile
//       </NavLink>
//     </div>
//   );
// }


import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  IndianRupee,
  Clock,
  User,
  Gift,
  History,
  Package,
  Wallet
} from "lucide-react";

import "./sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">DB4Fresh</h2>

      <NavLink to="/delivery/dashboard">
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      {/* 🔥 NEW - Assigned Orders */}
      <NavLink to="/delivery/orders">
        <Package size={18} /> Assigned Orders
      </NavLink>

      {/* 🔥 NEW - COD Wallet */}
      <NavLink to="/delivery/wallet">
        <Wallet size={18} /> COD Wallet
      </NavLink>

      {/* 🔥 NEW - COD Transactions */}
      <NavLink to="/delivery/cod-history">
        <History size={18} /> COD History
      </NavLink>

      <NavLink to="/delivery/earnings">
        <IndianRupee size={18} /> Earnings
      </NavLink>

      <NavLink to="/delivery/history">
        <Clock size={18} /> Delivery History
      </NavLink>

      <NavLink to="/delivery/slots">
        <Clock size={18} /> Slots
      </NavLink>

      <NavLink to="/delivery/refer">
        <Gift size={18} /> Refer & Earn
      </NavLink>

      <NavLink to="/delivery/profile">
        <User size={18} /> Profile
      </NavLink>
    </div>
  );
}