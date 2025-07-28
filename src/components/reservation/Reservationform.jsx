
import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaUser, FaDoorOpen, FaBed, FaCreditCard, FaInfoCircle, FaHotel, FaCar, FaAddressCard, FaBuilding, FaPhone, FaEnvelope, FaCity, FaGlobe, FaIdCard, FaRegMoneyBillAlt, FaRegStickyNote, FaRegClock, FaRegListAlt, FaRegCheckCircle, FaRegTimesCircle, FaRegUserCircle, FaRegCreditCard, FaRegStar, FaRegFlag, FaRegEdit, FaRegClone, FaRegCommentDots, FaRegFileAlt, FaRegCalendarPlus, FaRegCalendarCheck, FaRegCalendarTimes, FaRegCalendar, FaRegUser, FaRegAddressBook, FaRegBell, FaRegMap, FaRegBuilding, FaTimes } from "react-icons/fa"; // Added FaTimes for the close button
import { useNavigate } from "react-router-dom";
// Define InputWithIcon component directly within this file
const InputWithIcon = ({ icon, type, name, placeholder, value, onChange, className, required, min, max, step, readOnly }) => {
  return (
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3 text-gray-400 pointer-events-none">{icon}</div>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pl-10 pr-4 py-2 w-full ${className}`} // Merges passed className with base styles
        required={required}
        min={min}
        max={max}
        step={step}
        readOnly={readOnly} // Added readOnly prop
      />
    </div>
  );
};

