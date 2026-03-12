import { useParams, useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const { category } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        🚧 {category} Coming Soon
      </h1>

      <p className="text-gray-500 mb-6">
        We are working hard to launch this category.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-red-600 text-white rounded-lg"
      >
        Back to Home
      </button>
    </div>
  );
}