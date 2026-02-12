
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import AddressList from "../components/AddressList";
import DeliverySlot from "../components/DeliverySlot";

export default function Checkout() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= REDUX CART ================= */
  const cartItems = useSelector((s) => s.cart.items);
  const token = localStorage.getItem("token");

  /* ================= REORDER DATA ================= */
  const reorderData = JSON.parse(
    localStorage.getItem("checkout_data")
  );

  // 🔥 SOURCE OF TRUTH (reorder > cart)
  const items =
    reorderData?.items?.length > 0
      ? reorderData.items
      : cartItems;

  /* ================= LOCAL STATE ================= */
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(
    reorderData?.deliverySlot || null
  );
  const [selectedAddress, setSelectedAddress] = useState(
    reorderData?.address || null
  );

  // /* ================= BLOCK INVALID ACCESS ================= */
  // useEffect(() => {
  //   if (!items || items.length === 0) {
  //     navigate("/");
  //   }
  // }, [items, navigate]);

  /* ================= TOTAL ================= */
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        (item.qty || item.quantity || 1),
    0
  );

  /* ================= PLACE COD ORDER ================= */
  const placeCODOrder = async () => {
    const finalAddress =
      selectedAddress || reorderData?.address;

    if (!items.length) {
      alert("Cart is empty");
      return;
    }

    if (!finalAddress) {
      alert("Please select a delivery address");
      return;
    }

    if (!selectedSlot) {
      alert("Please select a delivery slot");
      return;
    }

    setProcessing(true);

    try {
      const fullAddress = {
        name: finalAddress.label || "Home",
        address_line1: finalAddress.address_line1 || "",
        city: finalAddress.city || "",
        state: finalAddress.state || "",
        pincode: finalAddress.pincode || "",
        phone: finalAddress.phone || "",
      };

      const payload = {
        items,
        totalAmount: subtotal,
        paymentMethod: "COD",
        address: fullAddress,
        deliverySlot: selectedSlot,
      };

      const res = await fetch(
        "http://localhost:4000/api/orders/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
console.log("SERVER RESPONSE:", data);

if (!res.ok) {
  alert(data.message || "Order failed ❌");
  return;
}

      dispatch(clearCart());
      localStorage.removeItem("checkout_data");
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setProcessing(false);
    }
  };

  /* ================= ONLINE PAYMENT ================= */
  const goToPayment = () => {
    const finalAddress =
      selectedAddress || reorderData?.address;

    if (!items.length || !finalAddress || !selectedSlot) {
      alert("Please complete checkout details");
      return;
    }

    localStorage.setItem(
      "checkout_data",
      JSON.stringify({
        items,
        totalAmount: subtotal,
        address: finalAddress,
        deliverySlot: selectedSlot,
      })
    );

    navigate("/payment");
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">

          {/* ADDRESS */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Delivery Address
            </h2>

            <AddressList onSelect={setSelectedAddress} />

            {selectedAddress && (
              <p className="mt-2 text-sm text-gray-600">
                Delivering to: {selectedAddress.address_line1}
              </p>
            )}
          </div>

          {/* SLOT */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Delivery Slot
            </h2>

            <DeliverySlot onChange={setSelectedSlot} />

            {selectedSlot && (
              <p className="mt-3 text-sm text-gray-600">
                Selected: {selectedSlot.date} ({selectedSlot.time})
              </p>
            )}
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Payment Method
            </h2>

            <label className="flex items-center gap-3 mb-3">
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
              Pay Online
            </label>

            <div className="mt-6">
              {paymentMethod === "COD" && (
                <button
                  onClick={placeCODOrder}
                  disabled={processing}
                  className="w-full bg-red-600 hover:bg-red-700
                             text-white py-3 rounded-xl text-lg font-semibold
                             disabled:opacity-60"
                >
                  {processing ? "Placing Order..." : "Place Order"}
                </button>
              )}

              {paymentMethod === "ONLINE" && (
                <button
                  onClick={goToPayment}
                  className="w-full bg-green-600 hover:bg-green-700
                             text-white py-3 rounded-xl text-lg font-semibold"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