// --- ReservationEdit Component (Now included in the same file) ---
const ReservationEdit = ({ room, onClose, onSaveSuccess }) => {
  const [editFormData, setEditFormData] = useState({
    title: '',
    room_number: '',
    price: 0,
    status: '',
    // Removed: description: '',
    category: '', // Assuming category is also editable
    capacity: 0,
    // Removed: amenities: [],
    // Removed: images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]); 
  const [formData, setFormData] = useState([]);// For category dropdown in edit form


  useEffect(() => {
    if (room) {
      // Initialize form with current room data
      setEditFormData({
        title: room.title || '',
        room_number: room.room_number || '',
        price: room.price || 0,
        status: room.status || '',
        // Removed: description: '',
        category: room.category?._id || '', // Use _id if category is an object
        capacity: room.capacity || 0,
        // Removed: amenities: [],
        // Removed: images: [],
      });
    }

    // Fetch categories for the dropdown in the edit form
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://backend-hazel-xi.vercel.app/api/categories/all", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setCategories(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching categories for edit form:", err));
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Removed handleAmenityChange

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://backend-hazel-xi.vercel.app/api/rooms/${room._id}`, {
        method: 'PUT', // Or PATCH, depending on your API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Call the parent's success handler to refresh data and close modal
        onSaveSuccess();
      } else {
        setError(result.message || 'Failed to update room.');
      }
    } catch (err) {
      setError(err.message || 'Network error during room update.');
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null; // Don't render if no room is passed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Room: {room.room_number}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Room Title</label>
              <InputWithIcon
                icon={<FaBed />}
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="room_number" className="block text-sm font-medium text-gray-700">Room Number</label>
              <InputWithIcon
                icon={<FaDoorOpen />}
                type="text"
                name="room_number"
                value={editFormData.room_number}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
              <InputWithIcon
                icon={<FaRegMoneyBillAlt />}
                type="number"
                name="price"
                value={editFormData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <div className="relative flex items-center mt-1">
                <FaRegCheckCircle className="absolute left-3 text-gray-400 pointer-events-none" />
                
                <div className="mb-4">
  <label className="block text-sm font-medium mb-1">Status</label>
  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-md"
    required
  >
    <option value="Confirmed">Confirmed</option>
    <option value="Tentative">Tentative</option>
    <option value="Waiting">Waiting</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</div>
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <div className="relative flex items-center mt-1">
                <FaBed className="absolute left-3 text-gray-400 pointer-events-none" />
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
              <InputWithIcon
                icon={<FaUser />}
                type="number"
                name="capacity"
                value={editFormData.capacity}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Removed: Description Textarea */}
          {/* Removed: Amenities Checkboxes */}
          {/* Removed: Image URLs Textarea */}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2 text-center">Room updated successfully!</p>}
        </form>
      </div>
    </div>
  );
};


// --- ReservationForm Component ---
const initialFormData = {
  // grcNo will be autofilled by backend, so it's not part of initial submission data
  bookingRefNo: "",
  reservationType: "",

  category: "", // This will be the ID of the selected category
  bookingDate: new Date().toISOString().split('T')[0], // Default to current date
  status: "Confirmed",

  salutation: "",
  guestName: "",
  nationality: "",
  city: "",
  address: "",
  phoneNo: "",
  mobileNo: "",
  email: "",
  companyName: "",
  gstApplicable: true,
  companyGSTIN: "",

  roomHoldStatus: "Pending",
  roomAssigned: "", // This will be the ID of the selected room
  roomHoldUntil: "", // Should be a date/time string, e.g., "2025-07-25T12:00:00.000Z"
  checkInDate: "",
  checkInTime: "14:00",
  checkOutDate: "",
  checkOutTime: "12:00",
  noOfRooms: 1,
  noOfAdults: 0,
  noOfChildren: 0,
  planPackage: "",
  rate: 0,

  arrivalFrom: "",
  purposeOfVisit: "",

  roomPreferences: {
    smoking: false,
    bedType: ""
  },

  specialRequests: "",
  remarks: "",
  billingInstruction: "",

  paymentMode: "",
  refBy: "",
  advancePaid: 0,
  isAdvancePaid: false,
  transactionId: "",
  discountPercent: 0,

  vehicleDetails: {
    vehicleNumber: "",
    vehicleType: "",
    vehicleModel: "",
    driverName: "",
    driverMobile: ""
  },

  vip: false,
  isForeignGuest: false,
  createdBy: "",

  linkedCheckInId: "",
  cancellationReason: "",
  cancelledBy: "",
  isNoShow: false,
};

const ReservationForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState([]); // For category dropdown
  const [allRooms, setAllRooms] = useState([]); // Store all rooms fetched from API
  const [filteredRooms, setFilteredRooms] = useState([]); // Rooms filtered by category
  const [roomFetchError, setRoomFetchError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', 'submitting'
  const [responseMessage, setResponseMessage] = useState(''); // Message to display to user
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null); // To store details of the selected room for display

  // State for Edit Room Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);

  // Function to fetch all rooms (can be called to refresh data)
  const fetchAllRooms = async () => {
    setRoomFetchError(null); // Clear previous errors
    const token = localStorage.getItem("token");
    if (!token) {
      setRoomFetchError("Authentication token not found. Please log in.");
      return;
    }

    try {
      const res = await fetch("https://backend-hazel-xi.vercel.app/api/rooms/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = await res.json();
      setAllRooms(data || []);
    } catch (error) {
      setRoomFetchError(error.message || "Unknown error fetching rooms");
      setAllRooms([]);
    }
  };

  useEffect(() => {
    const getAuthToken = () => localStorage.getItem("token");
    const token = getAuthToken();
    if (!token) {
      console.error("No authentication token found. User might not be logged in.");
      return;
    }

    // Fetch categories
    fetch("https://backend-hazel-xi.vercel.app/api/categories/all", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(error => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });

    // Initial fetch of all rooms
    fetchAllRooms();
  }, []);

  // Effect to filter rooms whenever category or allRooms changes
  useEffect(() => {
    if (formData.category && allRooms.length > 0) {
      // Filtering to show ALL rooms of the selected category, regardless of status
      const roomsOfSelectedCategory = allRooms.filter(room =>
        room.category && room.category._id === formData.category
      );
      setFilteredRooms(roomsOfSelectedCategory);

      // Update selected room details if category changes or selected room status changes
      if (selectedRoomDetails) {
        const updatedSelectedRoom = roomsOfSelectedCategory.find(room => room._id === selectedRoomDetails._id);
        if (updatedSelectedRoom) {
          setSelectedRoomDetails(updatedSelectedRoom); // Keep details updated
        } else {
          // If previously selected room is no longer in filtered list, clear it
          setFormData(prev => ({ ...prev, roomAssigned: "" }));
          setSelectedRoomDetails(null);
        }
      } else if (formData.roomAssigned && !roomsOfSelectedCategory.some(room => room._id === formData.roomAssigned)) {
        // If a room was selected but is no longer in the filtered list (e.g., category changed), clear it
        setFormData(prev => ({ ...prev, roomAssigned: "" }));
        setSelectedRoomDetails(null);
      }
    } else {
      setFilteredRooms([]); // Clear filtered rooms if no category is selected
      setFormData(prev => ({ ...prev, roomAssigned: "" })); // Also clear selected room
      setSelectedRoomDetails(null); // Clear selected room details
    }
  }, [formData.category, allRooms, selectedRoomDetails]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("roomPreferences.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        roomPreferences: {
          ...prev.roomPreferences,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith("vehicleDetails.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          [key]: value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTextarea = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomSelect = (room) => {
    // Only allow selection if the room is 'available' for a new reservation
    if (room.status === 'available') {
      setFormData(prev => ({ ...prev, roomAssigned: room._id }));
      setSelectedRoomDetails(room); // Store all details for display
    } else {
      alert(`Room ${room.title} (#${room.room_number}) is currently ${room.status}. You cannot select it for a new reservation.`);
    }
  };

  const handleEditRoom = (room) => {
    setRoomToEdit(room);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setRoomToEdit(null);
  };

  const handleRoomSaveSuccess = () => {
    // Re-fetch all rooms after a successful edit to update the table and selected room details
    fetchAllRooms();
    handleCloseEditModal(); // Close the modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    setResponseMessage('');

    const dataToSubmit = { ...formData };
    delete dataToSubmit.grcNo;

    if (!dataToSubmit.roomAssigned) {
        setSubmissionStatus('error');
        setResponseMessage('Please select a room.');
        return;
    }

    // Auto-fill rate based on selected room if not manually set and selectedRoomDetails exists
    if (selectedRoomDetails && dataToSubmit.rate === 0) { // Only auto-fill if rate is 0 (default)
        dataToSubmit.rate = selectedRoomDetails.price;
    }

    if (dataToSubmit.linkedCheckInId === "") delete dataToSubmit.linkedCheckInId;
    if (dataToSubmit.reservationType === "") delete dataToSubmit.reservationType;

    if (dataToSubmit.bookingDate) {
        dataToSubmit.bookingDate = new Date(dataToSubmit.bookingDate).toISOString();
    }
    // Correctly format roomHoldUntil if it exists
    if (dataToSubmit.roomHoldUntil) {
        // Assuming roomHoldUntil is just a date from the form
        dataToSubmit.roomHoldUntil = new Date(`${dataToSubmit.roomHoldUntil}T12:00:00.000Z`).toISOString();
    }

    const getAuthToken = () => localStorage.getItem("token");
    const token = getAuthToken();
    if (!token) {
      setSubmissionStatus('error');
      setResponseMessage('Authentication token missing. Please log in.');
      return;
    }

    try {
      const response = await fetch("https://backend-hazel-xi.vercel.app/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSubmit),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionStatus('success');
        setResponseMessage(`Reservation created successfully! GRC No: ${result.grcNo || 'N/A'}`);
        setFormData(initialFormData);
        setSelectedRoomDetails(null); // Clear selected room details after submission
        fetchAllRooms(); // Re-fetch rooms to update their statuses (e.g., the selected room is now booked)
      } else {
        setSubmissionStatus('error');
        setResponseMessage(`Error: ${result.message || 'Something went wrong.'}`);
        console.error("Submission error:", result);
      }
    } catch (error) {
      setSubmissionStatus('error');
      setResponseMessage(`Network error: ${error.message}`);
      console.error("Network error during submission:", error);
    }
  };

  return (
    <div className="w-full p-6 rounded-2xl shadow-md border border-[color:var(--color-border)] text-[color:var(--color-text)]">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-[color:var(--color-text)] flex items-center justify-center gap-3">
        Reservation Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Reservation Details */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
            <FaCalendarAlt className="text-amber-400" /> Reservation Details
          </h3>
           <div className="grid md:grid-cols-3 gap-6">
           
            {/* <InputWithIcon icon={<FaAddressCard />} type="text" name="grcNo" placeholder="GRC No (Auto-generated)" value={formData.grcNo} onChange={() => {}} readOnly className="bg-gray-100 border border-secondary rounded-lg cursor-not-allowed" /> */}
            <InputWithIcon icon={<FaRegListAlt />} type="text" name="bookingRefNo" placeholder="Booking Ref No" value={formData.bookingRefNo} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <div className="relative flex items-center">
              <FaRegListAlt className="absolute left-3 text-gray-400 pointer-events-none" />
              <select name="reservationType" value={formData.reservationType} onChange={handleChange} className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full">
                <option value="">Reservation Type</option>
                <option value="Online">Online</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Agent">Agent</option>
              </select>
            </div>  

            {/* Category Dropdown */}
            <div className="relative flex items-center">
                <FaBed className="absolute left-3 text-gray-400 pointer-events-none" />
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Display Selected Room */}
            <InputWithIcon
              icon={<FaDoorOpen />}
              type="text"
              name="selectedRoomDisplay"
              placeholder="Selected Room"
              value={selectedRoomDetails ? `${selectedRoomDetails.title} (#${selectedRoomDetails.room_number})` : ''}
              readOnly
              className="bg-gray-100 border border-secondary rounded-lg cursor-not-allowed"
            />
            {/* Hidden input for roomAssigned, updated via handleRoomSelect */}
            <input type="hidden" name="roomAssigned" value={formData.roomAssigned} />


            <InputWithIcon icon={<FaRegCalendarPlus />} type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <div className="relative flex items-center">
              <FaRegCheckCircle className="absolute left-3 text-gray-400 pointer-events-none" />
              <select name="status" value={formData.status} onChange={handleChange} className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full">
                <option value="Confirmed">Confirmed</option>
                <option value="Tentative">Tentative</option>
                <option value="Waiting">Waiting</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Room Availability Table */}
          <div className="mt-6 p-4 border border-[color:var(--color-border)] rounded-lg shadow-inner bg-gray-50">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaHotel className="text-amber-400" /> All Rooms for Selected Category
            </h4>
            {roomFetchError ? (
              <div className="text-red-600 font-semibold mb-2">{roomFetchError}</div>
            ) : !formData.category ? (
              <div className="text-gray-600">Please select a category above to see rooms.</div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-yellow-600 font-semibold">No rooms found for this category.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> {/* Changed to Actions */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRooms.map(room => (
                      <tr key={room._id} className={formData.roomAssigned === room._id ? "bg-amber-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{room.room_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{room.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            room.status === 'available' ? 'bg-green-100 text-green-800' :
                            room.status === 'booked' ? 'bg-red-100 text-red-800' :
                            room.status === 'maintenance' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {room.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          {formData.roomAssigned === room._id ? (
                            <span className="text-green-600 flex items-center gap-1">
                                <FaRegCheckCircle /> Selected
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRoomSelect(room)}
                              className="text-[color:var(--color-primary)] hover:text-[color:var(--color-hover)] px-3 py-1 rounded-md border border-[color:var(--color-primary)] hover:border-[color:var(--color-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={room.status !== 'available'}
                            >
                              Select
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEditRoom(room)}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md border border-blue-600 hover:border-blue-800 transition-colors flex items-center gap-1"
                          >
                            <FaRegEdit /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
        {/* Guest Details */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2  text-[color:var(--color-text)]">
            <FaUser className="text-amber-400" /> Guest Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <InputWithIcon icon={<FaUser />} type="text" name="guestName" placeholder="Guest Name *" value={formData.guestName} onChange={handleChange} required className="bg-white border border-secondary rounded-lg md:col-span-2" />
            <InputWithIcon icon={<FaRegUser />} type="text" name="salutation" placeholder="Salutation" value={formData.salutation} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaGlobe />} type="text" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaCity />} type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegAddressBook />} type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="bg-white border border-secondary rounded-lg md:col-span-3" />
            <InputWithIcon icon={<FaPhone />} type="text" name="phoneNo" placeholder="Phone No" value={formData.phoneNo} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaPhone />} type="text" name="mobileNo" placeholder="Mobile No" value={formData.mobileNo} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaEnvelope />} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaBuilding />} type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaIdCard />} type="text" name="companyGSTIN" placeholder="Company GSTIN" value={formData.companyGSTIN} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <div className="flex items-center gap-2 md:col-span-3 mt-2">
              <input type="checkbox" name="gstApplicable" id="gstApplicable" checked={formData.gstApplicable} onChange={handleChange} className="form-checkbox" />
              <label htmlFor="gstApplicable" className="text-sm">GST Applicable</label>
            </div>
          </div>
        </section>
        {/* Stay Info */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2  text-[color:var(--color-text)]">
            <FaBed className="text-amber-400" /> Stay Info
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative flex items-center">
              <FaRegCheckCircle className="absolute left-3 text-gray-400 pointer-events-none" />
              <select name="roomHoldStatus" value={formData.roomHoldStatus} onChange={handleChange} className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full">
                <option value="Pending">Pending</option>
                <option value="Held">Held</option>
                <option value="Released">Released</option>
              </select>
            </div>
            {/* roomAssigned input is now hidden, managed by handleRoomSelect */}
            <InputWithIcon icon={<FaRegClone />} type="text" name="roomAssignedDisplay" placeholder="Room Assigned ID (Selected from table)" value={formData.roomAssigned} onChange={() => {}} readOnly className="bg-gray-100 border border-secondary rounded-lg cursor-not-allowed" />
            <InputWithIcon icon={<FaRegCalendarTimes />} type="date" name="roomHoldUntil" value={formData.roomHoldUntil} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegCalendarCheck />} type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegClock />} type="time" name="checkInTime" value={formData.checkInTime} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegCalendarCheck />} type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegClock />} type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegListAlt />} type="number" name="noOfRooms" placeholder="No. of Rooms" value={formData.noOfRooms} onChange={handleChange} min="1" className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegUserCircle />} type="number" name="noOfAdults" placeholder="No. of Adults" value={formData.noOfAdults} onChange={handleChange} min="0" className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegUserCircle />} type="number" name="noOfChildren" placeholder="No. of Children" value={formData.noOfChildren} onChange={handleChange} min="0" className="bg-white border border-secondary rounded-lg" />
            {/* planPackage: Consider making this a select with actual plans */}
            <InputWithIcon icon={<FaRegListAlt />} type="text" name="planPackage" placeholder="Plan/Package (EP, CP, MAP, etc.)" value={formData.planPackage} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegMoneyBillAlt />} type="number" name="rate" placeholder="Rate (Total)" value={formData.rate} onChange={handleChange} min="0" step="0.01" className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegMap />} type="text" name="arrivalFrom" placeholder="Arrival From" value={formData.arrivalFrom} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegListAlt />} type="text" name="purposeOfVisit" placeholder="Purpose of Visit" value={formData.purposeOfVisit} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <div className="flex items-center gap-2">
              <input type="checkbox" name="roomPreferences.smoking" id="smoking" checked={formData.roomPreferences.smoking} onChange={handleChange} className="form-checkbox" />
              <label htmlFor="smoking" className="text-sm">Smoking Room Preference</label>
            </div>
            <div className="relative flex items-center">
              <FaRegListAlt className="absolute left-3 text-gray-400 pointer-events-none" />
              <select name="roomPreferences.bedType" value={formData.roomPreferences.bedType} onChange={handleChange} className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full">
                <option value="">Bed Type Preference</option>
                <option value="King">King</option>
                <option value="Queen">Queen</option>
                <option value="Twin">Twin</option>
                <option value="Double">Double</option>
              </select>
            </div>
            <div className="relative flex items-start">
              <FaRegCommentDots className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <textarea name="specialRequests" placeholder="Special Requests" value={formData.specialRequests} onChange={e => handleTextarea('specialRequests', e.target.value)} className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full h-20" />
            </div>
            <div className="relative flex items-start">
              <FaRegStickyNote className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <textarea name="remarks" placeholder="Remarks" value={formData.remarks} onChange={e => handleTextarea('remarks', e.target.value)} className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full h-20" />
            </div>
            <div className="relative flex items-start">
              <FaRegFileAlt className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <textarea name="billingInstruction" placeholder="Billing Instruction" value={formData.billingInstruction} onChange={e => handleTextarea('billingInstruction', e.target.value)} className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full h-20" />
            </div>
          </div>
        </section>
        {/* Payment Info */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2  text-[color:var(--color-text)]">
            <FaCreditCard className="text-amber-400" /> Payment Info
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <InputWithIcon icon={<FaRegCreditCard />} type="text" name="paymentMode" placeholder="Payment Mode" value={formData.paymentMode} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegUser />} type="text" name="refBy" placeholder="Referred By" value={formData.refBy} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegMoneyBillAlt />} type="number" name="advancePaid" placeholder="Advance Paid" value={formData.advancePaid} onChange={handleChange} min="0" step="0.01" className="bg-white border border-secondary rounded-lg" />
            <div className="flex items-center gap-2">
              <input type="checkbox" name="isAdvancePaid" id="isAdvancePaid" checked={formData.isAdvancePaid} onChange={handleChange} className="form-checkbox" />
              <label htmlFor="isAdvancePaid" className="text-sm">Advance Paid Confirmed</label>
            </div>
            <InputWithIcon icon={<FaRegListAlt />} type="text" name="transactionId" placeholder="Transaction ID" value={formData.transactionId} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegStar />} type="number" name="discountPercent" placeholder="Discount %" value={formData.discountPercent} onChange={handleChange} min="0" max="100" className="bg-white border border-secondary rounded-lg" />
          </div>
        </section>
        {/* Vehicle Details */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2  text-[color:var(--color-text)]">
            <FaCar className="text-amber-400" /> Vehicle Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <InputWithIcon icon={<FaCar />} type="text" name="vehicleDetails.vehicleNumber" placeholder="Vehicle Number" value={formData.vehicleDetails.vehicleNumber} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaCar />} type="text" name="vehicleDetails.vehicleType" placeholder="Vehicle Type" value={formData.vehicleDetails.vehicleType} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaCar />} type="text" name="vehicleDetails.vehicleModel" placeholder="Vehicle Model" value={formData.vehicleDetails.vehicleModel} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaRegUser />} type="text" name="vehicleDetails.driverName" placeholder="Driver Name" value={formData.vehicleDetails.driverName} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
            <InputWithIcon icon={<FaPhone />} type="text" name="vehicleDetails.driverMobile" placeholder="Driver Mobile" value={formData.vehicleDetails.driverMobile} onChange={handleChange} className="bg-white border border-secondary rounded-lg" />
          </div>
        </section>

        {/* Additional Details */}
        {/* <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2  text-[color:var(--color-text)]">
            <FaInfoCircle className="text-amber-400" /> Other Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="vip" id="vip" checked={formData.vip} onChange={handleChange} className="form-checkbox" />
              <label htmlFor="vip" className="text-sm">VIP Guest</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="isForeignGuest" id="isForeignGuest" checked={formData.isForeignGuest} onChange={handleChange} className="form-checkbox" />
              <label htmlFor="isForeignGuest" className="text-sm">Foreign Guest</label>
            </div>
            <InputWithIcon icon={<FaRegUser />} type="text" name="createdBy" placeholder="Created By" value={formData.createdBy} onChange={handleChange} className="bg-gray-100 border border-secondary rounded-lg cursor-not-allowed" readOnly />
          </div>
        </section> */}
        {/* Additional Details */}
