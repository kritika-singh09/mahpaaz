import React from "react";

const ReservationView = ({ reservation, onClose }) => {
  if (!reservation) return null;
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reservation Details</h2>
      <div className="mb-2"><strong>Name:</strong> {reservation.name}</div>
      <div className="mb-2"><strong>Email:</strong> {reservation.email}</div>
      <div className="mb-2"><strong>Room:</strong> {reservation.roomNumber}</div>
      <div className="mb-2"><strong>Check In:</strong> {reservation.checkIn}</div>
      <div className="mb-2"><strong>Check Out:</strong> {reservation.checkOut}</div>
      {/* Add more fields as needed */}
      <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary text-white rounded">Close</button>
    </div>
  );
};

export default ReservationView;
