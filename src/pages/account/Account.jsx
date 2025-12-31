import { useState } from "react";
import ProfileTab from "./ProfileTab";
import AddressTab from "./AddressTab";
import WalletTab from "./WalletTab";
import OrdersTab from "./OrdersTab";
import SupportTab from "./SupportTab";
import GeneralInfoTab from "./GeneralInfoTab";
import NotificationsTab from "./NotificationsTab";

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const handleDeleteAccount = async () => {
  const confirm = window.confirm(
    "Are you sure? This will permanently delete your account."
  );

  if (!confirm) return;

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  try {
    const res = await fetch(
      "http://localhost:4000/api/users/delete",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    alert(data.message || "Account deleted");

    // Logout user
    localStorage.clear();
    window.location.href = "/";
  } catch (err) {
    alert("Failed to delete account");
  }
};


  return (
    <div className="max-w-5xl mx-auto mt-6 bg-white rounded-xl shadow">
      {/* HEADER */}
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-semibold">My Account</h2>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <div className="w-64 border-r">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-6 py-3 ${
              activeTab === "profile"
                ? "bg-red-100 text-red-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("address")}
            className={`w-full text-left px-6 py-3 ${
              activeTab === "address"
                ? "bg-red-100 text-red-600 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            Addresses
          </button>
        
        <button
  onClick={() => setActiveTab("wallet")}
  className={`w-full text-left px-6 py-3 ${
    activeTab === "wallet"
      ? "bg-red-100 text-red-600 font-medium"
      : "hover:bg-gray-100"
  }`}
>
  Wallet & Rewards
</button>

<button
  onClick={() => setActiveTab("orders")}
  className={`w-full text-left px-6 py-3 ${
    activeTab === "orders"
      ? "bg-red-100 text-red-600 font-medium"
      : "hover:bg-gray-100"
  }`}
>
  Orders
</button>
<button
  onClick={() => setActiveTab("support")}
  className={`w-full text-left px-6 py-3 ${
    activeTab === "support"
      ? "bg-red-100 text-red-600 font-medium"
      : "hover:bg-gray-100"
  }`}
>
  Help & Support
</button>
<button  onClick={() => setActiveTab("info")}
  className={`w-full text-left px-6 py-3 ${
    activeTab === "info"
      ? "bg-red-100 text-red-600 font-medium"
      : "hover:bg-gray-100"
  }`}> 
  General Info
</button>
<button
  onClick={() => setActiveTab("notifications")}
  className={`w-full text-left px-6 py-3 ${
    activeTab === "notifications"
      ? "bg-red-100 text-red-600 font-medium"
      : "hover:bg-gray-100"
  }`}
>
  Notifications
</button>
<button
  onClick={handleDeleteAccount}
  className="mt-8 text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50"
>
  Delete Account
</button>


</div>


        {/* CONTENT */}
        <div className="flex-1 p-6">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "address" && <AddressTab />}
          {activeTab === "wallet" && <WalletTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "support" && <SupportTab />}
          {activeTab === "info" && <GeneralInfoTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>

    
  );
}


