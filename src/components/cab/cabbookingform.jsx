import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

// Main App component that renders the CabBookingForm
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <CabBookingForm />
    </div>
  );
}

// CabBookingForm component
function CabBookingForm() {
  // State to hold form data, initialized with default values
  const [formData, setFormData] = useState({
    purpose: 'guest_transport',
    guestName: '',
    roomNumber: '',
    grcNo: '',
    guestType: 'inhouse',
    pickupLocation: '',
    destination: '',
    pickupTime: '', // Will be set by datetime-local input
    cabType: 'standard',
    specialInstructions: '',
    scheduled: false,
    estimatedFare: '',
    actualFare: '',
    distanceInKm: '',
    paymentStatus: 'unpaid',
    vehicleNumber: '',
    driverName: '',
    driverContact: '',
    status: 'pending',
    cancellationReason: '',
  });

  // State for managing form submission messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setMessageType('');

    // Prepare data for submission, ensuring correct types for numbers
    const dataToSend = {
      ...formData,
      estimatedFare: formData.estimatedFare ? parseFloat(formData.estimatedFare) : undefined,
      actualFare: formData.actualFare ? parseFloat(formData.actualFare) : undefined,
      distanceInKm: formData.distanceInKm ? parseFloat(formData.distanceInKm) : undefined,
      // Convert pickupTime to ISO string if it exists
      pickupTime: formData.pickupTime ? new Date(formData.pickupTime).toISOString() : undefined,
      // For 'createdBy', in a real app, this would come from authenticated user context
      // For this demo, we'll use a placeholder or remove if not strictly required by the API
      createdBy: '60d5ec49f8c7e20015f8e2e1', // Placeholder User ID - REPLACE WITH ACTUAL USER ID
    };

    // Remove empty strings or undefined values for optional fields if the backend expects it
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === '' || dataToSend[key] === undefined || dataToSend[key] === null) {
        delete dataToSend[key];
      }
    });

    try {
      const response = await fetch('https://backend-hazel-xi.vercel.app/api/cab/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Cab booking successfully created!');
        setMessageType('success');
        console.log('Success:', result);
        // Optionally clear the form after successful submission
        setFormData({
          purpose: 'guest_transport',
          guestName: '',
          roomNumber: '',
          grcNo: '',
          guestType: 'inhouse',
          pickupLocation: '',
          destination: '',
          pickupTime: '',
          cabType: 'standard',
          specialInstructions: '',
          scheduled: false,
          estimatedFare: '',
          actualFare: '',
          distanceInKm: '',
          paymentStatus: 'unpaid',
          vehicleNumber: '',
          driverName: '',
          driverContact: '',
          status: 'pending',
          cancellationReason: '',
        });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'Failed to create cab booking.'}`);
        setMessageType('error');
        console.error('Error:', errorData);
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
      setMessageType('error');
      console.error('Network error:', error);
    }
  };

  // Determine if guest-related fields should be shown
  const showGuestInfo = formData.purpose === 'guest_transport' || formData.purpose === 'sightseeing';
  // Determine if cancellation reason should be shown
  const showCancellationReason = formData.status === 'cancelled';

  return (
    <div className="w-full  bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Cab Booking Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Message Display */}
        {message && (
          <div className={`p-3 rounded-md text-center ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Purpose Section */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
          <select
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
          >
            <option value="guest_transport">Guest Transport</option>
            <option value="hotel_supply">Hotel Supply</option>
            <option value="staff_pickup">Staff Pickup</option>
            <option value="sightseeing">Sightseeing</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Guest or Room Info (Conditional Rendering) */}
        {showGuestInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-blue-50 rounded-lg border bg-[color:var(--color-primary)]">
            <h3 className="col-span-full text-lg font-semibold text-blue-800 mb-2">Guest Information</h3>
            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
              <input
                type="text"
                id="guestName"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="grcNo" className="block text-sm font-medium text-gray-700 mb-1">GRC No. (Optional)</label>
              <input
                type="text"
                id="grcNo"
                name="grcNo"
                value={formData.grcNo}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            <div className="col-span-full">
              <label htmlFor="guestType" className="block text-sm font-medium text-gray-700 mb-1">Guest Type</label>
              <select
                id="guestType"
                name="guestType"
                value={formData.guestType}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              >
                <option value="inhouse">Inhouse</option>
                <option value="external">External</option>
              </select>
            </div>
          </div>
        )}

        {/* Ride Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="col-span-full text-lg font-semibold text-gray-800 mb-2">Ride Details</h3>
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">Pickup Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">Pickup Time <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="cabType" className="block text-sm font-medium text-gray-700 mb-1">Cab Type</label>
            <select
              id="cabType"
              name="cabType"
              value={formData.cabType}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="suv">SUV</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            ></textarea>
          </div>
          <div className="flex items-center md:col-span-2">
            <input
              id="scheduled"
              name="scheduled"
              type="checkbox"
              checked={formData.scheduled}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="scheduled" className="ml-2 block text-sm font-medium text-gray-700">Scheduled Ride</label>
          </div>
        </div>

       

        {/* Cab Vehicle & Driver Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="col-span-full text-lg font-semibold text-gray-800 mb-2">Cab & Driver Info</h3>
          <div>
            <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
            <input
              type="text"
              id="driverName"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="driverContact" className="block text-sm font-medium text-gray-700 mb-1">Driver Contact</label>
            <input
              type="text"
              id="driverContact"
              name="driverContact"
              value={formData.driverContact}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            />
          </div>
        </div>

        {/* Status Tracking Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="col-span-full text-lg font-semibold text-gray-800 mb-2">Status Tracking</h3>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="on_route">On Route</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {showCancellationReason && (
            <div>
              <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason</label>
              <textarea
                id="cancellationReason"
                name="cancellationReason"
                value={formData.cancellationReason}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              ></textarea>
            </div>
          )}
        </div>

{/*       
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Submit Cab Request
          </button>
           <button
            type="submit"
            className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Update Cab Request
          </button>
        </div>
         */}
         <div className="flex justify-center mt-8">
  <button
    type="submit"
    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[color:var(--color-primary)] focus:ring-2 focus:ring-offset-2 focus:bg-[color:var(--color-primary)] transform hover:scale-105"
  >
    Submit Cab Request
  </button>

 
</div>

      </form>
    </div>
  );
}