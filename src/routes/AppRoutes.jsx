import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from '../pages/Home';
import ProductDetails from '../pages/ProductDetails';
import CategoryPage from '../pages/CategoryPage';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import LoginSignup from '../pages/LoginSignup';

// --- Corrected Admin imports (MATCHES your folder) ---
import AdminLayout from '../Admin/AdminLayout';
import Dashboard from '../Admin/Dashboard';
import Orders from '../Admin/Orders';
import Users from '../Admin/Users';
import AdminLogin from '../Admin/AdminLogin';
import ProductList from '../Admin/ProductList';
import AddProduct from '../Admin/AddProduct';
import EditProduct from '../Admin/EditProduct';
import Wishlist from "../pages/Wishlist";
import OrderSuccess from "../pages/OrderSuccess";
import OrderHistory from "../pages/OrderHistory";



// Protect admin pages
function ProtectedAdmin({ children }) {
  const isAuth = Boolean(localStorage.getItem("admin_auth"));
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public User Routes */}
      <Route path='/' element={<Home />} />
      <Route path='/product/:id' element={<ProductDetails />} />
      <Route path='/category/:name' element={<CategoryPage />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/checkout' element={<Checkout />} />
      <Route path='/auth' element={<LoginSignup />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/orders" element={<OrderHistory />} />


      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route 
        path="/admin/*"
        element={
          <ProtectedAdmin>
            <AdminLayout />
          </ProtectedAdmin>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<ProductList />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="users" element={<Users />} />

        {/* Default Admin page */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="products" element={<ProductList />} />


    </Routes>
  );
}
