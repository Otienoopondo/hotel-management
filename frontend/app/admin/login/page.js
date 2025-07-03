"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "../../../utils/axios";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await axios.post("/admin/login", formData);
      localStorage.setItem("adminToken", res.data.token);
      setIsError(false);
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => router.push("/admin/dashboard"), 2500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/alogin.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-xl p-8 w-full max-w-md shadow-xl animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center mb-6 text-white bg-blue-700 py-2 rounded">
          Admin Login
        </h2>

        {message && (
          <div
            className={`text-center p-3 mb-4 rounded font-medium text-sm ${
              isError
                ? "bg-red-100 text-red-700 border border-red-400"
                : "bg-green-100 text-green-700 border border-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition font-semibold"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-center text-gray-700 mt-4">
          Don't have an account?{" "}
          <Link href="/admin/signup" className="text-blue-700 font-semibold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
