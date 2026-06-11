import { useState } from "react";
import ProfileTab from "./ProfileTab";
import AddressTab from "./AddressTab";
import WalletTab from "./WalletTab";
import OrdersTab from "./OrdersTab";
import SupportTab from "./SupportTab";
import GeneralInfoTab from "./GeneralInfoTab";
import NotificationsTab from "./NotificationsTab";
import LanguageSettings from "../../components/LanguageSwitcher";
import { useTranslate } from "../../utils/useTranslate";

export default function Account() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const t = useTranslate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(t("deleteConfirm"));
    if (!confirmDelete) return;

    const token = user?.token;

    try {
      const res = await fetch("http://localhost:4000/api/users/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      alert(data.message || t("accountDeleted"));

      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      alert(t("deleteFailed"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-5">
        {t("myAccount")}
      </h1>

      {/* USER CARD */}
      <div className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center text-xl font-bold">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              {user?.name || "User"}
            </h2>

            <p className="text-gray-500">
              {user?.email}
            </p>

            <p className="text-gray-500 text-sm">
              {user?.phone}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ActionCard
          icon="📦"
          title={t("orders")}
          onClick={() => setActiveTab("orders")}
        />

        <ActionCard
          icon="📍"
          title={t("addresses")}
          onClick={() => setActiveTab("address")}
        />

        <ActionCard
          icon="💰"
          title={t("wallet")}
          onClick={() => setActiveTab("wallet")}
        />

        <ActionCard
          icon="👤"
          title={t("profile")}
          onClick={() => setActiveTab("profile")}
        />
      </div>

      {/* EXTRA ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ActionCard
          icon="🔔"
          title={t("notifications")}
          onClick={() => setActiveTab("notifications")}
        />

        <ActionCard
          icon="ℹ️"
          title={t("general")}
          onClick={() => setActiveTab("info")}
        />

        <ActionCard
          icon="🌐"
          title={t("language")}
          onClick={() => setActiveTab("language")}
        />

        <ActionCard
          icon="💬"
          title={t("help")}
          onClick={() => setActiveTab("support")}
        />
      </div>

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-semibold text-lg mb-2">
              Welcome Back 👋
            </h3>

            <p className="text-gray-500">
              Manage your orders, addresses, wallet and
              account settings from one place.
            </p>
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-semibold mb-3">
              Recent Orders
            </h3>

            <button
              onClick={() => setActiveTab("orders")}
              className="text-red-600 font-medium"
            >
              View Orders →
            </button>
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-semibold mb-3">
              Saved Addresses
            </h3>

            <button
              onClick={() => setActiveTab("address")}
              className="text-red-600 font-medium"
            >
              Manage Addresses →
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT */}
      {activeTab !== "dashboard" && (
        <div className="bg-white rounded-2xl border shadow-sm p-5">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "address" && <AddressTab />}
          {activeTab === "wallet" && <WalletTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "support" && <SupportTab />}
          {activeTab === "info" && <GeneralInfoTab />}
          {activeTab === "notifications" && (
            <NotificationsTab />
          )}
          {activeTab === "language" && (
            <LanguageSettings />
          )}

          <div className="border-t mt-8 pt-5">
            <button
              onClick={handleDeleteAccount}
              className="text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              {t("deleteAccount")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionCard({ icon, title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        bg-white
        border
        rounded-2xl
        p-5
        text-left
        hover:shadow-md
        transition
        hover:-translate-y-1
      "
    >
      <div className="text-3xl mb-2">
        {icon}
      </div>

      <div className="font-medium">
        {title}
      </div>
    </button>
  );
}