<section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
    <FaInfoCircle className="text-amber-400" /> Other Details
  </h3>
  <div className="grid md:grid-cols-3 gap-6">
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        name="vip"
        id="vip"
        checked={formData.vip}
        onChange={handleChange}
        className="form-checkbox"
      />
      <label htmlFor="vip" className="text-sm">VIP Guest</label>
    </div>

    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        name="isForeignGuest"
        id="isForeignGuest"
        checked={formData.isForeignGuest}
        onChange={handleChange}
        className="form-checkbox"
      />
      <label htmlFor="isForeignGuest" className="text-sm">Foreign Guest</label>
    </div>

    {/* Created By Dropdown */}
    <div className="flex items-center gap-2">
      <FaRegUser className="text-gray-500" />
      <select
        name="createdBy"
        value={formData.createdBy}
        onChange={handleChange}
        className="w-full bg-gray-100 border border-secondary rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Select Created By</option>
        <option value="Admin">Admin</option>
        <option value="Frontdesk">Frontdesk</option>
      </select>
    </div>
  </div>
</section>


        {/* Submission and Status */}
        {/* <div className="flex justify-center mt-8">
          <button type="submit" className="px-8 py-3 bg-[color:var(--color-primary)] text-white font-semibold rounded-lg shadow-md hover:bg-[color:var(--color-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={submissionStatus === 'submitting'}>
            {submissionStatus === 'submitting' ? 'Submitting...' : 'Create Reservation'}
          </button>
        </div> */}
{/* Submission and Status */}
<div className="flex justify-end gap-4 mt-8">
  <button
    type="button"
   // Make sure to define this function in your component
    className="px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
  >
    Cancel
  </button>

  <button
    type="submit"
    className="px-8 py-3 bg-[color:var(--color-primary)] text-white font-semibold rounded-lg shadow-md hover:bg-[color:var(--color-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    disabled={submissionStatus === 'submitting'}
  >
    {submissionStatus === 'submitting' ? 'Submitting...' : 'Create Reservation'}
  </button>
</div>

        {submissionStatus && (
          <div className={`mt-4 p-3 rounded-md text-center ${submissionStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {responseMessage}
          </div>
        )}
      </form>

      {/* ReservationEdit Modal (still rendered conditionally) */}
      {isEditModalOpen && roomToEdit && (
        <ReservationEdit
          room={roomToEdit}
          onClose={handleCloseEditModal}
          onSaveSuccess={handleRoomSaveSuccess}
        />
      )}
    </div>
  );
};

export default ReservationForm;
