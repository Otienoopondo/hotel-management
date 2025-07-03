// Available Rooms Page
"use client";

import Link from "next/link";
import { FaArrowLeft, FaBed } from "react-icons/fa";

const rooms = [
  { name: "Sarova Whitesands", image: "/hotel1.jpg", available: true },
  { name: "Voyager Beach Resort", image: "/hotel2.jpg", available: false },
  { name: "PrideInn Paradise", image: "/hotel3.jpg", available: true },
  { name: "Serena Beach Resort", image: "/hotel4.jpg", available: true },
  { name: "Nyali Sun Africa", image: "/hotel5.jpg", available: false },
  { name: "Hotel EnglishPoint", image: "/hotel6.jpg", available: true },
  { name: "Reef Hotel", image: "/hotel7.jpg", available: true },
  { name: "Travellers Beach Hotel", image: "/hotel8.jpg", available: false },
  { name: "Bahari Beach Hotel", image: "/hotel9.jpg", available: true },
  { name: "CityBlue Creekside", image: "/hotel10.jpg", available: true }
];

export default function AvailableRooms() {
  return (
    <div className="min-h-screen bg-cover bg-center px-6 py-10" style={{ backgroundImage: "url('/cdashboard.jpg')" }}>
      <div className="bg-white bg-opacity-90 p-6 rounded shadow-md max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center flex items-center justify-center gap-2">
          <FaBed /> Available Rooms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((hotel, index) => (
            <div
              key={index}
              className={`rounded shadow overflow-hidden transition-transform transform hover:scale-105 ${hotel.available ? 'bg-white' : 'bg-gray-200 opacity-70'}`}
            >
              <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-blue-800 text-center">
                  {hotel.name}
                </h3>
                <p className={`text-center ${hotel.available ? 'text-green-600' : 'text-red-600'}`}>
                  {hotel.available ? 'Available' : 'Fully Booked'}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/client">
            <span className="inline-flex items-center text-blue-700 hover:underline">
              <FaArrowLeft className="mr-2" /> Go Back
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
