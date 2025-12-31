import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddressModal({ isOpen, onClose, onSave, editData }) {
  const [type, setType] = useState("Home");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= PREFILL FOR EDIT ================= */
  useEffect(() => {
    if (editData) {
      setType(editData.type || "Home");
      setAddress(editData.address || "");
      setLandmark(editData.landmark || "");
      setPincode(editData.pincode || "");
    } else {
      setType("Home");
      setAddress("");
      setLandmark("");
      setPincode("");
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!address || !pincode) {
      alert("Address & Pincode are required");
      return;
    }

    if (pincode.length !== 6) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      setLoading(true);

      /* ================= PINCODE CHECK (NO TOKEN) ================= */
      const checkRes = await axios.get(
        `http://localhost:4000/api/addresses/check/${pincode}`
      );

      if (!checkRes.data.available) {
        alert(checkRes.data.message);
        setLoading(false);
        return;
      }

      /* ================= LOGIN CHECK FOR SAVE ================= */
      if (!token) {
        alert("Please login to save address");
        setLoading(false);
        return;
      }

      /* ================= SAVE / UPDATE ADDRESS ================= */
      const payload = {
        type,
        address,
        landmark,
        pincode,
        is_default: editData?.is_default || false,
      };

      let saveRes;

      if (editData?.id) {
        // UPDATE ADDRESS
        saveRes = await axios.put(
          `http://localhost:4000/api/addresses/${editData.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // ADD NEW ADDRESS
        saveRes = await axios.post(
          "http://localhost:4000/api/addresses",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      /* ================= UPDATE UI ================= */
      onSave(saveRes.data);
      onClose();
    } catch (err) {
      console.error("ADDRESS SAVE ERROR:", err);
      alert("Failed to save address. Try again.");
    } finally {
      setLoading(false);
    }
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
          maxLength={6}
          className="w-full border p-3 rounded-lg"
          placeholder="6-digit pincode"
          value={pincode}
          onChange={(e) =>
            setPincode(e.target.value.replace(/\D/g, ""))
          }
        />

        {/* Actions */}
        <div className="flex justify-between mt-5">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editData
              ? "Save Changes"
              : "Add Address"}
          </button>
        </div>
      </div>
    </div>
  );
}
