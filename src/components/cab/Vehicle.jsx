// // import React, { useState, useEffect } from 'react';

// // function App() {
// //   const API_BASE_URL = 'https://backend-hazel-xi.vercel.app/api/vehicle';

// //   const [vehicles, setVehicles] = useState([]);
// //   const [loading, setLoading] = useState(false); // Set to false initially as data is fetched after component mounts
// //   const [error, setError] = useState(null);
// //   const [message, setMessage] = useState('');
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [editingVehicle, setEditingVehicle] = useState(null);
// //   const [formData, setFormData] = useState({
// //     vehicleNumber: '',
// //     type: 'other',
// //     brand: '',
// //     model: '',
// //     seatingCapacity: '',
// //     status: 'active',
// //     color: '',
// //     fuelType: 'petrol',
// //     insuranceValidTill: '',
// //     registrationExpiry: '',
// //     remarks: '',
// //   });
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [filterStatus, setFilterStatus] = useState('all');

// //   // Function to fetch all vehicles from the backend
// //   const fetchVehicles = async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/all`);
// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.message || 'Failed to fetch vehicles.');
// //       }
// //       let data = await response.json();

// //       // IMPORTANT: Handle cases where the API might return an object with a 'vehicles' key
// //       // or directly an array. Adjust this based on your actual API response structure.
// //       if (data && typeof data === 'object' && data.vehicles && Array.isArray(data.vehicles)) {
// //         data = data.vehicles; // Assuming the actual array is under a 'vehicles' key
// //       } else if (!Array.isArray(data)) {
// //         // If it's not an array and not an object with a 'vehicles' key, assume it's an empty array or invalid.
// //         console.warn("API response for /all was not an array or did not contain a 'vehicles' array:", data);
// //         data = [];
// //       }

// //       // Format dates for display in the form (YYYY-MM-DD)
// //       const formattedData = data.map(vehicle => ({
// //         ...vehicle,
// //         insuranceValidTill: vehicle.insuranceValidTill ? new Date(vehicle.insuranceValidTill).toISOString().split('T')[0] : '',
// //         registrationExpiry: vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toISOString().split('T')[0] : '',
// //       }));
// //       setVehicles(formattedData);
// //     } catch (err) {
// //       console.error("Error fetching vehicles:", err);
// //       setError(`Failed to load vehicles: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Fetch vehicles on component mount
// //   useEffect(() => {
// //     fetchVehicles();
// //   }, []);

// //   // Handle form input changes
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   // Handle form submission (add or update)
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setLoading(true);
// //     setMessage('');
// //     setError(null);

// //     try {
// //       // Prepare data for the API, ensuring dates are sent as ISO strings if they exist
// //       const vehicleData = {
// //         ...formData,
// //         seatingCapacity: parseInt(formData.seatingCapacity) || 0,
// //         insuranceValidTill: formData.insuranceValidTill ? new Date(formData.insuranceValidTill).toISOString() : null,
// //         registrationExpiry: formData.registrationExpiry ? new Date(formData.registrationExpiry).toISOString() : null,
// //       };

// //       let response;
// //       if (editingVehicle) {
// //         // Update existing vehicle
// //         response = await fetch(`${API_BASE_URL}/update/${editingVehicle._id}`, {
// //           method: 'PUT',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify(vehicleData),
// //         });
// //       } else {
// //         // Add new vehicle
// //         response = await fetch(`${API_BASE_URL}/add`, {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify(vehicleData),
// //         });
// //       }

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.message || `Failed to ${editingVehicle ? 'update' : 'add'} vehicle.`);
// //       }

// //       setMessage(`Vehicle ${editingVehicle ? 'updated' : 'added'} successfully!`);
// //       resetForm();
// //       fetchVehicles(); // Re-fetch vehicles to update the list
// //     } catch (err) {
// //       console.error("Error saving vehicle:", err);
// //       setError(`Failed to save vehicle: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //       setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
// //       setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
// //     }
// //   };

