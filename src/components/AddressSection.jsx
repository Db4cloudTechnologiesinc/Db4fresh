import { useEffect, useState } from "react";
import api from "../api/api";
import AddressModal from "./AddressModal";

export default function AddressSection({ onClose, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState(null);

  const token = localStorage.getItem("token");
console.log("Token:", token);
  /* ================= LOAD ADDRESSES ================= */
  const loadAddresses = async () => {
    try {
      const res = await api.get("/addresses");
      setAddresses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Load address error:", err);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  /* ================= DELETE ADDRESS ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await api.delete(`/addresses/${id}`);

      // 🔥 instant UI update
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete address");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-end sm:items-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-xl sm:rounded-xl max-h-[85vh] overflow-y-auto p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Select Delivery Address
          </h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* ADDRESS LIST */}
        <div className="space-y-3">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="border rounded-lg p-3 bg-gray-50"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-sm text-gray-700">
                    {a.address_line1}
                    {a.city && `, ${a.city}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Pincode: {a.pincode}
                  </p>

                  {a.is_default === 1 && (
                    <span className="text-green-600 text-xs font-medium">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 text-sm">
                  <button
                    onClick={() => {
                      onSelect(a);
                      localStorage.setItem(
                        "selected_address",
                        JSON.stringify(a)
                      );
                      onClose();
                    }}
                    className="text-red-600 underline"
                  >
                    Deliver Here
                  </button>

                  <button
                    onClick={() => {
                      setEditData(a);
                      setShowAdd(true);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADD ADDRESS */}
        <button
          onClick={() => {
            setEditData(null);
            setShowAdd(true);
          }}
          className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg"
        >
          + Add New Address
        </button>
      </div>

      {/* ADD / EDIT MODAL */}
      <AddressModal
        isOpen={showAdd}
        editData={editData}
        onClose={() => {
          setShowAdd(false);
          setEditData(null);
        }}
        onSave={loadAddresses}
      />
    </div>
  );
}
