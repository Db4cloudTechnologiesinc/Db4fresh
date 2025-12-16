import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/api/orders/${id}`, {
      headers: { "authorization": token }
    })
      .then(res => res.json())
      .then(data => setOrderData(data));
  }, [id]);

  if (!orderData) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <p><strong>Order ID:</strong> {orderData.order.id}</p>
      <p><strong>Total:</strong> ₹{orderData.order.total}</p>
      <p><strong>Status:</strong> {orderData.order.status}</p>
      <p><strong>Date:</strong> {orderData.order.created_at}</p>

      <h2 className="text-xl font-bold mt-6">Items</h2>

      <div className="space-y-4 mt-3">
        {orderData.items.map(item => (
          <div key={item.id} className="border p-3 rounded">
            <p><strong>Product ID:</strong> {item.product_id}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
