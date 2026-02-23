import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginDelivery } from "../services/deliveryApi";

export default function DeliveryLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginDelivery({ email, password });
      localStorage.setItem("delivery_token", res.data.token);
      navigate("/delivery/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600">

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-red-600">
            Db4Fresh Delivery
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Delivery Partner Login
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </div>

        {/* Register Section */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don’t have an account?
          </p>
          <button
            onClick={() => navigate("/delivery/register")}
            className="text-red-600 font-semibold mt-2 hover:underline"
          >
            Register as Delivery Partner
          </button>
        </div>

      </div>
    </div>
  );
}
