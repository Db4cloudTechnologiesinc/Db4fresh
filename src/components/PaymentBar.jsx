import { useState } from "react";
import { useSelector } from "react-redux";

export default function PaymentBar({ onPay }) {
  const total = useSelector((s) => s.cart.totalAmount);
  const [cod, setCod] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-4xl mx-auto p-3">

        {/* COD OPTION */}
        <label className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={cod}
            onChange={() => setCod(!cod)}
            className="w-4 h-4 accent-green-600"
          />
          Cash on Delivery
        </label>

        {/* PAY BUTTON */}
        <button
          onClick={() => onPay(cod)}
          className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold text-lg"
        >
          {cod ? "Place Order (COD)" : `Click to Pay ₹${total}`}
        </button>

      </div>
    </div>
  );
}
