import React, { useState, useRef, useEffect } from "react";
import InputWithIcon from "./InputWithIcon";
import {
  FaUser, FaPhone, FaCity, FaMapMarkedAlt, FaBuilding, FaGlobe,
  FaRegAddressCard, FaMobileAlt, FaEnvelope, FaMoneyCheckAlt,
  FaCalendarAlt, FaClock, FaDoorOpen, FaUsers, FaConciergeBell,
  FaInfoCircle, FaSuitcase, FaComments, FaFileInvoiceDollar,
  FaCheckCircle, FaSignInAlt, FaPassport, FaIdCard, FaCreditCard,
  FaCashRegister, FaAddressBook
} from "react-icons/fa";

// BookingEditForm accepts initialData and onEditSuccess props
const BookingEditForm = ({ initialData, onEditSuccess }) => {
  const [formData, setFormData] = useState({ ...initialData });
  const [showCamera, setShowCamera] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    fetch("https://backend-hazel-xi.vercel.app/api/rooms/all", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAvailableRooms(data || []));
    fetch("https://backend-hazel-xi.vercel.app/api/categories/all", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const token = getAuthToken();
    if (!token) {
      setMessage("Authentication required. Please log in.");
      return;
    }
    // Construct payload similar to BookingForm
    const payload = {
      categoryId: formData.selectedCategoryName,
      roomAssigned: formData.roomAssigned,
      guestDetails: {
        salutation: formData.salutation || "",
        name: formData.guestName || "",
        age: Number(formData.age) || undefined,
        gender: formData.gender || undefined,
      },
      contactDetails: {
        phone: formData.phoneNo || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country || undefined,
        pinCode: formData.pinCode || undefined
      },
      identityDetails: {
        idType: formData.idType || undefined,
        idNumber: formData.idNumber || undefined,
        idPhotoFront: formData.idImages?.[0] || undefined,
        idPhotoBack: formData.idImages?.[1] || undefined,
      },
      bookingInfo: {
        checkIn: formData.checkInDate,
        checkOut: formData.checkOutDate,
        arrivalFrom: formData.arrivalFrom || undefined,
        bookingType: formData.reservationType || undefined,
        purposeOfVisit: formData.purposeOfVisit || undefined,
        remarks: formData.remarks || undefined,
        adults: Number(formData.noOfAdults) || undefined,
        children: Number(formData.noOfChildren) || undefined
      },
      paymentDetails: {
        totalAmount: Number(formData.totalAmount) || undefined,
        amount: Number(formData.advanceAmount) || undefined,
        method: formData.paymentMode || undefined,
      },
    };
    try {
      // Replace with actual update endpoint and method
      const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data && data.booking) {
        setMessage("Booking updated successfully!");
        if (onEditSuccess) onEditSuccess(data.booking);
      } else {
        setMessage(`Update failed: ${data.error || "Unknown error."}`);
      }
    } catch (error) {
      setMessage(`Error updating booking: ${error.message}`);
    }
  };

  // Camera/image logic (same as BookingForm)
  const startCamera = async () => {
    setShowCamera(true);
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        setShowCamera(false);
        setMessage("Could not access camera.");
      }
    }, 100);
  };
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setShowCamera(false);
  };
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth || 320;
      canvasRef.current.height = videoRef.current.videoHeight || 240;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageDataURL = canvasRef.current.toDataURL('image/png');
      setFormData(prev => ({
        ...prev,
        idImages: [...(prev.idImages || []), imageDataURL]
      }));
      stopCamera();
    }
  };
  const removeImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      idImages: prev.idImages.filter((_, i) => i !== idx)
    }));
  };
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1000px] mx-auto p-8 relative">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Booking</h1>
        {message && (
          <div className={`px-4 py-3 rounded relative mb-4 ${message.includes("success") ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"}`} role="alert">
            <span className="block sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage(null)}>
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-10 w-full" autoComplete="off">
          {/* Guest Details Section */}
          <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] w-full">
            <h3 className="text-xl font-bold mb-6  text-[color:var(--color-text)] flex items-center gap-2">
              <FaUser /> Guest Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FaUser />
                </span>
                <select
                  className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  onChange={e => handleChange("salutation", e.target.value)}
                  value={formData.salutation || ""}
                >
                  <option value="">Select Salutation</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>
              </div>
              <InputWithIcon icon={<FaUser />} type="text" placeholder="Guest Name" onChange={(e) => handleChange("guestName", e.target.value)} value={formData.guestName || ''} />
              <InputWithIcon icon={<FaGlobe />} type="text" placeholder="Nationality" onChange={(e) => handleChange("nationality", e.target.value)} value={formData.nationality || ''} />
              <InputWithIcon icon={<FaCity />} type="text" placeholder="City" onChange={(e) => handleChange("city", e.target.value)} value={formData.city || ''} />
              <InputWithIcon icon={<FaMapMarkedAlt />} type="text" placeholder="Address" onChange={(e) => handleChange("address", e.target.value)} value={formData.address || ''} />
              <InputWithIcon icon={<FaPhone />} type="text" placeholder="Phone No" onChange={(e) => handleChange("phoneNo", e.target.value)} value={formData.phoneNo || ''} />
              <InputWithIcon icon={<FaMobileAlt />} type="text" placeholder="Mobile No" onChange={(e) => handleChange("mobileNo", e.target.value)} value={formData.mobileNo || ''} />
              <InputWithIcon icon={<FaEnvelope />} type="email" placeholder="Email" onChange={(e) => handleChange("email", e.target.value)} value={formData.email || ''} />
            </div>
          </section>
          {/* Contact Details Section */}
          <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] w-full">
            <h3 className="text-xl font-bold mb-6  text-[color:var(--color-text)]flex items-center gap-2">
              <FaAddressBook /> Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputWithIcon icon={<FaUser />} type="text" placeholder="Contact Person" onChange={(e) => handleChange("contactPerson", e.target.value)} value={formData.contactPerson || ''} />
              <InputWithIcon icon={<FaMobileAlt />} type="text" placeholder="Contact Mobile No" onChange={(e) => handleChange("contactMobile", e.target.value)} value={formData.contactMobile || ''} />
              <InputWithIcon icon={<FaEnvelope />} type="email" placeholder="Contact Email" onChange={(e) => handleChange("contactEmail", e.target.value)} value={formData.contactEmail || ''} />
            </div>
          </section>
          {/* Identity Details Section */}
          <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] w-full">
            <h3 className="text-xl font-bold mb-6  text-[color:var(--color-text)] flex items-center gap-2">
              <FaIdCard /> Identity Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputWithIcon icon={<FaIdCard />} type="text" placeholder="ID Type (e.g. Aadhar, Passport)" onChange={(e) => handleChange("idType", e.target.value)} value={formData.idType || ''} />
              <InputWithIcon icon={<FaIdCard />} type="text" placeholder="ID Number" onChange={(e) => handleChange("idNumber", e.target.value)} value={formData.idNumber || ''} />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="file"
                id="idImageUploadEdit"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({
                        ...prev,
                        idImages: [...(prev.idImages || []), reader.result]
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => document.getElementById('idImageUploadEdit').click()}
              >
                Upload Image
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={startCamera}
              >
                Use Camera
              </button>
            </div>
            {showCamera && (
              <div className="mt-4 p-4 border border-gray-300 rounded-md flex flex-col items-center">
                <video ref={videoRef} className="w-full max-w-md rounded-md" autoPlay playsInline></video>
                <button
                  type="button"
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition-all"
                  onClick={capturePhoto}
                >
                  Capture Photo
                </button>
                <button
                  type="button"
                  className="mt-2 bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition-all"
                  onClick={stopCamera}
                >
                  Close Camera
                </button>
              </div>
            )}
            {formData.idImages && formData.idImages.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {formData.idImages.map((img, idx) => (
                  <div key={idx} className="relative inline-block">
                    <img src={img} alt={`ID Proof ${idx + 1}`} className="max-w-xs h-auto rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-red-800"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </section>
          {/* Booking Info Section */}
          <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] w-full">
            <h3 className="text-xl font-bold mb-6  text-[color:var(--color-text)] flex items-center gap-2">
              <FaFileInvoiceDollar /> Booking Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FaDoorOpen />
                </span>
                <select
                  className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  onChange={e => {
                    const roomId = e.target.value;
                    handleChange("roomAssigned", roomId);
                    const selectedRoom = availableRooms.find(r => r._id === roomId);
                    handleChange("selectedCategoryName", selectedRoom && selectedRoom.category ? selectedRoom.category._id : "");
                  }}
                  value={formData.roomAssigned || ""}
                >
                  <option value="">Select Room</option>
                  {availableRooms
                    .filter(room => room.status === "available" || room._id === formData.roomAssigned)
                    .map(room => (
                      <option key={room._id} value={room._id}>
                        {room.title} (#{room.room_number}) - {room.category && room.category.name}
                      </option>
                    ))}
                </select>
              </div>
              <InputWithIcon icon={<FaInfoCircle />} type="text" placeholder="Reservation Type" onChange={(e) => handleChange("reservationType", e.target.value)} value={formData.reservationType || ''} />
              <InputWithIcon icon={<FaCalendarAlt />} type="date" placeholder="Check-In Date" onChange={(e) => handleChange("checkInDate", e.target.value)} value={formData.checkInDate || ''} />
              <InputWithIcon icon={<FaClock />} type="time" placeholder="Check-In Time" onChange={(e) => handleChange("checkInTime", e.target.value)} value={formData.checkInTime || ''} />
              <InputWithIcon icon={<FaCalendarAlt />} type="date" placeholder="Check-Out Date" onChange={(e) => handleChange("checkOutDate", e.target.value)} value={formData.checkOutDate || ''} />
              <InputWithIcon icon={<FaClock />} type="time" placeholder="Check-Out Time" onChange={(e) => handleChange("checkOutTime", e.target.value)} value={formData.checkOutTime || ''} />
              <InputWithIcon icon={<FaUsers />} type="number" placeholder="No. of Rooms" onChange={(e) => handleChange("noOfRooms", e.target.value)} value={formData.noOfRooms || ''} />
              <InputWithIcon icon={<FaUsers />} type="number" placeholder="No. of Adults" onChange={(e) => handleChange("noOfAdults", e.target.value)} value={formData.noOfAdults || ''} />
              <InputWithIcon icon={<FaUsers />} type="number" placeholder="No. of Children" onChange={(e) => handleChange("noOfChildren", e.target.value)} value={formData.noOfChildren || ''} />
              <InputWithIcon icon={<FaMoneyCheckAlt />} type="number" placeholder="Rate" onChange={(e) => handleChange("rate", e.target.value)} value={formData.rate || ''} />
            </div>
          </section>
          {/* Payment Details Section */}
          <section className="rounded-2xl shadow p-6 border border-[color:var(--color-border)] w-full">
            <h3 className="text-xl font-bold mb-6  text-[color:var(--color-text)] flex items-center gap-2">
              <FaCreditCard /> Payment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputWithIcon icon={<FaCashRegister />} type="text" placeholder="Payment Mode" onChange={(e) => handleChange("paymentMode", e.target.value)} value={formData.paymentMode || ''} />
              <InputWithIcon icon={<FaMoneyCheckAlt />} type="number" placeholder="Advance Amount" onChange={(e) => handleChange("advanceAmount", e.target.value)} value={formData.advanceAmount || ''} />
            </div>
          </section>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition"
            >
              Update Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingEditForm;
