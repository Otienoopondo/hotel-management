"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "@/utils/axios";
import { FaArrowLeft } from "react-icons/fa";

export default function BookRoom() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { name, checkIn, checkOut, roomType } = formData;

    if (!name || !checkIn || !checkOut || !roomType) {
      setError("Please fill in all fields.");
      return;
    }

    const token = localStorage.getItem("clientToken");
    if (!token) {
      setError("You must be logged in to book a room.");
      return;
    }

    try {
      await axios.post("/bookings/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add token here
        },
      });

      setSuccess(true);
      setFormData({ name: "", checkIn: "", checkOut: "", roomType: "" });
      setTimeout(() => router.push("/client/my-bookings"), 2500);
    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: "url('/cdashboard.jpg')" }}
    >
      <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-xl w-full max-w-xl">
        <h2 className="text-2xl sm:text-3xl text-center font-bold bg-green-600 text-white py-2 rounded mb-6">
          Book a Room
        </h2>

        {error && <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-4 font-semibold">
            ✅ Booking successful! Redirecting...
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="date"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="date"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Choose Room Type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold text-lg"
          >
            Confirm Booking
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-700 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
