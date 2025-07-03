"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSearch,
  FaMoon,
  FaSun,
  FaQuestionCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Home() {
  const [role, setRole] = useState("client");
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoverStates, setHoverStates] = useState(Array(10).fill(false));
  const [imageIndices, setImageIndices] = useState(Array(10).fill(0));
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const getRoute = (type) => {
    if (type === "admin") return "/admin/login";
    if (type === "staff") return "/staff/login";
    return "/client/login";
  };

  const hotels = [
    { name: "PrideInn Paradise Beach Resort & Spa Mombasa", base: "hotel1", desc: "Beachfront luxury resort in Shanzu.", price: "Kshs 15,000", rating: 5 },
    { name: "Baobab Holiday Resort", base: "hotel2", desc: "Affordable and family-friendly.", price: "Kshs 13,000", rating: 4.5 },
    { name: "Cocoa Luxury Resort, Nyali, Mombasa", base: "hotel3", desc: "Stylish retreat with ocean views.", price: "Kshs 11,500", rating: 4 },
    { name: "Englishpoint Marina", base: "hotel4", desc: "Elegant marina-side living.", price: "Kshs 12,000", rating: 4.5 },
    { name: "Hotel Sapphire", base: "hotel5", desc: "Business-class hotel in the city.", price: "Kshs 10,000", rating: 4 },
    { name: "Travellers Beach and Hotel Club", base: "hotel6", desc: "All-inclusive seaside hotel.", price: "Kshs 9,500", rating: 3.5 },
    { name: "CityBlue CreekSide Hotel and Suites", base: "hotel7", desc: "Creek view suites and serene vibes.", price: "Kshs 14,000", rating: 5 },
    { name: "Nyali Reef Hotel", base: "hotel8", desc: "Classic beachfront experience.", price: "Kshs 8,500", rating: 4 },
    { name: "Serena Beach Resort and Spa", base: "hotel9", desc: "World-class luxury spa resort.", price: "Kshs 9,000", rating: 4 },
    { name: "Severin Sea Lodge", base: "hotel10", desc: "Eco-friendly hotel on Bamburi Beach.", price: "Kshs 13,500", rating: 4.5 },
  ];

  const imageSuffixes = ["", "1", "11", "111"];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) return;
      setImageIndices((prev) =>
        prev.map((index, i) =>
          hoverStates[i] ? index : (index + 1) % imageSuffixes.length
        )
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying, hoverStates]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i === fullStars && hasHalf) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return <div className="flex gap-1 mt-1">{stars}</div>;
  };

  const Modal = ({ title, content, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg max-w-md w-full text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{content}</p>
        <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={onClose}>Close</button>
      </div>
    </div>
  );

  return (
    <main className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 via-gray-200 to-blue-100"}`}>
      {/* Header */}
      <header className="bg-gray-800 py-4 shadow-md text-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* Logo + App Name */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <h1 className="text-xl sm:text-2xl font-bold text-blue-300 tracking-wide">Hotel Management System</h1>
          </div>

          {/* Hamburger or Nav */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-5 items-center text-sm sm:text-base">
            <Link href="/" className="hover:text-yellow-300 inline-flex items-center gap-1"><FaHome /> Home</Link>
            <button onClick={() => setShowAbout(true)} className="hover:text-yellow-300 inline-flex items-center gap-1"><FaInfoCircle /> About</button>
            <button onClick={() => setShowContact(true)} className="hover:text-yellow-300 inline-flex items-center gap-1"><FaPhone /> Contact</button>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-1 rounded border text-black"
            >
              <option value="client">Client</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <Link href={getRoute(role).replace("login", "signup")} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center gap-1">
              <FaUserPlus /> Sign Up
            </Link>
            <Link href={getRoute(role)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center gap-1">
              <FaSignInAlt /> Log In
            </Link>
            <button onClick={() => setDarkMode(!darkMode)} className="ml-2 px-2 py-1 bg-white text-black rounded hover:bg-yellow-300">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </nav>
        </div>

        {/* Mobile Expanded Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 mt-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Link href="/" className="hover:text-yellow-300 inline-flex items-center gap-1"><FaHome /> Home</Link>
              <button onClick={() => setShowAbout(true)} className="hover:text-yellow-300 inline-flex items-center gap-1"><FaInfoCircle /> About</button>
              <button onClick={() => setShowContact(true)} className="hover:text-yellow-300 inline-flex items-center gap-1"><FaPhone /> Contact</button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="p-1 rounded border text-black"
              >
                <option value="client">Client</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <Link href={getRoute(role).replace("login", "signup")} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center gap-1">
                <FaUserPlus /> Sign Up
              </Link>
              <Link href={getRoute(role)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center gap-1">
                <FaSignInAlt /> Log In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Floating Help Button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50" onClick={() => setShowHelp(true)}>
        <FaQuestionCircle size={24} />
      </button>

      {/* Search */}
      <div className="px-6 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search for hotels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-1/2 py-2 pl-10 pr-4 rounded border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Hotel Cards */}
      <section className="flex-1 px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {hotels
          .filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))
          .map((hotel, index) => (
            <div
              key={index}
              className="bg-white/90 dark:bg-gray-700 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transform transition hover:scale-105 flex flex-col"
              onMouseEnter={() =>
                setHoverStates((prev) => {
                  const copy = [...prev];
                  copy[index] = true;
                  return copy;
                })
              }
              onMouseLeave={() =>
                setHoverStates((prev) => {
                  const copy = [...prev];
                  copy[index] = false;
                  return copy;
                })
              }
            >
              <div className="relative w-full h-52">
                {imageSuffixes.map((suffix, i) => {
                  const src = `/${hotel.base}${suffix}.jpg`;
                  const isVisible = imageIndices[index] === i;
                  return (
                    <img
                      key={i}
                      src={src}
                      alt={hotel.name}
                      loading="lazy"
                      className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        isVisible ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-white leading-snug mb-1">{hotel.name}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{hotel.desc}</p>
                  <p className="text-md font-semibold text-green-700 dark:text-green-400 mt-1">{hotel.price}</p>
                  {renderStars(hotel.rating)}
                </div>
                <Link href="/client/signup" className="block text-center w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-4 flex justify-center space-x-6 text-xl">
            <a href="https://facebook.com" target="_blank" className="hover:text-blue-400"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" className="hover:text-blue-300"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" className="hover:text-pink-400"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" className="hover:text-blue-500"><FaLinkedin /></a>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Hotel Management System. All rights reserved.</p>
          <div className="text-sm mt-2 space-x-4">
            <button onClick={() => setShowTerms(true)} className="hover:underline">Terms of Use</button>
            <button onClick={() => setShowPrivacy(true)} className="hover:underline">Privacy Policy</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAbout && <Modal title="About Our System" content="This Hotel Management System offers room booking, staff management, and client dashboards to enhance hospitality operations across multiple hotels." onClose={() => setShowAbout(false)} />}
      {showContact && <Modal title="Contact Us" content="Email: support@hotelbooking.co.ke | Phone: +254 740 547 264" onClose={() => setShowContact(false)} />}
      {showTerms && <Modal title="Terms of Use" content="By using this system, you agree to our terms including respectful conduct, proper usage of booking features, and acknowledgment of privacy responsibilities." onClose={() => setShowTerms(false)} />}
      {showPrivacy && <Modal title="Privacy Policy" content="Your data is handled with strict confidentiality and never shared with third parties. We use secure methods to store and process your personal information." onClose={() => setShowPrivacy(false)} />}
      {showHelp && <Modal title="Need Help?" content="Contact us at support@hotelbooking.co.ke or call +254 740 547 264." onClose={() => setShowHelp(false)} />}
    </main>
  );
}
