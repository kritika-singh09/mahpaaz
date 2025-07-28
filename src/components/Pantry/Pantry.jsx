import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Import axios for HTTP requests

// --- Gemini API Key (Leave empty, Canvas will inject) ---
const apiKey = "";

// --- API Endpoints ---
const API_BASE_URL = 'https://backend-hazel-xi.vercel.app/api/pantry';
const PANTRY_ITEMS_URL = `${API_BASE_URL}/items`;
const PANTRY_ORDERS_URL = `${API_BASE_URL}/orders`;
const BOOKINGS_URL = 'https://backend-hazel-xi.vercel.app/api/bookings/all'; // New Bookings API URL

// --- Dummy User Data (for display purposes, assuming API returns user IDs) ---
const dummyUsers = [
    { _id: 'user1', name: 'Chef John Doe' },
    { _id: 'user2', name: 'Receptionist Jane Smith' },
    { _id: 'user3', name: 'Pantry Manager Alex Lee' },
    { _id: '66a2e461a5e378c66e60b213', name: 'Admin User' }, // Example user from a real backend
    { _id: '66a2e461a5e378c66e60b214', name: 'Another User' }, // Example user from a real backend
];

// --- Helper to get auth token from localStorage ---
const getAuthToken = () => localStorage.getItem("token");

// --- Confirmation Modal Component ---
function ConfirmationModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
            <div className="relative p-8 bg-white w-full max-w-sm mx-auto rounded-lg shadow-xl animate-fade-in-down">
                <h3 className="text-lg font-semibold mb-4 text-[color:var(--color-text)]">Confirm Action</h3>
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

// --- Pantry Item Constants ---
const categories = ['food', 'beverage', 'spices', 'dairy', 'frozen', 'dry-goods', 'other'];
const units = ['kg', 'liter', 'piece', 'pack', 'bottle', 'box', 'bag'];
const allCategories = ['all', ...categories]; // Add 'all' option

// --- Pantry Order Constants ---
const orderTypes = ['kitchen-to-pantry', 'pantry-to-reception'];
const orderStatuses = ['pending', 'approved', 'fulfilled', 'cancelled'];
const orderPriorities = ['low', 'medium', 'high', 'urgent'];


