import React, { useState, useEffect } from "react";
import axios from "axios";
import AddressModal from "./AddressModal";

export default function LocationModal({ isOpen, onClose, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const API = "http://localhost:4000/api/addresses";
  const token = localStorage.getItem("token");

  const authHeader = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  /* ---------------- LOAD ADDRESSES ---------------- */
  const loadAddresses = async () => {
    if (token) {
      try {
        const res = await axios.get(API, authHeader);
        setAddresses(res.data.addresses || []);
        return;
      } catch (err) {
        console.error("Backend address error:", err);
      }
    }

    // Guest user → localStorage
    const local = JSON.parse(localStorage.getItem("guest_addresses")) || [];
    setAddresses(local);
  };

  useEffect(() => {
    if (isOpen) loadAddresses();
  }, [isOpen]);

  /* ---------------- SAVE GUEST ADDRESSES ---------------- */
  const saveGuestAddresses = (list) => {
    localStorage.setItem("guest_addresses", JSON.stringify(list));
    setAddresses(list);
  };

  /* ---------------- ADD / EDIT ADDRESS ---------------- */
  const handleSaveAddress = async (addr) => {
    if (token) {
      if (addr.id) {
        await axios.put(`${API}/${addr.id}`, addr, authHeader);
      } else {
        await axios.post(API, addr, authHeader);
      }
      loadAddresses();
    } else {
      // Guest
      if (addr.id) {
        const updated = addresses.map((a) =>
          a.id === addr.id ? addr : a
        );
        saveGuestAddresses(updated);
      } else {
        const newAddr = {
          ...addr,
          id: Date.now(),
          is_default: addresses.length === 0,
        };
        saveGuestAddresses([...addresses, newAddr]);
      }
    }

    setShowAddModal(false);
    setEditAddress(null);
  };

  /* ---------------- DELETE ADDRESS ---------------- */
  const handleDeleteAddress = async (addr) => {
    if (token) {
      await axios.delete(`${API}/${addr.id}`, authHeader);
      loadAddresses();
    } else {
      let updated = addresses.filter((a) => a.id !== addr.id);

      // If default deleted, make first one default
      if (addr.is_default && updated.length > 0) {
        updated[0].is_default = true;
      }

      saveGuestAddresses(updated);
    }
  };

  /* ---------------- SET DEFAULT ---------------- */
  const handleSetDefault = async (addr) => {
    if (token) {
      await axios.put(`${API}/${addr.id}/default`, {}, authHeader);
    } else {
      const updated = addresses.map((a) => ({
        ...a,
        is_default: a.id === addr.id,
      }));
      saveGuestAddresses(updated);
    }

    onSelect(addr.address);
    onClose();
  };

  if (!isOpen) return null;

  const defaultAddress = addresses.find((a) => a.is_default);
  const otherAddresses = addresses.filter((a) => !a.is_default);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
        <div className="bg-white w-full max-w-md p-6 rounded-xl">

          <h2 className="text-xl font-bold mb-4">Select Delivery Address</h2>

          {/* ⭐ DEFAULT ADDRESS */}
          {defaultAddress && (
            <div className="mb-4 p-3 border rounded-lg bg-green-50">
              <p className="font-semibold mb-1">Default Address</p>
              <p>{defaultAddress.address}</p>
              <p className="text-sm text-gray-600">
                Pincode: {defaultAddress.pincode}
              </p>

              <div className="flex gap-4 mt-2 text-sm">
                <button
                  onClick={() => handleSetDefault(defaultAddress)}
                  className="text-red-600 underline"
                >
                  Deliver Here
                </button>
                <button
                  onClick={() => {
                    setEditAddress(defaultAddress);
                    setShowAddModal(true);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(defaultAddress)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* 📦 OTHER ADDRESSES */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {otherAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3 border rounded-lg bg-gray-50 flex justify-between"
              >
                <div>
                  <p className="font-bold">{addr.type || "Address"}</p>
                  <p>{addr.address}</p>
                  <p className="text-sm text-gray-600">
                    Pincode: {addr.pincode}
                  </p>

                  <button
                    onClick={() => handleSetDefault(addr)}
                    className="text-red-600 underline mt-1"
                  >
                    Deliver Here
                  </button>
                </div>

                <div className="flex flex-col text-right gap-1">
                  <button
                    onClick={() => {
                      setEditAddress(addr);
                      setShowAddModal(true);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ➕ ADD ADDRESS */}
          <button
            onClick={() => {
              setEditAddress(null);
              setShowAddModal(true);
            }}
            className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg"
          >
            + Add New Address
          </button>

          {/* ❌ CLOSE */}
          <button
            className="w-full mt-3 border py-2 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      <AddressModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditAddress(null);
        }}
        onSave={handleSaveAddress}
        editData={editAddress}
      />
    </>
  );
}
