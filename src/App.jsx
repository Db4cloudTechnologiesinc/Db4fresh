
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

      {!isDeliveryRoute && <Header />}

      {/* ZEPTO STYLE CENTER CONTAINER */}
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