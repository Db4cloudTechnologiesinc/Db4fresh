import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const API = "http://localhost:4000/api/auth";

  /* 🔁 AUTO REDIRECT IF ALREADY LOGGED IN */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        /* 🔐 LOGIN */
        const res = await axios.post(`${API}/login`, {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      } else {
        /* 📝 SIGNUP */
        await axios.post(`${API}/signup`, {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        alert(t("accountCreated"));
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || t("authFailed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? t("login") : t("createAccount")}
        </h2>

        {!isLogin && (
          <input
            name="name"
            placeholder={t("name")}
            className="w-full mb-3 p-3 border rounded"
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder={t("email")}
          className="w-full mb-3 p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder={t("password")}
          className="w-full mb-2 p-3 border rounded"
          onChange={handleChange}
          required
        />

        {/* 🔐 Forgot Password (ONLY in Login) */}
        {isLogin && (
          <p
            className="text-sm text-green-700 cursor-pointer mb-4 text-right"
            onClick={() => navigate("/forgot-password")}
          >
            {t("forgotPassword")}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded font-semibold"
        >
          {isLogin ? t("login") : t("signUp")}
        </button>
       


        {/* 🔁 SWITCH LOGIN / SIGNUP */}
        <p
          className="mt-4 text-center text-sm text-blue-600 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
           {/* <p
  style={{ color: "#2e7d32", cursor: "pointer", marginTop: "8px" }}
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</p> */}
          {isLogin ? t("createAccount") : t("alreadyHaveAccount")}
        </p>
      </form>
    </div>
  );
}
