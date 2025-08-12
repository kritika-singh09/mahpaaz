
import React, { useState, useEffect, useRef, createContext, useContext, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaPhone,
  FaCity,
  FaMapMarkedAlt,
  FaBuilding,
  FaGlobe,
  FaRegAddressCard,
  FaMobileAlt,
  FaEnvelope,
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaClock,
  FaDoorOpen,
  FaUsers,
  FaConciergeBell,
  FaInfoCircle,
  FaSuitcase,
  FaComments,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaSignInAlt,
  FaPassport,
  FaIdCard,
  FaCreditCard,
  FaCashRegister,
  FaAddressBook,
  FaRegListAlt,
  FaRegUser,
  FaRegCalendarPlus,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaRegUserCircle,
  FaRegCreditCard,
  FaRegStar,
  FaRegFlag,
  FaRegEdit,
  FaRegClone,
  FaRegCommentDots,
  FaRegFileAlt,
  FaRegCalendarCheck,
  FaRegCalendarTimes,
  FaRegMap,
  FaHotel,
  FaTimes,
} from "react-icons/fa";

// Shadcn-like components (for a self-contained example)
const Button = ({
  children,
  onClick,
  className = "",
  disabled,
  type = "button",
  variant = "default",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";
  const variants = {
    default: "bg-white text-black border border-black shadow hover:bg-gray-100",
    outline:
      "border border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900",
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

const Input = ({
  type,
  placeholder,
  value,
  onChange,
  className = "",
  ...props
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);

const Select = ({
  value,
  onChange,
  children,
  className = "",
  name,
  ...props
}) => (
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

const Checkbox = ({ id, checked, onChange, className = "" }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={onChange}
    className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
  />
);

// Lucide-react-like icons
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-muted-foreground"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-muted-foreground"
  >
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4" />
    <path d="M12 4h4a2 2 0 0 1 2 2v4" />
    <path d="M22 10v4" />
  </svg>
);
const CarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-muted-foreground"
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L14 6H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const BASE_URL = 'https://backend-hazel-xi.vercel.app';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [searchGRC, setSearchGRC] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [formData, setFormData] = useState({
    grcNo: '',
    reservationId: '',
    categoryId: '',
    bookingDate: new Date().toISOString().split('T')[0],
    numberOfRooms: 1,
    isActive: true,
    checkInDate: '',
    checkOutDate: '',
    days: 0,
    timeIn: '12:00',
    timeOut: '12:00',
    salutation: 'mr.',
    name: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    nationality: '',
    mobileNo: '',
    email: '',
    phoneNo: '',
    birthDate: '',
    anniversary: '',
    companyName: '',
    companyGSTIN: '',
    idProofType: '',
    idProofNumber: '',
    idProofImageUrl: '',
    idProofImageUrl2: '',
    photoUrl: '',
    roomNumber: '',
    planPackage: '',
    noOfAdults: 1,
    noOfChildren: 0,
    rate: 0,
    taxIncluded: false,
    serviceCharge: false,
    arrivedFrom: '',
    destination: '',
    remark: '',
    businessSource: '',
    marketSegment: '',
    purposeOfVisit: '',
    discountPercent: 0,
    discountRoomSource: 0,
    paymentMode: '',
    paymentStatus: 'Pending',
    bookingRefNo: '',
    mgmtBlock: 'No',
    billingInstruction: '',
    temperature: '',
    fromCSV: false,
    epabx: false,
    vip: false,
    status: 'Booked',
    extensionHistory: [],
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCVV: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
  });

  // Memoized available rooms for the currently selected category
  const roomsForSelectedCategory = useMemo(() => {
    if (!formData.categoryId) {
      return [];
    }
    
    const filtered = allRooms.filter(room => {
      // Get the room's category ID from various possible fields
      const roomCategoryId = room.category?._id || room.category || room.categoryId;
      
      // Match with selected category
      const categoryMatch = roomCategoryId === formData.categoryId;
      
      // Additional safety check for room status
      const isAvailable = ['available', 'clean'].includes(room.status) || !room.status;
      const notReserved = !room.is_reserved;
      
      return categoryMatch && isAvailable && notReserved;
    });
    
    console.log(`Rooms for category ${formData.categoryId}:`, filtered);
    return filtered;
  }, [allRooms, formData.categoryId]);

  // --- Message Handling Logic ---
  const showMessage = (msg, msgType = 'info') => {
    setMessage(msg);
    setMessageType(msgType);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  // --- Data Fetching Functions ---
  const fetchNewGRCNo = () => {
    const random = Math.floor(Math.random() * 9000) + 1000;
    const grcNo = `GRC-${random}`;
    setFormData(prev => ({ ...prev, grcNo }));
  };

  const fetchAllData = async () => {
    try {
      const [catRes, roomRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/categories/all`),
        axios.get(`${BASE_URL}/api/rooms/all`),
      ]);

      console.log('Categories response:', catRes.data);
      console.log('Rooms response:', roomRes.data);

      const categories = Array.isArray(catRes.data) ? catRes.data : [];
      const rooms = Array.isArray(roomRes.data) ? roomRes.data : [];

      setAllRooms(rooms);
      
      const categoriesWithCounts = categories.map(category => ({
        ...category,
        totalRooms: rooms.filter(room => {
          if (!room.category) return false;
          return room.category._id === category._id || 
                 room.category === category._id || 
                 room.categoryId === category._id;
        }).length,
        availableRoomsCount: 0,
      }));
      setAllCategories(categoriesWithCounts);

    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage(`Failed to fetch initial data: ${error.message}. Ensure your server is running.`, 'error');
    }
  };

  // --- Form Reset Logic ---
  const resetForm = () => {
    setFormData({
      grcNo: '', reservationId: '', categoryId: '', bookingDate: new Date().toISOString().split('T')[0],
      numberOfRooms: 1, isActive: true, checkInDate: '', checkOutDate: '', days: 0,
      timeIn: '12:00', timeOut: '12:00', salutation: 'mr.', name: '', age: '',
      gender: '', address: '', city: '', nationality: '', mobileNo: '', email: '',
      phoneNo: '', birthDate: '', anniversary: '', companyName: '', companyGSTIN: '',
      idProofType: '', idProofNumber: '', idProofImageUrl: '', idProofImageUrl2: '',
      photoUrl: '', roomNumber: '', planPackage: '', noOfAdults: 1, noOfChildren: 0,
      rate: 0, taxIncluded: false, serviceCharge: false, arrivedFrom: '',
      destination: '', remark: '', businessSource: '', marketSegment: '',
      purposeOfVisit: '', discountPercent: 0, discountRoomSource: 0, paymentMode: '',
      paymentStatus: 'Pending', bookingRefNo: '', mgmtBlock: 'No', billingInstruction: '',
      temperature: '', fromCSV: false, epabx: false, vip: false, status: 'Booked',
      extensionHistory: [],
    });
    setSelectedRooms([]);
    setSearchGRC('');
    setAllCategories(prev => prev.map(cat => ({ ...cat, availableRoomsCount: 0 })));
    setHasCheckedAvailability(false);
    setCapturedPhoto(null);
    setIsCameraOpen(false);
    fetchNewGRCNo();
    fetchAllData();
  };

  // --- Context Value ---
  const value = {
    BASE_URL,
    loading,
    setLoading,
    message,
    messageType,
    showMessage,
    isCameraOpen,
    setIsCameraOpen,
    capturedPhoto,
    setCapturedPhoto,
    searchGRC,
    setSearchGRC,
    allCategories,
    setAllCategories,
    allRooms,
    setAllRooms,
    selectedRooms,
    setSelectedRooms,
    hasCheckedAvailability,
    setHasCheckedAvailability,
    formData,
    setFormData,
    roomsForSelectedCategory,
    fetchNewGRCNo,
    fetchAllData,
    resetForm,
    showCompanyDetails,
    setShowCompanyDetails,
  };
  useEffect(() => {
    fetchNewGRCNo();
    fetchAllData();
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
const App = () => {
  // Use the custom hook to access all state and functions
  const {
    BASE_URL, loading, setLoading, message, messageType, showMessage,
    isCameraOpen, setIsCameraOpen, capturedPhoto, setCapturedPhoto, searchGRC, setSearchGRC, allCategories, setAllCategories, allRooms, setAllRooms,
    selectedRooms, setSelectedRooms, hasCheckedAvailability, setHasCheckedAvailability,
    formData, setFormData, roomsForSelectedCategory, resetForm, showCompanyDetails, setShowCompanyDetails,
  } = useAppContext();

  // Navigation hook
  const navigate = useNavigate();

  // Refs for video and canvas elements to access them in the DOM
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- CAMERA LOGIC ---
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        showMessage('Error accessing camera. Please allow camera permissions.', 'error');
      }
    };
    
    if (isCameraOpen) {
        startCamera();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, showMessage, videoRef]);

  useEffect(() => {
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);

    if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime()) && checkOut > checkIn) {
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, days: diffDays }));
    } else {
      setFormData(prev => ({ ...prev, days: 0 }));
    }
  }, [formData.checkInDate, formData.checkOutDate, setFormData]);


  useEffect(() => {
    if (Array.isArray(selectedRooms)) {
      setFormData(prev => ({
        ...prev,
        roomNumber: selectedRooms.map(r => r.room_number).join(','),
        numberOfRooms: selectedRooms.length > 0 ? selectedRooms.length : 1,
      }));
    }
  }, [selectedRooms, setFormData]);

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(imageDataUrl);
      setFormData(prev => ({ ...prev, photoUrl: imageDataUrl }));
      showMessage("Photo captured successfully.", 'success');
    }
  };

  const handleRemovePhoto = () => {
    setCapturedPhoto(null);
    setFormData(prev => ({ ...prev, photoUrl: '' }));
  };

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "paymentMode") {
      setFormData((prev) => ({
        ...prev,
        paymentMode: value,
        cardNumber: '',
        cardHolder: '',
        cardExpiry: '',
        cardCVV: '',
        upiId: '',
        bankName: '',
        accountNumber: '',
        ifsc: '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFetchBooking = async () => {
    if (!searchGRC.trim()) {
      showMessage("Please enter a GRC number to search.", 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/bookings/grc/${searchGRC.trim()}`);
      console.log("API Response:", response);
      console.log("Fetched booking data:", response.data); 

      // Check if response has data
      if (response.data && response.status === 200) {
        const fetchedData = response.data.booking;
        
        // Helper function to safely format dates
        const formatDate = (dateString) => {
          if (!dateString) return '';
          try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
          } catch {
            return '';
          }
        };
        
        // Directly set the fetched data
        setFormData({
          ...fetchedData,
          categoryId: fetchedData.categoryId?._id || fetchedData.categoryId || '',
          bookingDate: formatDate(fetchedData.bookingDate),
          checkInDate: formatDate(fetchedData.checkInDate),
          checkOutDate: formatDate(fetchedData.checkOutDate),
          birthDate: formatDate(fetchedData.birthDate),
          anniversary: formatDate(fetchedData.anniversary),
          age: fetchedData.age ? String(fetchedData.age) : '',
          numberOfRooms: Number(fetchedData.numberOfRooms) || 1,
          noOfAdults: Number(fetchedData.noOfAdults) || 1,
          noOfChildren: Number(fetchedData.noOfChildren) || 0,
          rate: Number(fetchedData.rate) || 0,
          discountPercent: Number(fetchedData.discountPercent) || 0,
          days: Number(fetchedData.days) || 0,
        });
        
        // Handle room selection - check if roomNumber is a string of comma-separated values or an array
        if (fetchedData.roomNumber) {
          if (typeof fetchedData.roomNumber === 'string') {
            // If it's a comma-separated string, we need to find the actual room objects
            const roomNumbers = fetchedData.roomNumber.split(',').map(num => num.trim());
            const matchingRooms = allRooms.filter(room => 
              roomNumbers.includes(room.room_number)
            );
            setSelectedRooms(matchingRooms);
          } else if (Array.isArray(fetchedData.roomNumber)) {
            setSelectedRooms(fetchedData.roomNumber);
          }
        }

        // Set photo if available
        if (fetchedData.photoUrl) {
          setCapturedPhoto(fetchedData.photoUrl);
        }

        // Set category if available and trigger availability check
        if (fetchedData.categoryId && fetchedData.checkInDate && fetchedData.checkOutDate) {
          setHasCheckedAvailability(true);
          // Automatically check availability for the fetched dates
          setTimeout(() => {
            handleCheckAvailability();
          }, 500);
        }

        showMessage("Booking found and form populated successfully!", 'success');
      } else {
        showMessage("No booking found with that GRC number.", 'error');
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Unknown server error';
        if (status === 404) {
          showMessage("No booking found with that GRC number.", 'error');
        } else {
          showMessage(`Server error (${status}): ${message}`, 'error');
        }
      } else if (error.request) {
        // Network error
        showMessage("Network error. Please check your internet connection and try again.", 'error');
      } else {
        // Other error
        showMessage(`Error: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckAvailability = async () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      showMessage("Please select both check-in and check-out dates.", 'error');
      return;
    }
    setLoading(true);
    setHasCheckedAvailability(true);
    try {
      // Get all rooms first to check their actual status
      const [availabilityResponse, allRoomsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/rooms/available?checkInDate=${formData.checkInDate}&checkOutDate=${formData.checkOutDate}`),
        axios.get(`${BASE_URL}/api/rooms/all`)
      ]);
      
      const availableCategoriesData = availabilityResponse.data.availableRooms || [];
      const allRoomsData = allRoomsResponse.data || [];

      // Create a map of available room IDs from the availability check
      const availableRoomIds = new Set();
      availableCategoriesData.forEach(cat => {
        if (cat.rooms) {
          cat.rooms.forEach(room => availableRoomIds.add(room._id));
        }
      });

      // Filter rooms that are truly available (in availability response AND have correct status)
      const trulyAvailableRooms = allRoomsData.filter(room => {
        const isInAvailabilityList = availableRoomIds.has(room._id);
        const hasValidStatus = ['available', 'clean'].includes(room.status) || !room.status;
        const notReserved = !room.is_reserved;
        
        return isInAvailabilityList && hasValidStatus && notReserved;
      });

      // Group available rooms by category
      const categoryRoomCounts = {};
      trulyAvailableRooms.forEach(room => {
        const categoryId = room.category?._id || room.category || room.categoryId;
        if (categoryId) {
          categoryRoomCounts[categoryId] = (categoryRoomCounts[categoryId] || 0) + 1;
        }
      });

      // Update categories with correct available room counts
      const updatedCategories = allCategories.map(cat => ({
        ...cat,
        availableRoomsCount: categoryRoomCounts[cat._id] || 0
      }));
      setAllCategories(updatedCategories);

      // Set the truly available rooms with proper category info
      const roomsWithCategoryInfo = trulyAvailableRooms.map(room => ({
        ...room,
        category: room.category || { _id: room.categoryId },
        categoryId: room.category?._id || room.category || room.categoryId
      }));
      
      setAllRooms(roomsWithCategoryInfo);
      console.log('Truly available rooms:', roomsWithCategoryInfo);

      if (roomsWithCategoryInfo.length === 0) {
        showMessage("No rooms available for the selected dates.", 'error');
      } else {
        showMessage(`Found ${roomsWithCategoryInfo.length} available rooms.`, 'info');
      }

    } catch (error) {
      console.error('Availability check error:', error);
      showMessage(`Failed to check availability: ${error.message}`, 'error');
      setAllRooms([]);
      const resetCategories = allCategories.map(cat => ({ ...cat, availableRoomsCount: 0 }));
      setAllCategories(resetCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryCardClick = (categoryId) => {
    setFormData(prev => ({ ...prev, categoryId }));
    setSelectedRooms([]);
  };

  const handleRoomSelection = (room) => {
    setSelectedRooms((prev) => {
      const isSelected = prev.some((r) => r._id === room._id);
      if (isSelected) {
        return prev.filter((r) => r._id !== room._id);
      } else {
        return [...prev, room];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.name.trim()) {
      showMessage('Guest name is required', 'error');
      return;
    }
    
    if (!formData.checkInDate || !formData.checkOutDate) {
      showMessage('Check-in and check-out dates are required', 'error');
      return;
    }
    
    if (selectedRooms.length === 0) {
      showMessage('Please select at least one room', 'error');
      return;
    }
    
    if (!formData.categoryId) {
      showMessage('Please select a room category', 'error');
      return;
    }
    
    setLoading(true);
    
    // Clean the form data to remove any invalid fields
    const cleanFormData = {
      ...formData,
      photoUrl: capturedPhoto || '',
      roomNumber: selectedRooms.map(r => r.room_number).join(','),
      numberOfRooms: selectedRooms.length,
    };
    
    // Remove any MongoDB-specific fields that might cause issues
    delete cleanFormData._id;
    delete cleanFormData.__v;
    delete cleanFormData.createdAt;
    delete cleanFormData.updatedAt;
    
    // Ensure numeric fields are properly formatted
    cleanFormData.age = cleanFormData.age ? Number(cleanFormData.age) : 0;
    cleanFormData.noOfAdults = Number(cleanFormData.noOfAdults) || 1;
    cleanFormData.noOfChildren = Number(cleanFormData.noOfChildren) || 0;
    cleanFormData.rate = Number(cleanFormData.rate) || 0;
    cleanFormData.discountPercent = Number(cleanFormData.discountPercent) || 0;
    cleanFormData.days = Number(cleanFormData.days) || 0;
    
    console.log('Submitting booking data:', cleanFormData);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/bookings/book`, cleanFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Booking response:', response.data);
      showMessage("Booking submitted successfully!", 'success');
      alert("🎉 Booking submitted successfully! You will be redirected to the booking page.");
      resetForm();
      // Navigate to booking page after successful submission
      setTimeout(() => {
        navigate('/booking');
      }, 1500);
    } catch (error) {
      console.error('Booking submission error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        const errorMsg = error.response.data?.error || error.response.data?.message || `Server error (${error.response.status})`;
        
        // Handle specific room availability error
        if (errorMsg.includes('Not enough available rooms') || errorMsg.includes('available rooms')) {
          showMessage(`${errorMsg}. Please check room availability again and select different rooms.`, 'error');
          // Clear selected rooms and suggest re-checking availability
          setSelectedRooms([]);
          setHasCheckedAvailability(false);
        } else {
          showMessage(`Failed to submit booking: ${errorMsg}`, 'error');
        }
      } else if (error.request) {
        showMessage('Network error. Please check your connection and try again.', 'error');
      } else {
        showMessage(`An unexpected error occurred: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);
      setFormData(prev => ({ ...prev, [name]: imageUrl }));
    }
  };

  // Helper function to get a category name by ID
  const getCategoryName = (categoryId) => {
    const category = allCategories.find(cat => cat._id === categoryId);
    return category && category.name ? category.name : 'Unknown Category';
  };

  const isCheckAvailabilityDisabled =
    !formData.checkInDate ||
    !formData.checkOutDate ||
    new Date(formData.checkInDate) >= new Date(formData.checkOutDate);

  // Component rendering
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 rounded-2xl shadow-md border border-[color:var(--color-border)] text-[color:var(--color-text)] overflow-x-hidden">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-[color:var(--color-text)] flex items-center justify-center gap-3">
        Booking Form
      </h2>
      {message && (
        <div
          className={`px-4 py-3 rounded relative mb-4 mx-auto max-w-3xl ${
            messageType === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
          role="alert"
        >
          <span className="block sm:inline">{message}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => showMessage(null)}
          >
            <svg
              className="fill-current h-6 w-6"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Guest Search and GRC Number */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
            <FaInfoCircle className="text-amber-400" /> Guest Registration Card (GRC) Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grcNo">GRC No.</Label>
              <Input
                id="grcNo"
                name="grcNo"
                value={formData.grcNo}
                readOnly
                className="bg-gray-100 border border-secondary rounded-lg cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchGRC">Search by GRC</Label>
              <Input
                id="searchGRC"
                name="searchGRC"
                value={searchGRC}
                onChange={(e) => setSearchGRC(e.target.value)}
                placeholder="Enter GRC number to load booking"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleFetchBooking();
                  }
                }}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={handleFetchBooking}
                disabled={loading || !searchGRC.trim()}
                className="flex-1"
              >
                {loading ? "Searching..." : "Search Booking"}
              </Button>
              <Button
                onClick={() => {
                  setSearchGRC('');
                  resetForm();
                }}
                disabled={loading}
                variant="outline"
                className="px-3"
              >
                Clear
              </Button>
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
              <Input
                id="checkInDate"
                name="checkInDate"
                type="date"
                value={formData.checkInDate}
                onChange={handleDateChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOutDate">Check-out Date</Label>
              <Input
                id="checkOutDate"
                name="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                onChange={handleDateChange}
                required
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCheckAvailability}
                disabled={isCheckAvailabilityDisabled}
                className="w-full"
              >
                Check Availability
              </Button>
            </div>
          </div>

          {hasCheckedAvailability && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-gray-700">Room Categories</h3>
              {allCategories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category Name</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Availability</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allCategories.map(cat => (
                        <tr key={cat._id} className={`${formData.categoryId === cat._id ? 'bg-blue-50' : 'hover:bg-gray-50'} ${cat.availableRoomsCount === 0 ? 'opacity-50' : ''}`}>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">
                            {cat.name || 'Unknown'}
                            {cat.availableRoomsCount === 0 && <span className="text-red-500 text-xs ml-2">(No available rooms)</span>}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {`${cat.availableRoomsCount || 0} of ${cat.totalRooms || 0} available`}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <button
                              type="button"
                              onClick={() => handleCategoryCardClick(cat._id)}
                              disabled={cat.availableRoomsCount === 0}
                              className={`px-3 py-1 rounded-md text-white transition-colors ${
                                cat.availableRoomsCount === 0 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : formData.categoryId === cat._id 
                                    ? 'bg-blue-600 hover:bg-blue-700' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                              }`}
                            >
                              {cat.availableRoomsCount === 0 ? 'Unavailable' : formData.categoryId === cat._id ? 'Selected' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 col-span-full">No categories found. Please check availability first.</p>
              )}
            </div>
          )}

          {formData.categoryId && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-gray-700">Select Rooms ({getCategoryName(formData.categoryId)})</h3>
              <p className="text-sm text-gray-500 mb-2">Available rooms: {roomsForSelectedCategory.length}</p>
              {roomsForSelectedCategory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Number</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Name</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {roomsForSelectedCategory.map(room => (
                        <tr key={room._id} className={`${selectedRooms.some(r => r._id === room._id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                          <td className="py-4 px-6 text-sm">
                            <button
                              type="button"
                              onClick={() => handleRoomSelection(room)}
                              className={`px-3 py-1 rounded-md text-white transition-colors ${
                                selectedRooms.some(r => r._id === room._id)
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-red-500 hover:bg-red-600'
                              }`}
                            >
                              {selectedRooms.some(r => r._id === room._id) ? 'Unselect' : 'Select'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">{room.room_number || 'N/A'}</td>
                          <td className="py-4 px-6 text-sm text-gray-500">{room.title || 'N/A'}</td>
                          <td className="py-4 px-6 text-sm text-gray-500">{room.capacity || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No rooms available for this category.</p>
              )}
            </div>
          )}
        </section>

        {/* Guest Details Section */}
        <section className="rounded-xl p-6 border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
            <FaUser className="text-amber-400" /> Guest Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salutation">Salutation</Label>
              <Select
                id="salutation"
                name="salutation"
                value={formData.salutation}
                onChange={handleChange}
              >
                <option value="mr.">Mr.</option>
                <option value="mrs.">Mrs.</option>
                <option value="ms.">Ms.</option>
                <option value="dr.">Dr.</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">
                Guest Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNo">Mobile No</Label>
              <Input
                id="mobileNo"
                name="mobileNo"
                type="tel"
                value={formData.mobileNo}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNo">Whatsapp No</Label>
              <Input
                id="phoneNo"
                name="phoneNo"
                type="tel"
                value={formData.phoneNo}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="birthDate">Date of Birth</Label>
                <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleDateChange}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="anniversary">Anniversary Date</Label>
                <Input
                    id="anniversary"
                    name="anniversary"
                    type="date"
                    value={formData.anniversary}
                    onChange={handleDateChange}
                />
            </div>
            <div className="space-y-2 flex items-center gap-2 md:col-span-3">
              <Checkbox
                id="showCompanyDetails"
                checked={showCompanyDetails}
                onChange={(e) => setShowCompanyDetails(e.target.checked)}
              />
              <Label htmlFor="showCompanyDetails">Company Details</Label>
            </div>
            {showCompanyDetails && (
              <>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyGSTIN">Company GSTIN</Label>
                    <Input
                      id="companyGSTIN"
                      name="companyGSTIN"
                      value={formData.companyGSTIN}
                      onChange={handleChange}
                    />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="idProofType">ID Proof Type</Label>
              <Select
                id="idProofType"
                name="idProofType"
                value={formData.idProofType}
                onChange={handleChange}
              >
                <option value="">Select ID Proof Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="idProofNumber">
                  {formData.idProofType === 'Aadhaar' ? 'Aadhaar Number' :
                   formData.idProofType === 'PAN' ? 'PAN Number' :
                   formData.idProofType === 'Voter ID' ? 'Voter ID Number' :
                   formData.idProofType === 'Passport' ? 'Passport Number' :
                   formData.idProofType === 'Driving License' ? 'Driving License Number' :
                   formData.idProofType === 'Other' ? 'ID Proof Number' :
                   'ID Proof Number'}
                </Label>
                <Input 
                  id="idProofNumber" 
                  name="idProofNumber" 
                  value={formData.idProofNumber} 
                  onChange={handleChange}
                  placeholder={
                    formData.idProofType === 'Aadhaar' ? 'Enter 12-digit Aadhaar number' :
                    formData.idProofType === 'PAN' ? 'Enter 10-character PAN number' :
                    formData.idProofType === 'Voter ID' ? 'Enter Voter ID number' :
                    formData.idProofType === 'Passport' ? 'Enter Passport number' :
                    formData.idProofType === 'Driving License' ? 'Enter Driving License number' :
                    formData.idProofType === 'Other' ? 'Enter ID proof number' :
                    'Select ID proof type first'
                  }
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="idProofImageUrl">ID Proof Image 1</Label>
                <Input id="idProofImageUrl" name="idProofImageUrl" type="file" onChange={handleImageUpload} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="idProofImageUrl2">ID Proof Image 2</Label>
                <Input id="idProofImageUrl2" name="idProofImageUrl2" type="file" onChange={handleImageUpload} />
            </div>
            <div className="space-y-2 flex items-center gap-2">
              <Checkbox
                id="vip"
                checked={formData.vip}
                onChange={(e) => setFormData(prev => ({ ...prev, vip: e.target.checked }))}
              />
              <Label htmlFor="vip">VIP Guest</Label>
            </div>
          </div>
          <hr className="my-6 border-gray-200" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Guest Photo Capture</h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
                <Button
                    onClick={() => setIsCameraOpen(true)}
                    disabled={isCameraOpen}
                    className="w-full sm:w-auto bg-indigo-500 text-black hover:bg-indigo-600 disabled:bg-indigo-300"
                >
                    Open Camera
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        if (videoRef.current && videoRef.current.srcObject) {
                            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                            videoRef.current.srcObject = null;
                        }
                        setIsCameraOpen(false);
                    }}
                    disabled={!isCameraOpen}
                    className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
                >
                    Close Camera
                </Button>
            </div>
            {isCameraOpen && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="flex-grow max-w-lg">
                        <div className="relative w-full aspect-video bg-gray-200 rounded-md overflow-hidden">
                            <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover"></video>
                            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                        </div>
                        <button
                            type="button"
                            onClick={handleCapturePhoto}
                            className="mt-4 w-full px-4 py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 disabled:bg-indigo-300 transition-colors"
                            disabled={!isCameraOpen}
                        >
                            Capture Photo
                        </button>
                    </div>
                </div>
            )}
            <div className="space-y-2 mt-4">
                <p className="text-gray-600">Captured Photo</p>
                {capturedPhoto ? (
                    <div className="relative group max-w-lg mx-auto">
                        <img src={capturedPhoto} alt="Captured Guest Photo" className="rounded-md object-cover w-full h-auto" />
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove photo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 rounded-md text-center text-gray-500">No photo captured yet.</div>
                )}
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
              <Label htmlFor="numberOfRooms">Number of Rooms</Label>
              <Input
                id="numberOfRooms"
                name="numberOfRooms"
                type="number"
                min="1"
                value={formData.numberOfRooms}
                onChange={handleChange}
                readOnly
                className="bg-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noOfAdults">Adults</Label>
              <Input
                id="noOfAdults"
                name="noOfAdults"
                type="number"
                min="1"
                value={formData.noOfAdults}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noOfChildren">Children</Label>
              <Input
                id="noOfChildren"
                name="noOfChildren"
                type="number"
                min="0"
                value={formData.noOfChildren}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planPackage">Package Plan</Label>
              <Input
                id="planPackage"
                name="planPackage"
                value={formData.planPackage}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeIn">Check-in Time</Label>
              <Input
                id="timeIn"
                name="timeIn"
                type="time"
                value={formData.timeIn}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeOut">Check-out Time</Label>
              <Input
                id="timeOut"
                name="timeOut"
                type="time"
                value={formData.timeOut}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-2">
              <Label htmlFor="arrivedFrom">Arrival From</Label>
              <Input
                id="arrivedFrom"
                name="arrivedFrom"
                value={formData.arrivedFrom}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purposeOfVisit">Purpose of Visit</Label>
              <Input
                id="purposeOfVisit"
                name="purposeOfVisit"
                value={formData.purposeOfVisit}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="remark">Remarks</Label>
              <textarea
                id="remark"
                name="remark"
                value={formData.remark}
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
              <Input
                id="rate"
                name="rate"
                type="number"
                value={formData.rate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select
                id="paymentMode"
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPercent">Discount (%)</Label>
              <Input
                id="discountPercent"
                name="discountPercent"
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Partial">Partial</option>
              </Select>
            </div>

            {/* Show payment details based on payment mode */}
            {formData.paymentMode === "Card" && (
              <>
                <div className="col-span-full">
                  <span className="block font-semibold text-blue-700 mb-2">
                    Card Payment Details
                  </span>
                </div>
                <div className="space-y-2 col-span-full sm:col-span-1">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber || ""}
                    onChange={handleChange}
                    maxLength={19}
                    placeholder="XXXX XXXX XXXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    name="cardHolder"
                    value={formData.cardHolder || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry || ""}
                    onChange={handleChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCVV">CVV</Label>
                  <Input
                    id="cardCVV"
                    name="cardCVV"
                    value={formData.cardCVV || ""}
                    onChange={handleChange}
                    maxLength={4}
                  />
                </div>
              </>
            )}
            {formData.paymentMode === "UPI" && (
              <>
                <div className="col-span-full">
                  <span className="block font-semibold text-blue-700 mb-2">
                    UPI Payment Details
                  </span>
                </div>
                <div className="space-y-2 col-span-full sm:col-span-1">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    name="upiId"
                    value={formData.upiId || ""}
                    onChange={handleChange}
                    placeholder="example@upi"
                  />
                </div>
              </>
            )}
            {formData.paymentMode === "Bank Transfer" && (
              <>
                <div className="col-span-full">
                  <span className="block font-semibold text-blue-700 mb-2">
                    Bank Transfer Details
                  </span>
                </div>
                <div className="space-y-2 col-span-full sm:col-span-1">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    name="ifsc"
                    value={formData.ifsc || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

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

        <div className="mt-8 flex justify-center gap-4">
          <Button
            type="button"
            onClick={resetForm}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="px-8 py-3 bg-[color:var(--color-primary)] text-black font-semibold rounded-lg shadow-md hover:bg-[color:var(--color-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Submit Booking
          </Button>
        </div>
      </form>
    </div>
  );
};
const Root = () => (
    <AppProvider>
        <App />
    </AppProvider>
);

export default Root;
