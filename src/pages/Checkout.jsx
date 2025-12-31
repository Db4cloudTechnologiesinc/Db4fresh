import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import AddressList from "../components/AddressList";
import DeliverySlot from "../components/DeliverySlot";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart.items);
  const token = localStorage.getItem("token");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.qty,
    0
  );

  /* ===============================
     PLACE ORDER HANDLER
  =============================== */
  const placeOrder = async () => {
    if (!items.length) {
      alert("Cart is empty");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    if (!selectedSlot) {
      alert("Please select a delivery slot");
      return;
    }

    // 🟢 CASH ON DELIVERY
    if (paymentMethod === "COD") {
      const success = await submitOrder("COD");
      if (success) {
        dispatch(clearCart());
        navigate("/order-success");
      }
      return;
    }

    // 🔵 ONLINE PAYMENT (MOCK)
    setProcessing(true);

    setTimeout(async () => {
      setProcessing(false);

      const paymentSuccess = Math.random() > 0.3;

      if (!paymentSuccess) {
        alert("Payment Failed ❌");
        return;
      }

      const success = await submitOrder("ONLINE");

      if (success) {
        dispatch(clearCart());
        alert("Payment Successful ✅");
        navigate("/order-success");
      }
    }, 2000);
  };

  /* ===============================
     SUBMIT ORDER API
  =============================== */
  const submitOrder = async (paymentType) => {
    try {
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          items,
          totalAmount: subtotal,
          address_id: selectedAddress.id || null,
          address_text: selectedAddress.address,
          delivery_date: selectedSlot.date,
          delivery_slot: selectedSlot.time,
          paymentMethod: paymentType,
        }),
      });

      if (!res.ok) {
        alert("Order failed ❌");
        return false;
      }

      return true;
    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert("Something went wrong ❌");
      return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <AddressList onSelect={setSelectedAddress} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Slot</h2>
          <DeliverySlot onChange={setSelectedSlot} />
          {selectedSlot && (
            <p className="mt-3 text-sm text-gray-600">
              Selected: {selectedSlot.date} ({selectedSlot.time})
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

          <label className="flex items-center gap-3 mb-2">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Pay Online (Mock)
          </label>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white rounded-xl shadow p-6 h-fit">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex justify-between text-sm mb-2"
          >
            <span>
              {item.name} × {item.qty}
            </span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{subtotal}</span>
        </div>

        <button
          onClick={placeOrder}
          disabled={processing}
          className="w-full mt-6 bg-red-600 hover:bg-red-700
                     text-white py-3 rounded-xl text-lg font-semibold
                     disabled:opacity-60"
        >
          {processing ? "Processing Payment..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
