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
      const res = await fetch('http://localhost:5000/api/hotels', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch hotels');
      const data = await res.json();
      setHotels(data);
    } catch {
      showToast('Failed to load hotels.');
    }
  };

  const fetchStaff = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/staff', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch staff');
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
      const url = editHotelId ? `http://localhost:5000/api/hotels/${editHotelId}` : 'http://localhost:5000/api/hotels';
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
      const url = editStaffId ? `http://localhost:5000/api/staff/${editStaffId}` : 'http://localhost:5000/api/staff';
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
      const res = await fetch(`http://localhost:5000/api/${endpoint}/${confirmDelete.id}`, {
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
    <div className={`flex flex-col min-h-screen transition duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-md">{message}</div>
      )}

      <header className="p-4 flex justify-between items-center bg-black/70 text-white">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={toggleMode}>{darkMode ? <Sun /> : <Moon />}</button>
          <button onClick={logout} className="flex items-center gap-1 hover:text-yellow-400"><LogOut size={18} />Logout</button>
        </div>
      </header>

      <main className="p-4">
        <div className="flex gap-4 mb-4">
          <button onClick={() => setActiveTab('hotels')} className={`px-4 py-2 rounded ${activeTab === 'hotels' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>Manage Hotels</button>
          <button onClick={() => setActiveTab('staff')} className={`px-4 py-2 rounded ${activeTab === 'staff' ? 'bg-green-600 text-white' : 'bg-white text-black'}`}>Manage Staff</button>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setShowHotelForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"><Plus size={16} /> Add Hotel</button>
          <button onClick={() => setShowStaffForm(true)} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"><Plus size={16} /> Add Staff</button>
        </div>

        {loading ? (
          <p className="text-center text-sm text-gray-500">Loading...</p>
        ) : activeTab === 'hotels' ? (
          <section>
            <h2 className="text-xl font-bold mb-4">Hotels ({hotels.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((h) => (
                <div key={h._id} className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg text-black dark:text-white transition hover:shadow-lg">
                  <Image src={h.image || '/hotel-placeholder.jpg'} alt={h.name} width={400} height={200} className="w-full h-40 object-cover rounded" />
                  <h3 className="text-lg font-semibold mt-2">{h.name}</h3>
                  <p className="text-sm">{h.description}</p>
                  <p className="font-bold">KES {h.price}</p>
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => editHotel(h)} className="text-blue-600 flex items-center gap-1"><Edit size={16} />Edit</button>
                    <button onClick={() => confirmRemove('hotel', h._id)} className="text-red-600 flex items-center gap-1"><Trash size={16} />Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-xl font-bold mb-4">Staff Members ({staffList.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((s) => (
                <div key={s._id} className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg text-black dark:text-white transition hover:shadow-lg">
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <p>{s.email}</p>
                  <p>{s.phone}</p>
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => editStaff(s)} className="text-blue-600 flex items-center gap-1"><Edit size={16} />Edit</button>
                    <button onClick={() => confirmRemove('staff', s._id)} className="text-red-600 flex items-center gap-1"><Trash size={16} />Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-black/70 text-white text-center py-4 mt-auto text-sm">&copy; {new Date().getFullYear()} Hotel Management System</footer>

      {/* Add/Edit Modals */}
      {showHotelForm && (
        <FormModal title={editHotelId ? 'Edit Hotel' : 'Add Hotel'} form={hotelForm} setForm={setHotelForm} onClose={() => { setShowHotelForm(false); setEditHotelId(null); }} onSave={handleAddHotel} fields={[{ name: 'name', placeholder: 'Hotel Name' }, { name: 'price', placeholder: 'Price' }, { name: 'image', placeholder: 'Image URL or Path' }, { name: 'description', placeholder: 'Description', isTextarea: true }]} />
      )}

      {showStaffForm && (
        <FormModal title={editStaffId ? 'Edit Staff' : 'Add Staff'} form={staffForm} setForm={setStaffForm} onClose={() => { setShowStaffForm(false); setEditStaffId(null); }} onSave={handleAddStaff} fields={[{ name: 'name', placeholder: 'Name' }, { name: 'email', placeholder: 'Email' }, { name: 'phone', placeholder: 'Phone' }, { name: 'password', placeholder: 'Password', type: 'password' }]} />
      )}

      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-black dark:text-white">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this {confirmDelete.type}?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={executeRemove} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              <button onClick={() => setConfirmDelete({ show: false, type: null, id: null })} className="bg-gray-400 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormModal({ title, form, setForm, onClose, onSave, fields }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded shadow-lg w-[90%] max-w-md relative">
        <button className="absolute top-2 right-2 hover:text-red-600" onClick={onClose} aria-label="Close form"><X /></button>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        {fields.map(({ name, placeholder, type = 'text', isTextarea }) => isTextarea ? (
          <textarea key={name} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} placeholder={placeholder} className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" />
        ) : (
          <input key={name} type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} placeholder={placeholder} className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white" />
        ))}
        <button onClick={onSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2">Save</button>
      </div>
    </div>
  );
}