// //   // Set form for editing
// //   const handleEdit = (vehicle) => {
// //     setEditingVehicle(vehicle);
// //     setFormData({
// //       vehicleNumber: vehicle.vehicleNumber,
// //       type: vehicle.type,
// //       brand: vehicle.brand,
// //       model: vehicle.model,
// //       seatingCapacity: vehicle.seatingCapacity,
// //       status: vehicle.status,
// //       color: vehicle.color,
// //       fuelType: vehicle.fuelType,
// //       // Ensure dates are in YYYY-MM-DD format for input type="date"
// //       insuranceValidTill: vehicle.insuranceValidTill ? new Date(vehicle.insuranceValidTill).toISOString().split('T')[0] : '',
// //       registrationExpiry: vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toISOString().split('T')[0] : '',
// //       remarks: vehicle.remarks,
// //     });
// //     setIsFormOpen(true);
// //   };

// //   // Delete a vehicle
// //   const handleDelete = async (id) => {
// //     if (window.confirm("Are you sure you want to delete this vehicle?")) {
// //       setLoading(true);
// //       setMessage('');
// //       setError(null);
// //       try {
// //         const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
// //           method: 'DELETE',
// //         });

// //         if (!response.ok) {
// //           const errorData = await response.json();
// //           throw new Error(errorData.message || 'Failed to delete vehicle.');
// //         }

// //         setMessage('Vehicle deleted successfully!');
// //         fetchVehicles(); // Re-fetch vehicles to update the list
// //       } catch (err) {
// //         console.error("Error deleting vehicle:", err);
// //         setError(`Failed to delete vehicle: ${err.message}`);
// //       } finally {
// //         setLoading(false);
// //         setTimeout(() => setMessage(''), 3000);
// //         setTimeout(() => setError(null), 3000);
// //       }
// //     }
// //   };

// //   // Reset form and close it
// //   const resetForm = () => {
// //     setEditingVehicle(null);
// //     setFormData({
// //       vehicleNumber: '',
// //       type: 'other',
// //       brand: '',
// //       model: '',
// //       seatingCapacity: '',
// //       status: 'active',
// //       color: '',
// //       fuelType: 'petrol',
// //       insuranceValidTill: '',
// //       registrationExpiry: '',
// //       remarks: '',
// //     });
// //     setIsFormOpen(false);
// //   };

// //   // Filtered vehicles based on search query and status (client-side filtering)
// //   const filteredVehicles = vehicles.filter(vehicle => {
// //     const matchesSearch = searchQuery === '' ||
// //       vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

// //     const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;

// //     return matchesSearch && matchesStatus;
// //   });

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
// //       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
// //         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Vehicle Management</h1>

// //         {/* Message and Error Display */}
// //         {message && (
// //           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
// //             <span className="block sm:inline">{message}</span>
// //           </div>
// //         )}
// //         {error && (
// //           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
// //             <span className="block sm:inline">{error}</span>
// //           </div>
// //         )}

// //         {/* Controls: Add Vehicle, Search, Filter */}
// //         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
// //           <button
// //             onClick={() => setIsFormOpen(true)}
// //             className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
// //           >
// //             Add New Vehicle
// //           </button>

// //           <input
// //             type="text"
// //             placeholder="Search by number, brand, model..."
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
// //           />

// //           <select
// //             value={filterStatus}
// //             onChange={(e) => setFilterStatus(e.target.value)}
// //             className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
// //           >
// //             <option value="all">All Statuses</option>
// //             <option value="active">Active</option>
// //             <option value="under_maintenance">Under Maintenance</option>
// //             <option value="unavailable">Unavailable</option>
// //           </select>
// //         </div>

// //         {/* Loading Indicator */}
// //         {loading && (
// //           <div className="flex items-center justify-center py-4">
// //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
// //             <p className="ml-3 text-gray-700">Loading data...</p>
// //           </div>
// //         )}

