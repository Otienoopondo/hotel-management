'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function StaffLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      const res = await axios.post('/staff/login', form); // ✅ dynamic baseURL via axios instance
      localStorage.setItem('staffToken', res.data.token);
      setMessage('✅ Login successful! Redirecting to dashboard...');
      setTimeout(() => router.push('/staff/dashboard'), 2500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || '❌ Invalid credentials');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/slogin.jpg')" }}
    >
      <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-lg max-w-md w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-6 font-[Poppins] bg-blue-600 py-2 rounded">
          Staff Login
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

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/80 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-white text-center mt-4 font-[Poppins]">
          Don&apos;t have an account?{' '}
          <a href="/staff/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
