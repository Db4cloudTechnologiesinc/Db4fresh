
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
  const [activeTab, setActiveTab] = useState("profile");
  const t = useTranslate();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(t("deleteConfirm"));
    if (!confirmDelete) return;

    const token = JSON.parse(localStorage.getItem("user"))?.token;

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
    <div className="max-w-5xl mx-auto mt-6 bg-white rounded-xl shadow">
      {/* HEADER */}
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-semibold">{t("myAccount")}</h2>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <div className="w-64 border-r">
          <SidebarButton
            label={t("profile")}
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <SidebarButton
            label={t("addresses")}
            active={activeTab === "address"}
            onClick={() => setActiveTab("address")}
          />
          <SidebarButton
            label={t("wallet")}
            active={activeTab === "wallet"}
            onClick={() => setActiveTab("wallet")}
          />
          <SidebarButton
            label={t("orders")}
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />
          <SidebarButton
            label={t("help")}
            active={activeTab === "support"}
            onClick={() => setActiveTab("support")}
          />
          <SidebarButton
            label={t("general")}
            active={activeTab === "info"}
            onClick={() => setActiveTab("info")}
          />
          <SidebarButton
            label={t("notifications")}
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
          <SidebarButton
            label={`🌐 ${t("language")}`}
            active={activeTab === "language"}
            onClick={() => setActiveTab("language")}
          />

          <button
            onClick={handleDeleteAccount}
            className="m-4 text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50"
          >
            {t("deleteAccount")}
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
          {activeTab === "language" && <LanguageSettings />}
        </div>
      </div>
    </div>
  );
}

/* ================= SIDEBAR BUTTON ================= */

function SidebarButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-3 transition ${
        active
          ? "bg-red-100 text-red-600 font-medium"
          : "hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}
