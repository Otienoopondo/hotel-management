"use client";

import Link from "next/link";
import {
  Home,
  Users,
  LogOut,
  BookOpen,
  User,
  X,
  ClipboardList,
  Download,
  Printer,
  Trash2,
  BarChart2,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function StaffDashboard() {
  const [modal, setModal] = useState(null);
  const [staff, setStaff] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ type: null, id: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("staffToken") : null;

  const openModal = async (type) => {
    setModal(type);
    setError("");
    setLoading(true);

    try {
      if (type === "bookings") {
        const res = await axios.get(`${API_BASE}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      }
      if (type === "services") {
        const res = await axios.get(`${API_BASE}/api/services/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      }
      if (type === "clients") {
        const res = await axios.get(`${API_BASE}/api/client`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data);
      }
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load data.");
      toast.error("Failed to load data");
    }

    setLoading(false);
  };

  const closeModal = () => {
    setModal(null);
    setConfirmDelete({ type: null, id: null });
  };

  useEffect(() => {
    const stored = localStorage.getItem("staff");
    if (stored) {
      try {
        setStaff(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid staff in storage");
      }
    }
  }, []);

  const downloadReport = (type, data) => {
    const content = data.map((d) => JSON.stringify(d)).join("\n\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmAndDelete = async () => {
    if (!confirmDelete.type || !confirmDelete.id) return;

    setIsDeleting(true);
    try {
      if (confirmDelete.type === "booking") {
        await axios.delete(`${API_BASE}/api/bookings/${confirmDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings((prev) => prev.filter((b) => b._id !== confirmDelete.id));
        toast.success("Booking deleted successfully");
      }
      else if (confirmDelete.type === "client") {
        await axios.delete(`${API_BASE}/api/client/${confirmDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients((prev) => prev.filter((c) => c._id !== confirmDelete.id));
        toast.success("Client deleted successfully");
      }
      else if (confirmDelete.type === "order") {
        await axios.delete(`${API_BASE}/api/services/orders/${confirmDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders((prev) => prev.filter((o) => o._id !== confirmDelete.id));
        toast.success("Order deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Contact admin to delete this record");
    } finally {
      setIsDeleting(false);
      setConfirmDelete({ type: null, id: null });
    }
  };

  const handleDeleteClick = (type, id) => {
    setConfirmDelete({ type, id });
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center text-white relative"
      style={{ backgroundImage: "url('/sdashboard.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 flex-1 p-4 sm:p-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome{staff?.name ? `, ${staff.name}` : ""}
          </h1>
          <nav className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
            <Link href="/" className="hover:text-yellow-400 flex items-center gap-1">
              <Home size={18} /> Home
            </Link>
            <button onClick={() => openModal("profile")} className="hover:text-yellow-400 flex items-center gap-1">
              <User size={18} /> Profile
            </button>
            <Link href="/staff/login" className="hover:text-yellow-400 flex items-center gap-1">
              <LogOut size={18} /> Logout
            </Link>
          </nav>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-white/20 p-4 rounded-xl">
            <p className="text-lg font-semibold flex items-center justify-center gap-2">
              <BookOpen size={18} /> Bookings
            </p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <p className="text-lg font-semibold flex items-center justify-center gap-2">
              <Users size={18} /> Clients
            </p>
            <p className="text-2xl font-bold">{clients.length}</p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <p className="text-lg font-semibold flex items-center justify-center gap-2">
              <ClipboardList size={18} /> Services
            </p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
        </div>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={() => openModal("bookings")} 
            className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition"
          >
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen size={22} /> View Bookings
            </h2>
            <p className="text-sm text-gray-300 mt-1">Manage room bookings.</p>
          </button>
          <button 
            onClick={() => openModal("services")} 
            className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition"
          >
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList size={22} /> View Service Orders
            </h2>
            <p className="text-sm text-gray-300 mt-1">Client service requests.</p>
          </button>
          <button 
            onClick={() => openModal("clients")} 
            className="bg-white/10 p-6 rounded-xl shadow hover:bg-white/20 transition"
          >
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users size={22} /> Manage Clients
            </h2>
            <p className="text-sm text-gray-300 mt-1">Registered client info.</p>
          </button>
        </main>
      </div>

      <footer className="text-center py-5 bg-black/50 text-sm relative z-10">
        &copy; {new Date().getFullYear()} Hotel Management System
      </footer>

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4 py-10 overflow-auto">
          <div className="bg-white text-black p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">
              <X />
            </button>
            <h2 className="text-xl font-bold mb-3 capitalize">
              {modal === "profile" && "Staff Profile"}
              {modal === "bookings" && "Bookings"}
              {modal === "services" && "Service Orders"}
              {modal === "clients" && "Clients"}
            </h2>

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            {error && <p className="text-red-600 py-4">{error}</p>}

            {modal === "profile" && staff && (
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {staff.name}</p>
                <p><strong>Email:</strong> {staff.email}</p>
                <p><strong>Phone:</strong> {staff.phone}</p>
              </div>
            )}

            {modal === "bookings" && !loading && bookings.map((b) => (
              <div key={b._id} className="p-4 bg-gray-100 rounded mb-2 text-sm">
                <p><strong>Name:</strong> {b.name}</p>
                <p><strong>Email:</strong> {b.email}</p>
                <p><strong>Room:</strong> {b.roomType}</p>
                <p><strong>Check-in:</strong> {new Date(b.checkIn).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(b.checkOut).toLocaleDateString()}</p>
                <div className="flex justify-end mt-2 gap-2">
                  <button 
                    onClick={() => handleDeleteClick("booking", b._id)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}

            {modal === "services" && !loading && orders.map((o) => (
              <div key={o._id} className="p-4 bg-gray-100 rounded mb-2 text-sm">
                <p><strong>Name:</strong> {o.clientName}</p>
                <p><strong>Room:</strong> {o.roomNumber}</p>
                <p><strong>Service:</strong> {o.serviceType}</p>
                <p><strong>Details:</strong> {o.details}</p>
                <p><strong>Date:</strong> {new Date(o.createdAt).toLocaleString()}</p>
                <div className="flex justify-end mt-2 gap-2">
                  <button 
                    onClick={() => handleDeleteClick("order", o._id)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}

            {modal === "clients" && !loading && clients.map((c) => (
              <div key={c._id} className="p-4 bg-gray-100 rounded mb-2 text-sm">
                <p><strong>Name:</strong> {c.name}</p>
                <p><strong>Email:</strong> {c.email}</p>
                <p><strong>Phone:</strong> {c.phone}</p>
                <div className="flex justify-end mt-2 gap-2">
                  <button 
                    onClick={() => handleDeleteClick("client", c._id)} 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}

            {(modal === "bookings" || modal === "services" || modal === "clients") && !loading && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => downloadReport(modal, modal === "bookings" ? bookings : modal === "services" ? orders : clients)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Download size={16} /> Download Report
                </button>
                <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded flex items-center gap-2">
                  <Printer size={16} /> Print Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {confirmDelete.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black p-6 rounded-lg max-w-sm w-full">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to delete this {confirmDelete.type}?
            </p>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setConfirmDelete({ type: null, id: null })} 
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmAndDelete} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}