
import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BookingView from "./BookingView";
import BookingEdit from "./BookingEdit";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("token");

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    try {
      if (!token) throw new Error("Authentication token not found.");
      const res = await fetch("https://backend-hazel-xi.vercel.app/api/bookings/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch bookings.");
      }
      const data = await res.json();
      console.log('Raw bookings API response:', data);
      const bookingsArray = Array.isArray(data) ? data : data.bookings || [];
      const mappedBookings = bookingsArray.map((b) => ({
        id: b._id || "N/A",
        name: b.guestDetails?.name || "N/A",
        roomNumber: b.roomNumber || "N/A",
        checkIn: b.bookingInfo?.checkIn
          ? new Date(b.bookingInfo.checkIn).toLocaleDateString()
          : "N/A",
        checkOut: b.bookingInfo?.checkOut
          ? new Date(b.bookingInfo.checkOut).toLocaleDateString()
          : "N/A",
        vip: b.vip || false,
        _raw: b,
      }));
      console.log('Mapped bookings for table:', mappedBookings);
      setBookings(mappedBookings);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.roomNumber.toString().includes(search.toString())
  );

  // Update booking function
  const updateBooking = async (bookingId, updatedData) => {
    const token = getAuthToken();
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }
    try {
      const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (res.ok && data && data.success) {
        setError(null);
        fetchBookings(); // Refresh bookings list
        setEditId(null); // Close the edit modal
      } else {
        setError(`Update failed: ${typeof data.error === 'string' ? data.error : JSON.stringify(data)}`);
      }
    } catch (error) {
      setError(`Error updating booking: ${error.message}.`);
      console.error('Error updating booking:', error);
    }
  };

  return (
    <div className="p-6 bg-[#fff9e6] min-h-screen relative">
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-semibold">Bookings</h2>
  
  <div className="flex gap-2 ml-auto">
    <Link
      to="/bookingform"
      className="bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-4 py-2 rounded"
    >
      Add Booking
    </Link>
    
  </div>
</div>

    

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or room number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-border-secondary border border-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:border-secondary w-full max-w-md shadow-sm"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GRC No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check Out
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((room) => (
              <React.Fragment key={room.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">{room._raw?.grcNo || "N/A"}</td>
                  <td className="px-6 py-4">{room.name}</td>
                  <td className="px-6 py-4">{room.roomNumber}</td>
                  <td className="px-6 py-4">{room.checkIn}</td>
                  <td className="px-6 py-4">{room.checkOut}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditId(editId === room.id ? null : room.id);
                          setViewId(null);
                        }}
                        title="Edit"
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setBookings(bookings.filter((b) => b.id !== room.id))
                        }
                        title="Delete"
                        className="p-1 rounded-full text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {/* Overlay for edit */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 z-50 flex justify-center items-start pt-10">
          <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <BookingEdit
              booking={bookings.find((b) => b.id === editId)?._raw}
              onSave={async (updated) => {
                await updateBooking(editId, updated);
              }}
              onCancel={() => setEditId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;