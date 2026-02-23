
import { Routes, Route } from "react-router-dom";

import DeliveryLogin from "./pages/DeliveryLogin";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import OrdersList from "./pages/OrdersList";
import OrderDetails from "./pages/OrderDetails";
import Earnings from "./pages/Earnings"; // or Earnings if renamed
import Slots from "./pages/Slots";
import ReferEarn from "./pages/ReferEarn";
import Profile from "./pages/Profile";



import DeliveryLayout from "./DeliveryLayout";

export default function DeliveryApp() {
  return (
    <Routes>

      <Route path="/" element={<DeliveryLogin />} />

      <Route path="/delivery" element={<DeliveryLayout />}>
      
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="order/:id" element={<OrderDetails />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="slots" element={<Slots />} />
        <Route path="refer" element={<ReferEarn />} />
        <Route path="profile" element={<Profile />} />

       
      </Route>

    </Routes>
  );
}
