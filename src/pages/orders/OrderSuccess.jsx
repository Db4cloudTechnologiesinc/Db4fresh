import { useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600">Order Placed Successfully 🎉</h1>
      <p className="mt-4 text-lg">Your Order ID: <strong>{id}</strong></p>

      <a
        href="/my-orders"
        className="text-blue-600 underline mt-4 block"
      >
        View My Orders
      </a>
    </div>
  );
}