// //         {/* Vehicle List Table */}
// //         {!loading && (
// //           <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No.</th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel</th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Expiry</th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {filteredVehicles.length > 0 ? (
// //                   filteredVehicles.map((vehicle) => (
// //                     <tr key={vehicle._id} className="hover:bg-gray-50">
// //                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</td>
// //                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{vehicle.type.replace('_', ' ')}</td>
// //                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.brand}</td>
// //                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model}</td>
// //                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.seatingCapacity}</td>
// //                       <td className="px-4 py-4 whitespace-nowrap text-sm">
// //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                           vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
// //                           vehicle.status === 'under_maintenance' ? 'bg-yellow-100 text-yellow-800' :
// //                           'bg-red-100 text-red-800'
// //                         } capitalize`}>
// //                           {vehicle.status.replace('_', ' ')}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{vehicle.fuelType}</td>
// //                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
// //                         {vehicle.insuranceValidTill || 'N/A'}
// //                       </td>
// //                       <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                         <button
// //                           onClick={() => handleEdit(vehicle)}
// //                           className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150 ease-in-out"
// //                         >
// //                           Edit
// //                         </button>
// //                         <button
// //                           onClick={() => handleDelete(vehicle._id)}
// //                           className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
// //                         >
// //                           Delete
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-500">No vehicles found.</td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}


// //         {/* Add/Edit Vehicle Form Modal */}
// //         {isFormOpen && (
// //           <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
// //             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 animate-fade-in">
// //               <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
// //                 {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
// //               </h2>
// //               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {/* Vehicle Number */}
// //                 <div>
// //                   <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
// //                   <input
// //                     type="text"
// //                     id="vehicleNumber"
// //                     name="vehicleNumber"
// //                     value={formData.vehicleNumber}
// //                     onChange={handleChange}
// //                     required
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   />
// //                 </div>

// //                 {/* Type */}
// //                 <div>
// //                   <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
// //                   <select
// //                     id="type"
// //                     name="type"
// //                     value={formData.type}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   >
// //                     <option value="sedan">Sedan</option>
// //                     <option value="suv">SUV</option>
// //                     <option value="van">Van</option>
// //                     <option value="bus">Bus</option>
// //                     <option value="electric">Electric</option>
// //                     <option value="other">Other</option>
// //                   </select>
// //                 </div>

// //                 {/* Brand */}
// //                 <div>
// //                   <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
// //                   <input
// //                     type="text"
// //                     id="brand"
// //                     name="brand"
// //                     value={formData.brand}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   />
// //                 </div>

// //                 {/* Model */}
// //                 <div>
// //                   <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
// //                   <input
// //                     type="text"
// //                     id="model"
// //                     name="model"
// //                     value={formData.model}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   />
// //                 </div>

// //                 {/* Seating Capacity */}
// //                 <div>
// //                   <label htmlFor="seatingCapacity" className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
// //                   <input
// //                     type="number"
// //                     id="seatingCapacity"
// //                     name="seatingCapacity"
// //                     value={formData.seatingCapacity}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   />
// //                 </div>

// //                 {/* Status */}
// //                 <div>
// //                   <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
// //                   <select
// //                     id="status"
// //                     name="status"
// //                     value={formData.status}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   >
// //                     <option value="active">Active</option>
// //                     <option value="under_maintenance">Under Maintenance</option>
// //                     <option value="unavailable">Unavailable</option>
// //                   </select>
// //                 </div>

// //                 {/* Color */}
// //                 <div>
// //                   <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
// //                   <input
// //                     type="text"
// //                     id="color"
// //                     name="color"
// //                     value={formData.color}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   />
// //                 </div>

// //                 {/* Fuel Type */}
// //                 <div>
// //                   <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
// //                   <select
// //                     id="fuelType"
// //                     name="fuelType"
// //                     value={formData.fuelType}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   >
// //                     <option value="petrol">Petrol</option>
// //                     <option value="diesel">Diesel</option>
// //                     <option value="electric">Electric</option>
// //                     <option value="hybrid">Hybrid</option>
// //                   </select>
// //                 </div>

// //                 {/* Insurance Valid Till */}
// //                 <div>
// //                   <label htmlFor="insuranceValidTill" className="block text-sm font-medium text-gray-700 mb-1">Insurance Valid Till</label>
// //                   <input
// //                     type="date"
// //                     id="insuranceValidTill"
// //                     name="insuranceValidTill"
// //                     value={formData.insuranceValidTill}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   />
// //                 </div>

