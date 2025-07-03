"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaArrowLeft, FaHotel, FaInfoCircle, FaTimesCircle } from "react-icons/fa";

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const res = await axios.get("/bookings/mine", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add token here
        },
      });
      setBookings(res.data);
    } catch (err) {
      toast.error("❌ Failed to load bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const token = localStorage.getItem("clientToken");
    const toastId = toast.loading("Cancelling booking...");
    try {
      await axios.delete(`/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add token here
        },
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success("✅ Booking cancelled", { id: toastId });
    } catch (err) {
      toast.error("❌ Failed to cancel booking", { id: toastId });
      console.error("Cancel failed:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center px-4 py-10 sm:px-6" style={{ backgroundImage: "url('/cdashboard.jpg')" }}>
      <div className="bg-white bg-opacity-90 p-6 rounded shadow-md max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white bg-blue-600 px-6 py-4 rounded-lg mb-8 text-center inline-flex items-center justify-center gap-2 shadow">
          <FaHotel /> My Hotel Bookings
        </h2>

        {loading ? (
          <p className="text-center text-gray-700">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600">You have no bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden flex flex-col"
              >
                <div className="bg-blue-600 text-white text-center font-semibold text-lg py-2">
                  {booking.roomType} Room
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1 justify-between text-gray-800 text-sm">
                  <p><strong>Name:</strong> {booking.name}</p>
                  <p><strong>Check-In:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                  <p><strong>Check-Out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>

                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-flex items-center justify-center gap-2 mt-4"
                  >
                    <FaInfoCircle /> View Details
                  </button>

                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded inline-flex items-center justify-center gap-2"
                  >
                    <FaTimesCircle /> Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBooking && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
              >
                ×
              </button>
              <h3 className="text-2xl font-bold text-blue-700 mb-4">Booking Details</h3>
              <div className="text-gray-800 space-y-2">
                <p><strong>Name:</strong> {selectedBooking.name}</p>
                <p><strong>Email:</strong> {selectedBooking.email}</p>
                <p><strong>Check-In:</strong> {new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                <p><strong>Check-Out:</strong> {new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                <p><strong>Room Type:</strong> {selectedBooking.roomType}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button onClick={() => router.back()} className="inline-flex items-center text-blue-700 hover:underline text-lg">
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
