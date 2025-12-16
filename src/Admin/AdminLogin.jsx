// src/admin/login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // hard-coded admin credentials (for frontend-only demo)
    if (email === "admin@db4fresh.com" && pass === "123456") {
      localStorage.setItem("admin_auth", "true");
      // navigate to admin dashboard (replace prevents back button issues)
      navigate("/admin/dashboard", { replace: true });
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow p-8 w-80 rounded">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-2 mb-3 rounded"
            autoComplete="username"
          />

          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="w-full border p-2 mb-3 rounded"
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
