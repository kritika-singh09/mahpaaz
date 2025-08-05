
import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
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

const API_BASE_URL = "https://backend-hazel-xi.vercel.app/api/reservations";

const ReservationPage = () => {
  const navigate = useNavigate();
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
        setError("No authentication token found. Please log in to view reservations.");
        setIsLoading(false);
        return;
      }
      const response = await fetch(API_BASE_URL, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.error) errorMsg += `: ${errData.error}`;
        } catch {}
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setReservations(Array.isArray(data.reservations) ? data.reservations : []);
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
      const res = await fetch(`https://backend-hazel-xi.vercel.app/api/reservations/${reservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchReservations();
        setEditId(null);
      } else {
        const data = await res.json();
        alert(`Update failed: ${typeof data.error === 'string' ? data.error : JSON.stringify(data)}`);
      }
    } catch (error) {
      alert(`Error updating reservation: ${error.message}.`);
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
      const response = await fetch(`${API_BASE_URL}/${reservation._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchReservations();
    } catch (err) {
      setError("Failed to delete reservation. Please try again.");
    }
  };

  const filtered = Array.isArray(reservations)
    ? reservations.filter((r) =>
        typeof r.guestName === "string" &&
        r.guestName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const inputStyle =
    "bg-white border border-secondary rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="w-full p-6 text-[color:var(--color-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[color:var(--color-text)]">Reservation Page</h1>
        <button
          onClick={() => navigate("/reservationform")}
          className="bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-4 py-2 rounded"
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
          className={`${inputStyle} w-full md:w-1/3 pl-10`}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {typeof error === 'string' ? error : JSON.stringify(error)}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading reservations...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border)] shadow-sm">
          <table className="min-w-full text-sm text-[color:var(--color-text)] border border-[color:var(--color-border)]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GRC No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.guestName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.grcNo || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.checkInDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.checkOutDate}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditModal(b)}
                          className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(b)}
                          className="p-1 rounded-full text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Overlay for edit */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 z-50 flex justify-center items-start pt-10">
          <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
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