// //                 {/* Registration Expiry */}
// //                 <div>
// //                   <label htmlFor="registrationExpiry" className="block text-sm font-medium text-gray-700 mb-1">Registration Expiry</label>
// //                   <input
// //                     type="date"
// //                     id="registrationExpiry"
// //                     name="registrationExpiry"
// //                     value={formData.registrationExpiry}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   />
// //                 </div>

// //                 {/* Remarks */}
// //                 <div className="md:col-span-2">
// //                   <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
// //                   <textarea
// //                     id="remarks"
// //                     name="remarks"
// //                     value={formData.remarks}
// //                     onChange={handleChange}
// //                     rows="3"
// //                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                   ></textarea>
// //                 </div>

// //                 {/* Form Actions */}
// //                 <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
// //                   <button
// //                     type="button"
// //                     onClick={resetForm}
// //                     className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
// //                   >
// //                     {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;
// import React, { useState, useEffect } from 'react';

// function App() {
//   const API_BASE_URL = 'https://backend-hazel-xi.vercel.app/api/vehicle';

//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(false); // Set to false initially as data is fetched after component mounts
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingVehicle, setEditingVehicle] = useState(null);
//   const [formData, setFormData] = useState({
//     vehicleNumber: '',
//     seatingCapacity: '',
//     status: 'active',
//     insuranceValidTill: '',
//     registrationExpiry: '',
//     remarks: '',
//   });
//   const [generalSearchQuery, setGeneralSearchQuery] = useState(''); // Renamed for clarity
//   const [filterStatus, setFilterStatus] = useState('all');

//   // Removed: New states for ID search (searchIdQuery, vehicleById)

//   // Function to fetch all vehicles from the backend
//   const fetchVehicles = async () => {
//     setLoading(true);
//     setError(null);
//     // Removed: setVehicleById(null); // Clear single vehicle view when fetching all
//     try {
//       const response = await fetch(`${API_BASE_URL}/all`);
//       if (!response.ok) {
//         let errorMsg = 'Failed to fetch vehicles.';
//         try {
//           const errorData = await response.json();
//           errorMsg = errorData.message || errorMsg;
//         } catch (jsonError) {
//           console.error("Failed to parse error response as JSON for fetching vehicles:", jsonError);
//           errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API.`;
//         }
//         throw new Error(errorMsg);
//       }
//       let data = await response.json();

//       if (data && typeof data === 'object' && data.vehicles && Array.isArray(data.vehicles)) {
//         data = data.vehicles;
//       } else if (!Array.isArray(data)) {
//         console.warn("API response for /all was not an array or did not contain a 'vehicles' array:", data);
//         data = [];
//       }

//       const formattedData = data.map(vehicle => ({
//         ...vehicle,
//         insuranceValidTill: vehicle.insuranceValidTill ? new Date(vehicle.insuranceValidTill).toISOString().split('T')[0] : '',
//         registrationExpiry: vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toISOString().split('T')[0] : '',
//       }));
//       setVehicles(formattedData);
//     } catch (err) {
//       console.error("Error fetching vehicles:", err);
//       setError(`Failed to load vehicles: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Removed: Function to fetch a single vehicle by ID (fetchVehicleById)

//   // Initial fetch on component mount
//   useEffect(() => {
//     fetchVehicles();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Removed: Handle ID search input change (handleSearchIdChange)
//   // Removed: Trigger ID search on button click (handleSearchById)

//   // Handle form submission (add or update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     setMessage('');
//     setError(null);

//     try {
//       const vehicleData = {
//         vehicleNumber: formData.vehicleNumber,
//         seatingCapacity: parseInt(formData.seatingCapacity) || 0,
//         status: formData.status,
//         insuranceValidTill: formData.insuranceValidTill ? new Date(formData.insuranceValidTill).toISOString() : null,
//         registrationExpiry: formData.registrationExpiry ? new Date(formData.registrationExpiry).toISOString() : null,
//         remarks: formData.remarks,
//       };

