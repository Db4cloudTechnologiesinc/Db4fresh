import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderSuccess() {
  const navigate = useNavigate();

  // Auto redirect after 5 seconds (optional but nice UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

        <FiCheckCircle className="mx-auto text-green-600" size={80} />

        <h1 className="text-2xl font-bold mt-4">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-600 mt-2">
          Thank you for shopping with us.  
          Your order will be delivered soon.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 py-3 rounded-xl font-semibold"
          >
            Go to Home
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Redirecting to home in 5 seconds...
        </p>
      </div>
    </div>
  );
}
