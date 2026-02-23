// import { useState } from "react";
// import { Clock } from "lucide-react";

// export default function Slots() {
//   const [activeSlot, setActiveSlot] = useState(null);

//   const slots = [
//     { id: 1, time: "6:00 AM - 8:00 AM", peak: false },
//     { id: 2, time: "8:00 AM - 10:00 AM", peak: false },
//     { id: 3, time: "10:00 AM - 12:00 PM", peak: false },
//     { id: 4, time: "12:00 PM - 2:00 PM", peak: true },
//     { id: 5, time: "2:00 PM - 4:00 PM", peak: false },
//     { id: 6, time: "4:00 PM - 6:00 PM", peak: true },
//     { id: 7, time: "6:00 PM - 8:00 PM", peak: true },
//     { id: 8, time: "8:00 PM - 10:00 PM", peak: true },
//     { id: 9, time: "10:00 PM - 12:00 AM", peak: false }
//   ];

//   const handleBook = (slotId) => {
//     setActiveSlot(slotId);
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <Clock /> Available Slots
//       </h1>

//       <div className="grid md:grid-cols-2 gap-5">
//         {slots.map((slot) => (
//           <div
//             key={slot.id}
//             className={`p-5 rounded-xl shadow transition ${
//               slot.peak
//                 ? "bg-yellow-100 border border-yellow-400"
//                 : "bg-white"
//             }`}
//           >
//             <h3 className="font-semibold text-lg">{slot.time}</h3>

//             {slot.peak && (
//               <p className="text-yellow-700 text-sm font-medium">
//                 Peak Slot • 20% Extra Incentive
//               </p>
//             )}

//             <button
//               onClick={() => handleBook(slot.id)}
//               disabled={activeSlot && activeSlot !== slot.id}
//               className={`mt-4 w-full py-2 rounded text-white transition ${
//                 activeSlot === slot.id
//                   ? "bg-green-600"
//                   : activeSlot
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-black hover:bg-gray-800"
//               }`}
//             >
//               {activeSlot === slot.id
//                 ? "Active Slot"
//                 : activeSlot
//                 ? "Another Slot Active"
//                 : "Book Slot"}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);

  const partnerId = 1; // Replace with logged-in partner ID

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    const res = await axios.get(
      `http://localhost:4000/api/delivery/slots/${partnerId}`
    );
    setSlots(res.data.slots);
    setActiveSlot(res.data.activeSlot);
  };

  const bookSlot = async (slotId) => {
    try {
      await axios.post(
        "http://localhost:4000/api/delivery/slots/book",
        { partnerId, slotId }
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
    await axios.post(
      "http://localhost:4000/api/delivery/slots/cancel",
      { partnerId }
    );
    fetchSlots();
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
