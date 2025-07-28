import React from "react";
import {
  FaUser, FaPhone, FaCity, FaMapMarkedAlt, FaGlobe, FaMobileAlt, FaEnvelope,
  FaIdCard, FaFileInvoiceDollar, FaDoorOpen, FaInfoCircle, FaCalendarAlt, FaClock,
  FaUsers, FaMoneyCheckAlt, FaCreditCard, FaCashRegister, FaAddressBook
} from "react-icons/fa";

const renderField = (icon, label, value) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-gray-500">{icon}</span>
    <span className="font-medium text-gray-700 w-48">{label}:</span>
    <span className="text-gray-900">{value || 'N/A'}</span>
  </div>
);

const BookingViewForm = ({ booking }) => {
  if (!booking) return <div className="p-6">No booking data provided.</div>;
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1000px] mx-auto p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-8">Booking Details</h1>
        {/* Guest Details */}
        <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaUser /> Guest Details</h3>
          {renderField(<FaUser />, "Salutation", booking.guestDetails?.salutation)}
          {renderField(<FaUser />, "Name", booking.guestDetails?.name)}
          {renderField(<FaGlobe />, "Nationality", booking.guestDetails?.nationality)}
          {renderField(<FaCity />, "City", booking.guestDetails?.city)}
          {renderField(<FaMapMarkedAlt />, "Address", booking.guestDetails?.address)}
          {renderField(<FaPhone />, "Phone No", booking.guestDetails?.phone)}
          {renderField(<FaMobileAlt />, "Mobile No", booking.guestDetails?.mobileNo)}
          {renderField(<FaEnvelope />, "Email", booking.guestDetails?.email)}
        </section>
        {/* Contact Details */}
        <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaAddressBook /> Contact Details</h3>
          {renderField(<FaUser />, "Contact Person", booking.contactDetails?.contactPerson)}
          {renderField(<FaMobileAlt />, "Contact Mobile No", booking.contactDetails?.contactMobile)}
          {renderField(<FaEnvelope />, "Contact Email", booking.contactDetails?.contactEmail)}
        </section>
        {/* Identity Details */}
        <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaIdCard /> Identity Details</h3>
          {renderField(<FaIdCard />, "ID Type", booking.identityDetails?.idType)}
          {renderField(<FaIdCard />, "ID Number", booking.identityDetails?.idNumber)}
          <div className="flex gap-4 mt-2">
            {booking.identityDetails?.idPhotoFront && (
              <img src={booking.identityDetails.idPhotoFront} alt="ID Front" className="w-32 h-auto rounded border" />
            )}
            {booking.identityDetails?.idPhotoBack && (
              <img src={booking.identityDetails.idPhotoBack} alt="ID Back" className="w-32 h-auto rounded border" />
            )}
          </div>
        </section>
        {/* Booking Info */}
        <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaFileInvoiceDollar /> Booking Info</h3>
          {renderField(<FaDoorOpen />, "Room Assigned", booking.roomAssigned)}
          {renderField(<FaInfoCircle />, "Reservation Type", booking.bookingInfo?.bookingType)}
          {renderField(<FaCalendarAlt />, "Check-In Date", booking.bookingInfo?.checkIn)}
          {renderField(<FaClock />, "Check-In Time", booking.bookingInfo?.checkInTime)}
          {renderField(<FaCalendarAlt />, "Check-Out Date", booking.bookingInfo?.checkOut)}
          {renderField(<FaClock />, "Check-Out Time", booking.bookingInfo?.checkOutTime)}
          {renderField(<FaUsers />, "No. of Rooms", booking.bookingInfo?.noOfRooms)}
          {renderField(<FaUsers />, "No. of Adults", booking.bookingInfo?.adults)}
          {renderField(<FaUsers />, "No. of Children", booking.bookingInfo?.children)}
          {renderField(<FaMoneyCheckAlt />, "Rate", booking.bookingInfo?.rate)}
        </section>
        {/* Payment Details */}
        <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaCreditCard /> Payment Details</h3>
          {renderField(<FaCashRegister />, "Payment Mode", booking.paymentDetails?.method)}
          {renderField(<FaMoneyCheckAlt />, "Advance Amount", booking.paymentDetails?.amount)}
          {renderField(<FaMoneyCheckAlt />, "Total Amount", booking.paymentDetails?.totalAmount)}
        </section>
      </div>
    </div>
  );
};

export default BookingViewForm;
