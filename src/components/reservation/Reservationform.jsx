
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaUser, FaPhone, FaCity, FaMapMarkedAlt, FaBuilding, FaGlobe, FaRegAddressCard, FaMobileAlt, FaEnvelope, FaMoneyCheckAlt, FaCalendarAlt, FaClock, FaDoorOpen, FaUsers, FaConciergeBell, FaInfoCircle, FaSuitcase, FaComments, FaFileInvoiceDollar, FaCheckCircle, FaSignInAlt, FaPassport, FaIdCard, FaCreditCard, FaCashRegister, FaAddressBook, FaRegListAlt, FaRegUser, FaRegCalendarPlus, FaRegCheckCircle, FaRegTimesCircle, FaRegUserCircle, FaRegCreditCard, FaRegStar, FaRegFlag, FaRegEdit, FaRegClone, FaRegCommentDots, FaRegFileAlt, FaRegCalendarCheck, FaRegCalendarTimes, FaRegMap, FaHotel, FaTimes } from "react-icons/fa";

// InputWithIcon for UI consistency
const InputWithIcon = ({ icon, type, name, placeholder, value, onChange, className, required, min, max, step, readOnly, inputClassName }) => (
  <div className="relative flex items-center">
    {icon && <div className="absolute left-3 text-gray-400 pointer-events-none">{icon}</div>}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`pl-10 pr-4 py-2 w-full ${inputClassName || 'bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'} ${className}`}
      required={required}
      min={min}
      max={max}
      step={step}
      readOnly={readOnly}
    />
  </div>
);



