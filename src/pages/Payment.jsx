
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000";

export default function Payment() {
  const navigate = useNavigate();

  const checkout =
    JSON.parse(localStorage.getItem("checkout_data")) || {};

  // ✅ Correct keys
  const {
    totalAmount,
    items,
    address,
    deliverySlot,
  } = checkout;

  const [method, setMethod] = useState("online");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= SAFETY CHECK ================= */
  useEffect(() => {
    if (!totalAmount || !items?.length) {
      navigate("/cart");
    }
  }, [totalAmount, items, navigate]);

  /* ================= LOAD RAZORPAY SCRIPT ================= */
  useEffect(() => {
    if (window.Razorpay) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  /* ================= COD ORDER ================= */
  const placeCODOrder = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${API}/api/orders/order`,
        {
          items,
          totalAmount,
          address,
          deliverySlot,
          paymentMethod: "COD",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("checkout_data");
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      alert("Order failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ONLINE PAYMENT ================= */
  const startPayment = async () => {
    try {
      setLoading(true);

      // Step 1: Create order in DB
      const orderRes = await axios.post(
        `${API}/api/orders/order`,
        {
          items,
          totalAmount,
          address,
          deliverySlot,
          paymentMethod: "ONLINE",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = orderRes.data.orderId;

      // Step 2: Create Razorpay order
      const { data } = await axios.post(
        `${API}/api/payment/create-order`,
        { amount: totalAmount }
      );

      // Step 3: Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "Db4Fresh",
        description: "Secure Payment",
        order_id: data.id,
        redirect: true,
        callback_url: `${API}/api/payment/verify?orderId=${orderId}`,
        prefill: {
          name: address?.name || "",
          contact: address?.phone || "",
        },
        theme: { color: "#6b21a8" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
      setLoading(false);
    }
  };

  /* ================= PAY HANDLER ================= */
  const handlePay = () => {
    if (loading) return;
    method === "cod" ? placeCODOrder() : startPayment();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Payment Options</h2>

      <div className="space-y-3">
        <PaymentOption
          label="Online Payment (UPI / Card / Wallet / NetBanking)"
          value="online"
          method={method}
          setMethod={setMethod}
          disabled={loading}
        />
        <PaymentOption
          label="Cash on Delivery"
          value="cod"
          method={method}
          setMethod={setMethod}
          disabled={loading}
        />
      </div>

      <button
        disabled={loading}
        onClick={handlePay}
        className="w-full mt-6 bg-purple-700 text-white py-3 rounded-lg text-lg font-semibold disabled:opacity-60"
      >
        {loading
          ? "Processing..."
          : method === "cod"
          ? "Place Order"
          : `Pay ₹${totalAmount}`}
      </button>
    </div>
  );
}

function PaymentOption({ label, value, method, setMethod, disabled }) {
  return (
    <label className="flex items-center gap-3 border p-3 rounded cursor-pointer hover:bg-gray-50">
      <input
        type="radio"
        disabled={disabled}
        checked={method === value}
        onChange={() => setMethod(value)}
      />
      <span>{label}</span>
    </label>
  );
}
