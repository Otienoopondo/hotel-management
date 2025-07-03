'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from '@/utils/axios';

export default function ClientSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      await axios.post("/client/signup", { name, email, phone, password });
      setIsError(false);
      setMessage("✅ Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/client/login"), 2500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "❌ Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/csignup.jpg')" }}>
      <div className="bg-white/90 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center bg-blue-600 py-2 rounded mb-4 flex items-center justify-center gap-2">
          <FaUserPlus /> Client Sign Up
        </h2>

        {message && (
          <div
            className={`text-center p-3 mb-4 rounded font-semibold text-sm ${
              isError
                ? 'bg-red-100 text-red-700 border border-red-400'
                : 'bg-green-100 text-green-700 border border-green-400'
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded text-gray-800" />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded text-gray-800" />
          <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 border rounded text-gray-800" />

          <div className="relative">
            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded text-gray-800 pr-10" />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 cursor-pointer text-gray-500">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="relative">
            <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-3 border rounded text-gray-800 pr-10" />
            <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3.5 cursor-pointer text-gray-500">
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">Sign Up</button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-700 text-sm">
            Already have an account?{' '}
            <a href="/client/login" className="text-blue-600 hover:underline font-medium">Login</a>
          </p>
          <Link href="/" className="inline-flex items-center text-blue-700 hover:underline mt-2">
            <FaArrowLeft className="mr-2" /> Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
