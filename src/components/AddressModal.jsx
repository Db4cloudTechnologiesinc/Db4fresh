
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddressModal({ isOpen, onClose, onSave, editData }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    is_default: true,
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        is_default: true,
      });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!form.address_line1 || form.pincode.length !== 6) {
      alert("Address & valid pincode required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:4000/api/addresses",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 8000,
        }
      );

      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Address Save Error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
        "Failed to save address. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Address</h2>

        {[
          ["Name", "name"],
          ["Phone", "phone"],
          ["Address Line 1", "address_line1"],
          ["Address Line 2", "address_line2"],
          ["City", "city"],
          ["State", "state"],
          ["Pincode", "pincode"],
          ["Landmark", "landmark"],
        ].map(([label, key]) => (
          <input
            key={key}
            className="w-full border p-3 rounded-lg mb-3"
            placeholder={label}
            value={form[key] || ""}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        ))}

        <label className="flex gap-2 mb-4">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(e) => handleChange("is_default", e.target.checked)}
          />
          Set as default address
        </label>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
}