//       let response;
//       let url;

//       if (editingVehicle) {
//         url = `${API_BASE_URL}/update/${editingVehicle._id}`;
//         console.log("Attempting to update vehicle with PUT to:", url);
//         response = await fetch(url, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(vehicleData),
//         });
//       } else {
//         url = `${API_BASE_URL}/add`;
//         console.log("Attempting to add vehicle with POST to:", url);
//         response = await fetch(url, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(vehicleData),
//         });
//       }

//       if (!response.ok) {
//         let errorMsg = `Failed to ${editingVehicle ? 'update' : 'add'} vehicle.`;
//         try {
//           const errorData = await response.json();
//           errorMsg = errorData.message || errorMsg;
//         } catch (jsonError) {
//           console.error("Failed to parse error response as JSON:", jsonError);
//           errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API.`;
//         }
//         throw new Error(errorMsg);
//       }

//       setMessage(`Vehicle ${editingVehicle ? 'updated' : 'added'} successfully!`);
//       resetForm();
//       fetchVehicles(); // Re-fetch vehicles to update the list
//     } catch (err) {
//       console.error("Error saving vehicle:", err);
//       setError(`Failed to save vehicle: ${err.message}`);
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage(''), 3000);
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   // Set form for editing
//   const handleEdit = (vehicle) => {
//     setEditingVehicle(vehicle);
//     setFormData({
//       vehicleNumber: vehicle.vehicleNumber,
//       seatingCapacity: vehicle.seatingCapacity,
//       status: vehicle.status,
//       insuranceValidTill: vehicle.insuranceValidTill ? new Date(vehicle.insuranceValidTill).toISOString().split('T')[0] : '',
//       registrationExpiry: vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toISOString().split('T')[0] : '',
//       remarks: vehicle.remarks,
//     });
//     setIsFormOpen(true);
//   };

//   // Delete a vehicle
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this vehicle?")) {
//       setLoading(true);
//       setMessage('');
//       setError(null);
//       try {
//         const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
//           method: 'DELETE',
//         });

//         if (response.status === 204) {
//           setMessage('Vehicle deleted successfully!');
//         } else if (response.ok) {
//           const data = await response.json();
//           setMessage(data.message || 'Vehicle deleted successfully!');
//         } else {
//           let errorMsg = 'Failed to delete vehicle.';
//           try {
//             const errorData = await response.json();
//             errorMsg = errorData.message || errorMsg;
//           } catch (jsonError) {
//             console.error("Failed to parse error response as JSON for delete:", jsonError);
//             errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API.`;
//           }
//           throw new Error(errorMsg);
//         }

//         fetchVehicles(); // Re-fetch vehicles to update the list
//       } catch (err) {
//         console.error("Error deleting vehicle:", err);
//         setError(`Failed to delete vehicle: ${err.message}`);
//       } finally {
//         setLoading(false);
//         setTimeout(() => setMessage(''), 3000);
//         setTimeout(() => setError(null), 3000);
//       }
//     }
//   };

//   // Reset form and close it
//   const resetForm = () => {
//     setEditingVehicle(null);
//     setFormData({
//       vehicleNumber: '',
//       seatingCapacity: '',
//       status: 'active',
//       insuranceValidTill: '',
//       registrationExpiry: '',
//       remarks: '',
//     });
//     setIsFormOpen(false);
//   };

//   // Handle clicks outside the modal content
//   const handleModalClick = (e) => {
//     if (e.target.id === 'vehicle-form-modal-overlay') {
//       resetForm();
//     }
//   };

//   // Determine which vehicles to display
//   const vehiclesToDisplay = vehicles.filter(vehicle => { // Now only filters based on general search and status
//     const matchesSearch = generalSearchQuery === '' ||
//       vehicle.vehicleNumber.toLowerCase().includes(generalSearchQuery.toLowerCase());

//     const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;

//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Vehicle Management</h1>

