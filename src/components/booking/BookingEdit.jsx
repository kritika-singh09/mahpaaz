import React, { useState } from "react";

const BookingEdit = ({ booking, onSave, onCancel }) => {
  const [currentBooking, setCurrentBooking] = useState({
    ...booking,
    guestDetails: { ...booking.guestDetails },
    contactDetails: { ...booking.contactDetails },
    bookingInfo: { ...booking.bookingInfo },
  });

  const handleChange = (section, field, value) => {
    setCurrentBooking((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(currentBooking);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">GRC No</label>
        <input
          type="text"
          value={currentBooking.grcNo || ""}
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Guest Name</label>
        <input
          type="text"
          value={currentBooking.guestDetails?.name || ""}
          onChange={(e) => handleChange("guestDetails", "name", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={currentBooking.contactDetails?.email || ""}
          onChange={(e) => handleChange("contactDetails", "email", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="text"
          value={currentBooking.contactDetails?.phone || ""}
          onChange={(e) => handleChange("contactDetails", "phone", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Room</label>
        <input
          type="text"
          value={currentBooking.roomAssigned || currentBooking.roomNumber || ""}
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Check-In</label>
        <input
          type="date"
          value={currentBooking.bookingInfo?.checkIn ? currentBooking.bookingInfo.checkIn.slice(0, 10) : ""}
          onChange={(e) => handleChange("bookingInfo", "checkIn", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Check-Out</label>
        <input
          type="date"
          value={currentBooking.bookingInfo?.checkOut ? currentBooking.bookingInfo.checkOut.slice(0, 10) : ""}
          onChange={(e) => handleChange("bookingInfo", "checkOut", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default BookingEdit;
