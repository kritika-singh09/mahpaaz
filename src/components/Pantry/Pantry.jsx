import React, { useState, useEffect, useCallback } from 'react';

// API Base URLs
const API_BASE_URL = 'https://backend-hazel-xi.vercel.app/api/pantry'; // Updated to Vercel URL
const PANTRY_ITEMS_URL = `${API_BASE_URL}/items`;
const PANTRY_ORDERS_URL = `${API_BASE_URL}/orders`;

// Gemini API Key (left empty for Canvas runtime injection)
const apiKey = "";

// Dummy Users for order requests/approvals - UPDATED STRUCTURE
const dummyUsers = [
  { _id: '66a2e461a5e378c66e60b213', username: 'Admin User', email: 'admin@example.com' },
  { _id: 'user1', username: 'Chef John Doe', email: 'john.doe@example.com' },
  { _id: 'user2', username: 'Receptionist Jane Smith', email: 'jane.smith@example.com' },
  { _id: 'user3', username: 'Pantry Manager Alex Lee', email: 'alex.lee@example.com' },
];

// Helper function to get auth token from local storage
const getAuthToken = () => localStorage.getItem("token");

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
const ALL_CATEGORIES = ['all', ...CATEGORY_OPTIONS]; // For filters

const ORDER_TYPES = ['kitchen-to-pantry', 'pantry-to-reception'];
const ORDER_STATUSES = ['pending', 'approved', 'fulfilled', 'cancelled'];
const ORDER_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

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
        // Using alert for simplicity, replace with custom modal if needed
        alert('Failed to generate ideas. Please try again.');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Using alert for simplicity
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

