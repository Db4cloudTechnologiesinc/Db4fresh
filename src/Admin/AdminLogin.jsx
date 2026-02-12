
import React, { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        alert(data.message || "Login failed");
        return;
      }

      // ✅ Save token
      localStorage.setItem("adminToken", data.token);

      // ✅ FORCE navigation (bypasses router deadlock)
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      alert("Backend not reachable");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded font-semibold text-white ${
              loading ? "bg-gray-400" : "bg-red-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
