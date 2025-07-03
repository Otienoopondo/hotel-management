"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaConciergeBell, FaArrowLeft, FaSwimmingPool, FaUtensils, FaSpa,
  FaShuttleVan, FaDumbbell, FaWifi, FaHome, FaTimes
} from "react-icons/fa";

const services = [
  { key: "room", name: "24/7 Room Service", icon: <FaConciergeBell />, description: "Always-on call to ensure your stay is comfortable." },
  { key: "pool", name: "Swimming Pool", icon: <FaSwimmingPool />, description: "Relax and refresh in our clean, scenic pools." },
  { key: "restaurant", name: "Restaurant & Dining", icon: <FaUtensils />, description: "Enjoy local and international cuisine prepared by top chefs." },
  { key: "spa", name: "Spa & Wellness", icon: <FaSpa />, description: "Unwind with massages, facials, and other spa services." },
  { key: "shuttle", name: "Airport Shuttle", icon: <FaShuttleVan />, description: "Convenient transportation to and from the airport." },
  { key: "gym", name: "Fitness Center", icon: <FaDumbbell />, description: "Stay fit during your stay with modern gym facilities." },
  { key: "wifi", name: "Free Wi-Fi", icon: <FaWifi />, description: "High-speed internet available throughout the hotel." },
];

