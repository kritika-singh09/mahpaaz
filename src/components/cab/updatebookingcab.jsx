import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Clock, Car, DollarSign, CheckCircle, CreditCard, X, Info } from 'lucide-react';

// Main App component for the Cab Booking Edit Page
function App() {
  // State variables to hold form data
  const [bookingId, setBookingId] = useState('66a3d90f2358826d9e075c3f'); // Placeholder ID, in a real app this would come from props/URL
  const [customerName, setCustomerName] = useState('John Doe');
  const [pickupLocation, setPickupLocation] = useState('123 Main St, Anytown');
  const [dropoffLocation, setDropoffLocation] = useState('456 Oak Ave, Anytown');
  const [bookingDate, setBookingDate] = useState('2025-07-27');
  const [bookingTime, setBookingTime] = useState('14:30');
  const [vehicleType, setVehicleType] = useState('Sedan');
  const [fare, setFare] = useState('25.00');
  const [bookingStatus, setBookingStatus] = useState('Pending');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [message, setMessage] = useState(''); // State for displaying messages to the user
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Function to display messages
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  // Function to handle saving the booking
  const handleSaveBooking = async () => {
    if (!bookingId) {
      showMessage('Booking ID is missing. Cannot save.', 'error');
      return;
    }

    const apiUrl = `https://backend-hazel-xi.vercel.app/api/cab/bookings/${bookingId}`;

    const bookingData = {
      customerName,
      pickupLocation,
      dropoffLocation,
      bookingDate,
      bookingTime,
      vehicleType,
      fare: parseFloat(fare), // Ensure fare is a number
      bookingStatus,
      paymentMethod,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT', // Use PUT for updating existing resources
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Booking Saved Successfully:', result);
        showMessage('Booking Saved Successfully!', 'success');
        // You might also close the modal or navigate away after saving
      } else {
        const errorData = await response.json();
        console.error('Failed to save booking:', errorData);
        showMessage(`Failed to save booking: ${errorData.message || response.statusText}`, 'error');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      showMessage(`Error saving booking: ${error.message}`, 'error');
    }
  };

  // Function to handle canceling the edit
  const handleCancel = () => {
    console.log('Canceling Cab Booking Edit');
    showMessage('Edit Cancelled.', 'info');
    // In a real application, you would close the modal or navigate back
  };

  // Function to close the edit page (e.g., if it's a modal)
  const handleClose = () => {
    console.log('Closing Edit Page');
    // This would typically close a modal or navigate back to the previous page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Cab Booking</h2>

        {/* Message Display Area */}
        {message && (
          <div
            className={`flex items-center p-3 mb-4 rounded-lg text-sm
              ${messageType === 'success' ? 'bg-green-100 text-green-700' : ''}
              ${messageType === 'error' ? 'bg-red-100 text-red-700' : ''}
              ${messageType === 'info' ? 'bg-blue-100 text-blue-700' : ''}
            `}
            role="alert"
          >
            <Info size={18} className="mr-2" />
            {message}
          </div>
        )}

        {/* Customer Name Section */}
        <div className="mb-6">
          <label htmlFor="customerName" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
            <User size={18} className="mr-2 text-blue-500" />
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>

        {/* Cab Details Section */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Details</h3>

          {/* Pickup Location */}
          <div className="mb-4">
            <label htmlFor="pickupLocation" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
              <MapPin size={18} className="mr-2 text-green-500" />
              Pickup Location
            </label>
            <input
              type="text"
              id="pickupLocation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Enter pickup location"
            />
          </div>

          {/* Drop-off Location */}
          <div className="mb-4">
            <label htmlFor="dropoffLocation" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
              <MapPin size={18} className="mr-2 text-red-500" />
              Drop-off Location
            </label>
            <input
              type="text"
              id="dropoffLocation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              placeholder="Enter drop-off location"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="bookingDate" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <Calendar size={18} className="mr-2 text-purple-500" />
                Date
              </label>
              <input
                type="date"
                id="bookingDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="bookingTime" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <Clock size={18} className="mr-2 text-orange-500" />
                Time
              </label>
              <input
                type="time"
                id="bookingTime"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              />
            </div>
          </div>

          {/* Vehicle Type and Fare */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicleType" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <Car size={18} className="mr-2 text-teal-500" />
                Vehicle Type
              </label>
              <select
                id="vehicleType"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
                <option value="Van">Van</option>
              </select>
            </div>
            <div>
              <label htmlFor="fare" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                <DollarSign size={18} className="mr-2 text-yellow-600" />
                Fare ($)
              </label>
              <input
                type="number"
                id="fare"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-600 focus:border-yellow-600 transition duration-150 ease-in-out"
                value={fare}
                onChange={(e) => setFare(e.target.value)}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Status and Payment Method Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label htmlFor="bookingStatus" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
              <CheckCircle size={18} className="mr-2 text-indigo-500" />
              Booking Status
            </label>
            <select
              id="bookingStatus"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="On-route">On-route</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
              <CreditCard size={18} className="mr-2 text-pink-500" />
              Payment Method
            </label>
            <select
              id="paymentMethod"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 transition duration-150 ease-in-out"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Online Payment">Online Payment</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveBooking}
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out shadow-md"
          >
            Save Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
