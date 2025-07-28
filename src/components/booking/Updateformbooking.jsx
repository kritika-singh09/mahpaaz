import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  FaUser, FaPhone, FaCity, FaMapMarkedAlt, FaBuilding, FaGlobe,
  FaRegAddressCard, FaMobileAlt, FaEnvelope, FaMoneyCheckAlt,
  FaCalendarAlt, FaClock, FaDoorOpen, FaUsers, FaConciergeBell,
  FaInfoCircle, FaSuitcase, FaComments, FaFileInvoiceDollar,
  FaCheckCircle, FaSignInAlt, FaPassport, FaIdCard, FaCreditCard,
  FaCashRegister, FaAddressBook, FaRegListAlt, FaRegUser, FaRegCalendarPlus,
  FaRegCheckCircle, FaRegTimesCircle, FaRegUserCircle, FaRegCreditCard,
  FaRegStar, FaRegFlag, FaRegEdit, FaRegClone, FaRegCommentDots,
  FaRegFileAlt, FaRegCalendarCheck, FaRegCalendarTimes, FaRegMap, FaHotel, FaTimes
} from "react-icons/fa";

// Define InputWithIcon component directly within this file
const InputWithIcon = ({ icon, type, name, placeholder, value, onChange, className, required, min, max, step, readOnly, inputClassName }) => {
  return (
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3 text-gray-400 pointer-events-none">{icon}</div>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // Use inputClassName for specific input styling, fallback to default if not provided
        className={`pl-10 pr-4 py-2 w-full ${inputClassName || 'bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'} ${className}`}
        required={required}
        min={min}
        max={max}
        step={step}
        readOnly={readOnly}
      />
    </div>
  );
};


