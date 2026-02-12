
import React, { useState } from "react";

const SLOTS = [
  "6:00 AM - 9:00 AM",
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
];

const EXPRESS_SLOT = "Express (30 mins)";

export default function DeliverySlot({ onChange }) {
  const [day, setDay] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("");

  const handleSelect = (time) => {
    setSelectedTime(time);
    onChange({
      date: day,
      time: time,
    });
  };

  return (
    <div>
      {/* Day Selector */}
      <div className="flex gap-3 mb-4">
        {["Today", "Tomorrow"].map((d) => (
          <button
            key={d}
            onClick={() => {
              setDay(d);
              setSelectedTime("");
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${
              day === d
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="grid grid-cols-2 gap-3">
        {SLOTS.map((slot) => (
          <button
            key={slot}
            onClick={() => handleSelect(slot)}
            className={`border rounded-lg py-2 text-sm ${
              selectedTime === slot
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-gray-300"
            }`}
          >
            {slot}
          </button>
        ))}

        {/* Express Slot */}
        <button
          onClick={() => handleSelect(EXPRESS_SLOT)}
          className={`col-span-2 border rounded-lg py-2 text-sm font-medium ${
            selectedTime === EXPRESS_SLOT
              ? "border-orange-500 bg-orange-50 text-orange-600"
              : "border-orange-400 text-orange-600"
          }`}
        >
          🚀 {EXPRESS_SLOT}
        </button>
      </div>
    </div>
  );
}
