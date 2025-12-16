import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Checkout() {
  const cartItems = useSelector(s => s.cart.items);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const simulatePayment = async () => {
    const res = await fetch("http://localhost:4000/api/orders/payment/simulate");
    const data = await res.json();
    setPaymentStatus(data.status);

    if (data.status === "success") {
      placeOrder();
    }
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    const items = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.qty,
      price: item.price
    }));

    const res = await fetch("http://localhost:4000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": token
      },
      body: JSON.stringify({ total, items })
    });

    const data = await res.json();

    window.location.href = `/order-success/${data.order_id}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="space-y-3">
        {cartItems.map(item => (
          <div key={item.id} className="border p-3 rounded">
            <p className="font-semibold">{item.name}</p>
            <p>Qty: {item.qty}</p>
            <p>Price: ₹{item.price}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-5">Total: ₹{total}</h2>

      <button
        onClick={simulatePayment}
        className="bg-green-600 text-white px-5 py-2 rounded mt-4"
      >
        Pay & Place Order
      </button>

      {paymentStatus === "failed" && (
        <p className="text-red-600 mt-3">Payment Failed. Try Again.</p>
      )}
    </div>
  );
}
