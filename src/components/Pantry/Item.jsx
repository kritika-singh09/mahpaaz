import React, { useState, useEffect, useCallback } from 'react';

// API Base URL
const API_BASE_URL = 'https://backend-hazel-xi.vercel.app/api/pantry';
const PANTRY_ITEMS_URL = `${API_BASE_URL}/items`;

// Gemini API Key (left empty for Canvas runtime injection)
const apiKey = "";

// Confirmation Modal Component
function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative p-8 bg-white w-full max-w-sm mx-auto rounded-lg shadow-xl animate-fade-in-down">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Action</h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// Enum options for dropdowns, derived from the Mongoose schema
const CATEGORY_OPTIONS = ['food', 'beverage', 'spices', 'dairy', 'frozen', 'dry-goods', 'other'];
const UNIT_OPTIONS = ['kg', 'liter', 'piece', 'pack', 'bottle', 'box', 'bag'];

// Pantry Item Form Component
function PantryForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORY_OPTIONS[0],
    currentStock: 0,
    unit: UNIT_OPTIONS[0],
    minThreshold: 0,
    reorderQuantity: 1,
    costPerUnit: 0,
    location: 'Main Pantry',
    autoReorder: false,
    supplier: {
      name: '',
      contactPerson: '',
      phone: '',
      email: ''
    },
    notes: ''
  });
  const [generatingNotes, setGeneratingNotes] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        supplier: initialData.supplier || { name: '', contactPerson: '', phone: '', email: '' }
      });
    } else {
      setFormData({
        name: '',
        category: CATEGORY_OPTIONS[0],
        currentStock: 0,
        unit: UNIT_OPTIONS[0],
        minThreshold: 0,
        reorderQuantity: 1,
        costPerUnit: 0,
        location: 'Main Pantry',
        autoReorder: false,
        supplier: {
          name: '',
          contactPerson: '',
          phone: '',
          email: ''
        },
        notes: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('supplier.')) {
      const supplierField = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        supplier: {
          ...prevData.supplier,
          [supplierField]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleGenerateUsageIdeas = async () => {
    setGeneratingNotes(true);
    try {
      const prompt = `Suggest 3-5 concise culinary uses or a simple recipe idea for ${formData.name} (${formData.category}).`;
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setFormData(prevData => ({ ...prevData, notes: text }));
      } else {
        console.error('Gemini API response structure unexpected:', result);
        alert('Failed to generate ideas. Please try again.');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      alert('Error generating ideas. Check console for details.');
    } finally {
      setGeneratingNotes(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      currentStock: parseFloat(formData.currentStock),
      minThreshold: parseFloat(formData.minThreshold),
      reorderQuantity: parseFloat(formData.reorderQuantity),
      costPerUnit: parseFloat(formData.costPerUnit)
    };
    onSubmit(initialData ? initialData._id : null, dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {CATEGORY_OPTIONS.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
        <input
          type="number"
          id="currentStock"
          name="currentStock"
          value={formData.currentStock}
          onChange={handleChange}
          min="0"
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
        <select
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {UNIT_OPTIONS.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="minThreshold" className="block text-sm font-medium text-gray-700 mb-1">Min Threshold</label>
        <input
          type="number"
          id="minThreshold"
          name="minThreshold"
          value={formData.minThreshold}
          onChange={handleChange}
          min="0"
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="reorderQuantity" className="block text-sm font-medium text-gray-700 mb-1">Reorder Quantity</label>
        <input
          type="number"
          id="reorderQuantity"
          name="reorderQuantity"
          value={formData.reorderQuantity}
          onChange={handleChange}
          min="1"
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="costPerUnit" className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit (₹)</label>
        <input
          type="number"
          id="costPerUnit"
          name="costPerUnit"
          value={formData.costPerUnit}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="md:col-span-2 flex items-center">
        <input
          type="checkbox"
          id="autoReorder"
          name="autoReorder"
          checked={formData.autoReorder}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="autoReorder" className="ml-2 block text-sm text-gray-900">Enable Auto Reorder</label>
      </div>

      <fieldset className="md:col-span-2 border p-4 rounded-md">
        <legend className="text-base font-medium text-gray-800">Supplier Details (Optional)</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label htmlFor="supplier.name" className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
            <input
              type="text"
              id="supplier.name"
              name="supplier.name"
              value={formData.supplier.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="supplier.contactPerson" className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
            <input
              type="text"
              id="supplier.contactPerson"
              name="supplier.contactPerson"
              value={formData.supplier.contactPerson}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="supplier.phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              id="supplier.phone"
              name="supplier.phone"
              value={formData.supplier.phone}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="supplier.email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="supplier.email"
              name="supplier.email"
              value={formData.supplier.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </fieldset>

      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <button
            type="button"
            onClick={handleGenerateUsageIdeas}
            disabled={generatingNotes || !formData.name || !formData.category}
            className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-1 px-2 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingNotes ? 'Generating...' : 'Generate Usage Ideas ✨'}
          </button>
        </div>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add notes or click 'Generate Usage Ideas' for suggestions."
        ></textarea>
      </div>

      <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          {initialData ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}

// Main App Component
function App() {
  // State variables for application data and UI
  const [pantryItems, setPantryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Item Form States
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [editingPantryItem, setEditingPantryItem] = useState(null);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLowStock, setFilterLowStock] = useState('all');

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState('');

  // Helper function to get auth token from local storage
  const getAuthToken = () => localStorage.getItem("token");

  // Function to fetch all pantry items from the backend
  const fetchPantryItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    try {
      if (!token) {
        throw new Error("Authentication token not found. Please ensure you have a token in local storage.");
      }

      const response = await fetch(PANTRY_ITEMS_URL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        let errorMsg = 'Failed to fetch pantry items.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON for fetching items:", jsonError);
          errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API and its authentication requirements.`;
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();

      const formattedData = Array.isArray(data.items) ? data.items.map(item => ({
        ...item,
        supplierName: item.supplier?.name || '',
        supplierContactPerson: item.supplier?.contactPerson || '',
        supplierPhone: item.supplier?.phone || '',
        supplierEmail: item.supplier?.email || '',
      })) : [];

      setPantryItems(formattedData);
    } catch (err) {
      console.error("Error fetching pantry items:", err);
      setError(`Failed to load pantry items: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchPantryItems();
  }, [fetchPantryItems]);

  // Item Management Functions
  const handleItemSubmit = async (id, data) => {
    setLoading(true);
    setMessage('');
    setError(null);
    const token = getAuthToken();

    try {
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      let response;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      if (id) {
        response = await fetch(`${PANTRY_ITEMS_URL}/${id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(PANTRY_ITEMS_URL, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        let errorMsg = `Failed to ${id ? 'update' : 'add'} item.`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API.`;
        }
        throw new Error(errorMsg);
      }

      setMessage(`Pantry item ${id ? 'updated' : 'added'} successfully!`);
      resetItemForm();
      fetchPantryItems();
    } catch (err) {
      console.error("Error saving pantry item:", err);
      setError(`Failed to save item: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleItemEdit = (item) => {
    setEditingPantryItem(item);
    setIsItemFormOpen(true);
  };

  const handleItemDelete = (id) => {
    setConfirmMessage("Are you sure you want to delete this pantry item?");
    setConfirmAction(() => async () => {
      setLoading(true);
      setMessage('');
      setError(null);
      const token = getAuthToken();

      try {
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(`${PANTRY_ITEMS_URL}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 204 || response.ok) {
          setMessage('Pantry item deleted successfully!');
        } else {
          let errorMsg = 'Failed to delete pantry item.';
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (jsonError) {
            console.error("Failed to parse error response as JSON for delete:", jsonError);
            errorMsg = `Server error: ${response.status} ${response.statusText}.`;
          }
          throw new Error(errorMsg);
        }
        fetchPantryItems();
      } catch (err) {
        console.error("Error deleting pantry item:", err);
        setError(`Failed to delete item: ${err.message}`);
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
        setTimeout(() => setError(null), 3000);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const resetItemForm = () => {
    setEditingPantryItem(null);
    setIsItemFormOpen(false);
  };

  // Handle clicks outside the modal content to close it
  const handleModalClick = (e) => {
    if (e.target.id === 'pantry-item-form-modal-overlay') {
      resetItemForm();
    }
  };

  // Filter and search logic for displaying items in the main table
  const filteredAndSearchedItems = pantryItems.filter(item => {
    const matchesSearch = itemSearchQuery === '' ||
      item.name.toLowerCase().includes(itemSearchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

    const matchesLowStock = filterLowStock === 'all' ||
      (filterLowStock === 'low' && item.isLowStock) ||
      (filterLowStock === 'ok' && !item.isLowStock);

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Items specifically for the "Reorder List" table (low stock items)
  const itemsNeedingReorder = pantryItems.filter(item => item.isLowStock);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Pantry Items Management</h1>

        {/* Authentication Status Display */}
        {/* <div className="text-center text-sm text-gray-600 mb-4">
          {getAuthToken() ? (
            <p>Authentication Token: <span className="font-semibold">Found in Local Storage</span></p>
          ) : (
            <p className="text-red-500">Authentication Token: <span className="font-semibold">Not Found in Local Storage</span></p>
          )}
          <p className="text-xs text-gray-500">
            For full functionality, ensure a token is set in your browser's local storage (e.g., `localStorage.setItem('token', 'your_jwt_token_here');`)
          </p>
        </div> */}

        {/* Message and Error Display */}
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

        {/* Controls: Add Item, Search, Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setIsItemFormOpen(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add New Item
          </button>

          <input
            type="text"
            placeholder="Search by item name..."
            value={itemSearchQuery}
            onChange={(e) => setItemSearchQuery(e.target.value)}
            className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map(category => (
              <option key={category} value={category} className="capitalize">{category.replace('-', ' ')}</option>
            ))}
          </select>

          <select
            value={filterLowStock}
            onChange={(e) => setFilterLowStock(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="all">All Stock Status</option>
            <option value="low">Low Stock</option>
            <option value="ok">In Stock</option>
          </select>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="ml-3 text-gray-700">Loading data...</p>
          </div>
        )}

        {/* Main Pantry Items List Table */}
        {!loading && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Pantry Items</h2>
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Threshold</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Stock?</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSearchedItems.length > 0 ? (
                    filteredAndSearchedItems.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-500 capitalize">{item.category.replace('-', ' ')}</td>
                        <td className="px-6 py-3 text-sm text-gray-500">{item.currentStock}</td>
                        <td className="px-6 py-3 text-sm text-gray-500">{item.unit}</td>
                        <td className="px-6 py-3 text-sm text-gray-500">{item.minThreshold}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.isLowStock ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right text-sm font-medium flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleItemEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleItemDelete(item._id)}
                            className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-3 text-center text-sm text-gray-500">
                        No pantry items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Items Needing Reorder Table */}
        {!loading && itemsNeedingReorder.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Items Needing Reorder</h2>
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Threshold</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Qty</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {itemsNeedingReorder.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{item.currentStock} {item.unit}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{item.minThreshold} {item.unit}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{item.reorderQuantity} {item.unit}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{item.supplierName || 'N/A'}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{item.notes || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Pantry Item Form Modal */}
        {isItemFormOpen && (
          <div
            id="pantry-item-form-modal-overlay"
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
                {editingPantryItem ? 'Edit Pantry Item' : 'Add New Pantry Item'}
              </h2>
              <PantryForm
                initialData={editingPantryItem}
                onSubmit={handleItemSubmit}
                onCancel={resetItemForm}
              />
            </div>
          </div>
        )}

        {/* Global Confirmation Modal */}
        {showConfirmModal && (
          <ConfirmationModal
            message={confirmMessage}
            onConfirm={() => {
              confirmAction();
              setShowConfirmModal(false);
            }}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
