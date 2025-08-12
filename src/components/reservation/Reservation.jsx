import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

// Inline ReservationEdit for simplicity
const ReservationEdit = ({ reservation, onSave, onCancel }) => {
  const [current, setCurrent] = useState({
    guestName: reservation.guestName || "",
    grcNo: reservation.grcNo || "",
    checkInDate: reservation.checkInDate || "",
    checkOutDate: reservation.checkOutDate || "",
  });

  const handleChange = (field, value) => {
    setCurrent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(current);
  };

  if (!reservation) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded shadow"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">GRC No</label>
        <input
          type="text"
          value={current.grcNo}
          onChange={(e) => handleChange("grcNo", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Guest Name</label>
        <input
          type="text"
          value={current.guestName}
          onChange={(e) => handleChange("guestName", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Check In</label>
        <input
          type="date"
          value={current.checkInDate ? current.checkInDate.slice(0, 10) : ""}
          onChange={(e) => handleChange("checkInDate", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Check Out</label>
        <input
          type="date"
          value={current.checkOutDate ? current.checkOutDate.slice(0, 10) : ""}
          onChange={(e) => handleChange("checkOutDate", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Update
        </button>
      </div>
    </form>
  );
};

const ReservationPage = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for edit overlays
  const [editId, setEditId] = useState(null);

  // Fetch reservations from the API
  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "No authentication token found. Please log in to view reservations."
        );
        setIsLoading(false);
        return;
      }
      const { data } = await axios.get("/api/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations(
        Array.isArray(data.reservations) ? data.reservations : []
      );
    } catch (err) {
      setError(err.message || "Failed to load reservations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // useeffect
  useEffect(() => {
    fetchReservations();
  }, []);

  // Modal handler
  const handleEditModal = (reservation) => setEditId(reservation._id);

  // Update reservation via API (only table fields)
  const updateReservation = async (reservationId, updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in.");
      return;
    }
    // Only send the fields shown in the table
    const payload = {
      guestName: updatedData.guestName,
      grcNo: updatedData.grcNo,
      checkInDate: updatedData.checkInDate,
      checkOutDate: updatedData.checkOutDate,
    };
    try {
      await axios.put(`/api/reservations/${reservationId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReservations();
      setEditId(null);
    } catch (error) {
      alert(`Update failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async (reservation) => {
    setError(null);
    if (!reservation || !reservation._id) {
      setError("Cannot delete: Reservation ID not found.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/reservations/${reservation._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchReservations();
    } catch (err) {
      setError("Failed to delete reservation. Please try again.");
    }
  };

  const filtered = Array.isArray(reservations)
    ? reservations.filter(
        (r) =>
          typeof r.guestName === "string" &&
          r.guestName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const inputStyle =
    "bg-white border border-secondary rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="w-full p-4 sm:p-6 text-[color:var(--color-text)]" style={{ backgroundColor: 'hsl(45, 100%, 95%)' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--color-text)]">
          Reservation Page
        </h1>
        <button
          onClick={() => navigate("/reservationform")}
          className="bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-4 py-2 rounded text-sm sm:text-base"
        >
          Add Reservation
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by guest name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${inputStyle} w-full sm:max-w-md pl-10`}
        />
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            {typeof error === "string" ? error : JSON.stringify(error)}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading reservations...</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-[color:var(--color-border)] shadow-sm">
            <table className="min-w-full text-sm text-[color:var(--color-text)] border border-[color:var(--color-border)]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GRC No
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rooms
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length > 0 ? (
                  filtered.map((b) => (
                    <tr key={b._id}>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {b.guestName}
                        {b.vip && <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">VIP</span>}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {b.grcNo || "N/A"}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          b.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          b.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800' :
                          b.status === 'Waiting' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {b.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {b.mobileNo || b.phoneNo || 'N/A'}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {b.noOfRooms || 1}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        ₹{b.rate || 0}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex space-x-1 justify-center">
                          <button
                            onClick={() => handleEditModal(b)}
                            className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(b)}
                            className="p-1.5 rounded-full text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No reservations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filtered.length > 0 ? (
              filtered.map((b) => (
                <div
                  key={b._id}
                  className="bg-white border border-[color:var(--color-border)] rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{b.guestName}</h3>
                      <p className="text-sm text-gray-600">GRC: {b.grcNo || "N/A"}</p>
                      {b.vip && <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">VIP</span>}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      b.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      b.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800' :
                      b.status === 'Waiting' ? 'bg-blue-100 text-blue-800' :
                      b.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {b.status || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">Check In:</span>
                      <span className="ml-1 font-medium">{b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Check Out:</span>
                      <span className="ml-1 font-medium">{b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Mobile:</span>
                      <span className="ml-1 font-medium">{b.mobileNo || b.phoneNo || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Rooms:</span>
                      <span className="ml-1 font-medium">{b.noOfRooms || 1}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Rate:</span>
                      <span className="ml-1 font-medium text-lg">₹{b.rate || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEditModal(b)}
                      className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition duration-300"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      className="p-2 rounded-full text-red-600 hover:bg-red-50 transition duration-300"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-[color:var(--color-border)] rounded-lg shadow-sm p-8 text-center text-gray-500">
                No reservations found.
              </div>
            )}
          </div>
        </>
      )}

      {/* Overlay for edit */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <ReservationEdit
              reservation={reservations.find((r) => r._id === editId)}
              onSave={async (updated) => {
                await updateReservation(editId, updated);
              }}
              onCancel={() => setEditId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