// Pantry Order Form Component
function PantryOrderForm({ initialData, onSubmit, onCancel, pantryItems, users }) {
  const [formData, setFormData] = useState({
    orderType: ORDER_TYPES[0],
    status: ORDER_STATUSES[0],
    requestedBy: users[0]?._id || '',
    approvedBy: '',
    items: initialData?.items || [{ pantryItemId: '', name: '', quantity: 1, unit: '', notes: '' }],
    notes: '',
    priority: ORDER_PRIORITIES[1],
  });
  const [generatingOrderNotes, setGeneratingOrderNotes] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        orderType: initialData.orderType,
        status: initialData.status,
        requestedBy: initialData.requestedBy._id || initialData.requestedBy, // Handle both object and string
        approvedBy: initialData.approvedBy?._id || initialData.approvedBy || '', // Handle both object and string
        items: initialData.items.map(item => ({ ...item })),
        notes: initialData.notes || '',
        priority: initialData.priority || ORDER_PRIORITIES[1],
      });
    } else {
      setFormData({
        orderType: ORDER_TYPES[0],
        status: ORDER_STATUSES[0],
        requestedBy: users[0]?._id || '',
        approvedBy: '',
        items: [{ pantryItemId: '', name: '', quantity: 1, unit: '', notes: '' }],
        notes: '',
        priority: ORDER_PRIORITIES[1],
      });
    }
  }, [initialData, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = value;

    if (name === 'pantryItemId') {
      const selectedPantryItem = pantryItems.find(item => item._id === value);
      if (selectedPantryItem) {
        newItems[index].name = selectedPantryItem.name;
        newItems[index].unit = selectedPantryItem.unit;
      } else {
        newItems[index].name = '';
        newItems[index].unit = '';
      }
    }
    setFormData(prevData => ({ ...prevData, items: newItems }));
  };

  const handleAddItemField = () => {
    setFormData(prevData => ({
      ...prevData,
      items: [...prevData.items, { pantryItemId: '', name: '', quantity: 1, unit: '', notes: '' }]
    }));
  };

  const handleRemoveItemField = (index) => {
    setFormData(prevData => ({
      ...prevData,
      items: prevData.items.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateOrderJustification = async () => {
    setGeneratingOrderNotes(true);
    try {
      const requestedByUser = users.find(u => u._id === formData.requestedBy)?.username || 'an unknown user'; // Use .username
      const itemsList = formData.items
        .filter(item => item.name && item.quantity)
        .map(item => `${item.quantity} ${item.unit} of ${item.name}`)
        .join(', ');

      const prompt = `Draft a brief justification or summary for a pantry order of type '${formData.orderType.replace('-', ' ')}' requested by '${requestedByUser}' including these items: ${itemsList}. Focus on the purpose of the order for hotel operations.`;

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
        alert('Failed to generate justification. Please try again.'); // Using alert for simplicity
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      alert('Error generating justification. Check console for details.'); // Using alert for simplicity
    } finally {
      setGeneratingOrderNotes(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredItems = formData.items.filter(item => item.pantryItemId && item.quantity > 0);

    if (filteredItems.length === 0) {
      alert('Please add at least one item to the order.');
      return;
    }

    const dataToSend = {
      ...formData,
      items: filteredItems.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity)
      })),
      requestDate: initialData?.requestDate || new Date().toISOString(),
      approvedDate: formData.status === 'approved' && !initialData?.approvedDate ? new Date().toISOString() : initialData?.approvedDate,
      fulfilledDate: formData.status === 'fulfilled' && !initialData?.fulfilledDate ? new Date().toISOString() : initialData?.fulfilledDate,
    };
    onSubmit(initialData ? initialData._id : null, dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
          <select
            id="orderType"
            name="orderType"
            value={formData.orderType}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {ORDER_TYPES.map(type => (
              <option key={type} value={type}>{type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700 mb-1">Requested By</label>
          <select
            id="requestedBy"
            name="requestedBy"
            value={formData.requestedBy}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="approvedBy" className="block text-sm font-medium text-gray-700 mb-1">Approved By (Optional)</label>
          <select
            id="approvedBy"
            name="approvedBy"
            value={formData.approvedBy}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select --</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option> 
            ))}
          </select>
        </div>
      </div>

      <div className="md:col-span-2">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {ORDER_PRIORITIES.map(priority => (
            <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
          ))}
        </select>
      </div>

      <fieldset className="md:col-span-2 border p-4 rounded-md">
        <legend className="text-base font-medium text-gray-800">Order Items</legend>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 items-end">
            <div>
              <label htmlFor={`pantryItemId-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Pantry Item</label>
              <select
                id={`pantryItemId-${index}`}
                name="pantryItemId"
                value={item.pantryItemId}
                onChange={(e) => handleItemChange(index, e)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
              >
                <option value="">-- Select Item --</option>
                {pantryItems.map(pItem => (
                  <option key={pItem._id} value={pItem._id}>{pItem.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`quantity-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
              <input
                type="number"
                id={`quantity-${index}`}
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                min="1"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
              />
            </div>
            <div>
              <label htmlFor={`unit-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
              <input
                type="text"
                id={`unit-${index}`}
                name="unit"
                value={item.unit}
                readOnly // Unit is derived from selected pantry item
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm"
              />
            </div>
            <div className="flex items-center justify-end">
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItemField(index)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md text-xs transition duration-300"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItemField}
          className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300"
        >
          Add Item
        </button>
      </fieldset>

      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <button
            type="button"
            onClick={handleGenerateOrderJustification}
            disabled={generatingOrderNotes || formData.items.filter(i => i.pantryItemId).length === 0}
            className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-1 px-2 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingOrderNotes ? 'Generating...' : 'Generate Justification ✨'}
          </button>
        </div>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add notes or click 'Generate Justification' for suggestions."
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
          {initialData ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}

// Pantry Order Table Row Component
function PantryOrderTableRow({ order, onEdit, onDelete, users }) {
  // Refined getUsername to handle both user objects and user IDs
  const getUsername = (userOrId) => {
    if (typeof userOrId === 'object' && userOrId !== null && userOrId.username) {
      return userOrId.username; // If it's a full user object from backend
    }
    // Otherwise, assume it's an ID string and find in dummyUsers
    const user = users.find(u => u._id === userOrId);
    return user ? user.username : 'Unknown User';
  };

  let statusClass = '';
  switch (order.status) {
    case 'pending':
      statusClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'approved':
      statusClass = 'bg-blue-100 text-blue-800';
      break;
    case 'fulfilled':
      statusClass = 'bg-green-100 text-green-800';
      break;
    case 'cancelled':
      statusClass = 'bg-red-100 text-red-800';
      break;
    default:
      statusClass = 'bg-gray-100 text-gray-800';
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-4 text-sm font-medium text-gray-900 capitalize">{order.orderType.replace('-', ' ')}</td>
      <td className="py-3 px-4 text-sm text-gray-700">
        <ul className="list-disc list-inside">
          {order.items.map((item, idx) => (
            <li key={idx}>{item.quantity} {item.unit} of {item.name}</li>
          ))}
        </ul>
      </td>
      <td className="py-3 px-4 text-sm text-gray-700">{getUsername(order.requestedBy)}</td>
      <td className="py-3 px-4 text-sm text-gray-700">{order.approvedBy ? getUsername(order.approvedBy) : 'N/A'}</td>
      <td className="py-3 px-4 text-sm text-gray-700">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-700 capitalize">{order.priority}</td>
      <td className="py-3 px-4 text-sm text-gray-700">{new Date(order.requestDate).toLocaleDateString()}</td>
      <td className="py-3 px-4 text-sm text-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(order)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs transition duration-300"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(order._id)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition duration-300"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// Main App Component
function App() {
  // State variables for application data and UI
  const [pantryItems, setPantryItems] = useState([]);
  const [pantryOrders, setPantryOrders] = useState([]); // New state for orders
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'orders'

  // Item Form States
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [editingPantryItem, setEditingPantryItem] = useState(null);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLowStock, setFilterLowStock] = useState('all');

  // Order Form States
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [editingPantryOrder, setEditingPantryOrder] = useState(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [filterOrderType, setFilterOrderType] = useState('all');
  const [filterOrderStatus, setFilterOrderStatus] = useState('all');

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {}); // Function to execute on confirm
  const [confirmMessage, setConfirmMessage] = useState('');


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

      const formattedData = Array.isArray(data.items) ? data.items.map(item => ({ // Access data.items
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

  // Function to fetch all pantry orders from the backend
  const fetchPantryOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    try {
      if (!token) {
        throw new Error("Authentication token not found. Please ensure you have a token in local storage.");
      }

      const response = await fetch(PANTRY_ORDERS_URL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        let errorMsg = 'Failed to fetch pantry orders.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON for fetching orders:", jsonError);
          errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API and its authentication requirements.`;
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setPantryOrders(Array.isArray(data.orders) ? data.orders : []); // Access data.orders
    } catch (err) {
      console.error("Error fetching pantry orders:", err);
      setError(`Failed to load pantry orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch based on active tab
  useEffect(() => {
    if (activeTab === 'items') {
      fetchPantryItems();
    } else if (activeTab === 'orders') {
      fetchPantryOrders();
    }
  }, [activeTab, fetchPantryItems, fetchPantryOrders]);

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

  // Order Management Functions
  const handleOrderSubmit = async (id, data) => {
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
        response = await fetch(`${PANTRY_ORDERS_URL}/${id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(PANTRY_ORDERS_URL, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        let errorMsg = `Failed to ${id ? 'update' : 'create'} order.`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          errorMsg = `Server error: ${response.status} ${response.statusText}. Please check the backend API.`;
        }
        throw new Error(errorMsg);
      }

      setMessage(`Pantry order ${id ? 'updated' : 'created'} successfully!`);
      resetOrderForm();
      fetchPantryOrders();
    } catch (err) {
      console.error("Error saving pantry order:", err);
      setError(`Failed to save order: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleOrderEdit = (order) => {
    setEditingPantryOrder(order);
    setIsOrderFormOpen(true);
  };

  const handleOrderDelete = (id) => {
    setConfirmMessage("Are you sure you want to delete this pantry order?");
    setConfirmAction(() => async () => {
      setLoading(true);
      setMessage('');
      setError(null);
      const token = getAuthToken();

      try {
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(`${PANTRY_ORDERS_URL}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 204 || response.ok) {
          setMessage('Pantry order deleted successfully!');
        } else {
          let errorMsg = 'Failed to delete pantry order.';
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (jsonError) {
            console.error("Failed to parse error response as JSON for delete:", jsonError);
            errorMsg = `Server error: ${response.status} ${response.statusText}.`;
          }
          throw new Error(errorMsg);
        }
        fetchPantryOrders();
      } catch (err) {
        console.error("Error deleting pantry order:", err);
        setError(`Failed to delete order: ${err.message}`);
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
        setTimeout(() => setError(null), 3000);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const resetOrderForm = () => {
    setEditingPantryOrder(null);
    setIsOrderFormOpen(false);
  };

  // Handle clicks outside the modal content to close it
  const handleModalClick = (e) => {
    if (e.target.id === 'pantry-item-form-modal-overlay') {
      resetItemForm();
    }
    if (e.target.id === 'pantry-order-form-modal-overlay') {
      resetOrderForm();
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

  // Filter and search logic for displaying orders in the orders table
  const filteredAndSearchedOrders = pantryOrders.filter(order => {
    const matchesSearch = orderSearchQuery === '' ||
      order.notes.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    const matchesType = filterOrderType === 'all' || order.orderType === filterOrderType;
    const matchesStatus = filterOrderStatus === 'all' || order.status === filterOrderStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Pantry Management</h1>

        {/* Authentication Status Display */}
        {/* <div className="text-center text-sm text-gray-600 mb-4">
          {getAuthToken() ? (
            <p>Authentication Token: <span className="font-semibold">Found in Local Storage</span></p>
          ) : (
            <p className="text-red-500">Authentication Token: <span className="font-semibold">Not Found in Local Storage</span></p>
          )}-0pp[p=]
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

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-2 px-4 text-lg font-medium ${activeTab === 'items' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Pantry Items
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 text-lg font-medium ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Pantry Orders
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'items' && (
          <>
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
          </>
        )}

        {activeTab === 'orders' && (
          <>
            {/* Controls: Add Order, Search, Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setIsOrderFormOpen(true)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Create New Order
              </button>

              <input
                type="text"
                placeholder="Search orders..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />

              <select
                value={filterOrderType}
                onChange={(e) => setFilterOrderType(e.target.value)}
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="all">All Order Types</option>
                {ORDER_TYPES.map(type => (
                  <option key={type} value={type} className="capitalize">{type.replace('-', ' ')}</option>
                ))}
              </select>

              <select
                value={filterOrderStatus}
                onChange={(e) => setFilterOrderStatus(e.target.value)}
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="all">All Order Statuses</option>
                {ORDER_STATUSES.map(status => (
                  <option key={status} value={status} className="capitalize">{status}</option>
                ))}
              </select>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="ml-3 text-gray-700">Loading data...</p>
              </div>
            )}

            {/* Pantry Orders List Table */}
            {!loading && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pantry Orders</h2>
                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved By</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSearchedOrders.length > 0 ? (
                        filteredAndSearchedOrders.map((order) => (
                          <PantryOrderTableRow
                            key={order._id}
                            order={order}
                            onEdit={handleOrderEdit}
                            onDelete={handleOrderDelete}
                            users={dummyUsers}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-3 text-center text-sm text-gray-500">
                            No pantry orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
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

        {/* Add/Edit Pantry Order Form Modal */}
        {isOrderFormOpen && (
          <div
            id="pantry-order-form-modal-overlay"
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
                {editingPantryOrder ? 'Edit Pantry Order' : 'Create New Pantry Order'}
              </h2>
              <PantryOrderForm
                initialData={editingPantryOrder}
                onSubmit={handleOrderSubmit}
                onCancel={resetOrderForm}
                pantryItems={pantryItems} // Pass pantry items to populate dropdown
                users={dummyUsers} // Pass dummy users for selection
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