export default function HotelServices() {
  const [activeModal, setActiveModal] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e, orderData) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/services/order", {
        serviceType: activeModal,
        ...orderData,
      });

      setShowToast(true);
      setErrorToast(false);
    } catch (error) {
      console.error("Error submitting order:", error.response?.data || error.message);
      setShowToast(false);
      setErrorToast(true);
    }
  };

  useEffect(() => {
    if (showToast || errorToast) {
      const timer = setTimeout(() => {
        if (showToast) setActiveModal(null); // Close only on success
        setShowToast(false);
        setErrorToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast, errorToast]);

  const baseClasses = "space-y-3 text-white";
  const inputClasses = "w-full p-2 border border-white rounded bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300";
  const headingClasses = "text-xl font-bold text-white text-center mb-4 bg-blue-700 py-2 px-4 rounded-t-md shadow";
  const buttonClasses = "w-full py-2 px-4 rounded font-semibold text-white hover:opacity-90 transition duration-200";

  const feedback = showToast
    ? <p className="text-green-400 text-center font-medium">✅ Request submitted successfully!</p>
    : errorToast
      ? <p className="text-red-400 text-center font-medium">❌ Failed to submit. Try again.</p>
      : null;

  const renderModalContent = () => {
    switch (activeModal) {
      case "restaurant":
        return (
          <div className={baseClasses}>
            <h3 className={headingClasses}>🍽️ Order Food</h3>
            {feedback}
            <form onSubmit={(e) => handleSubmit(e, {
              clientName: e.target[0].value,
              roomNumber: e.target[1].value,
              serviceType: "Restaurant",
              details: `Dish: ${e.target[2].value}, Quantity: ${e.target[3].value}, Notes: ${e.target[4].value}`
            })} className="space-y-3">
              <input className={inputClasses} placeholder="Your Name" required />
              <input className={inputClasses} placeholder="Room Number" required />
              <input className={inputClasses} placeholder="Dish Name" required />
              <input className={inputClasses} type="number" placeholder="Quantity" required />
              <textarea className={inputClasses} placeholder="Additional Notes" />
              <button className={`${buttonClasses} bg-green-600`} type="submit">Submit Order</button>
            </form>
          </div>
        );
      case "room":
        return (
          <div className={baseClasses}>
            <h3 className={headingClasses}>🛎️ Room Service Request</h3>
            {feedback}
            <form onSubmit={(e) => handleSubmit(e, {
              clientName: e.target[0].value,
              roomNumber: e.target[1].value,
              serviceType: "Room Service",
              details: e.target[2].value
            })} className="space-y-3">
              <input className={inputClasses} placeholder="Your Name" required />
              <input className={inputClasses} placeholder="Room Number" required />
              <textarea className={inputClasses} placeholder="What do you need?" required />
              <button className={`${buttonClasses} bg-blue-600`} type="submit">Submit Request</button>
            </form>
          </div>
        );
      case "wifi":
        return (
          <div className={baseClasses}>
            <h3 className={headingClasses}>📶 Wi-Fi Details</h3>
            <p><strong>Network Name:</strong> Hotel_WiFi_5G</p>
            <p><strong>Password:</strong> StayConnected123</p>
          </div>
        );
      case "gym":
        return (
          <div className={baseClasses}>
            <h3 className={headingClasses}>🏋️ Gym Check-in</h3>
            {feedback}
            <form onSubmit={(e) => handleSubmit(e, {
              clientName: e.target[0].value,
              roomNumber: e.target[1].value,
              serviceType: "Gym",
              details: "Client checked into the gym"
            })} className="space-y-3">
              <input className={inputClasses} placeholder="Your Name" required />
              <input className={inputClasses} placeholder="Room Number" required />
              <button className={`${buttonClasses} bg-indigo-600`} type="submit">Check In</button>
            </form>
          </div>
        );
      case "pool":
        return (
          <div className={baseClasses}>
            <h3 className={headingClasses}>🏊 Swimming Pool Access</h3>
            {feedback}
            <form onSubmit={(e) => handleSubmit(e, {
              clientName: e.target[0].value,
              roomNumber: e.target[1].value,
              serviceType: "Pool",
              details: "Pool access requested"
            })} className="space-y-3">
              <input className={inputClasses} placeholder="Your Name" required />
              <input className={inputClasses} placeholder="Room Number" required />
              <button className={`${buttonClasses} bg-teal-600`} type="submit">Access Pool</button>
            </form>
          </div>
        );
      case "spa":
        return (
          <div className={baseClasses}>
            <h3 className={headingClasses}>💆 Book a Spa Session</h3>
            {feedback}
            <form onSubmit={(e) => handleSubmit(e, {
              clientName: e.target[0].value,
              roomNumber: e.target[1].value,
              serviceType: "Spa",
              details: e.target[2].value
            })} className="space-y-3">
              <input className={inputClasses} placeholder="Your Name" required />
              <input className={inputClasses} placeholder="Room Number" required />
              <select className={inputClasses} required>
                <option value="">Select Service</option>
                <option value="Massage">Massage</option>
                <option value="Facial">Facial</option>
                <option value="Manicure">Manicure</option>
              </select>
              <button className={`${buttonClasses} bg-purple-600`} type="submit">Book Now</button>
            </form>
          </div>
        );
      case "shuttle":
        return (
          <div className={baseClasses}>
            <h3 className={headingClasses}>🚐 Book Airport Shuttle</h3>
            {feedback}
            <form onSubmit={(e) => handleSubmit(e, {
              clientName: e.target[0].value,
              roomNumber: e.target[1].value,
              serviceType: "Shuttle",
              details: `Flight time: ${e.target[2].value}`
            })} className="space-y-3">
              <input className={inputClasses} placeholder="Your Name" required />
              <input className={inputClasses} placeholder="Room Number" required />
              <input className={inputClasses} type="time" required />
              <button className={`${buttonClasses} bg-yellow-600`} type="submit">Book Shuttle</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 sm:px-6 py-10 relative">
      <Link href="/" className="absolute top-4 left-4 text-gray-800 text-xl hover:text-blue-700">
        <FaHome />
      </Link>

      <div className="bg-white shadow-xl rounded-xl p-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-blue-700 mb-8 flex items-center justify-center gap-3 bg-blue-200 p-3 rounded shadow">
          <FaConciergeBell className="text-blue-700" /> Hotel Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <button
              key={service.key}
              className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 p-6 text-left"
              onClick={() => setActiveModal(service.key)}
            >
              <div className="text-5xl text-yellow-300 mb-3 text-center">{service.icon}</div>
              <h3 className="text-xl font-bold text-white text-center mb-2">{service.name}</h3>
              <p className="text-blue-100 text-center text-sm">{service.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => router.back()} className="inline-flex items-center text-blue-700 hover:underline text-lg">
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button onClick={() => {
              setActiveModal(null);
              setShowToast(false);
              setErrorToast(false);
            }} className="absolute top-3 right-3 text-gray-300 hover:text-red-400">
              <FaTimes size={20} />
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}