// Fetch a new, sequential GRC number from backend
const fetchNewGRCNo = async (setFormData, BASE_URL) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/bookings/grc`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    // Defensive JSON parse: only if content-type is JSON
    const contentType = res.headers.get('content-type');
    if (!res.ok) throw new Error('Failed to fetch new GRC number');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.grcNo) {
        setFormData(prev => ({ ...prev, grcNo: data.grcNo }));
      } else {
        setFormData(prev => ({ ...prev, grcNo: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, grcNo: '' }));
    }
  } catch (err) {
    setFormData(prev => ({ ...prev, grcNo: '' }));
  }
};

// Shadcn-like components (for a self-contained example)
const Button = ({ children, onClick, className = '', disabled, type = 'button', variant = 'default' }) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";
  const variants = {
    default: "bg-white text-black border border-black shadow hover:bg-gray-100",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900"
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ type, placeholder, value, onChange, className = '', ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, className = '' }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);

const Select = ({ value, onChange, children, className = '', name, ...props }) => (
  <select
    value={value}
    onChange={onChange}
    name={name}
    className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Checkbox = ({ id, checked, onChange, className = '' }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={onChange}
    className={`peer h-4 w-4 shrink-0 rounded-sm border border-black shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-black data-[state=checked]:text-primary-foreground ${className}`}
  />
);

// Lucide-react-like icons
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const BedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4"/><path d="M12 4h4a2 2 0 0 1 2 2v4"/><path d="M22 10v4"/></svg>
);
const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L14 6H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
);
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);


// Custom Date Picker Component to avoid browser inconsistencies
const DatePicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  
  const formattedValue = value ? new Date(value).toLocaleDateString('en-CA') : '';

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDayClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onChange(selectedDate.toLocaleDateString('en-CA'));
    setIsOpen(false);
  };

  const handleMonthChange = (offset) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
      const isSelected = value && new Date(value).getDate() === i && new Date(value).getMonth() === month && new Date(value).getFullYear() === year;
      const dayClasses = `h-10 w-10 flex items-center justify-center rounded-full cursor-pointer transition-colors ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-100'}`;
      days.push(
        <div key={i} className={dayClasses} onClick={() => handleDayClick(i)}>
          {i}
        </div>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2" />
        {formattedValue || `Select ${label}`}
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full sm:w-80">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" size="icon" onClick={() => handleMonthChange(-1)}>
              <ChevronLeftIcon />
            </Button>
            <span className="font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <Button variant="outline" size="icon" onClick={() => handleMonthChange(1)}>
              <ChevronRightIcon />
            </Button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
            {dayNames.map(day => <span key={day}>{day}</span>)}
          </div>
          <div className="grid grid-cols-7 text-center">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [formData, setFormData] = useState({
    grcNo: '',

// Fetch GRC number from backend (outside App to avoid syntax issues)

    bookingRefNo: '',
    reservationType: 'Online',
    modeOfReservation: '',
    category: '',
    status: 'Confirmed',
    salutation: 'Mr.',
    guestName: '',
    nationality: '',
    city: '',
    address: '',
    phoneNo: '',
    mobileNo: '',
    email: '',
    companyName: '',
    gstApplicable: true,
    companyGSTIN: '',
    roomHoldStatus: 'Pending',
    roomAssigned: [], // Changed to array to hold multiple room numbers
    roomHoldUntil: '',
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    noOfRooms: 1,
    noOfAdults: 1,
    noOfChildren: 0,
    planPackage: 'EP',
    rate: 0,
    arrivalFrom: '',
    purposeOfVisit: 'Leisure',
    roomPreferences: {
      smoking: false,
      bedType: 'King'
    },
    specialRequests: '',
    remarks: '',
    billingInstruction: '',
    paymentMode: '',
    refBy: '',
    advancePaid: 0,
    isAdvancePaid: false,
    transactionId: '',
    discountPercent: 0,
    vehicleDetails: {
      vehicleNumber: '',
      vehicleType: '',
      vehicleModel: '',
      driverName: '',
      driverMobile: ''
    },
    vip: false,
    isForeignGuest: false,
    cancellationReason: '',
    cancelledBy: '',
    isNoShow: false,
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [availableRoomsByCat, setAvailableRoomsByCat] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedRooms, setSelectedRooms] = useState([]); // New state for selected rooms

  const BASE_URL = "https://backend-hazel-xi.vercel.app/api";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Special handling for paymentMode to clear unrelated fields
    if (name === 'paymentMode') {
      setFormData(prev => {
        const cleared = { ...prev };
        // Clear all payment details fields
        delete cleared.cardNumber;
        delete cleared.cardHolder;
        delete cleared.cardExpiry;
        delete cleared.cardCVV;
        delete cleared.upiId;
        delete cleared.bankName;
        delete cleared.accountNumber;
        delete cleared.ifsc;
        return {
          ...cleared,
          paymentMode: value
        };
      });
      return;
    }
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const handleDateChange = (name, value) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  }
  
  const handleRoomSelection = (room) => {
      setSelectedRooms(prev => {
          const isSelected = prev.some(r => r._id === room._id);
          if (isSelected) {
              return prev.filter(r => r._id !== room._id);
          } else {
              return [...prev, room];
          }
      });
  };

  useEffect(() => {
    // Update formData.roomAssigned whenever selectedRooms changes
    setFormData(prev => ({
        ...prev,
        roomAssigned: selectedRooms.map(r => r.room_number)
    }));
    setFormData(prev => ({
        ...prev,
        noOfRooms: selectedRooms.length
    }));
  }, [selectedRooms]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [roomsRes, vehiclesRes, driversRes] = await Promise.all([
        fetch(`${BASE_URL}/rooms/all`),
        fetch(`${BASE_URL}/vehicle/all`),
        fetch(`${BASE_URL}/driver`),
      ]);

      if (!roomsRes.ok) throw new Error('Failed to fetch rooms data.');
      if (!vehiclesRes.ok) throw new Error('Failed to fetch vehicles data.');
      if (!driversRes.ok) throw new Error('Failed to fetch drivers data.');

      const roomsData = await roomsRes.json();
      const vehiclesData = await vehiclesRes.json();
      const driversData = await driversRes.json();

      setAllRooms(Array.isArray(roomsData) ? roomsData : []);
      setAllVehicles(Array.isArray(vehiclesData.vehicles) ? vehiclesData.vehicles : []);
      
      let drivers = [];
      if (Array.isArray(driversData)) {
          drivers = driversData;
      } else if (driversData && Array.isArray(driversData.drivers)) {
          drivers = driversData.drivers;
      }
      setAllDrivers(drivers);

      // Set default values from fetched data if available
      if (Array.isArray(vehiclesData.vehicles) && vehiclesData.vehicles.length > 0) {
        setFormData(prev => ({ ...prev, vehicleDetails: { ...prev.vehicleDetails, vehicleType: vehiclesData.vehicles[0].type } }));
      }
      if (Array.isArray(drivers) && drivers.length > 0) {
        setFormData(prev => ({ ...prev, vehicleDetails: { ...prev.vehicleDetails, driverName: drivers[0].driverName } }));
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch initial data. Please check the network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async () => {
    const { checkInDate, checkOutDate } = formData;
    if (!checkInDate || !checkOutDate || new Date(checkInDate) >= new Date(checkOutDate)) {
      setError('Please select valid check-in and check-out dates.');
      setAvailableCategories([]);
      setAvailableRoomsByCat({});
      setFormData(prev => ({ ...prev, category: '' }));
      setHasCheckedAvailability(true);
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedRooms([]); // Reset selected rooms on new availability check
    try {
      const apiUrl = `${BASE_URL}/rooms/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch room availability');
      }
      const data = await response.json();
      
      const availableRoomsList = data.availableRooms || [];
      if (Array.isArray(availableRoomsList)) {
        setAvailableCategories(availableRoomsList);
        
        const roomsByCategory = availableRoomsList.reduce((acc, current) => {
          if (current.rooms) {
            acc[current.category] = current.rooms;
          }
          return acc;
        }, {});
        setAvailableRoomsByCat(roomsByCategory);

        // Auto-select the first category if available
        if (availableRoomsList.length > 0) {
          setFormData(prev => ({ ...prev, category: availableRoomsList[0].category }));
        } else {
          setFormData(prev => ({ ...prev, category: '' }));
        }
      } else {
        const errorMessage = 'Received unexpected data from the server. The API for room availability did not return a list of rooms. Please try a different date range or check the API backend.';
        console.error('API response for rooms/available was not an array:', data);
        setError(errorMessage);
        setAvailableCategories([]);
        setAvailableRoomsByCat({});
        setFormData(prev => ({ ...prev, category: '' }));
      }

    } catch (err) {
      console.error(err);
      setError('Could not fetch room availability. Please check your network connection and try again.');
    } finally {
      setLoading(false);
      setHasCheckedAvailability(true);
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchNewGRCNo(setFormData, BASE_URL);
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final Reservation Object:', formData);
    showMessage('success', 'Reservation data logged to console. Please check the developer tools.');
  };
  
  const handleCategoryCardClick = (category) => {
    setFormData(prev => ({ ...prev, category }));
    setSelectedRooms([]); // Clear selected rooms when category changes
  };
  
  const roomsForSelectedCategory = availableRoomsByCat[formData.category] || [];

  const isCheckAvailabilityDisabled = !formData.checkInDate || !formData.checkOutDate || new Date(formData.checkInDate) >= new Date(formData.checkOutDate);

  return (
    <div className="w-full max-w-full p-6 rounded-2xl shadow-md border border-[color:var(--color-border)] text-[color:var(--color-text)] overflow-x-hidden">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-[color:var(--color-text)] flex items-center justify-center gap-3">
        Reservation Form
      </h2>
      {message.text && (
        <div className={`px-4 py-3 rounded relative mb-4 mx-auto max-w-3xl ${message.type === 'success' ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"}`} role="alert">
          <span className="block sm:inline">{message.text}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage({ type: '', text: '' })}>
            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information Section */}
          <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
              <FaInfoCircle className="text-amber-400" /> General Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grcNo">GRC No.</Label>
                <InputWithIcon
                  icon={<FaRegAddressCard />} 
                  type="text"
                  name="grcNo"
                  placeholder="GRC No."
                  value={formData.grcNo || ''}
                  onChange={handleChange}
                  readOnly={true}
                  inputClassName="bg-gray-100 border border-secondary rounded-lg cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingRefNo">Booking Reference No</Label>
                <InputWithIcon icon={<FaRegListAlt />} type="text" name="bookingRefNo" placeholder="Booking Reference No" value={formData.bookingRefNo} onChange={handleChange} inputClassName="bg-white border border-secondary rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reservationType">Reservation Type</Label>
                <div className="relative flex items-center">
                  <FaInfoCircle className="absolute left-3 text-gray-400 pointer-events-none" />
                  <select
                    className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                    id="reservationType"
                    name="reservationType"
                    value={formData.reservationType}
                    onChange={handleChange}
                  >
                    <option key="online-option" value="Online">Online</option>
                    <option key="walk-in-option" value="Walk-in">Walk-in</option>
                    <option key="agent-option" value="Agent">Agent</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modeOfReservation">Mode of Reservation</Label>
                <InputWithIcon icon={<FaRegUser />} type="text" name="modeOfReservation" placeholder="Mode of Reservation" value={formData.modeOfReservation} onChange={handleChange} inputClassName="bg-white border border-secondary rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="relative flex items-center">
                  <FaCheckCircle className="absolute left-3 text-gray-400 pointer-events-none" />
                  <select
                    className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option key="confirmed-option" value="Confirmed">Confirmed</option>
                    <option key="tentative-option" value="Tentative">Tentative</option>
                    <option key="waiting-option" value="Waiting">Waiting</option>
                    <option key="cancelled-option" value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomHoldStatus">Room Hold Status</Label>
                <div className="relative flex items-center">
                  <FaRegCheckCircle className="absolute left-3 text-gray-400 pointer-events-none" />
                  <select
                    className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
                    id="roomHoldStatus"
                    name="roomHoldStatus"
                    value={formData.roomHoldStatus}
                    onChange={handleChange}
                  >
                    <option key="pending-option" value="Pending">Pending</option>
                    <option key="held-option" value="Held">Held</option>
                    <option key="released-option" value="Released">Released</option>
                  </select>
                </div>
              </div>
              {formData.status === 'Cancelled' && (
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="cancellationReason">Cancellation Reason</Label>
                  <Input id="cancellationReason" name="cancellationReason" value={formData.cancellationReason} onChange={handleChange} />
                </div>
              )}
              <div className="space-y-2 col-span-1 sm:col-span-2">
                <div className="relative flex items-start col-span-full">
                  <FaComments className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <textarea
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Remarks"
                    className="bg-white border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-full h-20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Room & Availability Section */}
          <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
              <BedIcon className="text-amber-400" /> Room & Availability
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInDate">Check-in Date</Label>
                <DatePicker
                  value={formData.checkInDate}
                  onChange={(value) => handleDateChange('checkInDate', value)}
                  label="check-in date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutDate">Check-out Date</Label>
                <DatePicker
                  value={formData.checkOutDate}
                  onChange={(value) => handleDateChange('checkOutDate', value)}
                  label="check-out date"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={fetchAvailableRooms}
                  disabled={isCheckAvailabilityDisabled}
                  className="w-full"
                >
                  Check Availability
                </Button>
              </div>
            </div>
            
            {loading ? (
              <p className="text-center text-blue-500 mt-4">Checking for available rooms...</p>
            ) : error ? (
              <p className="text-center text-red-500 mt-4">{error}</p>
            ) : (
              hasCheckedAvailability ? (
                availableCategories.length > 0 ? (
                  <div className="space-y-6 mt-4">
                    <p className="text-lg font-medium">Select a Room Category:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableCategories.map((cat) => (
                        <div
                          key={cat.category}
                          onClick={() =>+ handleCategoryCardClick(cat.category)}
                          className={`
                            p-6 rounded-lg shadow-sm border cursor-pointer transition-all
                            ${formData.category === cat.category ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'}
                          `}
                        >
                          <h3 className="text-xl font-semibold">{cat.categoryName}</h3>
                          <p className="text-sm text-gray-500">{cat.availableRooms} rooms available</p>
                        </div>
                      ))}
                    </div>
    
                    {formData.category && roomsForSelectedCategory.length > 0 && (
                      <div className="mt-6 rounded-lg border border-gray-200 overflow-x-auto sm:overflow-x-visible">
                        <table className="min-w-full w-full text-sm text-left text-gray-500 table-auto">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th scope="col" className="p-4">
                                <span className="sr-only">Select</span>
                              </th>
                              <th scope="col" className="px-2 py-3 break-words max-w-[120px]">Room Number</th>
                              <th scope="col" className="px-2 py-3 break-words max-w-[180px]">Room Name</th>
                              <th scope="col" className="px-2 py-3 break-words max-w-[100px]">Capacity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roomsForSelectedCategory.map((room) => (
                              <tr
                                key={room._id}
                                className={`border-b ${selectedRooms.some(r => r._id === room._id) ? 'bg-blue-100' : 'bg-white hover:bg-gray-50'}`}
                              >
                                <td className="w-4 p-4">
                                  <Button
                                    type="button"
                                    variant="default"
                                    className={
                                      selectedRooms.some(r => r._id === room._id)
                                        ? 'bg-green-500 text-black border-green-500 hover:bg-green-600'
                                        : 'bg-red-500 text-black border-red-500 hover:bg-red-600'
                                    }
                                    onClick={() => handleRoomSelection(room)}
                                  >
                                    {selectedRooms.some(r => r._id === room._id) ? 'Unselect' : 'Select'}
                                  </Button>
                                </td>
                                <td className="px-2 py-4 font-medium text-black break-words max-w-[120px] whitespace-normal">
                                  {room.room_number}
                                </td>
                                <td className="px-2 py-4 break-words max-w-[180px] whitespace-normal">{room.title}</td>
                                <td className="px-2 py-4 break-words max-w-[100px] whitespace-normal">{room.capacity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    {formData.category && roomsForSelectedCategory.length === 0 && (
                      <p className="text-center text-red-500">No rooms found for the selected category and dates.</p>
                    )}
    
                  </div>
                ) : (
                  <p className="text-center text-red-500 mt-4">No rooms available for the selected dates.</p>
                )
              ) : (
                <p className="text-center text-gray-500 mt-4">Please select your check-in and check-out dates and click 'Check Availability'.</p>
              )
            )}
          </section>

          {/* Guest Details Section */}
          <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
              <FaUser className="text-amber-400" /> Guest Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salutation">Salutation</Label>
                <Select id="salutation" name="salutation" value={formData.salutation} onChange={handleChange}>
                  <option key="mr-option" value="Mr.">Mr.</option>
                  <option key="ms-option" value="Ms.">Ms.</option>
                  <option key="dr-option" value="Dr.">Dr.</option>
                  <option key="prof-option" value="Prof.">Prof.</option>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="guestName">Guest Name <span className="text-red-500">*</span></Label>
                <Input
                  id="guestName"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone No</Label>
                <Input id="phoneNo" name="phoneNo" type="tel" value={formData.phoneNo} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile No</Label>
                <Input id="mobileNo" name="mobileNo" type="tel" value={formData.mobileNo} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-3">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} />
              </div>
              <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-2">
                <Checkbox
                  id="gstApplicable"
                  name="gstApplicable"
                  checked={formData.gstApplicable}
                  onChange={handleChange}
                />
                <Label htmlFor="gstApplicable">GST Applicable</Label>
              </div>
              {formData.gstApplicable && (
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label htmlFor="companyGSTIN">Company GSTIN</Label>
                  <Input id="companyGSTIN" name="companyGSTIN" value={formData.companyGSTIN} onChange={handleChange} />
                </div>
              )}
              <div className="space-y-2 flex items-center gap-2">
                <Checkbox
                  id="vip"
                  name="vip"
                  checked={formData.vip}
                  onChange={handleChange}
                />
                <Label htmlFor="vip">VIP Guest</Label>
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <Checkbox
                  id="isForeignGuest"
                  name="isForeignGuest"
                  checked={formData.isForeignGuest}
                  onChange={handleChange}
                />
                <Label htmlFor="isForeignGuest">Foreign Guest</Label>
              </div>
            </div>
          </section>

          {/* Stay Info Section */}
          <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
              <BedIcon className="text-amber-400" /> Stay Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="noOfRooms">Number of Rooms</Label>
                <Input id="noOfRooms" name="noOfRooms" type="number" min="1" value={formData.noOfRooms} onChange={handleChange} readOnly className="bg-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noOfAdults">Adults</Label>
                <Input id="noOfAdults" name="noOfAdults" type="number" min="1" value={formData.noOfAdults} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noOfChildren">Children</Label>
                <Input id="noOfChildren" name="noOfChildren" type="number" min="0" value={formData.noOfChildren} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planPackage">Package Plan</Label>
                <Select id="planPackage" name="planPackage" value={formData.planPackage} onChange={handleChange}>
                  <option key="ep-option" value="EP">EP (European Plan)</option>
                  <option key="cp-option" value="CP">CP (Continental Plan)</option>
                  <option key="map-option" value="MAP">MAP (Modified American Plan)</option>
                  <option key="ap-option" value="AP">AP (American Plan)</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <Input id="checkInTime" name="checkInTime" type="time" value={formData.checkInTime} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Check-out Time</Label>
                <Input id="checkOutTime" name="checkOutTime" type="time" value={formData.checkOutTime} onChange={handleChange} disabled />
              </div>
              <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-2">
                <Label htmlFor="arrivalFrom">Arrival From</Label>
                <Input id="arrivalFrom" name="arrivalFrom" value={formData.arrivalFrom} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purposeOfVisit">Purpose of Visit</Label>
                <Select id="purposeOfVisit" name="purposeOfVisit" value={formData.purposeOfVisit} onChange={handleChange}>
                  <option key="leisure-option" value="Leisure">Leisure</option>
                  <option key="business-option" value="Business">Business</option>
                  <option key="other-option" value="Other">Other</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomPreferences.bedType">Bed Type</Label>
                <Select id="roomPreferences.bedType" name="roomPreferences.bedType" value={formData.roomPreferences.bedType} onChange={handleChange}>
                  <option key="king-bed" value="King">King</option>
                  <option key="twin-bed" value="Twin">Twin</option>
                  <option key="queen-bed" value="Queen">Queen</option>
                </Select>
              </div>
              <div className="space-y-2 col-span-2 flex items-center gap-2">
                <Checkbox
                  id="roomPreferences.smoking"
                  name="roomPreferences.smoking"
                  checked={formData.roomPreferences.smoking}
                  onChange={handleChange}
                />
                <Label htmlFor="roomPreferences.smoking">Smoking Room</Label>
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  rows="3"
                />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="billingInstruction">Billing Instruction</Label>
                <textarea
                  id="billingInstruction"
                  name="billingInstruction"
                  value={formData.billingInstruction}
                  onChange={handleChange}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  rows="3"
                />
              </div>
            </div>
          </section>

          {/* Payment Info Section */}
          <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
              <FaCreditCard className="text-amber-400" /> Payment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Total Rate</Label>
                <Input id="rate" name="rate" type="number" value={formData.rate} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <Select id="paymentMode" name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                  <option value="">Select Payment Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPercent">Discount (%)</Label>
                <Input id="discountPercent" name="discountPercent" type="number" min="0" max="100" value={formData.discountPercent} onChange={handleChange} />
              </div>

              {/* Show payment details based on payment mode */}
              {formData.paymentMode === 'Card' && (
                <>
                  <div className="col-span-full"><span className="block font-semibold text-blue-700 mb-2">Card Payment Details</span></div>
                  <div className="space-y-2 col-span-full sm:col-span-1">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" name="cardNumber" value={formData.cardNumber || ''} onChange={handleChange} maxLength={19} placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Card Holder Name</Label>
                    <Input id="cardHolder" name="cardHolder" value={formData.cardHolder || ''} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input id="cardExpiry" name="cardExpiry" value={formData.cardExpiry || ''} onChange={handleChange} placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCVV">CVV</Label>
                    <Input id="cardCVV" name="cardCVV" value={formData.cardCVV || ''} onChange={handleChange} maxLength={4} />
                  </div>
                </>
              )}
              {formData.paymentMode === 'UPI' && (
                <>
                  <div className="col-span-full"><span className="block font-semibold text-blue-700 mb-2">UPI Payment Details</span></div>
                  <div className="space-y-2 col-span-full sm:col-span-1">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input id="upiId" name="upiId" value={formData.upiId || ''} onChange={handleChange} placeholder="example@upi" />
                  </div>
                </>
              )}
              {formData.paymentMode === 'Bank Transfer' && (
                <>
                  <div className="col-span-full"><span className="block font-semibold text-blue-700 mb-2">Bank Transfer Details</span></div>
                  <div className="space-y-2 col-span-full sm:col-span-1">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" name="bankName" value={formData.bankName || ''} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" name="accountNumber" value={formData.accountNumber || ''} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input id="ifsc" name="ifsc" value={formData.ifsc || ''} onChange={handleChange} />
                  </div>
                </>
              )}
              <div className="space-y-2 col-span-full flex items-center gap-2">
                <Checkbox
                  id="isAdvancePaid"
                  name="isAdvancePaid"
                  checked={formData.isAdvancePaid}
                  onChange={handleChange}
                />
                <Label htmlFor="isAdvancePaid">Advance Paid</Label>
              </div>
              {formData.isAdvancePaid && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="advancePaid">Advance Paid Amount</Label>
                    <Input id="advancePaid" name="advancePaid" type="number" value={formData.advancePaid} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input id="transactionId" name="transactionId" value={formData.transactionId} onChange={handleChange} />
                  </div>
                </>
              )}
            </div>
          </section>
          
          {/* Vehicle Details Section */}
          <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
              <CarIcon className="text-amber-400" /> Vehicle Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleDetails.vehicleType">Vehicle Type</Label>
                <Select
                  id="vehicleDetails.vehicleType"
                  name="vehicleDetails.vehicleType"
                  value={formData.vehicleDetails.vehicleType}
                  onChange={handleChange}
                >
                  <option value="">Select a vehicle type</option>
                  {allVehicles.map(vehicle => (
                    <option key={vehicle._id} value={vehicle.type}>{vehicle.type}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleDetails.vehicleModel">Vehicle Model</Label>
                <Input
                  id="vehicleDetails.vehicleModel"
                  name="vehicleDetails.vehicleModel"
                  value={formData.vehicleDetails.vehicleModel}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleDetails.vehicleNumber">Vehicle Number</Label>
                <Input
                  id="vehicleDetails.vehicleNumber"
                  name="vehicleDetails.vehicleNumber"
                  value={formData.vehicleDetails.vehicleNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleDetails.driverName">Driver Name</Label>
                <Select
                  id="vehicleDetails.driverName"
                  name="vehicleDetails.driverName"
                  value={formData.vehicleDetails.driverName}
                  onChange={handleChange}
                >
                  <option value="">Select a driver</option>
                  {allDrivers.map(driver => (
                    <option key={driver._id} value={driver.driverName}>{driver.driverName}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleDetails.driverMobile">Driver Mobile</Label>
                <Input
                  id="vehicleDetails.driverMobile"
                  name="vehicleDetails.driverMobile"
                  type="tel"
                  value={formData.vehicleDetails.driverMobile}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

        <div className="mt-8 flex justify-center gap-4">
          <Button type="button" className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
            Reset
          </Button>
          <Button type="submit" className="px-8 py-3 bg-[color:var(--color-primary)] text-black font-semibold rounded-lg shadow-md hover:bg-[color:var(--color-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Submit Reservation
          </Button>
        </div>
          
          {message.text && (
            <div className={`p-4 rounded-md mt-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
  );
}

export default App;

