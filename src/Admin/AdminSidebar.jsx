import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Boxes, PlusCircle, ShoppingBag, Users, Settings } from "lucide-react";

const Item = ({ to, children, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg ${
        isActive ? "bg-red-500 text-white" : "text-gray-700 hover:bg-red-100"
      }`
    }
  >
    <Icon size={18} />
    {children}
  </NavLink>
);

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-red-600">Admin Panel</h1>
      </div>
      <nav className="p-4 space-y-2">
        <Item to="/admin/dashboard" icon={LayoutDashboard}>Dashboard</Item>
        <Item to="/admin/products" icon={Boxes}>Products</Item>
        <Item to="/admin/add-product" icon={PlusCircle}>Add Product</Item>
        <Item to="/admin/orders" icon={ShoppingBag}>Orders</Item>
        <Item to="/admin/users" icon={Users}>Users</Item>
        <Item to="/admin/settings" icon={Settings}>Settings</Item>
      </nav>
    </aside>
  );
}