// --- Pantry Item Form Component ---
function PantryForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        category: categories[0],
        currentStock: 0,
        unit: units[0],
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
                category: categories[0],
                currentStock: 0,
                unit: units[0],
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
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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
        // Ensure numeric values are parsed correctly
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-[color:var(--color-text)]">Item Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-[color:var(--color-text)]">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="currentStock" className="block text-sm font-medium text-[color:var(--color-text)]">Current Stock</label>
                    <input
                        type="number"
                        id="currentStock"
                        name="currentStock"
                        value={formData.currentStock}
                        onChange={handleChange}
                        min="0"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-[color:var(--color-text)]">Unit</label>
                    <select
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="minThreshold" className="block text-sm font-medium text-[color:var(--color-text)]">Min Threshold</label>
                    <input
                        type="number"
                        id="minThreshold"
                        name="minThreshold"
                        value={formData.minThreshold}
                        onChange={handleChange}
                        min="0"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label htmlFor="reorderQuantity" className="block text-sm font-medium text-[color:var(--color-text)]">Reorder Quantity</label>
                    <input
                        type="number"
                        id="reorderQuantity"
                        name="reorderQuantity"
                        value={formData.reorderQuantity}
                        onChange={handleChange}
                        min="1"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="costPerUnit" className="block text-sm font-medium text-[color:var(--color-text)]">Cost per Unit (₹)</label>
                <input
                    type="number"
                    id="costPerUnit"
                    name="costPerUnit"
                    value={formData.costPerUnit}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-[color:var(--color-text)]">Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>

            <div className="flex items-center">
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

            <fieldset className="border p-4 rounded-md">
                <legend className="text-base font-medium text-[color:var(--color-text)]">Supplier Details (Optional)</legend>
                <div className="space-y-4 mt-2">
                    <div>
                        <label htmlFor="supplier.name" className="block text-sm font-medium text-[color:var(--color-text)]">Supplier Name</label>
                        <input
                            type="text"
                            id="supplier.name"
                            name="supplier.name"
                            value={formData.supplier.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="supplier.contactPerson" className="block text-sm font-medium text-[color:var(--color-text)]">Contact Person</label>
                        <input
                            type="text"
                            id="supplier.contactPerson"
                            name="supplier.contactPerson"
                            value={formData.supplier.contactPerson}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="supplier.phone" className="block text-sm font-medium text-[color:var(--color-text)]">Phone</label>
                        <input
                            type="tel"
                            id="supplier.phone"
                            name="supplier.phone"
                            value={formData.supplier.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="supplier.email" className="block text-sm font-medium text-[color:var(--color-text)]">Email</label>
                        <input
                            type="email"
                            id="supplier.email"
                            name="supplier.email"
                            value={formData.supplier.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>
            </fieldset>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="notes" className="block text-sm font-medium text-[color:var(--color-text)]">Notes</label>
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Add notes or click 'Generate Usage Ideas' for suggestions."
                ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
                >
                    {initialData ? 'Update Item' : 'Add Item'}
                </button>
            </div>
        </form>
    );
}

// --- Pantry Item Table Row Component ---
function PantryItemTableRow({ item, onEdit, onDelete }) {
    let stockStatusClass = '';
    let stockStatusText = '';

    if (item.currentStock === 0) {
        stockStatusClass = 'bg-red-500 text-white'; // Distinct color for out of stock
        stockStatusText = 'Out of Stock!';
    } else if (item.isLowStock) {
        stockStatusClass = 'bg-orange-100 text-orange-800';
        stockStatusText = 'Low Stock!';
    } else {
        stockStatusClass = 'bg-green-100 text-green-800';
        stockStatusText = 'In Stock';
    }

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-4 text-sm font-medium text-[color:var(--color-text)]">{item.name}</td>
            <td className="py-3 px-4 text-sm text-gray-700 capitalize">{item.category}</td>
            <td className="py-3 px-4 text-sm text-gray-700">{item.currentStock} {item.unit}</td>
            <td className="py-3 px-4 text-sm text-gray-700">{item.minThreshold} {item.unit}</td>
            <td className="py-3 px-4 text-sm text-gray-700">₹{item.costPerUnit.toFixed(2)}</td>
            <td className="py-3 px-4 text-sm text-gray-700">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatusClass}`}>
                    {stockStatusText}
                </span>
            </td>
            <td className="py-3 px-4 text-sm text-gray-700">{item.location}</td>
            <td className="py-3 px-4 text-sm text-gray-700">
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs transition duration-300"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(item._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition duration-300"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

// --- Pantry List Component (Table View) ---
function PantryList({ items, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Threshold</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Unit</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map(item => (
                        <PantryItemTableRow key={item._id} item={item} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// --- Search Bar Component ---
function SearchBar({ searchTerm, onSearchChange }) {
    return (
        <div className="flex items-center">
            <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-64"
            />
        </div>
    );
}

// --- Category Filter Component ---
function CategoryFilter({ selectedCategory, onCategoryChange }) {
    return (
        <div>
            <label htmlFor="categoryFilter" className="sr-only">Filter by Category</label>
            <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
                {allCategories.map(cat => (
                    <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}

// --- Low Stock Alerts Component ---
function LowStockAlerts({ lowStockItems, onEdit }) {
    const outOfStockItems = lowStockItems.filter(item => item.currentStock === 0);
    const lowButNotInStockItems = lowStockItems.filter(item => item.currentStock > 0 && item.isLowStock);

    if (outOfStockItems.length === 0 && lowButNotInStockItems.length === 0) {
        return null;
    }

    return (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6 rounded-md shadow-md" role="alert">
            <div className="flex items-center mb-2">
                <svg className="fill-current h-6 w-6 text-orange-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>
                <p className="font-bold text-lg text-[color:var(--color-text)]">Stock Alerts!</p>
            </div>
            {outOfStockItems.length > 0 && (
                <div className="mb-3">
                    <p className="font-semibold text-red-700">Out of Stock Items:</p>
                    <ul className="list-disc list-inside ml-4">
                        {outOfStockItems.map(item => (
                            <li key={item._id} className="mb-1 text-sm">
                                <span className="font-semibold">{item.name}</span> is completely out of stock!
                                <button
                                    onClick={() => onEdit(item)}
                                    className="ml-2 text-blue-700 hover:text-blue-900 underline text-sm"
                                >
                                    Reorder/Adjust
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {lowButNotInStockItems.length > 0 && (
                <div>
                    <p className="font-semibold text-orange-700">Low Stock Items:</p>
                    <ul className="list-disc list-inside ml-4">
                        {lowButNotInStockItems.map(item => (
                            <li key={item._id} className="mb-1 text-sm">
                                <span className="font-semibold">{item.name}</span> is critically low: {item.currentStock} {item.unit}. (Min Threshold: {item.minThreshold} {item.unit}).
                                <button
                                    onClick={() => onEdit(item)}
                                    className="ml-2 text-blue-700 hover:text-blue-900 underline text-sm"
                                >
                                    Reorder/Adjust
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// --- Pantry Order Form Component ---
function PantryOrderForm({ initialData, onSubmit, onCancel, pantryItems, users }) {
    const [formData, setFormData] = useState({
        orderType: orderTypes[0],
        status: orderStatuses[0],
        requestedBy: users[0]?._id || '', // Default to first dummy user
        approvedBy: '', // Optional
        items: initialData?.items || [{ pantryItemId: '', name: '', quantity: 1, unit: '', notes: '' }],
        notes: '',
        priority: orderPriorities[1], // Default to medium
    });
    const [generatingOrderNotes, setGeneratingOrderNotes] = useState(false);


    useEffect(() => {
        if (initialData) {
            setFormData({
                orderType: initialData.orderType,
                status: initialData.status,
                requestedBy: initialData.requestedBy,
                approvedBy: initialData.approvedBy || '',
                items: initialData.items.map(item => ({ ...item })), // Deep copy items
                notes: initialData.notes || '',
                priority: initialData.priority || orderPriorities[1],
            });
        } else {
            setFormData({
                orderType: orderTypes[0],
                status: orderStatuses[0],
                requestedBy: users[0]?._id || '',
                approvedBy: '',
                items: [{ pantryItemId: '', name: '', quantity: 1, unit: '', notes: '' }],
                notes: '',
                priority: orderPriorities[1],
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

        // If pantryItemId changes, update name and unit
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
            const requestedByUser = users.find(u => u._id === formData.requestedBy)?.name || 'an unknown user';
            const itemsList = formData.items
                .filter(item => item.name && item.quantity)
                .map(item => `${item.quantity} ${item.unit} of ${item.name}`)
                .join(', ');

            const prompt = `Draft a brief justification or summary for a pantry order of type '${formData.orderType.replace('-', ' ')}' requested by '${requestedByUser}' including these items: ${itemsList}. Focus on the purpose of the order for hotel operations.`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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
                alert('Failed to generate justification. Please try again.');
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            alert('Error generating justification. Check console for details.');
        } finally {
            setGeneratingOrderNotes(false);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter out empty items
        const filteredItems = formData.items.filter(item => item.pantryItemId && item.quantity > 0);

        if (filteredItems.length === 0) {
            alert('Please add at least one item to the order.'); // Using alert for simplicity here, can be replaced by custom modal
            return;
        }

        const dataToSend = {
            ...formData,
            items: filteredItems.map(item => ({
                ...item,
                quantity: parseFloat(item.quantity) // Ensure quantity is number
            })),
            requestDate: initialData?.requestDate || new Date().toISOString(), // Preserve existing date or set new
            approvedDate: formData.status === 'approved' && !initialData?.approvedDate ? new Date().toISOString() : initialData?.approvedDate,
            fulfilledDate: formData.status === 'fulfilled' && !initialData?.fulfilledDate ? new Date().toISOString() : initialData?.fulfilledDate,
        };
        onSubmit(initialData ? initialData._id : null, dataToSend);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="orderType" className="block text-sm font-medium text-[color:var(--color-text)]">Order Type</label>
                    <select
                        id="orderType"
                        name="orderType"
                        value={formData.orderType}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        {orderTypes.map(type => (
                            <option key={type} value={type}>{type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-[color:var(--color-text)]">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        {orderStatuses.map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="requestedBy" className="block text-sm font-medium text-[color:var(--color-text)]">Requested By</label>
                    <select
                        id="requestedBy"
                        name="requestedBy"
                        value={formData.requestedBy}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="approvedBy" className="block text-sm font-medium text-[color:var(--color-text)]">Approved By (Optional)</label>
                    <select
                        id="approvedBy"
                        name="approvedBy"
                        value={formData.approvedBy}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        <option value="">-- Select --</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-[color:var(--color-text)]">Priority</label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                    {orderPriorities.map(priority => (
                        <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
                    ))}
                </select>
            </div>

            <fieldset className="border p-4 rounded-md">
                <legend className="text-base font-medium text-[color:var(--color-text)]">Order Items</legend>
                {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 p-2 border rounded-md bg-gray-50">
                        <div className="md:col-span-2">
                            <label htmlFor={`item-${index}-id`} className="block text-xs font-medium text-gray-700">Pantry Item</label>
                            <select
                                id={`item-${index}-id`}
                                name="pantryItemId"
                                value={item.pantryItemId}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            >
                                <option value="">Select an item</option>
                                {pantryItems.map(pItem => (
                                    <option key={pItem._id} value={pItem._id}>{pItem.name} ({pItem.unit})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor={`item-${index}-quantity`} className="block text-xs font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                id={`item-${index}-quantity`}
                                name="quantity"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, e)}
                                min="1"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            />
                        </div>
                        <div className="flex items-end">
                            <p className="block text-sm font-medium text-gray-700 mb-1">Unit: <span className="font-semibold">{item.unit || 'N/A'}</span></p>
                            {formData.items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItemField(index)}
                                    className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <div className="md:col-span-4">
                            <label htmlFor={`item-${index}-notes`} className="block text-xs font-medium text-gray-700">Item Notes (Optional)</label>
                            <input
                                type="text"
                                id={`item-${index}-notes`}
                                name="notes"
                                value={item.notes}
                                onChange={(e) => handleItemChange(index, e)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            />
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddItemField}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md text-sm"
                >
                    Add Item
                </button>
            </fieldset>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="notes" className="block text-sm font-medium text-[color:var(--color-text)]">Order Notes</label>
                    <button
                        type="button"
                        onClick={handleGenerateOrderJustification}
                        disabled={generatingOrderNotes || formData.items.filter(item => item.pantryItemId).length === 0 || !formData.requestedBy}
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Add notes or click 'Generate Justification' for suggestions."
                ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
                >
                    {initialData ? 'Update Order' : 'Create Order'}
                </button>
            </div>
        </form>
    );
}

// --- Pantry Order Table Row Component ---
function PantryOrderTableRow({ order, onEdit, onDelete, users }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'fulfilled': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'low': return 'text-green-600';
            case 'medium': return 'text-orange-600';
            case 'high': return 'text-red-600';
            case 'urgent': return 'text-purple-600 font-bold';
            default: return 'text-gray-600';
        }
    };

    const getTypeName = (type) => type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const getUserName = (userId) => users.find(u => u._id === userId)?.name || 'N/A';

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-4 text-sm font-medium text-[color:var(--color-text)]">{order.orderNumber}</td>
            <td className="py-3 px-4 text-sm text-gray-700">{getTypeName(order.orderType)}</td>
            <td className="py-3 px-4 text-sm text-gray-700">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </td>
            <td className="py-3 px-4 text-sm text-gray-700">{getUserName(order.requestedBy)}</td>
            <td className="py-3 px-4 text-sm text-gray-700">{order.approvedBy ? getUserName(order.approvedBy) : 'N/A'}</td>
            <td className="py-3 px-4 text-sm text-gray-700">
                <ul className="list-disc list-inside text-xs">
                    {order.items.map((item, index) => (
                        <li key={index}>{item.name} ({item.quantity} {item.unit})</li>
                    ))}
                </ul>
            </td>
            <td className="py-3 px-4 text-sm text-gray-700">{new Date(order.requestDate).toLocaleDateString()}</td>
            <td className="py-3 px-4 text-sm text-gray-700">
                <span className={`font-medium ${getPriorityClass(order.priority)}`}>{order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}</span>
            </td>
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

// --- Pantry Order List Component (Table View) ---
function PantryOrderList({ orders, onEdit, onDelete, users }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved By</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                        <PantryOrderTableRow key={order._id} order={order} onEdit={onEdit} onDelete={onDelete} users={users} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// --- Booking Table Row Component ---
function BookingTableRow({ booking }) {
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-3 px-4 text-sm font-medium text-[color:var(--color-text)]">{booking.name}</td>
            <td className="py-3 px-4 text-sm text-gray-700">{booking.roomNumber}</td>
            <td className="py-3 px-4 text-sm text-gray-700">{booking.checkIn}</td>
            <td className="py-3 px-4 text-sm text-gray-700">{booking.checkOut}</td>
            <td className="py-3 px-4 text-sm text-gray-700">
                {booking.vip ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">VIP</span>
                ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Standard</span>
                )}
            </td>
        </tr>
    );
}

// --- Booking List Component (Table View) ---
function BookingList({ bookings }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Date</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out Date</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIP Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map(booking => (
                        <BookingTableRow key={booking.id} booking={booking} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}


// --- Main App Component ---
function App() {
    const [pantryItems, setPantryItems] = useState([]);
    const [pantryOrders, setPantryOrders] = useState([]);
    const [bookings, setBookings] = useState([]); // New state for bookings
    const [isItemFormOpen, setIsItemFormOpen] = useState(false);
    const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeTab, setActiveTab] = useState('pantryItems'); // 'pantryItems', 'pantryOrders', or 'bookings'
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch pantry items
    const fetchPantryItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = getAuthToken();

        try {
            if (!token) throw new Error("Authentication token not found in localStorage. Please set it manually using 'localStorage.setItem(\"token\", \"YOUR_TOKEN_HERE\");' in your browser's developer console.");

            const response = await axios.get(PANTRY_ITEMS_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Assuming the API returns isLowStock, otherwise calculate it here
            const itemsWithLowStockStatus = response.data.map(item => ({
                ...item,
                isLowStock: item.currentStock <= item.minThreshold
            }));
            setPantryItems(itemsWithLowStockStatus);
        } catch (err) {
            console.error("Error fetching pantry items:", err);
            setError(err.message || "Failed to load pantry items. Please check your network and authentication token.");
        } finally {
            setLoading(false);
        }
    }, []); // No dependency on authToken state, as it's read directly from localStorage

    // Function to fetch pantry orders
    const fetchPantryOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = getAuthToken();

        try {
            if (!token) throw new Error("Authentication token not found in localStorage. Please set it manually using 'localStorage.setItem(\"token\", \"YOUR_TOKEN_HERE\");' in your browser's developer console.");

            const response = await axios.get(PANTRY_ORDERS_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPantryOrders(response.data);
        } catch (err) {
            console.error("Error fetching pantry orders:", err);
            setError(err.message || "Failed to load pantry orders. Please check your network and authentication token.");
        } finally {
            setLoading(false);
        }
    }, []); // No dependency on authToken state, as it's read directly from localStorage

    // Function to fetch bookings (provided by user, adapted to axios)
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = getAuthToken();

        try {
            if (!token) throw new Error("Authentication token not found in localStorage. Please set it manually using 'localStorage.setItem(\"token\", \"YOUR_TOKEN_HERE\");' in your browser's developer console.");
            
            const res = await axios.get(BOOKINGS_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            const data = res.data;
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
            setError(err.message || "Failed to fetch bookings.");
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data fetch on component mount
    useEffect(() => {
        fetchPantryItems();
        fetchPantryOrders();
        fetchBookings(); // Fetch bookings as well
    }, [fetchPantryItems, fetchPantryOrders, fetchBookings]);

    // Simulate fetching and filtering pantry items
    const getFilteredPantryItems = useCallback(() => {
        let filteredItems = pantryItems;

        if (searchTerm) {
            filteredItems = filteredItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory && selectedCategory !== 'all') {
            filteredItems = filteredItems.filter(item =>
                item.category === selectedCategory
            );
        }
        return filteredItems;
    }, [pantryItems, searchTerm, selectedCategory]);

    // Simulate filtering pantry orders (e.g., by status, type, or order number)
    const getFilteredPantryOrders = useCallback(() => {
        let filteredOrders = pantryOrders;
        // Add order specific filters here if needed
        // For now, just return all orders
        return filteredOrders;
    }, [pantryOrders]);


    // --- Pantry Item Handlers ---
    const handleAddItem = async (id, itemData) => {
        const token = getAuthToken();
        if (!token) { alert("Authentication token not found. Cannot add item. Please set it manually in localStorage."); return; }
        try {
            await axios.post(PANTRY_ITEMS_URL, itemData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPantryItems(); // Re-fetch all items to update the list
            setIsItemFormOpen(false);
        } catch (err) {
            console.error("Error adding item:", err);
            alert("Failed to add item. Check console for details and ensure all required fields are filled.");
        }
    };

    const handleUpdateItem = async (id, itemData) => {
        const token = getAuthToken();
        if (!token) { alert("Authentication token not found. Cannot update item. Please set it manually in localStorage."); return; }
        try {
            await axios.put(`${PANTRY_ITEMS_URL}/${id}`, itemData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPantryItems();
            setIsItemFormOpen(false);
            setSelectedItem(null);
        } catch (err) {
            console.error("Error updating item:", err);
            alert("Failed to update item. Check console for details.");
        }
    };

    const handleDeleteItem = (idToDelete) => {
        setConfirmAction(() => async () => {
            const token = getAuthToken();
            if (!token) { alert("Authentication token not found. Cannot delete item. Please set it manually in localStorage."); setShowConfirmModal(false); return; }
            try {
                await axios.delete(`${PANTRY_ITEMS_URL}/${idToDelete}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchPantryItems();
                setShowConfirmModal(false);
            } catch (err) {
                console.error("Error deleting item:", err);
                alert("Failed to delete item. Check console for details.");
            }
        });
        setShowConfirmModal(true);
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setIsItemFormOpen(true);
    };

    // --- Pantry Order Handlers ---
    const handleAddOrder = async (id, orderData) => {
        const token = getAuthToken();
        if (!token) { alert("Authentication token not found. Cannot add order. Please set it manually in localStorage."); return; }
        try {
            // The backend should generate orderNumber, dates, and timestamps
            await axios.post(PANTRY_ORDERS_URL, orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPantryOrders();
            setIsOrderFormOpen(false);
        } catch (err) {
            console.error("Error adding order:", err);
            alert("Failed to add order. Check console for details and ensure all required fields are filled.");
        }
    };

    const handleUpdateOrder = async (id, orderData) => {
        const token = getAuthToken();
        if (!token) { alert("Authentication token not found. Cannot update order. Please set it manually in localStorage."); return; }
        try {
            await axios.put(`${PANTRY_ORDERS_URL}/${id}`, orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPantryOrders();
            setIsOrderFormOpen(false);
            setSelectedOrder(null);
        } catch (err) {
            console.error("Error updating order:", err);
            alert("Failed to update order. Check console for details.");
        }
    };

    const handleDeleteOrder = (idToDelete) => {
        setConfirmAction(() => async () => {
            const token = getAuthToken();
            if (!token) { alert("Authentication token not found. Cannot delete order. Please set it manually in localStorage."); setShowConfirmModal(false); return; }
            try {
                await axios.delete(`${PANTRY_ORDERS_URL}/${idToDelete}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchPantryOrders();
                setShowConfirmModal(false);
            } catch (err) {
                console.error("Error deleting order:", err);
                alert("Failed to delete order. Check console for details.");
            }
        });
        setShowConfirmModal(true);
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setIsOrderFormOpen(true);
    };

    const lowStockItems = pantryItems.filter(item => item.isLowStock);
    const filteredAndDisplayedItems = getFilteredPantryItems();
    const filteredAndDisplayedOrders = getFilteredPantryOrders();


    return (
        <div className="min-h-screen p-4">
            <header className="bg-white shadow p-6 mb-6 rounded-lg">
                <h1 className="text-4xl font-bold text-center text-[color:var(--color-text)]">Hotel Pantry Management</h1>
            </header>

            {showConfirmModal && (
                <ConfirmationModal
                    message="Are you sure you want to delete this item? This action cannot be undone."
                    onConfirm={confirmAction}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

            <LowStockAlerts lowStockItems={lowStockItems} onEdit={handleEditItem} />

            {/* Tab Navigation */}
            <div className="mb-6 flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('pantryItems')}
                    className={`py-2 px-4 text-lg font-medium ${activeTab === 'pantryItems' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Pantry Items
                </button>
                <button
                    onClick={() => setActiveTab('pantryOrders')}
                    className={`py-2 px-4 text-lg font-medium ${activeTab === 'pantryOrders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Pantry Orders
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`py-2 px-4 text-lg font-medium ${activeTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Bookings
                </button>
            </div>

            {loading && <div className="text-center text-blue-600 text-lg py-10">Loading data...</div>}
            {error && <div className="text-center text-red-600 text-lg py-10">{error}</div>}

            {!loading && !error && activeTab === 'pantryItems' && (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <button
                            onClick={() => { setIsItemFormOpen(true); setSelectedItem(null); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 w-full md:w-auto"
                        >
                            Add New Pantry Item
                        </button>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
                        </div>
                    </div>

                    {isItemFormOpen && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
                            <div className="relative p-8 bg-white w-full max-w-xl mx-auto rounded-lg shadow-xl animate-fade-in-down">
                                <button
                                    onClick={() => { setIsItemFormOpen(false); setSelectedItem(null); }}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                                >
                                    &times;
                                </button>
                                <h2 className="text-2xl font-semibold mb-6 text-[color:var(--color-text)]">{selectedItem ? 'Edit Pantry Item' : 'Add New Pantry Item'}</h2>
                                <PantryForm
                                    initialData={selectedItem}
                                    onSubmit={selectedItem ? handleUpdateItem : handleAddItem}
                                    onCancel={() => { setIsItemFormOpen(false); setSelectedItem(null); }}
                                />
                            </div>
                        </div>
                    )}

                    {filteredAndDisplayedItems.length === 0 ? (
                        <div className="text-center text-[color:var(--color-text)] text-lg py-10">No pantry items found matching your criteria.</div>
                    ) : (
                        <PantryList items={filteredAndDisplayedItems} onEdit={handleEditItem} onDelete={handleDeleteItem} />
                    )}
                </>
            )}

            {!loading && !error && activeTab === 'pantryOrders' && (
                <>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => { setIsOrderFormOpen(true); setSelectedOrder(null); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300"
                        >
                            Create New Order
                        </button>
                    </div>

                    {isOrderFormOpen && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
                            <div className="relative p-8 bg-white w-full max-w-3xl mx-auto rounded-lg shadow-xl animate-fade-in-down">
                                <button
                                    onClick={() => { setIsOrderFormOpen(false); setSelectedOrder(null); }}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                                >
                                    &times;
                                </button>
                                <h2 className="text-2xl font-semibold mb-6 text-[color:var(--color-text)]">{selectedOrder ? 'Edit Pantry Order' : 'Create New Pantry Order'}</h2>
                                <PantryOrderForm
                                    initialData={selectedOrder}
                                    onSubmit={selectedOrder ? handleUpdateOrder : handleAddOrder}
                                    onCancel={() => { setIsOrderFormOpen(false); setSelectedOrder(null); }}
                                    pantryItems={pantryItems} // Pass pantry items for selection
                                    users={dummyUsers} // Pass dummy users for selection
                                />
                            </div>
                        </div>
                    )}

                    <PantryOrderList orders={filteredAndDisplayedOrders} onEdit={handleEditOrder} onDelete={handleDeleteOrder} users={dummyUsers} />
                </>
            )}

            {!loading && !error && activeTab === 'bookings' && (
                <>
                    <h2 className="text-2xl font-semibold mb-4 text-[color:var(--color-text)]">Hotel Bookings</h2>
                    {bookings.length === 0 ? (
                        <div className="text-center text-[color:var(--color-text)] text-lg py-10">No bookings found.</div>
                    ) : (
                        <BookingList bookings={bookings} />
                    )}
                </>
            )}
        </div>
    );
}

export default App;