//         {/* Message and Error Display */}
//         {message && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <span className="block sm:inline">{message}</span>
//           </div>
//         )}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}

//         {/* Controls: Add Vehicle, Search, Filter */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
//           <button
//             onClick={() => setIsFormOpen(true)}
//             className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Add New Vehicle
//           </button>

//           {/* General Search */}
//           <input
//             type="text"
//             placeholder="Search by number..."
//             value={generalSearchQuery}
//             onChange={(e) => {
//               setGeneralSearchQuery(e.target.value);
//               // Removed: setSearchIdQuery(''); // Clear ID search when general search is used
//               // Removed: setVehicleById(null); // Clear single vehicle view
//             }}
//             className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
//           />

//           {/* Removed: ID Search input and button */}
//           {/* <div className="flex w-full sm:w-1/3 space-x-2">
//             <input
//               type="text"
//               placeholder="Search by ID..."
//               value={searchIdQuery}
//               onChange={handleSearchIdChange}
//               className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
//             />
//             <button
//               onClick={handleSearchById}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-150 ease-in-out"
//             >
//               Search ID
//             </button>
//           </div> */}

//           {/* Status Filter */}
//           <select
//             value={filterStatus}
//             onChange={(e) => {
//               setFilterStatus(e.target.value);
//               // Removed: setSearchIdQuery(''); // Clear ID search when status filter is used
//               // Removed: setVehicleById(null); // Clear single vehicle view
//             }}
//             className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
//           >
//             <option value="all">All Statuses</option>
//             <option value="active">Active</option>
//             <option value="under_maintenance">Under Maintenance</option>
//             <option value="unavailable">Unavailable</option>
//           </select>
//         </div>

//         {/* Loading Indicator */}
//         {loading && (
//           <div className="flex items-center justify-center py-4">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//             <p className="ml-3 text-gray-700">Loading data...</p>
//           </div>
//         )}

//         {/* Vehicle List Table */}
//         {!loading && (
//           <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No.</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Expiry</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {vehiclesToDisplay.length > 0 ? (
//                   vehiclesToDisplay.map((vehicle) => (
//                     <tr key={vehicle._id} className="hover:bg-gray-50">
//                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.seatingCapacity}</td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
//                           vehicle.status === 'under_maintenance' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-red-100 text-red-800'
//                         } capitalize`}>
//                           {vehicle.status.replace('_', ' ')}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {vehicle.insuranceValidTill || 'N/A'}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => handleEdit(vehicle)}
//                           className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150 ease-in-out"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(vehicle._id)}
//                           className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500">
//                       No vehicles found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}


//         {/* Add/Edit Vehicle Form Modal */}
//         {isFormOpen && (
//           <div
//             id="vehicle-form-modal-overlay"
//             className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
//             onClick={handleModalClick}
//           >
//             <style>
//               {`
//               /* For WebKit browsers (Chrome, Safari) */
//               .hide-scrollbar::-webkit-scrollbar {
//                   display: none;
//               }

//               /* For Firefox */
//               .hide-scrollbar {
//                   scrollbar-width: none; /* Firefox */
//               }
//               `}
//             </style>
//             <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 animate-fade-in hide-scrollbar">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//                 {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
//               </h2>
//               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Vehicle Number */}
//                 <div>
//                   <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
//                   <input
//                     type="text"
//                     id="vehicleNumber"
//                     name="vehicleNumber"
//                     value={formData.vehicleNumber}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Seating Capacity */}
//                 <div>
//                   <label htmlFor="seatingCapacity" className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
//                   <input
//                     type="number"
//                     id="seatingCapacity"
//                     name="seatingCapacity"
//                     value={formData.seatingCapacity}
//                     onChange={handleChange}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Status */}
//                 <div>
//                   <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     id="status"
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="active">Active</option>
//                     <option value="under_maintenance">Under Maintenance</option>
//                     <option value="unavailable">Unavailable</option>
//                   </select>
//                 </div>

