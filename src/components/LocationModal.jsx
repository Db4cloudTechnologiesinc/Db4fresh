import { useEffect, useState } from "react";
import axios from "axios";
import AddressModal from "./AddressModal";

export default function LocationModal({ isOpen, onClose, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= LOAD ADDRESSES ================= */
  const loadAddresses = async () => {
  if (!token) {
    setAddresses([]);
    return;
  }

  try {
    const res = await axios.get(
      "http://localhost:4000/api/addresses",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const list = Array.isArray(res.data) ? res.data : [];
    setAddresses(list);
  } catch (err) {
    console.error("LOAD ADDRESS ERROR:", err);
    setAddresses([]);
  }
};

  /* ================= DELETE ADDRESS ================= */
 const deleteAddress = async (id) => {
  if (!window.confirm("Delete this address?")) return;

  try {
    await axios.delete(
      `http://localhost:4000/api/addresses/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔥 REMOVE FROM UI IMMEDIATELY
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  } catch (err) {
    console.error("DELETE ADDRESS ERROR:", err);
    alert("Failed to delete address");
  }
};

  /* ================= OPEN MODAL ================= */
  useEffect(() => {
    if (isOpen) {
      loadAddresses();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-xl p-6 max-h-[80vh] overflow-y-auto">

          <h2 className="text-xl font-bold mb-4">
            Select Delivery Address
          </h2>

          {/* ================= ADDRESS LIST ================= */}
          {addresses.length === 0 ? (
            <p className="text-sm text-gray-500 mb-4">
              No saved addresses
            </p>
          ) : (
            addresses.map((a) => (
              <div
                key={a.id}
                className="border rounded-lg p-3 mb-3"
              >
                <p className="font-semibold">{a.name}</p>
                <p className="text-sm">
                  {a.address_line1}
                  {a.city ? `, ${a.city}` : ""}
                </p>
                <p className="text-xs text-gray-600">
                  Pincode: {a.pincode}
                </p>

                <div className="flex justify-between items-center mt-2 text-sm">
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

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditAddress(a);
                        setShowAdd(true);
                      }}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteAddress(a.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* ================= ADD ADDRESS ================= */}
          <button
            onClick={() => {
              setEditAddress(null);
              setShowAdd(true);
            }}
            className="w-full bg-red-600 text-white py-2 rounded-lg mt-2"
          >
            + Add New Address
          </button>

          {/* ================= CLOSE ================= */}
          <button
            onClick={onClose}
            className="w-full mt-2 border py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      <AddressModal
        isOpen={showAdd}
        editData={editAddress}
        onClose={() => {
          setShowAdd(false);
          setEditAddress(null);
        }}
        onSave={() => {
          setShowAdd(false);
          setEditAddress(null);
          loadAddresses(); // 🔥 instant refresh
        }}
      />
    </>
  );
}
