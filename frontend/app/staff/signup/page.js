'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

export default function StaffSignup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    staffId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('❌ Passwords do not match');
      return;
    }

    try {
      await axios.post('/staff/signup', {
        name: form.name,
        email: form.email,
        phone: form.staffId,
        password: form.password,
      });
      setShowSuccess(true);
      toast.success('✅ Signup successful! Redirecting...');
      setTimeout(() => router.push('/staff/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Signup failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Toaster position="top-center" />

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/ssignup.jpg')" }}
      />

      <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <h2 className="text-3xl font-bold text-center mb-6 bg-blue-600 text-white py-2 rounded">Staff Signup</h2>

        {showSuccess ? (
          <div className="bg-green-100 border border-green-400 text-green-700 rounded p-4 text-center font-medium">
            ✅ Signup Successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="text"
              name="staffId"
              placeholder="Staff ID / Phone"
              value={form.staffId}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold p-3 rounded hover:bg-indigo-700 transition-all"
            >
              Create Account
            </button>
          </form>
        )}

        {!showSuccess && (
          <p className="mt-4 text-center text-sm text-gray-700">
            Already have an account?{' '}
            <a href="/staff/login" className="text-indigo-600 font-medium hover:underline">
              Login
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
