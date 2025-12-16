import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const [paymentMethod, setPaymentMethod] = useState("COD");
const [processing, setProcessing] = useState(false);

  // ✅ ADDRESS STATE (IMPORTANT)
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    pincode: "",
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    // basic validation
    if (
      !address.name ||
      !address.phone ||
      !address.house ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please fill all address fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: subtotal,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        return;
      }

      dispatch(clearCart());
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* LEFT – ADDRESS + PAYMENT */}
      <div className="md:col-span-2 space-y-6">

        {/* ADDRESS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border p-3 rounded-lg"
              value={address.name}
              onChange={(e) =>
                setAddress({ ...address, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="border p-3 rounded-lg"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="House / Flat No."
              className="border p-3 rounded-lg md:col-span-2"
              value={address.house}
              onChange={(e) =>
                setAddress({ ...address, house: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Street / Area"
              className="border p-3 rounded-lg md:col-span-2"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="City"
              className="border p-3 rounded-lg"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Pincode"
              className="border p-3 rounded-lg"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />
          </div>
        </div>

        {/* PAYMENT */}
        {/* <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

          <label className="flex items-center gap-3">
            <input type="radio" checked readOnly />
            <span>Cash on Delivery</span>
          </label>
        </div>*/}
        <div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

  <div className="space-y-3">
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        name="payment"
        checked={paymentMethod === "COD"}
        onChange={() => setPaymentMethod("COD")}
      />
      <span>Cash on Delivery</span>
    </label>

    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        name="payment"
        checked={paymentMethod === "ONLINE"}
        onChange={() => setPaymentMethod("ONLINE")}
      />
      <span>Pay Online (Mock)</span>
    </label>
  </div>
</div>

      </div> 

      {/* RIGHT – ORDER SUMMARY */}
      <div cla