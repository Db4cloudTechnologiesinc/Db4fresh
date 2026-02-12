
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiBarChart,
  FiArchive,FiLayers
} from "react-icons/fi";
import AdminNavbar from "./AdminNavbar";
 
 
 
export default function AdminLayout() {
  const { pathname } = useLocation();
 
  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname.startsWith(path);
  };
 
  return (
    <div className="flex min-h-screen bg-gray-100">
 
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-red-100 border-r border-red-200 p-6 space-y-6">
 
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
            A
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Panel
          </h1>
        </div>
 
        {/* Navigation */}
        <nav className="space-y-3">
 
  <SidebarItem
    to="/admin/dashboard"
    icon={<FiHome />}
    label="Dashboard"
    active={isActive("/admin/dashboard")}
  />
 
  <SidebarItem
    to="/admin/products/add"
    icon={<FiBox />}
    label="Add Product"
    active={pathname === "/admin/products/add"}
  />
 
  <SidebarItem
    to="/admin/orders"
    icon={<FiShoppingBag />}
    label="Orders"
    active={isActive("/admin/orders")}
  />
 
  <SidebarItem
    to="/admin/products"
    icon={<FiBox />}
    label="Products"
    active={isActive("/admin/products")}
  />
 
  {/* ================= Categories Section ================= */}
  <div className="pt-3">
    <p className="text-xs uppercase tracking-wider text-gray-500 px-4 mb-2">
      Categories
    </p>
 
    <SidebarItem
      to="/admin/categories"
      icon={<FiLayers />}
      label="Categories"
      active={isActive("/admin/categories")}
    />
 
    <SidebarItem
      to="/admin/subcategories"
      icon={<FiLayers />}
      label="Subcategories"
      active={isActive("/admin/subcategories")}
    />
  </div>
 
  <SidebarItem
    to="/admin/stock"
    icon={<FiArchive />}
    label="Stock"
    active={isActive("/admin/stock")}
  />
 
  <SidebarItem
    to="/admin/users"
    icon={<FiUsers />}
    label="Users"
    active={isActive("/admin/users")}
  />
 
  <SidebarItem
    to="/admin/revenue"
    icon={<FiBarChart />}
    label="Revenue"
    active={isActive("/admin/revenue")}
  />
 
  <SidebarItem
    to="/admin/add-admin"
    icon={<FiUsers />}
    label="Add Admin"
    active={isActive("/admin/add-admin")}
  />
 
</nav>
 
      </aside>
 
      {/* ================= Main Content ================= */}
      <main className="flex-1">
        <AdminNavbar />
 
        <div className="p-6">
          <div className="bg-white p-6 rounded-xl shadow-md min-h-[500px]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
 
/* Sidebar Item */
function SidebarItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
        ${active ? "bg-red-300 text-black" : "hover:bg-red-200"}`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </Link>
  );
}
 