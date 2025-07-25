'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backend = 'https://hotel-management-backend-9459.onrender.com';

export default function AdminDashboard() {
  const [hotels, setHotels] = useState([]);
  const [staff, setStaff] = useState([]);
  const [activeTab, setActiveTab] = useState('hotels');
  const [newHotel, setNewHotel] = useState({ name: '', location: '', price: '', image: '' });
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', password: '' });
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteHotelModal, setShowDeleteHotelModal] = useState(false);
  const [showDeleteStaffModal, setShowDeleteStaffModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get(`${backend}/api/hotels`);
      setHotels(data);
    } catch (err) {
      toast.error('Failed to load hotels');
    }
  };

  const fetchStaff = async () => {
    try {
      const { data } = await axios.get(`${backend}/api/staff`);
      setStaff(data);
    } catch (err) {
      toast.error('Failed to load staff');
    }
  };

  const handleAddHotel = async () => {
    setLoading(true);
    try {
      if (editMode) {
        await axios.put(`${backend}/api/hotels/${currentEditItem._id}`, newHotel);
        toast.success('Hotel updated!');
      } else {
        await axios.post(`${backend}/api/hotels`, newHotel);
        toast.success('Hotel added!');
      }
      fetchHotels();
      setNewHotel({ name: '', location: '', price: '', image: '' });
      setShowHotelForm(false);
      setEditMode(false);
      setCurrentEditItem(null);
    } catch {
      toast.error(editMode ? 'Failed to update hotel' : 'Failed to add hotel');
    }
    setLoading(false);
  };

  const handleDeleteHotel = async () => {
    try {
      await axios.delete(`${backend}/api/hotels/${itemToDelete}`);
      toast.success('Hotel deleted');
      fetchHotels();
      setShowDeleteHotelModal(false);
    } catch {
      toast.error('Failed to delete hotel');
    }
  };

  const handleAddStaff = async () => {
    setLoading(true);
    try {
      if (editMode) {
        await axios.put(`${backend}/api/staff/${currentEditItem._id}`, newStaff);
        toast.success('Staff updated!');
      } else {
        await axios.post(`${backend}/api/staff`, newStaff);
        toast.success('Staff added!');
      }
      fetchStaff();
      setNewStaff({ name: '', email: '', phone: '', password: '' });
      setShowStaffForm(false);
      setEditMode(false);
      setCurrentEditItem(null);
    } catch {
      toast.error(editMode ? 'Failed to update staff' : 'Failed to add staff');
    }
    setLoading(false);
  };

  const handleDeleteStaff = async () => {
    try {
      await axios.delete(`${backend}/api/staff/${itemToDelete}`);
      toast.success('Staff deleted');
      fetchStaff();
      setShowDeleteStaffModal(false);
    } catch {
      toast.error('Failed to delete staff');
    }
  };

  const handleEdit = (type, item) => {
    if (type === 'hotel') {
      setNewHotel({
        name: item.name,
        location: item.location,
        price: item.price,
        image: item.image
      });
      setCurrentEditItem(item);
      setEditMode(true);
      setShowHotelForm(true);
    } else {
      setNewStaff({
        name: item.name,
        email: item.email,
        phone: item.phone,
        password: '' // Password is not retrieved for security
      });
      setCurrentEditItem(item);
      setEditMode(true);
      setShowStaffForm(true);
    }
  };

  const handleDeleteClick = (type, id) => {
    setItemToDelete(id);
    if (type === 'hotel') {
      setShowDeleteHotelModal(true);
    } else {
      setShowDeleteStaffModal(true);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchStaff();
  }, []);

  // Confirmation Modal Component
  const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">{title}</h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-indigo-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-white text-indigo-700 px-4 py-2 rounded font-semibold hover:bg-gray-200"
          >
            Home
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-white text-indigo-700 px-4 py-2 rounded font-semibold hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-6 py-2 rounded ${activeTab === 'hotels' ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}
        >
          Manage Hotels
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-6 py-2 rounded ${activeTab === 'staff' ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}
        >
          Manage Staff
        </button>
      </div>

      <main className="flex-grow px-4 mt-6">
        {activeTab === 'hotels' && (
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold mb-2">Hotel List</h2>
              <button
                onClick={() => {
                  setShowHotelForm(!showHotelForm);
                  if (showHotelForm) {
                    setEditMode(false);
                    setCurrentEditItem(null);
                    setNewHotel({ name: '', location: '', price: '', image: '' });
                  }
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {showHotelForm ? 'Cancel' : 'Add Hotel'}
              </button>
            </div>
            {showHotelForm && (
              <div className="grid gap-2 max-w-md mb-6">
                <input className="border p-2 rounded" placeholder="Name" value={newHotel.name} onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Location" value={newHotel.location} onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Price" type="number" value={newHotel.price} onChange={(e) => setNewHotel({ ...newHotel, price: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Image (e.g., hotel1.jpg)" value={newHotel.image} onChange={(e) => setNewHotel({ ...newHotel, image: e.target.value })} />
                <button disabled={loading} onClick={handleAddHotel} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  {loading ? (editMode ? 'Updating...' : 'Saving...') : (editMode ? 'Update Hotel' : 'Save Hotel')}
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              {hotels.map((hotel) => (
                <div key={hotel._id} className="bg-purple-100 rounded shadow p-4">
                  <Image 
                    src={hotel.image.startsWith('/') ? hotel.image : `/images/${hotel.image}`} 
                    alt={hotel.name} 
                    width={300} 
                    height={200} 
                    className="rounded mb-2 w-full h-48 object-cover" 
                  />
                  <h3 className="text-lg font-semibold text-purple-800">{hotel.name}</h3>
                  <p className="text-sm text-gray-700">{hotel.location}</p>
                  <p className="text-green-600 font-bold">Kshs. {hotel.price}</p>
                  <div className="space-x-2 mt-2">
                    <button onClick={() => handleEdit('hotel', hotel)} className="text-blue-700 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteClick('hotel', hotel._id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold mb-2">Staff List</h2>
              <button
                onClick={() => {
                  setShowStaffForm(!showStaffForm);
                  if (showStaffForm) {
                    setEditMode(false);
                    setCurrentEditItem(null);
                    setNewStaff({ name: '', email: '', phone: '', password: '' });
                  }
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {showStaffForm ? 'Cancel' : 'Add Staff'}
              </button>
            </div>
            {showStaffForm && (
              <div className="grid gap-2 max-w-md mb-6">
                <input className="border p-2 rounded" placeholder="Name" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Phone" value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} />
                <input 
                  className="border p-2 rounded" 
                  type="password" 
                  placeholder={editMode ? "New Password (leave blank to keep current)" : "Password"} 
                  value={newStaff.password} 
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} 
                />
                <button disabled={loading} onClick={handleAddStaff} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  {loading ? (editMode ? 'Updating...' : 'Saving...') : (editMode ? 'Update Staff' : 'Save Staff')}
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {staff.map((member) => (
                <div key={member._id} className="bg-yellow-100 rounded shadow p-4">
                  <h3 className="text-lg font-semibold text-yellow-800">{member.name}</h3>
                  <p className="text-sm text-gray-800">Email: {member.email}</p>
                  <p className="text-sm text-gray-800">Phone: {member.phone}</p>
                  <div className="space-x-2 mt-2">
                    <button onClick={() => handleEdit('staff', member)} className="text-blue-700 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteClick('staff', member._id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-indigo-700 text-white text-center p-4">
        &copy; {new Date().getFullYear()} Hotel Management System. All rights reserved.
      </footer>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteHotelModal}
        onClose={() => setShowDeleteHotelModal(false)}
        onConfirm={handleDeleteHotel}
        title="Delete Hotel"
        message="Are you sure you want to delete this hotel? This action cannot be undone."
      />

      <ConfirmationModal
        isOpen={showDeleteStaffModal}
        onClose={() => setShowDeleteStaffModal(false)}
        onConfirm={handleDeleteStaff}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
      />
    </div>
  );
}