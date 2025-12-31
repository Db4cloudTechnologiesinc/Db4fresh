
import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  ShoppingBag,
  Users,
  Settings,
} from "lucide-react";

const Item = ({ to, label, icon: Icon, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
      ${
        active
          ? "bg-red-500 text-white"
          : "text-gray-700 hover:bg-red-100"
      }`}
  >
    <Icon size={18} />
    {label}
  </Link>
);

export default function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
    

      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-red-600">Admin Panel</h1>
      </div>

      <nav className="p-4 space-y-2">
        <Item
          to="/admin/dashboard"
          label="Dashboard"
          icon={LayoutDashboard}
          active={pathname === "/admin/dashboard"}
        />

        <Item
          to="/admin/products"
          label="Products"
          icon={Boxes}
          active={pathname.startsWith("/admin/products")}
        />

        <Item
          to="/admin/add-product"
          label="Add Product"
          icon={PlusCircle}
          active={pathname.startsWith("/admin/add-product")}
        />

        <Item
          to="/admin/orders"
          label="Orders"
          icon={ShoppingBag}
          active={pathname.startsWith("/admin/orders")}
        />

        <Item
          to="/admin/users"
          label="Users"
          icon={Users}
          active={pathname.startsWith("/admin/users")}
        />

        <Item
          to="/admin/settings"
          label="Settings"
          icon={Settings}
          active={pathname.startsWith("/admin/settings")}
        />
      </nav>
    </aside>
  );
}

