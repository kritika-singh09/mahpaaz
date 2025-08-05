
// // import React, { useState, useEffect } from "react";
// // import { Edit, Trash2 } from "lucide-react";
// // import { Link, useNavigate } from "react-router-dom";
// // import BookingView from "./BookingView";
// // import BookingEdit from "./BookingEdit";

// // const BookingPage = () => {
// //   const [bookings, setBookings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [search, setSearch] = useState("");
// //   const [viewId, setViewId] = useState(null);
// //   const [editId, setEditId] = useState(null);
// //   const navigate = useNavigate();

// //   const getAuthToken = () => localStorage.getItem("token");

// //   const fetchBookings = async () => {
// //     setLoading(true);
// //     setError(null);
// //     const token = getAuthToken();

// //     try {
// //       if (!token) throw new Error("Authentication token not found.");
// //       const res = await fetch("https://backend-hazel-xi.vercel.app/api/bookings/all", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       if (!res.ok) {
// //         const errorData = await res.json();
// //         throw new Error(errorData.message || "Failed to fetch bookings.");
// //       }
// //       const data = await res.json();
// //       console.log('Raw bookings API response:', data);
// //       const bookingsArray = Array.isArray(data) ? data : data.bookings || [];
// //       const mappedBookings = bookingsArray.map((b) => ({
// //         id: b._id || "N/A",
// //         name: b.guestDetails?.name || "N/A",
// //         roomNumber: b.roomNumber || "N/A",
// //         checkIn: b.bookingInfo?.checkIn
// //           ? new Date(b.bookingInfo.checkIn).toLocaleDateString()
// //           : "N/A",
// //         checkOut: b.bookingInfo?.checkOut
// //           ? new Date(b.bookingInfo.checkOut).toLocaleDateString()
// //           : "N/A",
// //         vip: b.vip || false,
// //         _raw: b,
// //       }));
// //       console.log('Mapped bookings for table:', mappedBookings);
// //       setBookings(mappedBookings);
// //     } catch (err) {
// //       setError(err.message);
// //       console.error('Error fetching bookings:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchBookings();
// //   }, []);

// //   const filteredBookings = bookings.filter((b) =>
// //     b.name.toLowerCase().includes(search.toLowerCase()) ||
// //     b.roomNumber.toString().includes(search.toString())
// //   );

// //   // Update booking function
// //   const updateBooking = async (bookingId, updatedData) => {
// //     const token = getAuthToken();
// //     if (!token) {
// //       setError("Authentication required. Please log in.");
// //       return;
// //     }
// //     try {
// //       const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${token}`
// //         },
// //         body: JSON.stringify(updatedData)
// //       });
// //       const data = await res.json();
// //       if (res.ok && data && data.success) {
// //         setError(null);
// //         fetchBookings(); // Refresh bookings list
// //         setEditId(null); // Close the edit modal
// //       } else {
// //         setError(`Update failed: ${typeof data.error === 'string' ? data.error : JSON.stringify(data)}`);
// //       }
// //     } catch (error) {
// //       setError(`Error updating booking: ${error.message}.`);
// //       console.error('Error updating booking:', error);
// //     }
// //   };

// //   return (
// //     <div className="p-6 bg-[#fff9e6] min-h-screen relative">
// //       <div className="flex justify-between items-center mb-4">
// //   <h2 className="text-2xl font-semibold">Bookings</h2>
  
// //   <div className="flex gap-2 ml-auto">
// //     <Link
// //       to="/bookingform"
// //       className="bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-4 py-2 rounded"
// //     >
// //       Add Booking
// //     </Link>
    
// //   </div>
// // </div>

    

// //       <div className="mb-4">
// //         <input
// //           type="text"
// //           placeholder="Search by name or room number..."
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           className="bg-border-secondary border border-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:border-secondary w-full max-w-md shadow-sm"
// //         />
// //       </div>

