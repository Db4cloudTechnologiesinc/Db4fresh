import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export default function DeliveryLayout() {
  return (
    <div className="bg-slate-100 min-h-screen">

      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>

    </div>
  );
}