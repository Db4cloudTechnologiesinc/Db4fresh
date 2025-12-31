import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderSuccess() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <FiCheckCircle className="text-green-600" size={90} />

      <h1 className="text-3xl font-bold mt-4">
        Order Placed Successfully 🎉
      </h1>

      <p className="text-gray-600 mt-2 max-w-md">
        Thank you for shopping with us. Your order has been placed and will be
        delivered soon.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          to="/orders"
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          View Orders
        </Link>

        <Link
          to="/"
          className="border border-gray-300 px-6 py-3 rounded-xl font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
