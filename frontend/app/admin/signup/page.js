"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios"; // ✅ using default axios instead of custom
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      const { name, email, phone, password } = formData;
      await axios.post(
        "https://hotel-management-backend-9459.onrender.com/api/admin/signup",
        { name, email, phone, password }
      );
      setIsError(false);
      setMessage("✅ Signup successful! Redirecting...");
      setTimeout(() => router.push("/admin/login"), 2500);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "❌ Signup failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/asignup.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-xl p-8 w-full max-w-md shadow-xl animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center mb-6 text-white bg-blue-700 py-2 rounded">
          Admin Signup
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
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-9 right-3 text-gray-600 cursor-pointer"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link
            href="/admin/login"
            className="text-blue-700 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
