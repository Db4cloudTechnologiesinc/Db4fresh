<<<<<<< HEAD
=======
// import { useLocation } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import BottomNav from "./components/BottomNav";
// import FloatingCart from "./components/FloatingCart";
// import AppRoutes from "./routes/AppRoutes";
// import AddressModal from "./components/AddressModal";
>>>>>>> 1b1f779f33a8e28559a72481ec8b515e00342974

import { useLocation } from "react-router-dom";

<<<<<<< HEAD
=======

// export default function App() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">

//       {/* HEADER */}
//       <Header />

//       {/* MAIN CONTENT */}
//       <main className="flex-1 px-2 md:px-6 py-4">
//         <AppRoutes />
//       </main>
//       <Footer />
//       <BottomNav />
//       <FloatingCart />
//       <AddressModal />
// import AddressModal from "./components/AddressModal";

// import AppRoutes from "./routes/AppRoutes";
// import AdminRoutes from "./Admin/Routes/AdminRoutes";

// export default function App() {
//   const location = useLocation();
//   const isAdminRoute = location.pathname.startsWith("/admin");

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* USER HEADER */}
//       {!isAdminRoute && <Header />}

//       {/* MAIN CONTENT */}
//       <main className={`flex-1 ${isAdminRoute ? "" : "px-2 md:px-6 py-4"}`}>
//         {/* IMPORTANT: render ONLY ONE */}
//         {isAdminRoute ? <AdminRoutes /> : <AppRoutes />}
//       </main>

//       {/* USER FOOTER & NAV */}
//       {!isAdminRoute && <Footer />}
//       {!isAdminRoute && <BottomNav />}
//       {!isAdminRoute && <FloatingCart />}
//       {!isAdminRoute && <AddressModal />}
//     </div>
//   );
// }
>>>>>>> 1b1f779f33a8e28559a72481ec8b515e00342974
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import FloatingCart from "./components/FloatingCart";
import AppRoutes from "./routes/AppRoutes";
import AddressModal from "./components/AddressModal";

import DeliveryApp from "./db4fresh_delivery/DeliveryApp";

export default function App() {
  const location = useLocation();
  const isDeliveryRoute = location.pathname.startsWith("/delivery");

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <>
        {!isDeliveryRoute && <Header />}

        <main className="flex-1 px-2 md:px-6 py-4">
          <AppRoutes />
        </main>

        {!isDeliveryRoute && (
          <>
            <Footer />
            <BottomNav />
            <FloatingCart />
            <AddressModal />
          </>
        )}
      </>

    </div>
  );
}