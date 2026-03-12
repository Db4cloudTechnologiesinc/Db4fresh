
// import { useLocation } from "react-router-dom";

// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import BottomNav from "./components/BottomNav";
// import FloatingCart from "./components/FloatingCart";
// import AppRoutes from "./routes/AppRoutes";
// import AddressModal from "./components/AddressModal";

// import DeliveryApp from "./db4fresh_delivery/DeliveryApp";

// export default function App() {
//   const location = useLocation();
//   const isDeliveryRoute = location.pathname.startsWith("/delivery");

//   return (
//     <div className="min-h-screen flex flex-col bg-white">

//       {!isDeliveryRoute && <Header />}

//       {/* ZEPTO STYLE CENTER CONTAINER */}
//       <main className="flex-1">
//         <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4">
//           <AppRoutes />
//         </div>
//       </main>

//       {!isDeliveryRoute && (
//         <>
//           <Footer />
//           <BottomNav />
//           <FloatingCart />
//           <AddressModal />
//         </>
//       )}

//     </div>
//   );
// }
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setCart } from "./features/cart/cartSlice";

import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import FloatingCart from "./components/FloatingCart";
import AppRoutes from "./routes/AppRoutes";
import AddressModal from "./components/AddressModal";

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const isDeliveryRoute = location.pathname.startsWith("/delivery");

  // check auth state
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user) return;

        const res = await axios.get("/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Cart Loaded:", res.data);

        dispatch(setCart(res.data));
      } catch (err) {
        console.log("Cart load error:", err);
      }
    };

    loadCart();
  }, [dispatch, user]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isDeliveryRoute && <Header />}

      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4">
          <AppRoutes />
        </div>
      </main>

      {!isDeliveryRoute && (
        <>
          <Footer />
          <BottomNav />
          <FloatingCart />
          <AddressModal />
        </>
      )}
    </div>
  );
}