import React, { useState } from "react";

export default function CheckoutPanel({
  totalAmount,
  address,
  user,
  onEditUser,
  onChangeAddress,
  onPay,
}) {
  const [noBag, setNoBag] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">

      {/* 🛍️ NO PAPER BAG */}
      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌱</span>
          <div>
            <p className="font-medium">I don’t need a paper bag!</p>
            <p className="text-xs text-gray-500">
              You have opted for no bag delivery
            </p>
          </div>
        </div>

        <button
          onClick={() => setNoBag(!noBag)}
          className={`w-12 h-6 rounded-full ${
            noBag ? "bg-green-500" : "bg-gray-300"
          } relative`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
              noBag ? "right-1" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* 👤 ORDERING FOR */}
<div className="flex justify-between items-center">
  <p className="font-medium">
    Ordering for{" "}
    <span className="text-purple-600">{user.name}</span>, {user.phone}
  </p>
  <button
    onClick={onEditUser}
    className="text-red-600 text-sm font-semibold"
  >
    Edit
  </button>
</div>


      {/* 📍 DELIVERING TO */}
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={onChangeAddress}
      >
        <span className="text-xl">🏠</span>
        <div>
          <p className="font-medium flex items-center gap-1">
            Delivering to home
            <span className="text-gray-400">▾</span>
          </p>

          {address ? (
            <p className="text-sm text-gray-500">
              {address.address_line2}, {address.landmark} – {address.pincode}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Select delivery address
            </p>
          )}
        </div>
      </div>

      {/* 💳 CLICK TO PAY */}
      <button
        onClick={onPay}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold text-lg"
      >
        Click to Pay ₹{totalAmount}
      </button>
    </div>
  );
}
