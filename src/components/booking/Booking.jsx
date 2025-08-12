import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, XCircle, CheckCircle, Search, X, FileText, Trash2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const BookingEdit = ({ booking, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: booking?.name || "",
    mobileNo: booking?.mobileNo || "",
    checkInDate: booking?.checkInDate
      ? new Date(booking.checkInDate).toISOString().split("T")[0]
      : "",
    checkOutDate: booking?.checkOutDate
      ? new Date(booking.checkOutDate).toISOString().split("T")[0]
      : "",
    roomNumber: booking?.roomNumber || "",
    vip: booking?.vip || false,
    status: booking?.status || "Booked",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
      <h3 className="text-2xl font-bold mb-4 text-center">
        Edit Booking: {booking?.name}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Guest Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Check-out Date
          </label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Room Number
          </label>
          <input
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="vip"
            checked={formData.vip}
            onChange={handleChange}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="text-gray-700 font-semibold">VIP</label>
        </div>
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const BookingPage = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  const getAuthToken = () => localStorage.getItem("token");

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const res = await axios.get("/api/bookings/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      
      console.log('Raw booking data:', data);
      const bookingsArray = Array.isArray(data) ? data : data.bookings || [];

      const mappedBookings = bookingsArray.map((b) => ({
        id: b._id || "N/A",
        grcNo: b.grcNo || "N/A",
        name: b.name || "N/A",
        mobileNo: b.mobileNo || "N/A",
        roomNumber: b.roomNumber || "N/A",
        checkIn: b.checkInDate
          ? new Date(b.checkInDate).toLocaleDateString()
          : "N/A",
        checkOut: b.checkOutDate
          ? new Date(b.checkOutDate).toLocaleDateString()
          : "N/A",
        status: b.status || "N/A",
        paymentStatus: b.paymentStatus || "Pending",
        vip: b.vip || false,
        _raw: b,
      }));

      console.log('Mapped bookings:', mappedBookings);
      setBookings(mappedBookings);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.roomNumber.toString().includes(search.toString()) ||
      b.grcNo.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBookingStatus = async (bookingId) => {
    try {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      const newStatus = booking.status === "Booked" ? "Cancelled" : "Booked";

      const updateData = {
        status: newStatus,
      };

      const token = getAuthToken();
      const res = await axios.put(`/api/bookings/update/${bookingId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: newStatus,
                _raw: {
                  ...b._raw,
                  status: newStatus,
                },
              }
            : b
        )
      );

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error toggling booking status:", err);
    }
  };

  const updateRoomStatus = async (roomNumber, status) => {
    try {
      const roomRes = await axios.get("/api/rooms/all");
      const rooms = roomRes.data;
      const room = rooms.find(r => r.room_number === roomNumber);
      
      if (room) {
        await axios.put(`/api/rooms/update/${room._id}`, { status });
      }
    } catch (err) {
      console.error("Error updating room status:", err);
    }
  };

  const updatePaymentStatus = async (bookingId, newPaymentStatus) => {
    try {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      const token = getAuthToken();
      const res = await axios.put(`/api/bookings/update/${bookingId}`, {
        paymentStatus: newPaymentStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                paymentStatus: newPaymentStatus,
                _raw: {
                  ...b._raw,
                  paymentStatus: newPaymentStatus,
                },
              }
            : b
        )
      );

      setError(null);
    } catch (err) {
      console.error("Error updating payment status:", err);
      setError(err.response?.data?.message || err.message || "Failed to update payment status");
    }
  };

  const generateInvoice = async (bookingId) => {
    try {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      const invoiceData = {
        serviceType: "Booking",
        serviceRefId: bookingId,
        bookingId: bookingId,
        invoiceNumber: `INV-${Date.now()}`,
        items: [
          {
            description: `Room ${booking.roomNumber} - ${booking.name}`,
            amount: 1000
          }
        ],
        subTotal: 1000,
        tax: 100,
        discount: 0,
        totalAmount: 1100,
        balanceAmount: 0,
        paymentMode: "Cash",
        status: "Paid"
      };

      const token = getAuthToken();
      const res = await axios.post("/api/invoices/create", invoiceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data) {
        setCurrentInvoice({ ...invoiceData, ...res.data, booking });
        setShowInvoice(true);
      }
    } catch (err) {
      console.error("Error generating invoice:", err);
      setError(err.response?.data?.message || err.message || "Failed to generate invoice");
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    
    try {
      const token = getAuthToken();
      await axios.delete(`/api/bookings/delete/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      setError(null);
    } catch (err) {
      console.error("Error deleting booking:", err);
      setError(err.response?.data?.message || err.message || "Failed to delete booking");
    }
  };

  const updateBooking = async (bookingId, updatedData) => {
    try {
      const res = await fetch(
        `https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      
      const responseData = await res.json();

      if (!res.ok) throw new Error(responseData.message || "Update failed");

      setError(null);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                grcNo: responseData.grcNo || b.grcNo,
                name: responseData.name || b.name,
                mobileNo: responseData.mobileNo || b.mobileNo,
                roomNumber: responseData.roomNumber || b.roomNumber,
                checkIn: responseData.checkInDate ? new Date(responseData.checkInDate).toLocaleDateString() : b.checkIn,
                checkOut: responseData.checkOutDate ? new Date(responseData.checkOutDate).toLocaleDateString() : b.checkOut,
                status: responseData.status || b.status,
                vip: responseData.vip !== undefined ? responseData.vip : b.vip,
                _raw: responseData,
              }
            : b
        )
      );
      setEditId(null);
    } catch (error) {
      setError(`Error: ${error.message}`);
      console.error("Update error:", error);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Bookings</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/bookingform")}
            className="bg-[color:var(--color-primary)] text-[color:var(--color-text)] font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-[color:var(--color-primary)] transition duration-300"
          >
            Add Booking
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center relative">
        <input
          type="text"
          placeholder="Search by name, room number, or GRC No..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] w-full max-w-md shadow-sm transition duration-300"
        />
        <Search className="absolute left-3 text-gray-400" size={20} />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex items-center justify-between shadow-sm">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900 transition duration-300"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-600">
          Loading bookings...
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  GRC No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.grcNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.roomNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.checkIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {booking.checkOut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "Booked"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : booking.status === "Checked In"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.paymentStatus}
                      onChange={(e) => updatePaymentStatus(booking.id, e.target.value)}
                      className="px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex space-x-2 justify-center items-center">
                      <button
                        onClick={() => setEditId(booking.id)}
                        title="Edit Booking"
                        className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition duration-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => toggleBookingStatus(booking.id)}
                        title={
                          booking.status === "Booked"
                            ? "Cancel Booking"
                            : "Re-Book"
                        }
                        className={`p-2 rounded-full transition duration-300 ${
                          booking.status === "Booked"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {booking.status === "Booked" ? (
                          <XCircle size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                      </button>
                      {booking.paymentStatus === "Paid" && (
                        <button
                          onClick={() => generateInvoice(booking.id)}
                          title="Generate Bill"
                          className="p-2 rounded-full text-green-600 hover:bg-green-50 transition duration-300"
                        >
                          <FileText size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        title="Delete Booking"
                        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition duration-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <BookingEdit
            booking={bookings.find((b) => b.id === editId)?._raw}
            onSave={async (updated) => {
              await updateBooking(editId, updated);
            }}
            onCancel={() => setEditId(null)}
          />
        </div>
      )}

      {showInvoice && currentInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Invoice</h3>
              <button
                onClick={() => setShowInvoice(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Invoice Number:</p>
                  <p>{currentInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="font-semibold">Date:</p>
                  <p>{new Date(currentInvoice.issueDate || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Guest Details:</p>
                <p>{currentInvoice.booking?.name}</p>
                <p>Room: {currentInvoice.booking?.roomNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Items:</p>
                {currentInvoice.items?.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.description}</span>
                    <span>₹{item.amount}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{currentInvoice.subTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{currentInvoice.tax}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{currentInvoice.totalAmount}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Print
              </button>
              <button
                onClick={() => setShowInvoice(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
