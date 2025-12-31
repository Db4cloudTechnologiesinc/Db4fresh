import React, { useState } from "react";

const slots = [
  "6:00 AM - 8:00 AM",
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
];

export default function DeliverySlot({ onSelect }) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000)
    .toISOString()
    .split("T")[0];

  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState("");

  const handleSelect = (s) => {
    setSlot(s);
    onSelect({
      date,
      time: s,
    });
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Select Delivery Slot</h3>

      {/* DATE SELECTOR */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setDate(today)}
          className={`px-3 py-1 rounded ${
            date === today ? "bg-red-600 text-white" : "bg-gray-100"
          }`}
        >
          Today
        </button>

        <button
          onClick={() => setDate(tomorrow)}
          className={`px-3 py-1 rounded ${
            date === tomorrow ? "bg-red-600 text-white" : "bg-gray-100"
          }`}
        >
          Tomorrow
        </button>
      </div>

      {/* SLOT LIST */}
      <div className="grid grid-cols-2 gap-2">
        {slots.map((s) => (
          <button
            key={s}
            onClick={() => handleSelect(s)}
            className={`border px-2 py-2 rounded text-sm ${
              slot === s
                ? "border-red-600 bg-red-50"
                : "border-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
