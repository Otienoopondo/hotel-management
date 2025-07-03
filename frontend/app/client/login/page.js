'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function ClientLogin() {
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
      const res = await axios.post('/client/login', form);
      localStorage.setItem('clientToken', res.data.token);
      setMessage('✅ Login successful! Redirecting to dashboard...');
      setTimeout(() => router.push('/client/dashboard'), 2500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || '❌ Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/clogin.jpg')" }}>
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 bg-blue-600 text-white py-2 rounded">Client Login</h2>

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

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/80 text-black focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/80 text-black focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-white text-center mt-4">
          Don&apos;t have an account?{' '}
          <a href="/client/signup" className="text-blue-300 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