//                 {/* Insurance Valid Till */}
//                 <div>
//                   <label htmlFor="insuranceValidTill" className="block text-sm font-medium text-gray-700 mb-1">Insurance Valid Till</label>
//                   <input
//                     type="date"
//                     id="insuranceValidTill"
//                     name="insuranceValidTill"
//                     value={formData.insuranceValidTill}
//                     onChange={handleChange}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Registration Expiry */}
//                 <div>
//                   <label htmlFor="registrationExpiry" className="block text-sm font-medium text-gray-700 mb-1">Registration Expiry</label>
//                   <input
//                     type="date"
//                     id="registrationExpiry"
//                     name="registrationExpiry"
//                     value={formData.registrationExpiry}
//                     onChange={handleChange}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Remarks */}
//                 <div className="md:col-span-2">
//                   <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
//                   <textarea
//                     id="remarks"
//                     name="remarks"
//                     value={formData.remarks}
//                     onChange={handleChange}
//                     rows="3"
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                   ></textarea>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//                   >
//                     {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';

function App() {
  const API_BASE_URL = 'https://backend-hazel-xi.vercel.app/api/vehicle';

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    seatingCapacity: '',
    status: 'active',
    insuranceValidTill: '',
    registrationExpiry: '',
    remarks: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [singleVehicleFound, setSingleVehicleFound] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    setSingleVehicleFound(null);

    try {
      let response;
      let data;

      const isPotentialId = searchQuery.length === 24 && /^[0-9a-fA-F]+$/.test(searchQuery);

      if (isPotentialId) {
        try {
          response = await fetch(`${API_BASE_URL}/get/${searchQuery}`);
          if (!response.ok) {
            console.warn(`Vehicle with ID ${searchQuery} not found. Attempting general search.`);
            response = await fetch(`${API_BASE_URL}/all`);
          } else {
            const vehicleData = await response.json();
            const formattedVehicle = {
              ...vehicleData,
              insuranceValidTill: vehicleData.insuranceValidTill ? new Date(vehicleData.insuranceValidTill).toISOString().split('T')[0] : '',
              registrationExpiry: vehicleData.registrationExpiry ? new Date(vehicleData.registrationExpiry).toISOString().split('T')[0] : '',
            };
            setSingleVehicleFound(formattedVehicle);
            setVehicles([]);
            setLoading(false);
            return;
          }
        } catch (idFetchError) {
          console.error("Error during ID fetch attempt, falling back to general search:", idFetchError);
          response = await fetch(`${API_BASE_URL}/all`);
        }
      } else {
        response = await fetch(`${API_BASE_URL}/all`);
      }

      if (!response.ok) {
        let errorMsg = 'Failed to fetch vehicles.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON for fetching vehicles:", jsonError);
          errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API.`;
        }
        throw new Error(errorMsg);
      }

      data = await response.json();

      if (data && typeof data === 'object' && data.vehicles && Array.isArray(data.vehicles)) {
        data = data.vehicles;
      } else if (!Array.isArray(data)) {
        console.warn("API response for /all was not an array or did not contain a 'vehicles' array:", data);
        data = [];
      }

      const formattedData = data.map(vehicle => ({
        ...vehicle,
        insuranceValidTill: vehicle.insuranceValidTill ? new Date(vehicle.insuranceValidTill).toISOString().split('T')[0] : '',
        registrationExpiry: vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toISOString().split('T')[0] : '',
      }));
      setVehicles(formattedData);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError(`Failed to load vehicles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setError(null);

    try {
      const vehicleData = {
        vehicleNumber: formData.vehicleNumber,
        seatingCapacity: parseInt(formData.seatingCapacity) || 0,
        status: formData.status,
        insuranceValidTill: formData.insuranceValidTill ? new Date(formData.insuranceValidTill).toISOString() : null,
        registrationExpiry: formData.registrationExpiry ? new Date(formData.registrationExpiry).toISOString() : null,
        remarks: formData.remarks,
      };

      let response;
      let url;

      if (editingVehicle) {
        url = `${API_BASE_URL}/update/${editingVehicle._id}`;
        console.log("Attempting to update vehicle with PUT to:", url);
        response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicleData),
        });
      } else {
        url = `${API_BASE_URL}/add`;
        console.log("Attempting to add vehicle with POST to:", url);
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicleData),
        });
      }

      if (!response.ok) {
        let errorMsg = `Failed to ${editingVehicle ? 'update' : 'add'} vehicle.`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API.`;
        }
        throw new Error(errorMsg);
      }

      setMessage(`Vehicle ${editingVehicle ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchVehicles();
    } catch (err) {
      console.error("Error saving vehicle:", err);
      setError(`Failed to save vehicle: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      seatingCapacity: vehicle.seatingCapacity,
      status: vehicle.status,
      insuranceValidTill: vehicle.insuranceValidTill ? new Date(vehicle.insuranceValidTill).toISOString().split('T')[0] : '',
      registrationExpiry: vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toISOString().split('T')[0] : '',
      remarks: vehicle.remarks,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      setLoading(true);
      setMessage('');
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
          method: 'DELETE',
        });

        if (response.status === 204) {
          setMessage('Vehicle deleted successfully!');
        } else if (response.ok) {
          const data = await response.json();
          setMessage(data.message || 'Vehicle deleted successfully!');
        } else {
          let errorMsg = 'Failed to delete vehicle.';
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (jsonError) {
            console.error("Failed to parse error response as JSON for delete:", jsonError);
            errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API.`;
          }
          throw new Error(errorMsg);
        }

        fetchVehicles();
      } catch (err) {
        console.error("Error deleting vehicle:", err);
        setError(`Failed to delete vehicle: ${err.message}`);
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const resetForm = () => {
    setEditingVehicle(null);
    setFormData({
      vehicleNumber: '',
      seatingCapacity: '',
      status: 'active',
      insuranceValidTill: '',
      registrationExpiry: '',
      remarks: '',
    });
    setIsFormOpen(false);
  };

  const handleModalClick = (e) => {
    if (e.target.id === 'vehicle-form-modal-overlay') {
      resetForm();
    }
  };

  const vehiclesToDisplay = singleVehicleFound
    ? [singleVehicleFound]
    : vehicles.filter(vehicle => {
        const matchesSearch = searchQuery === '' ||
          vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;

        return matchesSearch && matchesStatus;
      });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Vehicle Management</h1>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add New Vehicle
          </button>

          <input
            type="text"
            placeholder="Search by number or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setSearchQuery('');
            }}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="under_maintenance">Under Maintenance</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="ml-3 text-gray-700">Loading data...</p>
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No.</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Expiry</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehiclesToDisplay.length > 0 ? (
                  vehiclesToDisplay.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{vehicle.seatingCapacity}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                          vehicle.status === 'under_maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        } capitalize`}>
                          {vehicle.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {vehicle.insuranceValidTill || 'N/A'}
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-medium flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle._id)}
                          className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-3 text-center text-sm text-gray-500">
                      {searchQuery.trim() && !loading && !singleVehicleFound ? "No vehicle found with this ID or number." : "No vehicles found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isFormOpen && (
          <div
            id="vehicle-form-modal-overlay"
            className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={handleModalClick}
          >
            <style>
              {`
              /* For WebKit browsers (Chrome, Safari) */
              .hide-scrollbar::-webkit-scrollbar {
                  display: none;
              }

              /* For Firefox */
              .hide-scrollbar {
                  scrollbar-width: none; /* Firefox */
              }
              `}
            </style>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 animate-fade-in hide-scrollbar">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    id="vehicleNumber"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="seatingCapacity" className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    id="seatingCapacity"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="under_maintenance">Under Maintenance</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="insuranceValidTill" className="block text-sm font-medium text-gray-700 mb-1">Insurance Valid Till</label>
                  <input
                    type="date"
                    id="insuranceValidTill"
                    name="insuranceValidTill"
                    value={formData.insuranceValidTill}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="registrationExpiry" className="block text-sm font-medium text-gray-700 mb-1">Registration Expiry</label>
                  <input
                    type="date"
                    id="registrationExpiry"
                    name="registrationExpiry"
                    value={formData.registrationExpiry}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
