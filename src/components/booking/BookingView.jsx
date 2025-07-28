import React from "react";

const BookingView = ({ booking, onClose }) => {
  if (!booking) return null;
  return (
    <form className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Guest Name</label>
        <input
          type="text"
          value={booking.guestDetails?.name || ""}
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={booking.contactDetails?.email || ""}
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="text"
          value={booking.contactDetails?.phone || ""}
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Room</label>
        <input
          type="text"
          value={booking.roomAssigned || booking.roomNumber || ""}
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Check-In</label>
        <input
          type="date"
          value={booking.bookingInfo?.checkIn ? booking.bookingInfo.checkIn.slice(0, 10) : ""}
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Check-Out</label>
        <input
          type="date"
          value={booking.bookingInfo?.checkOut ? booking.bookingInfo.checkOut.slice(0, 10) : ""}
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          disabled
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-md"
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default BookingView;
