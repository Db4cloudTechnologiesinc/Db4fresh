import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  IndianRupee,
  Clock,
  User,
  Gift,
  History,
  Package,
  Wallet,
  FileText
} from "lucide-react";

export default function Sidebar() {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-300 hover:bg-slate-800 hover:text-white";

  const activeClass =
    "bg-green-600 text-white shadow-md";

  return (
    <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0 shadow-xl flex flex-col">

      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-slate-800">
        DB4Fresh
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

        <NavLink
          to="/delivery/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/delivery/assigned-orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Package size={18} />
          Assigned Orders
        </NavLink>

        <NavLink
          to="/delivery/wallet"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Wallet size={18} />
          COD Wallet
        </NavLink>

        <NavLink
          to="/delivery/cod-history"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <History size={18} />
          COD History
        </NavLink>

        <NavLink
          to="/delivery/earnings"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <IndianRupee size={18} />
          Earnings
        </NavLink>

        <NavLink
          to="/delivery/documents"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FileText size={18} />
          Documents
        </NavLink>

        <NavLink
          to="/delivery/history"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <History size={18} />
          Delivery History
        </NavLink>

        <NavLink
          to="/delivery/slots"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Clock size={18} />
          Slots
        </NavLink>

        <NavLink
          to="/delivery/refer"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Gift size={18} />
          Refer & Earn
        </NavLink>

        <NavLink
          to="/delivery/profile"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <User size={18} />
          Profile
        </NavLink>

      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-800 text-sm text-slate-400">
        Delivery Partner Panel
      </div>

    </div>
  );
}