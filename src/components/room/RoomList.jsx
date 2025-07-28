import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader,
  BedDouble,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import RoomForm from "./RoomForm";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({
    _id: null,
    title: "",
    category: "",
    room_number: "",
    price: "",
    exptra_bed: false,
    is_reserved: false,
    status: "",
    description: "",
    images: [],
  });

  // New state for filtering and pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchRooms(), fetchCategories()]);
      setLoading(false);
    };

    fetchData();
  }, [page, statusFilter, categoryFilter, searchTerm]);

  const fetchRooms = async () => {
    try {
      setLoading(true);

      // Build query parameters (in a real implementation, you'd use these with your API)
      let url = "http://localhost:5000/api/rooms/all";

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      let filteredRooms = response.data;

      // Client-side filtering (replace with server-side filtering when API supports it)
      if (statusFilter !== "all") {
        filteredRooms = filteredRooms.filter((room) =>
          statusFilter === "available"
            ? room.status === "available"
            : statusFilter === "booked"
            ? room.status === "booked"
            : statusFilter === "maintenance"
            ? room.status === "maintenance"
            : true
        );
      }

      if (categoryFilter) {
        filteredRooms = filteredRooms.filter(
          (room) =>
            room.category === categoryFilter ||
            (room.category && room.category._id === categoryFilter)
        );
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredRooms = filteredRooms.filter(
          (room) =>
            room.title.toLowerCase().includes(term) ||
            room.room_number.toString().includes(term)
        );
      }

      // Calculate pagination
      const totalItems = filteredRooms.length;
      const totalPages = Math.ceil(totalItems / limit);

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const paginatedRooms = filteredRooms.slice(
        startIndex,
        startIndex + limit
      );

      setRooms(paginatedRooms);
      setTotal(totalItems);
      setTotalPages(totalPages);
      setError(null);
    } catch (err) {
      setError("Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/categories/all"
      );
      const categoryMap = {};
      response.data.forEach((category) => {
        categoryMap[category._id] = category.name;
      });
      setCategories(categoryMap);
      localStorage.setItem("roomCategories", JSON.stringify(categoryMap));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleAddRoom = () => {
    setEditMode(false);
    setCurrentRoom({
      _id: null,
      title: "",
      category: "",
      room_number: "",
      price: "",
      exptra_bed: false,
      is_reserved: false,
      status: "",
      description: "",
      images: [],
    });
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setEditMode(true);
    setCurrentRoom({
      _id: room._id,
      title: room.title,
      category: room.category,
      room_number: room.room_number,
      price: room.price,
      exptra_bed: room.exptra_bed,
      is_reserved: room.is_reserved,
      status: room.status,
      description: room.description,
      images: room.images,
      imageUrl: room.images && room.images.length > 0 ? room.images[0] : "",
    });
    setShowModal(true);
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        };

        await axios.delete(
          `http://localhost:5000/api/rooms/delete/${id}`,
          config
        );
        setRooms(rooms.filter((room) => room._id !== id));
      } catch (err) {
        console.error("Error deleting room:", err);
        alert("Failed to delete room");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const roomData = {
        title: currentRoom.title,
        category: currentRoom.category,
        room_number: currentRoom.room_number,
        price: currentRoom.price,
        extra_bed: currentRoom.exptra_bed,
        status: currentRoom.status,
        description: currentRoom.description,
        images: currentRoom.images,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      };

      if (editMode) {
        const response = await axios.put(
          `http://localhost:5000/api/rooms/update/${currentRoom._id}`,
          roomData,
          config
        );

        setRooms(
          rooms.map((room) =>
            room._id === currentRoom._id ? response.data : room
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/rooms/add",
          roomData,
          config
        );
        setRooms([...rooms, response.data.room]);
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error saving room:", err);
      alert("Failed to save room");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "booked":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen overflow-y-auto bg-[#fff9e6]">
      <div className="flex items-center justify-between  mt-6 ">
        <h1 className="text-3xl font-extrabold text-[#1f2937]">Rooms</h1>{" "}
        <button
          onClick={handleAddRoom}
          className="bg-secondary text-dark px-4 py-2 cursor-pointer rounded-lg hover:shadow-lg transition-shadow font-medium"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add Room
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 ">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by room title or number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-end" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="capitalize mr-2">{statusFilter}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-100">
              {["all", "available", "booked", "maintenance"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 capitalize transition-colors hover:bg-gray-50 ${
                    statusFilter === status
                      ? "font-medium text-primary"
                      : "text-dark/70"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* {Object.keys(categories).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-dark/70 self-center">Filter by Category:</span>
          <button
            onClick={() => {
              setCategoryFilter("");
              setPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-sm ${
              categoryFilter === ""
                ? "bg-secondary text-dark font-medium "
                : "bg-primary/30 text-dark cursor-pointer"
            }`}
          >
            All
          </button>
          {Object.entries(categories).map(([id, name]) => (
            <button
              key={id}
              onClick={() => {
                setCategoryFilter(id);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-sm ${
                categoryFilter === id
                  ? "bg-secondary text-dark font-medium "
                  : "bg-primary/30 text-dark cursor-pointer"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )} */}

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 text-secondary animate-spin" />
          <span className="ml-2 text-dark">Loading rooms...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-primary/50 border border-gray-200 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Image Section */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {room.images &&
                    room.images.length > 0 &&
                    room.images[0].startsWith("data:image/") ? (
                      <img
                        src={room.images[0]}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <BedDouble size={48} className="text-gray-400" />
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="bg-white/80 cursor-pointer text-dark p-1.5 rounded-full hover:bg-white"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="bg-white/80 text-red-600 p-1.5 rounded-full hover:bg-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusClass(
                          room.status
                        )}`}
                      >
                        {room.status
                          ? room.status.charAt(0).toUpperCase() +
                            room.status.slice(1)
                          : "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-dark">
                        Room {room.room_number}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-dark/70">Room title:</span>
                      <span className="font-semibold text-dark">
                        {room.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-dark/70">Category:</span>
                      <span className="font-semibold text-dark">
                        {room.category &&
                        typeof room.category === "object" &&
                        room.category.name
                          ? room.category.name
                          : categories[room.category] || "Unknown"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-dark/70">Price:</span>
                        <span className="font-semibold text-dark">
                          ₹{room.price}/night
                        </span>
                      </div>

                      {room.exptra_bed && (
                        <div className="mt-2 py-1 px-2 bg-blue-100 text-blue-800 text-xs rounded">
                          Extra Bed Available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-dark/70">
                No rooms found matching your criteria
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`p-2 rounded-lg ${
                  page === 1
                    ? "text-dark/40 cursor-not-allowed"
                    : "text-dark hover:bg-secondary/50"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-dark">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`p-2 rounded-lg ${
                  page === totalPages
                    ? "text-dark/40 cursor-not-allowed"
                    : "text-dark hover:bg-secondary/50"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      <RoomForm
        showModal={showModal}
        setShowModal={setShowModal}
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
        handleSubmit={handleSubmit}
        editMode={editMode}
      />
    </div>
  );
};

export default RoomList;