// //       {loading ? (
// //         <div>Loading...</div>
// //       ) : error ? (
// //         <div className="text-red-500 text-center">{error}</div>
// //       ) : (
// //         <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 GRC No
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Name
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Room
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Check In
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Check Out
// //               </th>
// //               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Actions
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {filteredBookings.map((room) => (
// //               <React.Fragment key={room.id}>
// //                 <tr className="hover:bg-gray-50">
// //                   <td className="px-6 py-4">{room._raw?.grcNo || "N/A"}</td>
// //                   <td className="px-6 py-4">{room.name}</td>
// //                   <td className="px-6 py-4">{room.roomNumber}</td>
// //                   <td className="px-6 py-4">{room.checkIn}</td>
// //                   <td className="px-6 py-4">{room.checkOut}</td>
// //                   <td className="px-6 py-4 text-center">
// //                     <div className="flex space-x-2">
// //                       <button
// //                         onClick={() => {
// //                           setEditId(editId === room.id ? null : room.id);
// //                           setViewId(null);
// //                         }}
// //                         title="Edit"
// //                         className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
// //                       >
// //                         <Edit size={18} />
// //                       </button>
// //                       <button
// //                         onClick={() =>
// //                           setBookings(bookings.filter((b) => b.id !== room.id))
// //                         }
// //                         title="Delete"
// //                         className="p-1 rounded-full text-red-600 hover:bg-red-50"
// //                       >
// //                         <Trash2 size={18} />
// //                       </button>
// //                       <button
// //                         onClick={async () => {
// //                           // Toggle booking status between 'Booked' and 'Cancelled'
// //                           const newStatus = room._raw.status === 'Booked' ? 'Cancelled' : 'Booked';
// //                           try {
// //                             const token = getAuthToken();
// //                             const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${room.id}`,
// //                               {
// //                                 method: 'PUT',
// //                                 headers: {
// //                                   'Content-Type': 'application/json',
// //                                   'Authorization': `Bearer ${token}`
// //                                 },
// //                                 body: JSON.stringify({ status: newStatus })
// //                               }
// //                             );
// //                             const data = await res.json();
// //                             if (res.ok && data && data.success) {
// //                               setBookings(prev => prev.map(b => b.id === room.id ? { ...b, _raw: { ...b._raw, status: newStatus } } : b));
// //                             } else {
// //                               alert('Failed to update booking status.');
// //                             }
// //                           } catch (err) {
// //                             alert('Error updating booking status.');
// //                           }
// //                         }}
// //                         title={room._raw.status === 'Booked' ? 'Cancel Booking' : 'Book'}
// //                         className={`p-1 rounded-full ${room._raw.status === 'Booked' ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}
// //                       >
// //                         {room._raw.status === 'Booked' ? 'Cancel' : 'Book'}
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               </React.Fragment>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}

// //       {/* Overlay for edit */}
// //       {editId && (
// //         <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 z-50 flex justify-center items-start pt-10">
// //           <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
// //             <BookingEdit
// //               booking={bookings.find((b) => b.id === editId)?._raw}
// //               onSave={async (updated) => {
// //                 await updateBooking(editId, updated);
// //               }}
// //               onCancel={() => setEditId(null)}
// //             />
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default BookingPage;
// // import React, { useState, useEffect } from "react";
// // import { Edit, Trash2 } from "lucide-react";
// // import { Link, useNavigate } from "react-router-dom";
// // import BookingView from "./BookingView";
// // import BookingEdit from "./BookingEdit";

// // const BookingPage = () => {
// //   const [bookings, setBookings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [search, setSearch] = useState("");
// //   const [viewId, setViewId] = useState(null);
// //   const [editId, setEditId] = useState(null);
// //   const navigate = useNavigate();

// //   const getAuthToken = () => localStorage.getItem("token");

// //   const fetchBookings = async () => {
// //     setLoading(true);
// //     setError(null);
// //     const token = getAuthToken();

// //     try {
// //       if (!token) throw new Error("Authentication token not found.");
// //       const res = await fetch("https://backend-hazel-xi.vercel.app/api/bookings/all", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       if (!res.ok) {
// //         const errorData = await res.json();
// //         throw new Error(errorData.message || "Failed to fetch bookings.");
// //       }
// //       const data = await res.json();
// //       console.log('Raw bookings API response:', data);
// //       const bookingsArray = Array.isArray(data) ? data : data.bookings || [];
// //       const mappedBookings = bookingsArray.map((b) => ({
// //         id: b._id || "N/A",
// //         name: b.guestDetails?.name || "N/A",
// //         roomNumber: b.roomNumber || "N/A",
// //         checkIn: b.bookingInfo?.checkIn
// //           ? new Date(b.bookingInfo.checkIn).toLocaleDateString()
// //           : "N/A",
// //         checkOut: b.bookingInfo?.checkOut
// //           ? new Date(b.bookingInfo.checkOut).toLocaleDateString()
// //           : "N/A",
// //         vip: b.vip || false,
// //         _raw: b,
// //       }));
// //       console.log('Mapped bookings for table:', mappedBookings);
// //       setBookings(mappedBookings);
// //     } catch (err) {
// //       setError(err.message);
// //       console.error('Error fetching bookings:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchBookings();
// //   }, []);

// //   const filteredBookings = bookings.filter((b) =>
// //     b.name.toLowerCase().includes(search.toLowerCase()) ||
// //     b.roomNumber.toString().includes(search.toString())
// //   );

// //   // Update booking function
// //   const updateBooking = async (bookingId, updatedData) => {
// //     const token = getAuthToken();
// //     if (!token) {
// //       setError("Authentication required. Please log in.");
// //       return;
// //     }
// //     try {
// //       const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${token}`
// //         },
// //         body: JSON.stringify(updatedData)
// //       });
// //       const data = await res.json();
// //       if (res.ok && data && data.success) {
// //         setError(null);
// //         fetchBookings(); // Refresh bookings list
// //         setEditId(null); // Close the edit modal
// //       } else {
// //         setError(`Update failed: ${typeof data.error === 'string' ? data.error : JSON.stringify(data)}`);
// //       }
// //     } catch (error) {
// //       setError(`Error updating booking: ${error.message}.`);
// //       console.error('Error updating booking:', error);
// //     }
// //   };

// //   return (
// //     <div className="p-6 bg-[#fff9e6] min-h-screen relative">
// //       <div className="flex justify-between items-center mb-4">
// //         <h2 className="text-2xl font-semibold">Bookings</h2>
        
// //         <div className="flex gap-2 ml-auto">
// //           <Link
// //             to="/bookingform"
// //             className="bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-4 py-2 rounded"
// //           >
// //             Add Booking
// //           </Link>
// //         </div>
// //       </div>

// //       <div className="mb-4">
// //         <input
// //           type="text"
// //           placeholder="Search by name or room number..."
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           className="bg-border-secondary border border-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:border-secondary w-full max-w-md shadow-sm"
// //         />
// //       </div>

// //       {loading ? (
// //         <div>Loading...</div>
// //       ) : error ? (
// //         <div className="text-red-500 text-center">{error}</div>
// //       ) : (
// //         <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 GRC No
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Name
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Room
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Check In
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Check Out
// //               </th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Status
// //               </th>
// //               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Actions
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {filteredBookings.map((room) => (
// //               <React.Fragment key={room.id}>
// //                 <tr className="hover:bg-gray-50">
// //                   <td className="px-6 py-4">{room._raw?.grcNo || "N/A"}</td>
// //                   <td className="px-6 py-4">{room.name}</td>
// //                   <td className="px-6 py-4">{room.roomNumber}</td>
// //                   <td className="px-6 py-4">{room.checkIn}</td>
// //                   <td className="px-6 py-4">{room.checkOut}</td>
// //                   <td className="px-6 py-4">
// //                     <span className={`px-2 py-1 rounded-full text-xs ${
// //                       room._raw.status === 'Booked' 
// //                         ? 'bg-green-100 text-green-800' 
// //                         : room._raw.status === 'Cancelled' 
// //                           ? 'bg-red-100 text-red-800' 
// //                           : 'bg-gray-100 text-gray-800'
// //                     }`}>
// //                       {room._raw.status || 'N/A'}
// //                     </span>
// //                   </td>
// //                   <td className="px-6 py-4 text-center">
// //                     <div className="flex space-x-2">
// //                       <button
// //                         onClick={() => {
// //                           setEditId(editId === room.id ? null : room.id);
// //                           setViewId(null);
// //                         }}
// //                         title="Edit"
// //                         className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
// //                       >
// //                         <Edit size={18} />
// //                       </button>
// //                       <button
// //                         onClick={() =>
// //                           setBookings(bookings.filter((b) => b.id !== room.id))
// //                         }
// //                         title="Delete"
// //                         className="p-1 rounded-full text-red-600 hover:bg-red-50"
// //                       >
// //                         <Trash2 size={18} />
// //                       </button>
// //                       <button
// //                         onClick={async () => {
// //                           // Toggle booking status between 'Booked' and 'Cancelled'
// //                           const newStatus = room._raw.status === 'Booked' ? 'Cancelled' : 'Booked';
// //                           try {
// //                             const token = getAuthToken();
// //                             const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${room.id}`,
// //                               {
// //                                 method: 'PUT',
// //                                 headers: {
// //                                   'Content-Type': 'application/json',
// //                                   'Authorization': `Bearer ${token}`
// //                                 },
// //                                 body: JSON.stringify({ status: newStatus })
// //                               }
// //                             );
// //                             const data = await res.json();
// //                             if (res.ok && data && data.success) {
// //                               setBookings(prev => prev.map(b => b.id === room.id ? { ...b, _raw: { ...b._raw, status: newStatus } } : b));
// //                             } else {
// //                               alert('Failed to update booking status.');
// //                             }
// //                           } catch (err) {
// //                             alert('Error updating booking status.');
// //                           }
// //                         }}
// //                         title={room._raw.status === 'Booked' ? 'Cancel Booking' : 'Book'}
// //                         className={`p-1 rounded-full ${room._raw.status === 'Booked' ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}
// //                       >
// //                         {room._raw.status === 'Booked' ? 'Cancel' : 'Book'}
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               </React.Fragment>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}

// //       {/* Overlay for edit */}
// //       {editId && (
// //         <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 z-50 flex justify-center items-start pt-10">
// //           <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
// //             <BookingEdit
// //               booking={bookings.find((b) => b.id === editId)?._raw}
// //               onSave={async (updated) => {
// //                 await updateBooking(editId, updated);
// //               }}
// //               onCancel={() => setEditId(null)}
// //             />
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default BookingPage;
// // import React, { useState, useEffect } from "react";
// // import { Edit, Trash2 } from "lucide-react";
// // import { Link } from "react-router-dom";
// // import BookingEdit from "./BookingEdit";

// // const BookingPage = () => {
// //   const [bookings, setBookings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [search, setSearch] = useState("");
// //   const [editId, setEditId] = useState(null);

// //   const getAuthToken = () => localStorage.getItem("token");

// //   const fetchBookings = async () => {
// //     setLoading(true);
// //     setError(null);
// //     const token = getAuthToken();

// //     try {
// //       if (!token) throw new Error("Authentication token not found.");
// //       const res = await fetch("https://backend-hazel-xi.vercel.app/api/bookings/all", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
      
// //       if (!res.ok) {
// //         const errorData = await res.json();
// //         throw new Error(errorData.message || "Failed to fetch bookings.");
// //       }
      
// //       const data = await res.json();
// //       const bookingsArray = Array.isArray(data) ? data : data.bookings || [];
      
// //       const mappedBookings = bookingsArray.map((b) => ({
// //         id: b._id || "N/A",
// //         name: b.guestDetails?.name || "N/A",
// //         mobileNo: b.guestDetails?.mobileNo || "N/A",
// //         roomNumber: b.roomNumber || "N/A",
// //         checkIn: b.bookingInfo?.checkInDate
// //           ? new Date(b.bookingInfo.checkInDate).toLocaleDateString()
// //           : "N/A",
// //         checkOut: b.bookingInfo?.checkOutDate
// //           ? new Date(b.bookingInfo.checkOutDate).toLocaleDateString()
// //           : "N/A",
// //         status: b.status || "N/A",
// //         _raw: b,
// //       }));
      
// //       setBookings(mappedBookings);
// //     } catch (err) {
// //       setError(err.message);
// //       console.error('Error fetching bookings:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchBookings();
// //   }, []);

// //   const filteredBookings = bookings.filter((b) =>
// //     b.name.toLowerCase().includes(search.toLowerCase()) ||
// //     b.roomNumber.toString().includes(search.toString())
// //   );

// //   const toggleBookingStatus = async (bookingId) => {
// //     const token = getAuthToken();
// //     if (!token) {
// //       setError("Authentication required. Please log in.");
// //       return;
// //     }

// //     try {
// //       const booking = bookings.find(b => b.id === bookingId);
// //       if (!booking) {
// //         throw new Error("Booking not found");
// //       }

// //       const currentStatus = booking._raw?.status || "N/A";
// //       const newStatus = currentStatus === 'Booked' ? 'Cancelled' : 'Booked';

// //       // Create update payload with all required fields
// //       const updateData = {
// //         status: newStatus,
// //         guestDetails: {
// //           name: booking._raw?.guestDetails?.name || "",
// //           mobileNo: booking._raw?.guestDetails?.mobileNo || "",
// //           ...booking._raw?.guestDetails
// //         },
// //         bookingInfo: {
// //           checkInDate: booking._raw?.bookingInfo?.checkInDate || new Date().toISOString(),
// //           checkOutDate: booking._raw?.bookingInfo?.checkOutDate || new Date().toISOString(),
// //           ...booking._raw?.bookingInfo
// //         },
// //         roomNumber: booking._raw?.roomNumber || "",
// //         vip: booking._raw?.vip || false
// //       };

// //       const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${token}`
// //         },
// //         body: JSON.stringify(updateData)
// //       });

// //       if (!res.ok) {
// //         const errorData = await res.json();
// //         throw new Error(errorData.message || "Failed to update booking status");
// //       }

// //       // Update local state
// //       setBookings(prev => prev.map(b => 
// //         b.id === bookingId 
// //           ? { 
// //               ...b, 
// //               status: newStatus, 
// //               _raw: { 
// //                 ...b._raw, 
// //                 status: newStatus 
// //               } 
// //             } 
// //           : b
// //       ));

// //     } catch (err) {
// //       setError(err.message);
// //       console.error('Error toggling booking status:', err);
// //     }
// //   };

// //   const updateBooking = async (bookingId, updatedData) => {
// //     const token = getAuthToken();
// //     if (!token) {
// //       setError("Authentication required. Please log in.");
// //       return;
// //     }

// //     try {
// //       const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${token}`
// //         },
// //         body: JSON.stringify(updatedData)
// //       });
      
// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.message || "Update failed");
      
// //       setError(null);
// //       fetchBookings();
// //       setEditId(null);
// //     } catch (error) {
// //       setError(`Error: ${error.message}`);
// //       console.error('Update error:', error);
// //     }
// //   };

// //   return (
// //     <div className="p-6 bg-[#fff9e6] min-h-screen relative">
// //       <div className="flex justify-between items-center mb-4">
// //         <h2 className="text-2xl font-semibold">Bookings</h2>
// //         <div className="flex gap-2 ml-auto">
// //           <Link
// //             to="/bookingform"
// //             className="bg-[color:var(--color-primary)] text-[color:var(--color-text)] px-4 py-2 rounded"
// //           >
// //             Add Booking
// //           </Link>
// //         </div>
// //       </div>

// //       <div className="mb-4">
// //         <input
// //           type="text"
// //           placeholder="Search by name or room number..."
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           className="bg-border-secondary border border-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:border-secondary w-full max-w-md shadow-sm"
// //         />
// //       </div>

// //       {error && <div className="text-red-500 mb-4">{error}</div>}

// //       {loading ? (
// //         <div>Loading...</div>
// //       ) : (
// //         <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GRC No</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {filteredBookings.map((room) => (
// //               <tr key={room.id} className="hover:bg-gray-50">
// //                 <td className="px-6 py-4">{room._raw?.grcNo || "N/A"}</td>
// //                 <td className="px-6 py-4">{room.name}</td>
// //                 <td className="px-6 py-4">{room.roomNumber}</td>
// //                 <td className="px-6 py-4">{room.checkIn}</td>
// //                 <td className="px-6 py-4">{room.checkOut}</td>
// //                 <td className="px-6 py-4">
// //                   <span className={`px-2 py-1 rounded-full text-xs ${
// //                     room.status === 'Booked' 
// //                       ? 'bg-green-100 text-green-800' 
// //                       : room.status === 'Cancelled' 
// //                         ? 'bg-red-100 text-red-800' 
// //                         : 'bg-gray-100 text-gray-800'
// //                   }`}>
// //                     {room.status}
// //                   </span>
// //                 </td>
// //                 <td className="px-6 py-4 text-center">
// //                   <div className="flex space-x-2 justify-center">
// //                     <button
// //                       onClick={() => setEditId(room.id)}
// //                       title="Edit"
// //                       className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
// //                     >
// //                       <Edit size={18} />
// //                     </button>
// //                     <button
// //                       onClick={() => toggleBookingStatus(room.id)}
// //                       title={room.status === 'Booked' ? 'Cancel Booking' : 'Re-Book'}
// //                       className={`p-1 rounded-full ${
// //                         room.status === 'Booked' 
// //                           ? 'text-yellow-600 hover:bg-yellow-50' 
// //                           : 'text-green-600 hover:bg-green-50'
// //                       }`}
// //                     >
// //                       {room.status === 'Booked' ? 'Cancel' : 'Book'}
// //                     </button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}

// //       {editId && (
// //         <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 z-50 flex justify-center items-start pt-10">
// //           <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
// //             <BookingEdit
// //               booking={bookings.find((b) => b.id === editId)?._raw}
// //               onSave={async (updated) => {
// //                 await updateBooking(editId, updated);
// //               }}
// //               onCancel={() => setEditId(null)}
// //             />
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default BookingPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
//  import { Edit, XCircle, CheckCircle, Search, X } from "lucide-react";

// // This is a simplified, self-contained version of the BookingEdit component for demonstration.
// // In a real application, this would likely be in its own file and more complex.
// const navigate = useNavigate();

// const BookingEdit = ({ booking, onSave, onCancel }) => {
//   // Use a flat state object to match the provided Mongoose schema
//   const [formData, setFormData] = useState({
//     name: booking?.name || "",
//     mobileNo: booking?.mobileNo || "",
//     checkInDate: booking?.checkInDate
//       ? new Date(booking.checkInDate).toISOString().split("T")[0]
//       : "",
//     checkOutDate: booking?.checkOutDate
//       ? new Date(booking.checkOutDate).toISOString().split("T")[0]
//       : "",
//     roomNumber: booking?.roomNumber || "",
//     vip: booking?.vip || false,
//     status: booking?.status || "Booked",
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
//       <h3 className="text-2xl font-bold mb-4 text-center">
//         Edit Booking: {booking?.name}
//       </h3>
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-gray-700 font-semibold mb-2">Guest Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 font-semibold mb-2">Mobile Number</label>
//           <input
//             type="text"
//             name="mobileNo"
//             value={formData.mobileNo}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 font-semibold mb-2">Check-in Date</label>
//           <input
//             type="date"
//             name="checkInDate"
//             value={formData.checkInDate}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 font-semibold mb-2">Check-out Date</label>
//           <input
//             type="date"
//             name="checkOutDate"
//             value={formData.checkOutDate}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 font-semibold mb-2">Room Number</label>
//           <input
//             type="text"
//             name="roomNumber"
//             value={formData.roomNumber}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="vip"
//             checked={formData.vip}
//             onChange={handleChange}
//             className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//           />
//           <label className="text-gray-700 font-semibold">VIP</label>
//         </div>
//         <div className="md:col-span-2 flex justify-end gap-4 mt-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };


// const BookingPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [editId, setEditId] = useState(null);

//   // NOTE: You must provide a valid authentication token.
//   const getAuthToken = () => localStorage.getItem("token");

//   const fetchBookings = async () => {
//     setLoading(true);
//     setError(null);
//     const token = getAuthToken();

//     try {
//       if (!token) throw new Error("Authentication token not found. Please log in.");
      
//       const res = await fetch("https://backend-hazel-xi.vercel.app/api/bookings/all", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to fetch bookings.");
//       }
      
//       const data = await res.json();
//       const bookingsArray = Array.isArray(data) ? data : data.bookings || [];
      
//       // Map the API response to a flat object that matches the Mongoose schema
//       const mappedBookings = bookingsArray.map((b) => ({
//         id: b._id || "N/A",
//         grcNo: b.grcNo || "N/A",
//         name: b.name || "N/A",
//         mobileNo: b.mobileNo || "N/A",
//         roomNumber: b.roomNumber || "N/A",
//         checkIn: b.checkInDate
//           ? new Date(b.checkInDate).toLocaleDateString()
//           : "N/A",
//         checkOut: b.checkOutDate
//           ? new Date(b.checkOutDate).toLocaleDateString()
//           : "N/A",
//         status: b.status || "N/A",
//         vip: b.vip || false,
//         _raw: b, // Keep the raw data for editing
//       }));
      
//       setBookings(mappedBookings);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching bookings:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const filteredBookings = bookings.filter((b) =>
//     b.name.toLowerCase().includes(search.toLowerCase()) ||
//     b.roomNumber.toString().includes(search.toString()) ||
//     b.grcNo.toLowerCase().includes(search.toLowerCase())
//   );

//   const toggleBookingStatus = async (bookingId) => {
//     const token = getAuthToken();
//     if (!token) {
//       setError("Authentication required. Please log in.");
//       return;
//     }

//     try {
//       const booking = bookings.find(b => b.id === bookingId);
//       if (!booking) throw new Error("Booking not found");

//       const currentStatus = booking.status;
//       const newStatus = currentStatus === 'Booked' ? 'Cancelled' : 'Booked';

//       const updateData = {
//         ...booking._raw,
//         status: newStatus,
//       };

//       const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(updateData)
//       });

//       const responseData = await res.json();

//       if (!res.ok) {
//         throw new Error(responseData.message || "Failed to update booking status");
//       }

//       // Update local state with the new status directly
//       setBookings(prev => prev.map(b => 
//         b.id === bookingId 
//           ? { 
//               ...b, 
//               status: newStatus, 
//               _raw: { 
//                 ...b._raw, 
//                 status: newStatus 
//               } 
//             } 
//           : b
//       ));

//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error toggling booking status:', err);
//     }
//   };

//   const updateBooking = async (bookingId, updatedData) => {
//     const token = getAuthToken();
//     if (!token) {
//       setError("Authentication required. Please log in.");
//       return;
//     }

//     try {
//       const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(updatedData)
//       });
      
//       const responseData = await res.json();
//       if (!res.ok) throw new Error(responseData.message || "Update failed");
      
//       setError(null);
//       // Update local state with the new data from the response
//       setBookings(prev => prev.map(b => 
//         b.id === bookingId
//           ? {
//               ...b,
//               grcNo: responseData.grcNo,
//               name: responseData.name,
//               mobileNo: responseData.mobileNo,
//               roomNumber: responseData.roomNumber,
//               checkIn: new Date(responseData.checkInDate).toLocaleDateString(),
//               checkOut: new Date(responseData.checkOutDate).toLocaleDateString(),
//               status: responseData.status,
//               vip: responseData.vip,
//               _raw: responseData,
//             }
//           : b
//       ));
//       setEditId(null); // Close the modal on success
//     } catch (error) {
//       setError(`Error: ${error.message}`);
//       console.error('Update error:', error);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h2 className="text-3xl font-bold text-gray-800">Bookings</h2>
//         <div className="flex gap-2">
//           {/* NOTE: You will need a router (e.g., react-router-dom) to make this Link work properly. */}
//           {/* <button
//             onClick={() => console.log("Navigating to booking form...")}
//             className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
//           >
//             Add Booking
//           </button> */}
//           <button
//   onClick={() => navigate("/bookingform")}  // or your actual route path
//   className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
// >
//   Add Booking
// </button>

//         </div>
//       </div>

//       <div className="mb-6 flex items-center relative">
//         <input
//           type="text"
//           placeholder="Search by name, room number, or GRC No..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md shadow-sm transition duration-300"
//         />
//         <Search className="absolute left-3 text-gray-400" size={20} />
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex items-center justify-between shadow-sm">
//           <span>{error}</span>
//           <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 transition duration-300">
//             <X size={20} />
//           </button>
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center py-10 text-gray-600">Loading bookings...</div>
//       ) : (
//         <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
//           <table className="min-w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">GRC No</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {filteredBookings.map((room) => (
//                 <tr key={room.id} className="hover:bg-gray-50 transition-colors duration-200">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.grcNo}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.roomNumber}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.checkIn}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.checkOut}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       room.status === 'Booked' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {room.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center">
//                     <div className="flex space-x-2 justify-center items-center">
//                       <button
//                         onClick={() => setEditId(room.id)}
//                         title="Edit Booking"
//                         className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition duration-300"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => toggleBookingStatus(room.id)}
//                         title={room.status === 'Booked' ? 'Cancel Booking' : 'Re-Book'}
//                         className={`p-2 rounded-full transition duration-300 ${
//                           room.status === 'Booked' 
//                             ? 'text-red-600 hover:bg-red-50' 
//                             : 'text-green-600 hover:bg-green-50'
//                         }`}
//                       >
//                         {room.status === 'Booked' ? <XCircle size={18} /> : <CheckCircle size={18} />}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {editId && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
//           <BookingEdit
//             booking={bookings.find((b) => b.id === editId)?._raw}
//             onSave={async (updated) => {
//               await updateBooking(editId, updated);
//             }}
//             onCancel={() => setEditId(null)}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingPage;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, XCircle, CheckCircle, Search, X } from "lucide-react";

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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Guest Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Mobile Number</label>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Check-in Date</label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Check-out Date</label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Room Number</label>
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
  const navigate = useNavigate(); // ✅ FIXED: move useNavigate inside component

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const getAuthToken = () => localStorage.getItem("token");

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    try {
      if (!token) throw new Error("Authentication token not found. Please log in.");

      const res = await fetch("https://backend-hazel-xi.vercel.app/api/bookings/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch bookings.");
      }

      const data = await res.json();
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
        vip: b.vip || false,
        _raw: b,
      }));

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
    b.roomNumber.toString().includes(search.toString()) ||
    b.grcNo.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBookingStatus = async (bookingId) => {
    const token = getAuthToken();
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      const newStatus = booking.status === 'Booked' ? 'Cancelled' : 'Booked';

      const updateData = {
        ...booking._raw,
        status: newStatus,
      };

      const res = await fetch(`https://backend-hazel-xi.vercel.app/api/bookings/update/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to update booking status");
      }

      setBookings(prev => prev.map(b => 
        b.id === bookingId 
          ? { 
              ...b, 
              status: newStatus, 
              _raw: { 
                ...b._raw, 
                status: newStatus 
              } 
            } 
          : b
      ));

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error toggling booking status:', err);
    }
  };

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

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || "Update failed");

      setError(null);
      setBookings(prev => prev.map(b => 
        b.id === bookingId
          ? {
              ...b,
              grcNo: responseData.grcNo,
              name: responseData.name,
              mobileNo: responseData.mobileNo,
              roomNumber: responseData.roomNumber,
              checkIn: new Date(responseData.checkInDate).toLocaleDateString(),
              checkOut: new Date(responseData.checkOutDate).toLocaleDateString(),
              status: responseData.status,
              vip: responseData.vip,
              _raw: responseData,
            }
          : b
      ));
      setEditId(null);
    } catch (error) {
      setError(`Error: ${error.message}`);
      console.error('Update error:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Bookings</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/bookingform")}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
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
          className="bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md shadow-sm transition duration-300"
        />
        <Search className="absolute left-3 text-gray-400" size={20} />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex items-center justify-between shadow-sm">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 transition duration-300">
            <X size={20} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading bookings...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">GRC No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredBookings.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.grcNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.roomNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{room.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      room.status === 'Booked' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex space-x-2 justify-center items-center">
                      <button
                        onClick={() => setEditId(room.id)}
                        title="Edit Booking"
                        className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition duration-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => toggleBookingStatus(room.id)}
                        title={room.status === 'Booked' ? 'Cancel Booking' : 'Re-Book'}
                        className={`p-2 rounded-full transition duration-300 ${
                          room.status === 'Booked' 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {room.status === 'Booked' ? <XCircle size={18} /> : <CheckCircle size={18} />}
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
    </div>
  );
};

export default BookingPage;
