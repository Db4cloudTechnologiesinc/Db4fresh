
import React from "react";

export default function AdminNavbar() {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-gray-700">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Hello, Admin</span>

        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => {
            // sessionStorage.removeItem("admin_auth"); // UPDATED
            // window.location.href = "/admin/login";
            localStorage.removeItem("admin_auth");
localStorage.removeItem("admin_token");
window.location.href = "/admin/login";

          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
