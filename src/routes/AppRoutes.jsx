
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
 
/* ================= USER PAGES ================= */
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import CategoryPage from "../pages/CategoryPage";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Auth from "../pages/Auth";
import Wishlist from "../pages/Wishlist";
import OrderSuccess from "../pages/OrderSuccess";
import OrderHistory from "../pages/OrderHistory";
import OrderFailed from "../pages/OrderFailed";
import Profile from "../pages/Profile";
import Account from "../pages/account/Account";
import OrderDetails from "../pages/OrderDetails";

 
/* ================= ADMIN PAGES ================= */
import AdminLogin from "../Admin/AdminLogin";
import AdminLayout from "../Admin/AdminLayout";
import Dashboard from "../Admin/Dashboard";
import Orders from "../Admin/Orders";
import Users from "../Admin/Users";
import ProductList from "../Admin/ProductList";
import AddProduct from "../Admin/AddProduct";
import UpdateProduct from "../Admin/UpdateProduct";
import AddAdmin from "../Admin/AddAdmin";
import UserDetails from "../Admin/UserDetails";
import UserHistory from "../Admin/UserHistory";
import Revenue from "../Admin/Revenue";
import Stock from "../Admin/Stock";
import AdminOrderDetails from "../Admin/AdminOrderDetails";
import CategoriesAdmin from "../Admin/Categories";
import AdminSubcategories from "../Admin/AdminSubCategories";


 
 
 
/* ================= ADMIN PROTECTION ================= */
function ProtectedAdmin({ children }) {
  const isAuth = Boolean(localStorage.getItem("adminToken"));
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
 
export default function AppRoutes() {
  return (
    <Routes>
 
      {/* ================= PUBLIC USER ROUTES ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/order-failed" element={<OrderFailed />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/account" element={<Account />} />
      <Route path="/order/:id" element={<OrderDetails />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      
 
      {/* ================= ADMIN LOGIN (PUBLIC) ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />
 
      {/* ================= PROTECTED ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <AdminLayout />
          </ProtectedAdmin>
        }
      >
        {/* Default admin route */}
        <Route index element={<Navigate to="dashboard" replace />} />
 
        {/* Admin pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="users/:id/history" element={<UserHistory />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/update/:id" element={<UpdateProduct />} />
        
 
        {/* ✅ CATEGORY MANAGEMENT */}
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="subcategories" element={<AdminSubcategories />} />
 
        <Route path="add-admin" element={<AddAdmin />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="stock" element={<Stock />} />
        <Route path="order/:id" element={<AdminOrderDetails />} />
      </Route>
 
      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
 
    </Routes>
  );
}
 
 