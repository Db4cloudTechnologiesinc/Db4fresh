
// // import Header from "./components/Header";
// // import Footer from "./components/Footer";
// // import BottomNav from "./components/BottomNav";
// // import FloatingCart from "./components/FloatingCart";
// // import AppRoutes from "./routes/AppRoutes";
// // import AddressModal from "./components/AddressModal";


// // export default function App() {
// //   return (
// //     <div className="min-h-screen flex flex-col bg-gray-100">

// //       <Header />

// //       <main className="flex-1 px-2 md:px-6 py-4">
// //         <AppRoutes />
// //       </main>

// //       <Footer />
// //       <BottomNav />
// //       <FloatingCart />
// //       <AddressModal />
// //     </div>
// //   );
// // }




// import { useLocation } from "react-router-dom";

// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import BottomNav from "./components/BottomNav";
// import FloatingCart from "./components/FloatingCart";
// import AppRoutes from "./routes/AppRoutes";
// import AddressModal from "./components/AddressModal";


// export default function App() {
//   const location = useLocation();

//   const isDeliveryRoute = location.pathname.startsWith("/delivery");

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">

//       {/* Hide main layout for delivery routes */}
//       {!isDeliveryRoute && <Header />}

//       <main className="flex-1 px-2 md:px-6 py-4">
//         <AppRoutes />
//       </main>

//       {!isDeliveryRoute && <Footer />}
//       {!isDeliveryRoute && <BottomNav />}
//       {!isDeliveryRoute && <FloatingCart />}
//       {!isDeliveryRoute && <AddressModal />}

//     </div>
//   );
// }
import { useLocation } from "react-router-dom";

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

      {/* ---------------- DELIVERY APP ---------------- */}
      {isDeliveryRoute ? (
        <DeliveryApp />
      ) : (
        <>
          {/* ---------------- CUSTOMER APP ---------------- */}
          <Header />

          <main className="flex-1 px-2 md:px-6 py-4">
            <AppRoutes />
          </main>

          <Footer />
          <BottomNav />
          <FloatingCart />
          <AddressModal />
        </>
      )}

    </div>
  );
}
