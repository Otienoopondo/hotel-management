"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBook, FaConciergeBell, FaBed, FaArrowLeft } from "react-icons/fa";
import { X } from "lucide-react";

export default function ClientDashboard() {
  const [modal, setModal] = useState(null);

  const renderModal = () => {
    if (!modal) return null;

    let content = "";
    if (modal === "privacy") {
      content = "We respect your privacy. Your personal data is safe and used only for booking and communication purposes.";
    } else if (modal === "terms") {
      content = "By using our platform, you agree to our terms: no spamming, valid bookings only, and timely cancellations.";
    } else if (modal === "support") {
      content = "For support, contact us at support@hotelbookings.com or call +254 712 345678.";
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl relative">
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            onClick={() => setModal(null)}
          >
            <X />
          </button>
          <h3 className="text-xl font-bold mb-4 capitalize">{modal.replace("-", " ")}</h3>
          <p className="text-gray-700">{content}</p>
          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setModal(null)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-between"
      style={{ backgroundImage: "url('/cdashboard.jpg')" }}
    >
      <div className="w-full px-4 py-10 flex justify-center">
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-center text-white bg-blue-600 px-6 py-4 rounded-lg mb-10 shadow">
            Welcome to Your Dashboard
          </h1>

          <div className="flex flex-col sm:flex-row justify-around items-center gap-6 flex-wrap">
            <Link href="/client/my-bookings">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg">
                <FaBook /> My Bookings
              </button>
            </Link>

            <Link href="/client/services">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg">
                <FaConciergeBell /> Hotel Services
              </button>
            </Link>

            <Link href="/client/book-room">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg">
                <FaBed /> Book a Room
              </button>
            </Link>
          </div>

          <div className="mt-10 text-center">
            <Link href="/">
              <span className="inline-flex items-center text-blue-700 hover:underline">
                <FaArrowLeft className="mr-2" /> Go Back
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/70 text-white text-center py-5 w-full">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Hotel Management System. All rights reserved.
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm">
          <button onClick={() => setModal("privacy")} className="hover:underline">Privacy Policy</button>
          <span className="text-gray-400">|</span>
          <button onClick={() => setModal("terms")} className="hover:underline">Terms of Use</button>
          <span className="text-gray-400">|</span>
          <button onClick={() => setModal("support")} className="hover:underline">Support</button>
        </div>
      </footer>

      {renderModal()}
    </div>
  );
}
