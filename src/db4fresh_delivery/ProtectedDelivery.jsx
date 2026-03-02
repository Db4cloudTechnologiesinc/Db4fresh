import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedDelivery() {
  const token = localStorage.getItem("deliveryToken");

  if (!token) {
    return <Navigate to="/delivery/login" replace />;
  }

  return <Outlet />;
}