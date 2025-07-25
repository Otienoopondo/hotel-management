'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from '@/utils/axios';
import {
  FaHome,
  FaUserShield,
  FaPhone,
  FaInfoCircle,
  FaQuestionCircle,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaSpinner
} from 'react-icons/fa';

export default function AdminSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/admin/signup', formData); // ✅ Correct API endpoint
      router.push('/admin/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* HEADER */}
      <header className="bg-gray-800 p-4 shadow-md flex items-center justify-between">
        <div className="text-xl font-bold flex items-center gap-2">
          <FaUserShield className="text-yellow-400" />
          <span>Admin Signup</span>
        </div>
        <nav className="flex gap-4 text-sm">
          <button onClick={() => router.push('/')} className="hover:text-yellow-400 flex items-center gap-1"><FaHome />Home</button>
          <button onClick={() => setShowAbout(true)} className="hover:text-yellow-400 flex items-center gap-1"><FaInfoCircle />About</button>
          <button onClick={() => setShowContact(true)} className="hover:text-yellow-400 flex items-center gap-1"><FaPhone />Contact</button>
          <button onClick={() => setShowHelp(true)} className="hover:text-yellow-400 flex items-center gap-1"><FaQuestionCircle />Need Help?</button>
        </nav>
      </header>

      {/* FORM */}
      <main className="flex flex-col lg:flex-row flex-grow">
        <div className="lg:w-1/2 p-8 flex flex-col justify-center items-start space-y-6">
          <h2 className="text-3xl font-bold text-yellow-400">Create Admin Account</h2>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex items-center bg-gray-800 border border-gray-600 rounded px-3">
              <FaUser className="text-gray-400 mr-2" />
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange}
                className="w-full py-2 bg-transparent focus:outline-none text-white" required />
            </div>
            <div className="flex items-center bg-gray-800 border border-gray-600 rounded px-3">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
                className="w-full py-2 bg-transparent focus:outline-none text-white" required />
            </div>
            <div className="flex items-center bg-gray-800 border border-gray-600 rounded px-3">
              <FaPhone className="text-gray-400 mr-2" />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange}
                className="w-full py-2 bg-transparent focus:outline-none text-white" required />
            </div>
            <div className="flex items-center bg-gray-800 border border-gray-600 rounded px-3">
              <FaLock className="text-gray-400 mr-2" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
                className="w-full py-2 bg-transparent focus:outline-none text-white" required />
            </div>
            <div className="flex items-center bg-gray-800 border border-gray-600 rounded px-3">
              <FaLock className="text-gray-400 mr-2" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}
                className="w-full py-2 bg-transparent focus:outline-none text-white" required />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded flex items-center justify-center">
              {loading ? (
                <><FaSpinner className="animate-spin mr-2" /> Signing up...</>
              ) : (
                'Signup'
              )}
            </button>
          </form>

          {/* Login redirect */}
          <p className="text-sm mt-4 text-gray-300">
            Already have an account?{' '}
            <button onClick={() => router.push('/admin/login')} className="text-yellow-400 underline hover:text-yellow-300">
              Log In
            </button>
          </p>

          {/* Back button */}
          <button onClick={() => router.back()} className="mt-4 text-sm text-yellow-300 flex items-center gap-2 hover:text-yellow-400">
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* IMAGE */}
        <div className="hidden lg:block lg:w-1/2 relative h-96 lg:h-auto">
          <Image src="/asignup.jpg" alt="Admin Background" layout="fill" objectFit="cover" priority />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-center p-4 text-sm text-gray-300">
        &copy; {new Date().getFullYear()} Hotel Management System. All rights reserved.
      </footer>

      {/* ABOUT MODAL */}
      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p>Welcome to our hotel management system for Admins, built for efficiency and control.</p>
            <button onClick={() => setShowAbout(false)} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600">Close</button>
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p>Email: support@hotelms.com</p>
            <p>Phone: +254 740 547264</p>
            <button onClick={() => setShowContact(false)} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600">Close</button>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p>For any signup issues, ensure all fields are filled correctly or contact support.</p>
            <button onClick={() => setShowHelp(false)} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
