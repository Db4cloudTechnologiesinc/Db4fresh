import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import FloatingCart from "./components/FloatingCart";
import AppRoutes from "./routes/AppRoutes";
import AddressModal from "./components/AddressModal";



export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-1 px-2 md:px-6 py-4">
        <AppRoutes />
      </main>
      <Footer />
      <BottomNav />
      <FloatingCart />
      <AddressModal />
    </div>
  );
}
