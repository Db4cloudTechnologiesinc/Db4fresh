import { useEffect, useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");

      const res = await axios.get(
        "http://localhost:4000/api/delivery/slots",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSlots(res.data.slots);
      setActiveSlot(res.data.activeSlot);
    } catch (err) {
      console.log("Slots fetch error:", err.response?.data || err.message);
    }
  };

  const bookSlot = async (slotId) => {
    try {
      const token = localStorage.getItem("deliveryToken");

      await axios.post(
        "http://localhost:4000/api/delivery/slots/book",
        { slotId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchSlots();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong";

      alert(errorMessage);
    }
  };

  const cancelSlot = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");

      await axios.post(
        "http://localhost:4000/api/delivery/slots/cancel",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchSlots();
    } catch (err) {
      alert("Failed to cancel slot");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex gap-2">
        <Clock /> Choose Your Slot
      </h1>

      {activeSlot && (
        <button
          onClick={cancelSlot}
          className="mb-5 bg-red-600 text-white px-4 py-2 rounded"
        >
          Cancel Active Slot
        </button>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {slots.map((slot) => (
          <div key={slot.id} className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold">{slot.slot_time}</h3>

            <button
              onClick={() => bookSlot(slot.id)}
              disabled={activeSlot && activeSlot !== slot.id}
              className={`mt-3 w-full py-2 rounded text-white ${
                activeSlot === slot.id
                  ? "bg-green-600"
                  : activeSlot
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black"
              }`}
            >
              {activeSlot === slot.id
                ? "Active Slot"
                : activeSlot
                ? "Another Slot Active"
                : "Activate Slot"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}