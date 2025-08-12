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
        <h2 className="text-2xl font-semibold" style={{ color: 'hsl(45, 100%, 20%)' }}>Restaurant Bookings</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg transition duration-300"
          style={{ backgroundColor: 'hsl(45, 43%, 58%)', color: 'hsl(45, 100%, 20%)' }}
        >
          New Booking
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(45, 100%, 20%)' }}>Create New Booking</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="border rounded-lg px-3 py-2"
                style={{ borderColor: 'hsl(45, 100%, 85%)' }}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="border rounded-lg px-3 py-2"
                style={{ borderColor: 'hsl(45, 100%, 85%)' }}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="border rounded-lg px-3 py-2"
                style={{ borderColor: 'hsl(45, 100%, 85%)' }}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="border rounded-lg px-3 py-2"
                style={{ borderColor: 'hsl(45, 100%, 85%)' }}
                required
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="border rounded-lg px-3 py-2"
                style={{ borderColor: 'hsl(45, 100%, 85%)' }}
                required
              />
              <input
                type="number"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                className="border rounded-lg px-3 py-2"
                style={{ borderColor: 'hsl(45, 100%, 85%)' }}
                min="1"
                required
              />
              <select
                value={formData.tableType}
                onChange={(e) => setFormData({...formData, tableType: e.target.value})}
                className="border rounded-lg px-3 py-2"
                style={{ borderColor: 'hsl(45, 100%, 85%)' }}
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
                style={{ borderColor: 'hsl(45, 100%, 85%)' }}
              />
            </div>
            <textarea
              placeholder="Special Requests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
              className="border rounded-lg px-3 py-2 w-full"
              style={{ borderColor: 'hsl(45, 100%, 85%)' }}
              rows="3"
            />
            <div className="flex space-x-2">
              <button type="submit" className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'hsl(45, 43%, 58%)', color: 'hsl(45, 100%, 20%)' }}>
                Create Booking
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'hsl(45, 100%, 85%)', color: 'hsl(45, 100%, 20%)' }}
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
              <h3 className="font-semibold" style={{ color: 'hsl(45, 100%, 20%)' }}>{booking.customerName}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </div>
            <p className="mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Phone: {booking.phoneNumber}</p>
            <p className="mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p className="mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Time: {booking.time}</p>
            <p className="mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Guests: {booking.guests}</p>
            <p className="mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Table: {booking.tableType}</p>
            {booking.advanceAmount > 0 && <p className="font-semibold mb-2" style={{ color: 'hsl(45, 43%, 58%)' }}>Advance: ₹{booking.advanceAmount}</p>}
            <div className="flex flex-wrap gap-2">
              <select
                value={booking.status}
                onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                style={{ borderColor: 'hsl(45, 100%, 85%)' }}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => generateInvoice(booking._id)}
                className="px-2 py-1 rounded text-sm"
                style={{ backgroundColor: 'hsl(45, 43%, 58%)', color: 'hsl(45, 100%, 20%)' }}
              >
                Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'hsl(45, 100%, 20%)' }}>Invoice</h2>
            <button
              onClick={() => setShowInvoice(null)}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'hsl(45, 100%, 85%)', color: 'hsl(45, 100%, 20%)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantBooking;