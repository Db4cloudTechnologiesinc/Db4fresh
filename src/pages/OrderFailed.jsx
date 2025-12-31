import { Link } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";

export default function OrderFailed() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <FiXCircle className="text-red-600" size={90} />

      <h1 className="text-3xl font-bold mt-4">
        Order Failed 😔
      </h1>

      <p className="text-gray-600 mt-2 max-w-md">
        Something went wrong while placing your order.
        Please try again.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          to="/checkout"
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Retry Checkout
        </Link>

        <Link
          to="/"
          className="border border-gray-300 px-6 py-3 rounded-xl font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
