// import { Routes, Route, Navigate } from "react-router-dom";

// import DeliveryLogin from "./pages/DeliveryLogin";
// import DeliveryRegister from "./pages/DeliveryRegister";
// import DeliveryLayout from "./DeliveryLayout";

// import DeliveryDashboard from "./pages/DeliveryDashboard";
// import OrdersList from "./pages/OrdersList";
// import OrderDetails from "./pages/OrderDetails";
// import Earnings from "./pages/Earnings";
// import Slots from "./pages/Slots";
// import ReferEarn from "./pages/ReferEarn";
// import Profile from "./pages/Profile";
// import DeliveryHistory from "./pages/DeliveryHistory";
// import CODHistory from "./pages/CodHistory";
// import DeliveryWallet from "./pages/DeliveryWallet";
// import DeliveryAssignedOrders from "./pages/DeliveryAssignedOrders";
// import Store from "./pages/Store";
// import HelpSupport from "./pages/HelpSupport";
// import Documents from "./pages/Documents";

// export default function DeliveryApp() {
//   return (
//     <Routes>
      
//       {/* Login & Register */}
//       <Route path="/delivery/login" element={<DeliveryLogin />} />
//       <Route path="/delivery/register" element={<DeliveryRegister />} />

//       {/* Layout with Sidebar */}
//       <Route path="/delivery" element={<DeliveryLayout />}>

//         <Route index element={<Navigate to="dashboard" />} />
//         <Route path="dashboard" element={<DeliveryDashboard />} />
//         <Route path="orders" element={<OrdersList />} />
//         <Route path="order/:id" element={<OrderDetails />} />
//         <Route path="earnings" element={<Earnings />} />
//         <Route path="history" element={<DeliveryHistory />} />
//         <Route path="slots" element={<Slots />} />
//         <Route path="refer" element={<ReferEarn />} />
//         <Route path="profile" element={<Profile />} />
//         <Route path="store" element={<Store />} />
//         <Route path="help" element={<HelpSupport />} />
//         <Route path="documents" element={<Documents />} />
//         <Route path="wallet" element={<DeliveryWallet />} />
//         <Route path="cod-history" element={<CODHistory />} />
//         <Route path="assigned-orders" element={<DeliveryAssignedOrders />} />

//       </Route>

//     </Routes>
//   );
// }


import { Routes, Route, Navigate } from "react-router-dom";

import DeliveryLogin from "./pages/DeliveryLogin";
import DeliveryRegister from "./pages/DeliveryRegister";
import DeliveryLayout from "./DeliveryLayout";

import DeliveryDashboard from "./pages/DeliveryDashboard";
import OrdersList from "./pages/OrdersList";
import OrderDetails from "./pages/OrderDetails";
import Earnings from "./pages/Earnings";
import Slots from "./pages/Slots";
import ReferEarn from "./pages/ReferEarn";
import Profile from "./pages/Profile";
import DeliveryHistory from "./pages/DeliveryHistory";
import CODHistory from "./pages/CodHistory";
import DeliveryWallet from "./pages/DeliveryWallet";
import DeliveryAssignedOrders from "./pages/DeliveryAssignedOrders";
import Store from "./pages/Store";
import HelpSupport from "./pages/HelpSupport";
import Documents from "./pages/Documents";
import ProtectedDelivery from "./ProtectedDelivery";

export default function DeliveryApp() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="login" element={<DeliveryLogin />} />
      <Route path="register" element={<DeliveryRegister />} />

      {/* Protected Routes */}
      <Route element={<ProtectedDelivery />}>
        <Route element={<DeliveryLayout />}>

          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<DeliveryDashboard />} />
          <Route path="assigned-orders" element={<DeliveryAssignedOrders />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="order/:id" element={<OrderDetails />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="history" element={<DeliveryHistory />} />
          <Route path="slots" element={<Slots />} />
          <Route path="refer" element={<ReferEarn />} />
          <Route path="profile" element={<Profile />} />
          <Route path="store" element={<Store />} />
          <Route path="help" element={<HelpSupport />} />
          <Route path="documents" element={<Documents />} />
          <Route path="wallet" element={<DeliveryWallet />} />
          <Route path="cod-history" element={<CODHistory />} />

        </Route>
      </Route>

    </Routes>
  );
}