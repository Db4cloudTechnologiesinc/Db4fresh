import React, { useState, useEffect } from "react";
import AddressModal from "./AddressModal";
import axios from "axios";

export default function LocationModal({ isOpen, onClose, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const API = "http://localhost:4000/api/addresses";
  const USER_ID = "user123"; // Replace after authentication is implemented

  // Load addresses from backend
  const loadAddresses = async () => {
    try {
      const res = await axios.get(API, {
        headers: { "x-user-id": USER_ID },
      });
      setAddresses(res.data.addresses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) loadAddresses();
  }, [isOpen]);

  // Create new address
  const handleAddAddress = async (addr) => {
    try {
      await axios.post(API, addr, {
        headers: { "x-user-id": USER_ID },
      });
      loadAddresses(); // reload list
    } catch (err) {
      console.error(err);
    }
  };

  // Update address
  const handleEditAddress = async (addr) => {
    try {
      await axios.put(`${API}/${addr.id}`, addr, {
        headers: { "x-user-id": USER_ID },
      });
      loadAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { "x-user-id": USER_ID },
      });
      loadAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  // Set default address
  const handleSetDefault = async (addr) => {
    try {
      await axios.put(`${API}/${addr.id}/default`, {}, {
        headers: { "x-user-id": USER_ID },
      });

      // Send selected location back to header
      onSelect(addr.address);
      onClose();

    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
        <div className="bg-white w-full max-w-md p-6 rounded-xl">

          <h2 className="text-xl font-bold mb-3">Select Delivery Address</h2>

          {/* Saved addresses from backend */}
          {addresses.length === 0 && (
            <p className="text-gray-500">No saved addresses.</p>
          )}

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3 border rounded-lg bg-gray-50 flex justify-between"
              >
                <div>
                  <p className="font-bold">
                    {addr.type} {addr.is_default ? "(Default)" : ""}
                  </p>
                  <p>{addr.address}</p>
                  <p className="text-gray-600 text-sm">{addr.landmark}</p>
                  <p className="text-gray-600 text-sm">Pincode: {addr.pincode}</p>

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
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Address */}
          <button
            onClick={() => {
              setEditAddress(null);
              setShowAddModal(true);
            }}
            className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg"
          >
            + Add New Address
          </button>

          {/* Close */}
          <button
            className="w-full mt-3 border py-2 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>

      {/* Address Add/Edit Modal */}
      <AddressModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={editAddress ? handleEditAddress : handleAddAddress}
        editData={editAddress}
      />
    </>
  );
}
