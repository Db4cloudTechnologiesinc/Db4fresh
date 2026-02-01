
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Auth() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const navigate = useNavigate();

//   const API = "http://localhost:4000/api/auth";

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (isLogin) {
//         // 🔐 LOGIN
//         const res = await axios.post(`${API}/login`, {
//           email: form.email,
//           password: form.password,
//         });

//         // ✅ SAVE TOKEN
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("user", JSON.stringify(res.data.user));

//         navigate("/"); // redirect home
//       } else {
//         // 📝 SIGNUP
//         await axios.post(`${API}/signup`, {
//         // await axios.post(`${API}/register`, {

//           name: form.name,
//           email: form.email,
//           password: form.password,
//         });

//         alert("Account created. Please login.");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Auth failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           {isLogin ? "Login" : "Create Account"}
//         </h2>

//         {!isLogin && (
//           <input
//             name="name"
//             placeholder="Name"
//             className="w-full mb-3 p-3 border rounded"
//             onChange={handleChange}
//             required
//           />
//         )}

//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           className="w-full mb-3 p-3 border rounded"
//           onChange={handleChange}
//           required
//         />

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-3 border rounded"
//           onChange={handleChange}
//           required
//         />

//         <button className="w-full bg-red-600 text-white py-3 rounded font-semibold">
//           {isLogin ? "Login" : "Sign Up"}
//         </button>

//         <p
//           className="mt-4 text-center text-sm text-blue-600 cursor-pointer"
//           onClick={() => setIsLogin(!isLogin)}
//         >
//           {isLogin
//             ? "Create an account"
//             : "Already have an account? Login"}
//         </p>
//       </form>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
 
  const API = "http://localhost:4000/api/auth";
 
  /* 🔁 AUTO REDIRECT IF ALREADY LOGGED IN */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("LOGIN / SIGNUP SUBMITTED");
 
    try {
      if (isLogin) {
        /* 🔐 LOGIN */
        const res = await axios.post(`${API}/login`, {
          email: form.email,
          password: form.password,
        });
 
        console.log("LOGIN SUCCESS:", res.data);
 
        /* ✅ SAVE AUTH DATA */
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
 
        navigate("/"); // redirect home
      } else {
        /* 📝 SIGNUP */
        await axios.post(`${API}/signup`, {
          name: form.name,
          email: form.email,
          password: form.password,
        });
 
        alert("Account created. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);
      alert(err.response?.data?.message || "Auth failed");
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Create Account"}
        </h2>
 
        {!isLogin && (
          <input
            name="name"
            placeholder="Name"
            className="w-full mb-3 p-3 border rounded"
            onChange={handleChange}
            required
          />
        )}
 
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded"
          onChange={handleChange}
          required
        />
 
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded"
          onChange={handleChange}
          required
        />
 
        {/* 🔴 IMPORTANT: type="submit" */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded font-semibold"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
 
        <p
          className="mt-4 text-center text-sm text-blue-600 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Create an account"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}
 
 