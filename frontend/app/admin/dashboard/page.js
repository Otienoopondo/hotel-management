'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LogOut, Moon, Sun, Plus, Edit, Trash, X
} from 'lucide-react';

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [hotelForm, setHotelForm] = useState({ name: '', price: '', description: '', image: '' });
  const [staffForm, setStaffForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [editHotelId, setEditHotelId] = useState(null);
  const [editStaffId, setEditStaffId] = useState(null);
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ show: false, type: null, id: null });
  const [activeTab, setActiveTab] = useState('hotels');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return router.push('/admin/login');
    Promise.all([fetchHotels(token), fetchStaff(token)]).finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchHotels = async (token) => {
    try {
      const res = await fetch('https://hotel-management-backend-9459.onrender.com/api/hotels', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHotels(data);
    } catch {
      showToast('Failed to load hotels.');
    }
  };

  const fetchStaff = async (token) => {
    try {
      const res = await fetch('https://hotel-management-backend-9459.onrender.com/api/staff', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStaffList(data);
    } catch {
      showToast('Failed to load staff.');
    }
  };

  const handleAddHotel = async () => {
    if (!hotelForm.name || !hotelForm.price || !hotelForm.image) {
      return showToast('Please fill all required hotel fields.');
    }
    try {
      const token = localStorage.getItem('adminToken');
      const method = editHotelId ? 'PUT' : 'POST';
      const url = editHotelId
        ? `https://hotel-management-backend-9459.onrender.com/api/hotels/${editHotelId}`
        : 'https://hotel-management-backend-9459.onrender.com/api/hotels';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(hotelForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchHotels(token);
      showToast(editHotelId ? 'Hotel updated!' : 'Hotel added!');
      setHotelForm({ name: '', price: '', description: '', image: '' });
      setShowHotelForm(false);
      setEditHotelId(null);
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleAddStaff = async () => {
    if (!staffForm.name || !staffForm.email || !staffForm.phone) {
      return showToast('Please fill all required staff fields.');
    }
    try {
      const token = localStorage.getItem('adminToken');
      const method = editStaffId ? 'PUT' : 'POST';
      const url = editStaffId
        ? `https://hotel-management-backend-9459.onrender.com/api/staff/${editStaffId}`
        : 'https://hotel-management-backend-9459.onrender.com/api/staff';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(staffForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchStaff(token);
      showToast(editStaffId ? 'Staff updated!' : 'Staff added!');
      setStaffForm({ name: '', email: '', phone: '', password: '' });
      setShowStaffForm(false);
      setEditStaffId(null);
    } catch (err) {
      showToast(err.message);
    }
  };

  const editHotel = (hotel) => {
    setHotelForm(hotel);
    setEditHotelId(hotel._id);
    setShowHotelForm(true);
  };

  const editStaff = (staff) => {
    setStaffForm({ ...staff, password: '' });
    setEditStaffId(staff._id);
    setShowStaffForm(true);
  };

  const confirmRemove = (type, id) => {
    setConfirmDelete({ show: true, type, id });
  };

  const executeRemove = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = confirmDelete.type === 'hotel' ? 'hotels' : 'staff';
      const res = await fetch(`https://hotel-management-backend-9459.onrender.com/api/${endpoint}/${confirmDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      confirmDelete.type === 'hotel' ? fetchHotels(token) : fetchStaff(token);
      showToast('Deleted successfully.');
    } catch {
      showToast('Delete failed.');
    } finally {
      setConfirmDelete({ show: false, type: null, id: null });
    }
  };

  const toggleMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <button onClick={toggleMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {darkMode ? <Sun /> : <Moon />}
          </button>
          <button onClick={logout} className="p-2 rounded-full hover:bg-red-100 text-red-500 dark:hover:bg-red-800">
            <LogOut />
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-200 text-green-800 px-4 py-2 rounded mb-4">{message}</div>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2 rounded ${activeTab === 'hotels' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          Hotels
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded ${activeTab === 'staff' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          Staff
        </button>
      </div>

      {activeTab === 'hotels' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Hotel Listings</h2>
            <button onClick={() => setShowHotelForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
              <Plus size={16} /> Add Hotel
            </button>
          </div>
          {showHotelForm && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{editHotelId ? 'Edit Hotel' : 'Add New Hotel'}</h3>
                <button onClick={() => { setShowHotelForm(false); setEditHotelId(null); }}><X /></button>
              </div>
              <input type="text" placeholder="Name" value={hotelForm.name} onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })} className="w-full p-2 mb-2 rounded" />
              <input type="number" placeholder="Price" value={hotelForm.price} onChange={(e) => setHotelForm({ ...hotelForm, price: e.target.value })} className="w-full p-2 mb-2 rounded" />
              <input type="text" placeholder="Image URL" value={hotelForm.image} onChange={(e) => setHotelForm({ ...hotelForm, image: e.target.value })} className="w-full p-2 mb-2 rounded" />
              <textarea placeholder="Description" value={hotelForm.description} onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })} className="w-full p-2 mb-2 rounded" />
              <button onClick={handleAddHotel} className="bg-green-600 text-white px-4 py-2 rounded">
                {editHotelId ? 'Update Hotel' : 'Add Hotel'}
              </button>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {hotels.map(hotel => (
              <div key={hotel._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <Image src={hotel.image} alt={hotel.name} width={400} height={200} className="rounded mb-2 object-cover" />
                <h3 className="font-bold">{hotel.name}</h3>
                <p>${hotel.price}</p>
                <p className="text-sm">{hotel.description}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => editHotel(hotel)} className="p-1 bg-yellow-300 rounded"><Edit size={16} /></button>
                  <button onClick={() => confirmRemove('hotel', hotel._id)} className="p-1 bg-red-300 rounded"><Trash size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'staff' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Staff Members</h2>
            <button onClick={() => setShowStaffForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
              <Plus size={16} /> Add Staff
            </button>
          </div>
          {showStaffForm && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{editStaffId ? 'Edit Staff' : 'Add New Staff'}</h3>
                <button onClick={() => { setShowStaffForm(false); setEditStaffId(null); }}><X /></button>
              </div>
              <input type="text" placeholder="Name" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} className="w-full p-2 mb-2 rounded" />
              <input type="email" placeholder="Email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} className="w-full p-2 mb-2 rounded" />
              <input type="text" placeholder="Phone" value={staffForm.phone} onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} className="w-full p-2 mb-2 rounded" />
              <input type="password" placeholder="Password" value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} className="w-full p-2 mb-2 rounded" />
              <button onClick={handleAddStaff} className="bg-green-600 text-white px-4 py-2 rounded">
                {editStaffId ? 'Update Staff' : 'Add Staff'}
              </button>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {staffList.map(staff => (
              <div key={staff._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h3 className="font-bold">{staff.name}</h3>
                <p>{staff.email}</p>
                <p>{staff.phone}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => editStaff(staff)} className="p-1 bg-yellow-300 rounded"><Edit size={16} /></button>
                  <button onClick={() => confirmRemove('staff', staff._id)} className="p-1 bg-red-300 rounded"><Trash size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg text-center">
            <p>Are you sure you want to delete this {confirmDelete.type}?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button onClick={executeRemove} className="bg-red-600 text-white px-4 py-2 rounded">Yes</button>
              <button onClick={() => setConfirmDelete({ show: false, type: null, id: null })} className="bg-gray-400 px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
