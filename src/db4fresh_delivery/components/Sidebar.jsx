import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  IndianRupee,
  Clock,
  User,
  Gift
} from "lucide-react";

import "./sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">DB4Fresh</h2>

      <NavLink to="/delivery/dashboard">
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      <NavLink to="/delivery/earnings">
        <IndianRupee size={18} /> Earnings
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
