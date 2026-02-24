
import { Routes, Route } from "react-router-dom";
import Store from "./pages/Store";
import HelpSupport from "./pages/HelpSupport";
import Documents from "./pages/Documents";

import DeliveryLogin from "./pages/DeliveryLogin";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import OrdersList from "./pages/OrdersList";
import OrderDetails from "./pages/OrderDetails";
import Earnings from "./pages/Earnings"; // or Earnings if renamed
import Slots from "./pages/Slots";
import ReferEarn from "./pages/ReferEarn";
import Profile from "./pages/Profile";
import DeliveryHistory from "./pages/DeliveryHistory";
import CODHistory from "./pages/CODHistory";
import DeliveryWallet from "./pages/DeliveryWallet";
import DeliveryAssignedOrders from "./pages/DeliveryAssignedOrders";



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
        <Route path="history" element={<DeliveryHistory />} />
        <Route path="slots" element={<Slots />} />
        <Route path="refer" element={<ReferEarn />} />
        <Route path="profile" element={<Profile />} />
          {/* NEW ROUTES */}
  <Route path="store" element={<Store />} />
  <Route path="help" element={<HelpSupport />} />
  <Route path="documents" element={<Documents />} />
  <Route path="wallet" element={<DeliveryWallet />} />
  <Route path="cod-history" element={<CODHistory />} />
  <Route path="assigned-orders" element={<DeliveryAssignedOrders />} />

       
      </Route>

    </Routes>
  );
}
