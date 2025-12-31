import React from "react";
import { useSelector } from "react-redux";

export default function AddressSection({ onClose, onSelect, onAddAddress }) {
  const addresses = useSelector((s) => s.address.addresses || []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Select delivery address</h3>
          <button onClick={onClose} className="text-xl text-gray-500">✕</button>
        </div>

        {/* ADDRESS LIST */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`border rounded-lg p-3 ${
                Number(addr.is_default) === 1
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
            > 
              <p className="font-medium">{addr.name || "Home"}</p>

              <p className="text-sm text-gray-500">
                {[addr.address_line2, addr.landmark, addr.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <button
                onClick={() => {
                  onSelect(addr);
                  onClose();
                }}
                className="mt-2 text-red-600 text-sm font-semibold"
              >
                Deliver here
              </button>
            </div>
          ))}

          {addresses.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No saved addresses
            </p>
          )}
        </div>

        {/* ADD ADDRESS */}
        <button
          onClick={onAddAddress}
          className="w-full mt-4 border border-dashed border-red-500 text-red-600 py-2 rounded-lg font-medium"
        >
          + Add new address
        </button>
      </div>
    </div>
  );
}