const UpdateBookingForm = ({ bookingId, onUpdateSuccess, onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idImages: [],
    selectedCategoryId: "",
    guestName: "",
    checkInDate: "",
    checkOutDate: "",
    salutation: "",
    nationality: "",
    city: "",
    address: "",
    phoneNo: "",
    mobileNo: "",
    email: "",
    contactPerson: "",
    contactMobile: "",
    contactEmail: "",
    idType: "",
    idNumber: "",
    reservationType: "",
    checkInTime: "",
    checkOutTime: "",
    noOfRooms: "",
    noOfAdults: "",
    noOfChildren: "",
    rate: "",
    paymentMode: "",
    advanceAmount: "",
    totalAmount: "",
    roomAssigned: "",
    arrivalFrom: "",
    purposeOfVisit: "",
    remarks: "",
    grcNo: "",
  });
  const [showCamera, setShowCamera] = useState(false);
  const [allAvailableRooms, setAllAvailableRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomFetchError, setRoomFetchError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoryFetchError, setCategoryFetchError] = useState(null);

  const [message, setMessage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      console.error("Authentication token not found.");
      return;
    }

    // Fetch all rooms
    fetch("https://backend-hazel-xi.vercel.app/api/rooms/all", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        setAllAvailableRooms(data || []);
        setFilteredRooms(data || []);
        setRoomFetchError(null);
      })
      .catch(error => {
        setRoomFetchError(error.message || "Unknown error fetching rooms");
        setAllAvailableRooms([]);
        setFilteredRooms([]);
        console.error("Error fetching rooms:", error);
      });

    // Fetch all categories
    fetch("https://backend-hazel-xi.vercel.app/api/categories/all", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setCategoryFetchError(null);
      })
      .catch(error => {
        setCategoryFetchError(error.message || "Unknown error fetching categories");
        setCategories([]);
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Effect to fetch existing booking data for update
  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) return;

      const token = getAuthToken();
      if (!token) {
        setMessage("Authentication required to fetch booking details.");
        return;
      }

      try {
        const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/${bookingId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch booking: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        if (data && data.booking) {
          const booking = data.booking;
          // Populate form data with existing booking details
          setFormData({
            idImages: booking.identityDetails?.idPhotoFront ? [booking.identityDetails.idPhotoFront, booking.identityDetails.idPhotoBack].filter(Boolean) : [],
            selectedCategoryId: booking.room?.category?._id || "", // Assuming room object has category details
            guestName: booking.guestDetails?.name || "",
            checkInDate: booking.bookingInfo?.checkIn ? new Date(booking.bookingInfo.checkIn).toISOString().split('T')[0] : "",
            checkOutDate: booking.bookingInfo?.checkOut ? new Date(booking.bookingInfo.checkOut).toISOString().split('T')[0] : "",
            salutation: booking.guestDetails?.salutation || "",
            nationality: booking.guestDetails?.nationality || "", // Assuming nationality exists
            city: booking.contactDetails?.city || "",
            address: booking.contactDetails?.address || "",
            phoneNo: booking.contactDetails?.phone || "",
            mobileNo: booking.contactDetails?.mobile || "", // Assuming mobile exists
            email: booking.contactDetails?.email || "",
            contactPerson: booking.contactDetails?.contactPerson || "", // Assuming contact person exists
            contactMobile: booking.contactDetails?.contactMobile || "", // Assuming contact mobile exists
            contactEmail: booking.contactDetails?.contactEmail || "", // Assuming contact email exists
            idType: booking.identityDetails?.idType || "",
            idNumber: booking.identityDetails?.idNumber || "",
            reservationType: booking.bookingInfo?.bookingType || "",
            checkInTime: booking.bookingInfo?.checkInTime || "", // Assuming checkInTime exists
            checkOutTime: booking.bookingInfo?.checkOutTime || "", // Assuming checkOutTime exists
            noOfRooms: booking.bookingInfo?.noOfRooms || "", // Assuming noOfRooms exists
            noOfAdults: booking.bookingInfo?.adults || "",
            noOfChildren: booking.bookingInfo?.children || "",
            rate: booking.paymentDetails?.rate || "", // Assuming rate exists
            paymentMode: booking.paymentDetails?.method || "",
            advanceAmount: booking.paymentDetails?.amount || "",
            totalAmount: booking.paymentDetails?.totalAmount || "",
            roomAssigned: booking.room?._id || "",
            arrivalFrom: booking.bookingInfo?.arrivalFrom || "",
            purposeOfVisit: booking.bookingInfo?.purposeOfVisit || "",
            remarks: booking.bookingInfo?.remarks || "",
            grcNo: booking.grcNo || "",
          });
        } else {
          setMessage("Booking data not found.");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setMessage(`Error fetching booking details: ${error.message}`);
      }
    };

    fetchBookingData();
  }, [bookingId]); // Re-fetch when bookingId changes

  // Effect to filter rooms based on selected category
  useEffect(() => {
    if (formData.selectedCategoryId) {
      const roomsForCategory = allAvailableRooms.filter(room =>
        room.category && room.category._id === formData.selectedCategoryId
      );
      setFilteredRooms(roomsForCategory);
      // If the currently selected room is not in the new filtered list, clear it
      if (formData.roomAssigned && !roomsForCategory.some(room => room._id === formData.roomAssigned)) {
        setFormData(prev => ({ ...prev, roomAssigned: "" }));
      }
    } else {
      setFilteredRooms(allAvailableRooms); // Show all rooms if no category is selected
    }
  }, [formData.selectedCategoryId, allAvailableRooms]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const token = getAuthToken();
    if (!token) {
      console.error("Authentication token not found. Cannot update booking.");
      setMessage("Authentication required. Please log in.");
      return;
    }

    if (!bookingId) {
      setMessage("No booking ID provided for update.");
      return;
    }

    const payload = {
      categoryId: formData.selectedCategoryId,
      roomAssigned: formData.roomAssigned,
      guestDetails: {
        salutation: formData.salutation || undefined,
        name: formData.guestName || undefined,
        // Assuming age and gender might be added to form in future if needed
        // age: Number(formData.age) || undefined,
        // gender: formData.gender || undefined,
      },
      contactDetails: {
        phone: formData.phoneNo || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        nationality: formData.nationality || undefined, // Adding nationality to contactDetails based on API structure
        // state: formData.state || undefined, // If you add state to form
        // country: formData.country || undefined, // If you add country to form
        // pinCode: formData.pinCode || undefined // If you add pinCode to form
      },
      identityDetails: {
        idType: formData.idType || undefined,
        idNumber: formData.idNumber || undefined,
        idPhotoFront: formData.idImages[0] || undefined,
        idPhotoBack: formData.idImages[1] || undefined,
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
        rate: Number(formData.rate) || undefined, // Added rate to payment details
      },
    };

    // Clean up payload to remove empty strings/undefined for optional fields if API expects absence
    Object.keys(payload).forEach(key => {
        if (typeof payload[key] === 'object' && payload[key] !== null) {
            Object.keys(payload[key]).forEach(subKey => {
                if (payload[key][subKey] === "" || payload[key][subKey] === undefined) {
                    delete payload[key][subKey];
                }
            });
            if (Object.keys(payload[key]).length === 0) {
                delete payload[key];
            }
        } else if (payload[key] === "" || payload[key] === undefined) {
            delete payload[key];
        }
    });


    try {
      const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`, {
        method: "PUT", // Changed to PUT method for updates
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if ((res.ok && data && data.booking) || (data && data.success === true)) {
        setMessage("Booking updated successfully!");
        if (onUpdateSuccess) {
          onUpdateSuccess(data.booking);
        }
      } else {
        console.error("Booking update failed:", data);
        setMessage(`Booking update failed: ${typeof data.error === 'string' ? data.error : JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Error submitting booking update:", error);
      setMessage(`Error submitting booking update: ${error.message}.`);
    }
  };

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
        console.error("Error accessing camera: ", err);
        setMessage("Could not access camera. Please ensure camera permissions are granted.");
      }
    }, 100);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="w-full p-6 rounded-2xl shadow-md border border-[color:var(--color-border)] text-[color:var(--color-text)]">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-[color:var(--color-text)] flex items-center justify-center gap-3">
        <FaRegEdit className="text-purple-600" /> Update Booking Form
      </h2>

      {message && (
        <div className={`px-4 py-3 rounded relative mb-4 mx-auto max-w-3xl ${message.includes("successful") ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"}`} role="alert">
          <span className="block sm:inline">{message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage(null)}>
            <FaTimes className="fill-current h-6 w-6" role="button" />
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Guest Details Section */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
            <FaUser className="text-amber-400" /> Guest Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* GRC No. Field - Always visible and read-only */}
            <InputWithIcon
              icon={<FaRegAddressCard />}
              type="text"
              name="grcNo"
              placeholder="GRC No."
              value={formData.grcNo || ''}
              readOnly={true}
              inputClassName="bg-gray-100 border border-secondary rounded-lg cursor-not-allowed"
              className="col-span-full md:col-span-1"
            />
            <div className="relative flex items-center">
              <FaUser className="absolute left-3 text-gray-400 pointer-events-none" />
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

            <InputWithIcon icon={<FaUser />} type="text" placeholder="Guest Name" onChange={(e) => handleChange("guestName", e.target.value)} value={formData.guestName || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaGlobe />} type="text" placeholder="Nationality" onChange={(e) => handleChange("nationality", e.target.value)} value={formData.nationality || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaCity />} type="text" placeholder="City" onChange={(e) => handleChange("city", e.target.value)} value={formData.city || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaMapMarkedAlt />} type="text" placeholder="Address" onChange={(e) => handleChange("address", e.target.value)} value={formData.address || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaPhone />} type="text" placeholder="Phone No" onChange={(e) => handleChange("phoneNo", e.target.value)} value={formData.phoneNo || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaMobileAlt />} type="text" placeholder="Mobile No" onChange={(e) => handleChange("mobileNo", e.target.value)} value={formData.mobileNo || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaEnvelope />} type="email" placeholder="Email" onChange={(e) => handleChange("email", e.target.value)} value={formData.email || ''} inputClassName="bg-white border border-secondary rounded-lg" />
          </div>
        </section>

        {/* Contact Details Section */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
            <FaAddressBook className="text-amber-400" /> Contact Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <InputWithIcon icon={<FaUser />} type="text" placeholder="Contact Person" onChange={(e) => handleChange("contactPerson", e.target.value)} value={formData.contactPerson || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaMobileAlt />} type="text" placeholder="Contact Mobile No" onChange={(e) => handleChange("contactMobile", e.target.value)} value={formData.contactMobile || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaEnvelope />} type="email" placeholder="Contact Email" onChange={(e) => handleChange("contactEmail", e.target.value)} value={formData.contactEmail || ''} inputClassName="bg-white border border-secondary rounded-lg" />
          </div>
        </section>

        {/* Identity Details Section */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
            <FaIdCard className="text-amber-400" /> Identity Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative flex items-center">
              <FaIdCard className="absolute left-3 text-gray-400 pointer-events-none" />
              <select
                className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                onChange={e => handleChange("idType", e.target.value)}
                value={formData.idType || ""}
              >
                <option value="">Select ID Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <InputWithIcon icon={<FaIdCard />} type="text" placeholder="ID Number" onChange={(e) => handleChange("idNumber", e.target.value)} value={formData.idNumber || ''} inputClassName="bg-white border border-secondary rounded-lg" />
          </div>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <input
              type="file"
              id="idImageUpload"
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
              className="px-4 py-2 bg-[color:var(--color-primary)] text-white font-semibold rounded-md shadow-md hover:bg-[color:var(--color-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => document.getElementById('idImageUpload').click()}
            >
              Upload Image
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[color:var(--color-primary)] text-white font-semibold rounded-md shadow-md hover:bg-[color:var(--color-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={startCamera}
            >
              Use Camera
            </button>
          </div>
          {showCamera && (
            <div className="mt-6 p-4 border border-[color:var(--color-border)] rounded-md flex flex-col items-center bg-gray-50">
              <video ref={videoRef} className="w-full max-w-md rounded-md" autoPlay playsInline></video>
              <button
                type="button"
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all"
                onClick={capturePhoto}
              >
                Capture Photo
              </button>
              <button
                type="button"
                className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all"
                onClick={stopCamera}
              >
                Close Camera
              </button>
            </div>
          )}
          {formData.idImages && formData.idImages.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {formData.idImages.map((img, idx) => (
                <div key={idx} className="relative inline-block">
                  <img src={img} alt={`ID Proof ${idx + 1}`} className="max-w-xs h-auto rounded-md border-2 border-[color:var(--color-primary)]/30" />
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
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
            <FaFileInvoiceDollar className="text-amber-400" /> Booking Info
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Room Category Dropdown */}
            <div className="relative flex items-center">
              <FaRegListAlt className="absolute left-3 text-gray-400 pointer-events-none" />
              <div className="w-full">
                {categoryFetchError ? (
                  <div className="text-red-600 font-semibold mb-2">Error loading categories: {categoryFetchError}</div>
                ) : null}
                {categories.length === 0 && !categoryFetchError ? (
                  <div className="text-yellow-600 font-semibold mb-2">No categories found.</div>
                ) : null}
                <Select
                  options={categories.map(category => ({
                    value: category._id,
                    label: category.name
                  }))}
                  value={categories.find(c => c._id === formData.selectedCategoryId) ? {
                    value: formData.selectedCategoryId,
                    label: categories.find(c => c._id === formData.selectedCategoryId).name
                  } : null}
                  onChange={option => {
                    handleChange("selectedCategoryId", option ? option.value : "");
                    // Clear selected room when category changes
                    handleChange("roomAssigned", "");
                  }}
                  placeholder="Select Room Category"
                  menuPlacement="bottom"
                  isClearable
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-secondary)',
                      borderWidth: '1px',
                      borderRadius: '0.5rem',
                      boxShadow: state.isFocused ? '0 0 0 2px var(--color-primary)' : base.boxShadow,
                      outline: state.isFocused ? '2px solid var(--color-primary)' : base.outline,
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      minHeight: '44px',
                      width: '100%',
                    }),
                    input: (base) => ({ ...base, color: 'var(--color-text)' }),
                    menu: (base) => ({ ...base, width: '100%', zIndex: 50 }),
                    option: (base, state) => ({
                      ...base,
                      cursor: 'pointer',
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      backgroundColor: state.isSelected
                        ? 'var(--color-primary)'
                        : state.isFocused
                        ? 'rgba(245, 158, 66, 0.1)'
                        : 'white',
                      color: state.isSelected
                        ? 'white'
                        : state.isFocused
                        ? 'var(--color-primary)'
                        : 'var(--color-text)',
                    }),
                  }}
                />
              </div>
            </div>

            {/* Room Dropdown: now filtered by selected category */}
            <div className="relative flex items-center">
              <FaDoorOpen className="absolute left-3 text-gray-400 pointer-events-none" />
              <div className="w-full">
                {roomFetchError ? (
                  <div className="text-red-600 font-semibold mb-2">Error loading rooms: {roomFetchError}</div>
                ) : null}
                {filteredRooms.length === 0 && !roomFetchError ? (
                  <div className="text-yellow-600 font-semibold mb-2">No rooms found for selected category.</div>
                ) : null}
                <Select
                  options={filteredRooms
                    .map(room => ({
                      value: room._id,
                      label: `${room.title} (#${room.room_number}) [${room.status}]`
                    }))}
                  value={(() => {
                    const selectedRoom = filteredRooms.find(room => room._id === formData.roomAssigned);
                    return selectedRoom ? {
                      value: selectedRoom._id,
                      label: `${selectedRoom.title} (#${selectedRoom.room_number}) [${selectedRoom.status}]`
                    } : null;
                  })()}
                  onChange={option => {
                    const roomId = option ? option.value : "";
                    handleChange("roomAssigned", roomId);
                  }}
                  placeholder="Select Room"
                  menuPlacement="bottom"
                  isClearable
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-secondary)',
                      borderWidth: '1px',
                      borderRadius: '0.5rem',
                      boxShadow: state.isFocused ? '0 0 0 2px var(--color-primary)' : base.boxShadow,
                      outline: state.isFocused ? '2px solid var(--color-primary)' : base.outline,
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      minHeight: '44px',
                      width: '100%',
                    }),
                    input: (base) => ({ ...base, color: 'var(--color-text)' }),
                    menu: (base) => ({ ...base, width: '100%', zIndex: 50 }),
                    option: (base, state) => ({
                      ...base,
                      cursor: 'pointer',
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      backgroundColor: state.isSelected
                        ? 'var(--color-primary)'
                        : state.isFocused
                        ? 'rgba(245, 158, 66, 0.1)'
                        : 'white',
                      color: state.isSelected
                        ? 'white'
                        : state.isFocused
                        ? 'var(--color-primary)'
                        : 'var(--color-text)',
                    }),
                  }}
                />
              </div>
            </div>

            <div className="relative flex items-center">
              <FaInfoCircle className="absolute left-3 text-gray-400 pointer-events-none" />
              <select
                className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                onChange={e => handleChange("reservationType", e.target.value)}
                value={formData.reservationType || ""}
              >
                <option value="">Select Reservation Type</option>
                <option value="Online">Online</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Agent">Agent</option>
              </select>
            </div>

            <InputWithIcon icon={<FaCalendarAlt />} type="date" placeholder="Check-In Date" onChange={(e) => handleChange("checkInDate", e.target.value)} value={formData.checkInDate || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaClock />} type="time" placeholder="Check-In Time" onChange={(e) => handleChange("checkInTime", e.target.value)} value={formData.checkInTime || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaCalendarAlt />} type="date" placeholder="Check-Out Date" onChange={(e) => handleChange("checkOutDate", e.target.value)} value={formData.checkOutDate || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaClock />} type="time" placeholder="Check-Out Time" onChange={(e) => handleChange("checkOutTime", e.target.value)} value={formData.checkOutTime || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaUsers />} type="number" placeholder="No. of Rooms" onChange={(e) => handleChange("noOfRooms", e.target.value)} value={formData.noOfRooms || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaUsers />} type="number" placeholder="No. of Adults" onChange={(e) => handleChange("noOfAdults", e.target.value)} value={formData.noOfAdults || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaUsers />} type="number" placeholder="No. of Children" onChange={(e) => handleChange("noOfChildren", e.target.value)} value={formData.noOfChildren || ''} inputClassName="bg-white border border-secondary rounded-lg" />
          </div>
        </section>

        {/* Payment Details Section */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
            <FaMoneyCheckAlt className="text-amber-400" /> Payment Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <InputWithIcon icon={<FaMoneyCheckAlt />} type="number" placeholder="Rate" onChange={(e) => handleChange("rate", e.target.value)} value={formData.rate || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaMoneyCheckAlt />} type="number" placeholder="Total Amount" onChange={(e) => handleChange("totalAmount", e.target.value)} value={formData.totalAmount || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaMoneyCheckAlt />} type="number" placeholder="Advance Amount" onChange={(e) => handleChange("advanceAmount", e.target.value)} value={formData.advanceAmount || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <div className="relative flex items-center">
              <FaCreditCard className="absolute left-3 text-gray-400 pointer-events-none" />
              <select
                className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                onChange={e => handleChange("paymentMode", e.target.value)}
                value={formData.paymentMode || ""}
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
            <FaInfoCircle className="text-amber-400" /> Additional Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <InputWithIcon icon={<FaRegMap />} type="text" placeholder="Arrival From" onChange={(e) => handleChange("arrivalFrom", e.target.value)} value={formData.arrivalFrom || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaSuitcase />} type="text" placeholder="Purpose of Visit" onChange={(e) => handleChange("purposeOfVisit", e.target.value)} value={formData.purposeOfVisit || ''} inputClassName="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaComments />} type="textarea" placeholder="Remarks" onChange={(e) => handleChange("remarks", e.target.value)} value={formData.remarks || ''} className="md:col-span-2" inputClassName="bg-white border border-secondary rounded-lg resize-y" />
          </div>
        </section>

        {/* Form Submission Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="submit"
            className="px-8 py-3 bg-[color:var(--color-confirm-button)] text-white font-bold rounded-lg shadow-lg hover:bg-[color:var(--color-confirm-button-hover)] transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <FaCheckCircle /> Update Booking
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBookingForm;