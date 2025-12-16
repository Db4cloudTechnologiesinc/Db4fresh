import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddressModal({ isOpen, onClose, onSave, editData }) {
  const [type, setType] = useState("Home");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (editData) {
      setType(editData.type);
      setAddress(editData.address);
      setLandmark(editData.landmark);
      setPincode(editData.pincode);
    }
  }, [editData]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!address || !pincode) {
      alert("Address & Pincode are required");
      return;
    }

    // ⭐ Pincode availability check
    try {
      const res = await axios.get(
        `http://localhost:4000/api/addresses/check/${pincode}`
      );

      if (!res.data.available) {
        alert(res.data.message);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    // ⭐ Save to backend (parent will call API)
    onSave({
      id: editData?.id, // only for update
      type,
      address,
      landmark,
      pincode,
      is_default: editData?.is_default || false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Address" : "Add New Address"}
        </h2>

        {/* Address Type */}
        <label className="font-medium">Address Type</label>
        <select
          className="w-full border p-3 rounded-lg mb-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Home</option>
          <option>Work</option>
          <option>Other</option>
        </select>

        {/* Full Address */}
        <label className="font-medium">Full Address</label>
        <textarea
          className="w-full border p-3 rounded-lg mb-3"
          placeholder="Flat Number, Building Name, Area"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Landmark */}
        <label className="font-medium">Landmark</label>
        <input
          type="text"
          className="w-full border p-3 rounded-lg mb-3"
          placeholder="Nearby landmark"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
        />

        {/* Pincode */}
        <label className="font-medium">Pincode</label>
        <input
          type="text"
          className="w-full border p-3 rounded-lg"
          placeholder="e.g., 500081"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />

        {/* Actions */}
        <div className="flex justify-between mt-5">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={handleSubmit}
          >
            {editData ? "Save Changes" : "Add Address"}
          </button>
        </div>
      </div>
    </div>
  );
}
