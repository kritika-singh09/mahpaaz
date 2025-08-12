import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const RestaurantBooking = () => {
  const { axios } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    date: '',
    time: '',
    guests: 1,
    tableType: '',
    specialRequests: '',
    advanceAmount: 0
  });

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/restaurant-bookings/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/restaurant-bookings/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
      setShowForm(false);
      setFormData({
        customerName: '',
        phoneNumber: '',
        email: '',
        date: '',
        time: '',
        guests: 1,
        tableType: '',
        specialRequests: '',
        advanceAmount: 0
      });
      alert('🎉 Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/restaurant-bookings/${bookingId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const generateInvoice = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/restaurant-bookings/invoice/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowInvoice(response.data);
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: 'hsl(45, 100%, 95%)' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Restaurant Bookings</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          New Booking
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Booking</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                className="border rounded-lg px-3 py-2"
                min="1"
                required
              />
              <select
                value={formData.tableType}
                onChange={(e) => setFormData({...formData, tableType: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Table Type</option>
                <option value="regular">Regular</option>
                <option value="window">Window</option>
                <option value="private">Private</option>
                <option value="outdoor">Outdoor</option>
              </select>
              <input
                type="number"
                placeholder="Advance Amount"
                value={formData.advanceAmount}
                onChange={(e) => setFormData({...formData, advanceAmount: parseFloat(e.target.value)})}
                className="border rounded-lg px-3 py-2"
              />
            </div>
            <textarea
              placeholder="Special Requests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
              className="border rounded-lg px-3 py-2 w-full"
              rows="3"
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Create Booking
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{booking.customerName}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </div>
            <p className="text-gray-600 mb-1">Phone: {booking.phoneNumber}</p>
            <p className="text-gray-600 mb-1">Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-1">Time: {booking.time}</p>
            <p className="text-gray-600 mb-1">Guests: {booking.guests}</p>
            <p className="text-gray-600 mb-1">Table: {booking.tableType}</p>
            {booking.advanceAmount > 0 && <p className="text-blue-600 font-semibold mb-2">Advance: ₹{booking.advanceAmount}</p>}
            <div className="flex flex-wrap gap-2">
              <select
                value={booking.status}
                onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => generateInvoice(booking._id)}
                className="bg-green-500 text-white px-2 py-1 rounded text-sm"
              >
                Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Booking Invoice</h3>
              <button onClick={() => setShowInvoice(null)} className="text-gray-500 hover:text-gray-700 text-xl">
                ✕
              </button>
            </div>
            <div className="invoice-content">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Restaurant Booking Invoice</h2>
                <p className="text-gray-600">Booking ID: {showInvoice._id}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Customer Details:</h4>
                  <p>Name: {showInvoice.customerName}</p>
                  <p>Phone: {showInvoice.phoneNumber}</p>
                  <p>Email: {showInvoice.email}</p>
                  <p>Date: {new Date(showInvoice.date).toLocaleDateString()}</p>
                  <p>Time: {showInvoice.time}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Booking Details:</h4>
                  <p>Guests: {showInvoice.guests}</p>
                  <p>Table Type: {showInvoice.tableType}</p>
                  <p>Status: {showInvoice.status}</p>
                  <p className="font-semibold">Advance Amount: ₹{showInvoice.advanceAmount}</p>
                </div>
              </div>
              
              {showInvoice.specialRequests && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Special Requests:</h4>
                  <p className="text-gray-700">{showInvoice.specialRequests}</p>
                </div>
              )}
              
              <div className="text-center mt-8 pt-4 border-t">
                <p className="text-gray-600">Thank you for choosing our restaurant!</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantBooking;