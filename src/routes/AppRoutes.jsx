
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ================= USER PAGES ================= */
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import CategoryPage from "../pages/CategoryPage";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";
import PaymentFailed from "../pages/PaymentFailed";
import Auth from "../pages/Auth";
import Wishlist from "../pages/Wishlist";
import OrderSuccess from "../pages/OrderSuccess";
import OrderFailed from "../pages/OrderFailed";
import Profile from "../pages/Profile";
import Account from "../pages/account/Account";
import OrderDetails from "../pages/OrderDetails";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import MyOrders from "../pages/MyOrders";

/* ================= ADMIN ================= */
import AdminLogin from "../Admin/AdminLogin";
import ProtectedAdmin from "../Admin/ProtectedAdmin";
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= USER ROUTES ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/order-failed" element={<OrderFailed />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/wishlist" element={<Wishlist />} />

      {/* ================= USER ORDERS ================= */}
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/orders/:id" element={<OrderDetails />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/account" element={<Account />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ================= ADMIN LOGIN ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ================= ADMIN PROTECTED ================= */}
      <Route element={<ProtectedAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order/:id" element={<AdminOrderDetails />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="users/:id/history" element={<UserHistory />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/update/:id" element={<UpdateProduct />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="subcategories" element={<AdminSubcategories />} />
          <Route path="add-admin" element={<AddAdmin />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="stock" element={<Stock />} />
        </Route>
      </Route>

      {/* ================= REORDER SUPPORT ================= */}
<Route path="/reorder/:id" element={<Checkout />} />

{/* ================= 404 ================= */}
<Route
  path="*"
  element={
    <div className="p-10 text-center">
      <h2 className="text-xl font-semibold">
        404 – Page Not Found
      </h2>
    </div>
  }
/>

    </Routes>
  );
}

