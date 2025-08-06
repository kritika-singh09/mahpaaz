
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

// Initial empty states (all dummy data removed)
const initialCategories = [];
const initialMenuItems = [];
const initialOrders = []; 
const initialBookings = [];
const initialTables = [];


// --- Status Badge Component (Simplified) ---
const StatusBadge = ({ status }) => {
  let colorClass = '';
  switch (status) {
    case 'active':
    case 'available':
    case 'completed':
    case 'ready':
    case 'served':
    case 'confirmed':
    case 'seated':
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'inactive':
    case 'unavailable':
    case 'cancelled':
    case 'occupied':
    case 'dirty':
      colorClass = 'bg-red-100 text-red-800';
      break;
    case 'pending':
    case 'preparing':
    case 'reserved':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800';
  }
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${colorClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// --- Category Management Components ---

const CategoryForm = ({ onSave, editingCategory, setEditingCategory, isLoading, isAuth }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description);
      setStatus(editingCategory.status);
    } else {
      setName('');
      setDescription('');
      setStatus('active');
    }
  }, [editingCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, status });
    setName('');
    setDescription('');
    setStatus('active');
    setEditingCategory(null); // Clear editing state after save
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          ></textarea>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isAuth}
          >
            {isLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category')}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isAuth}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const CategoryList = ({ categories, onEdit, onDelete, onToggleStatus, isLoading, isAuth }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurant Categories</h2>
      {isLoading ? (
        <p className="text-gray-600">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-600">No categories found. Add one above!</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-gray-900">{category.name}</p>
                <p className="text-sm text-gray-600">{category.description}</p>
                <div className="mt-2">
                  <StatusBadge status={category.status} />
                </div>
              </div>
              <div className="mt-3 sm:mt-0 flex space-x-2">
                <button
                  onClick={() => onEdit(category)}
                  className="px-3 py-1 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !isAuth}
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleStatus(category._id, category.status === 'active' ? 'inactive' : 'active')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${category.status === 'active' ? 'text-red-700 bg-red-100 hover:bg-red-200' : 'text-green-700 bg-green-100 hover:bg-green-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={isLoading || !isAuth}
                >
                  {category.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => onDelete(category._id)}
                  className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !isAuth}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- Menu Item Management Components ---

const MenuItemForm = ({ onSave, editingMenuItem, setEditingMenuItem, categories, isLoading, isAuth }) => {
  const [name, setName] = useState('');
  const [Price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [Discount, setDiscount] = useState(0);
  const [status, setStatus] = useState('available');
  const [in_oostock, setInOostock] = useState(true);
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingMenuItem) {
      setName(editingMenuItem.name);
      setPrice(editingMenuItem.Price);
      setCategory(editingMenuItem.category);
      setDiscount(editingMenuItem.Discount);
      setStatus(editingMenuItem.status);
      setInOostock(editingMenuItem.in_oostock);
      setImage(editingMenuItem.image);
      setVideo(editingMenuItem.video);
      setDescription(editingMenuItem.description);
    } else {
      setName('');
      setPrice('');
      setCategory('');
      setDiscount(0);
      setStatus('available');
      setInOostock(true);
      setImage('');
      setVideo('');
      setDescription('');
    }
  }, [editingMenuItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      Price: parseFloat(Price),
      category,
      Discount: parseFloat(Discount),
      status,
      in_oostock,
      image,
      video,
      description,
    });
    setName('');
    setPrice('');
    setCategory('');
    setDiscount(0);
    setStatus('available');
    setInOostock(true);
    setImage('');
    setVideo('');
    setDescription('');
    setEditingMenuItem(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            id="itemName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="itemPrice"
            value={Price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="0"
            step="0.01"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="itemCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          >
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="itemDiscount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            id="itemDiscount"
            value={Discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="0"
            max="100"
            step="0.01"
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="itemStatus" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="itemStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            id="inOostock"
            name="inOostock"
            type="checkbox"
            checked={in_oostock}
            onChange={(e) => setInOostock(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={isLoading || !isAuth}
          />
          <label htmlFor="inOostock" className="ml-2 block text-sm text-gray-900">
            In Stock
          </label>
        </div>
        <div>
          <label htmlFor="itemImage" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            id="itemImage"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="itemVideo" className="block text-sm font-medium text-gray-700">Video URL</label>
          <input
            type="text"
            id="itemVideo"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="itemDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          ></textarea>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isAuth}
          >
            {isLoading ? 'Saving...' : (editingMenuItem ? 'Update Item' : 'Add Item')}
          </button>
          {editingMenuItem && (
            <button
              type="button"
              onClick={() => setEditingMenuItem(null)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isAuth}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const MenuList = ({ menuItems, categories, onEdit, onDelete, onToggleStatus, isLoading, onSearchChange, searchTerm, isAuth }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurant Menu Items</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      {isLoading ? (
        <p className="text-gray-600">Loading menu items...</p>
      ) : menuItems.length === 0 ? (
        <p className="text-gray-600">No menu items found. Add one above!</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {menuItems.map((item) => (
            <li key={item._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-gray-900">{item.name} - ${item.Price.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Category: {item.category}</p>
                {item.Discount > 0 && <p className="text-sm text-gray-600">Discount: {item.Discount}%</p>}
                <div className="mt-2">
                  <StatusBadge status={item.status} />
                  <StatusBadge status={item.in_oostock ? 'in stock' : 'out of stock'} />
                </div>
                {item.description && <p className="text-xs text-gray-500 mt-1">Desc: {item.description}</p>}
                {item.image && <img src={item.image} alt={item.name} className="mt-2 w-16 h-16 object-cover rounded-md" onError={(e)=>{e.target.onerror = null; e.target.src='https://placehold.co/64x64/E0E0E0/ADADAD?text=No+Image'}}/>}
                {item.video && <a href={item.video} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs hover:underline">View Video</a>}
              </div>
              <div className="mt-3 sm:mt-0 flex space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !isAuth}
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleStatus(item._id, item.status === 'available' ? 'unavailable' : 'available')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${item.status === 'available' ? 'text-red-700 bg-red-100 hover:bg-red-200' : 'text-green-700 bg-green-100 hover:bg-green-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={isLoading || !isAuth}
                >
                  {item.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !isAuth}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


// --- Order Display Component ---

const OrderList = ({ orders, onAddOrderClick, menuItems, onUpdateOrderStatus, isLoading, onSearchChange, searchTerm, isAuth }) => {
  // Helper to get item name and price for display
  const getItemDetails = (itemId) => {
    const item = menuItems.find(mi => mi._id === itemId);
    return item ? { name: item.name, Price: item.Price } : { name: 'Unknown Item', Price: 0 };
  };

  const orderStatuses = ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Orders</h2>
        <button
          onClick={onAddOrderClick}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !isAuth}
        >
          Add New Order
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search orders by staff or table..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      {isLoading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders found. Add one using the form above!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff / Table
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.staffName} ({order.tableNo})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <ul className="list-disc list-inside">
                      {order.items.map((item, index) => {
                        const itemDetails = getItemDetails(item.itemId);
                        return (
                          <li key={index}>
                            {itemDetails.name} x {item.quantity}
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${order.amount.toFixed(2)}
                    {order.discount > 0 && <span className="text-xs text-gray-500 block">(-${order.discount.toFixed(2)} discount)</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order._id, e.target.value)}
                      className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                        'bg-blue-100 text-blue-800 border-blue-300'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={isLoading || !isAuth}
                    >
                      {orderStatuses.map(statusOption => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Order Form Component ---
const OrderForm = ({ onSave, onCancel, menuItems, isLoading, isAuth }) => {
  const [staffName, setStaffName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [items, setItems] = useState([{ itemId: '', quantity: 1 }]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('pending');
  const [amount, setAmount] = useState(0); // This will be calculated
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [isMembership, setIsMembership] = useState(false);
  const [isLoyalty, setIsLoyalty] = useState(false);

  // Map menuItems to a more accessible object for price lookup
  const menuItemsMap = menuItems.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {});

  // Calculate amount based on selected items
  useEffect(() => {
    let totalAmount = 0;
    items.forEach(item => {
      const menuItem = menuItemsMap[item.itemId];
      if (menuItem) {
        totalAmount += menuItem.Price * item.quantity;
      }
    });
    setAmount(totalAmount - discount);
  }, [items, discount, menuItemsMap]); // Depend on menuItemsMap as well

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { itemId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!staffName || !phoneNumber || !tableNo || items.some(item => !item.itemId || item.quantity <= 0)) {
      console.error('Validation Error: Please fill in all required fields and ensure items have valid quantities.');
      return;
    }

    onSave({
      staffName,
      phoneNumber,
      tableNo,
      items,
      notes,
      status,
      amount,
      discount,
      couponCode,
      isMembership,
      isLoyalty,
      createdBy: 'simulated_user_id', // Hardcoded for simulation
    });

    // Reset form
    setStaffName('');
    setPhoneNumber('');
    setTableNo('');
    setItems([{ itemId: '', quantity: 1 }]);
    setNotes('');
    setStatus('pending');
    setDiscount(0);
    setCouponCode('');
    setIsMembership(false);
    setIsLoyalty(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="staffName" className="block text-sm font-medium text-gray-700">Staff Name</label>
          <input
            type="text"
            id="staffName"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="tableNo" className="block text-sm font-medium text-gray-700">Table Number</label>
          <input
            type="text"
            id="tableNo"
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>

        {/* Items Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex space-x-2 mb-2 items-center">
              <select
                value={item.itemId}
                onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                disabled={isLoading || !isAuth}
              >
                <option value="">Select Item</option>
                {menuItems.filter(mi => mi.status === 'available' && mi.in_oostock).map((menuItem) => (
                  <option key={menuItem._id} value={menuItem._id}>{menuItem.name} (${menuItem.Price.toFixed(2)})</option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-center focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                min="1"
                required
                disabled={isLoading || !isAuth}
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !isAuth}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isAuth}
          >
            Add Item
          </button>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="2"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          ></textarea>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="served">Served</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount ($)</label>
          <input
            type="number"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="0"
            disabled={isLoading || !isAuth}
          />
        </div>

        <div>
          <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700">Coupon Code</label>
          <input
            type="text"
            id="couponCode"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              id="isMembership"
              name="isMembership"
              type="checkbox"
              checked={isMembership}
              onChange={(e) => setIsMembership(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={isLoading || !isAuth}
            />
            <label htmlFor="isMembership" className="ml-2 block text-sm text-gray-900">
              Membership
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="isLoyalty"
              name="isLoyalty"
              type="checkbox"
              checked={isLoyalty}
              onChange={(e) => setIsLoyalty(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={isLoading || !isAuth}
            />
            <label htmlFor="isLoyalty" className="ml-2 block text-sm text-gray-900">
              Loyalty
            </label>
          </div>
        </div>

        <div className="text-xl font-bold text-gray-800">
          Total Amount: ${amount.toFixed(2)}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isAuth}
          >
            {isLoading ? 'Creating...' : 'Create Order'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isAuth}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Booking Form Component ---
const BookingForm = ({ onSave, editingBooking, setEditingBooking, isLoading, isAuth }) => {
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [tableNumber, setTableNumber] = useState('');
  const [vip, setVip] = useState(false);
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [invoiceId, setInvoiceId] = useState(''); // New state for invoiceId

  useEffect(() => {
    if (editingBooking) {
      setGuestName(editingBooking.staffName); // Map staffName back to guestName
      setPhoneNumber(editingBooking.phoneNumber);
      // Extract booking details from notes or a dedicated field if available
      // For now, these are just placeholders
      setBookingDate(editingBooking.bookingDetails?.bookingDate || '');
      setBookingTime(editingBooking.bookingDetails?.bookingTime || '');
      setNumberOfGuests(editingBooking.bookingDetails?.numberOfGuests || 1);
      setTableNumber(editingBooking.tableNo); // Map tableNo back to tableNumber
      setVip(editingBooking.bookingDetails?.vip || false);
      setStatus(editingBooking.status);
      setNotes(editingBooking.notes);
      setInvoiceId(editingBooking.bookingDetails?.invoiceId || ''); // Set invoiceId
    } else {
      setGuestName('');
      setPhoneNumber('');
      setBookingDate('');
      setBookingTime('');
      setNumberOfGuests(1);
      setTableNumber('');
      setVip(false);
      setStatus('pending');
      setNotes('');
      setInvoiceId(''); // Reset invoiceId
    }
  }, [editingBooking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      staffName: guestName, // Mapping guestName to staffName for orders API
      phoneNumber,
      tableNo: tableNumber, // Mapping tableNumber to tableNo for orders API
      items: [], // Bookings don't have items in this model, so send empty
      notes: `Booking for ${numberOfGuests} guests on ${bookingDate} at ${bookingTime}. VIP: ${vip ? 'Yes' : 'No'}. Notes: ${notes}`,
      status,
      amount: 0, // Bookings don't have amount in this model
      discount: 0,
      couponCode: '',
      isMembership: false,
      isLoyalty: false,
      createdBy: 'simulated_user_id',
      // Store booking specific details in notes or a custom field if backend supports it
      bookingDetails: {
        bookingDate,
        bookingTime,
        numberOfGuests,
        vip,
        invoiceId,
      }
    });
    setGuestName('');
    setPhoneNumber('');
    setBookingDate('');
    setBookingTime('');
    setNumberOfGuests(1);
    setTableNumber('');
    setVip(false);
    setStatus('pending');
    setNotes('');
    setInvoiceId(''); // Reset invoiceId
    setEditingBooking(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingBooking ? 'Edit Booking' : 'Add New Booking'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">Guest Name</label>
          <input
            type="text"
            id="guestName"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Booking Date</label>
          <input
            type="date"
            id="bookingDate"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700">Booking Time</label>
          <input
            type="time"
            id="bookingTime"
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700">Number of Guests</label>
          <input
            type="number"
            id="numberOfGuests"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="1"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">Table Number</label>
          <input
            type="text"
            id="tableNumber"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          />
        </div>
        <div className="flex items-center">
          <input
            id="vip"
            name="vip"
            type="checkbox"
            checked={vip}
            onChange={(e) => setVip(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={isLoading || !isAuth}
          />
          <label htmlFor="vip" className="ml-2 block text-sm text-gray-900">
            VIP Booking
          </label>
        </div>
        <div>
          <label htmlFor="bookingStatus" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="bookingStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="seated">Seated</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="2"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          ></textarea>
        </div>
        <div>
          <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700">Invoice ID</label>
          <input
            type="text"
            id="invoiceId"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isAuth}
          >
            {isLoading ? 'Saving...' : (editingBooking ? 'Update Booking' : 'Add Booking')}
          </button>
          {editingBooking && (
            <button
              type="button"
              onClick={() => setEditingBooking(null)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isAuth}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// --- Booking List Component ---
const BookingList = ({ bookings, onEdit, onDelete, onUpdateBookingStatus, isLoading, onSearchChange, searchTerm, isAuth }) => {
  const bookingStatuses = ['pending', 'confirmed', 'seated', 'completed', 'cancelled'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Bookings</h2>
        <button
          onClick={() => onEdit(null)} // Trigger add new booking
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !isAuth}
        >
          Add New Booking
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search bookings by guest name or table..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      {isLoading ? (
        <p className="text-gray-600">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found. Add one above!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th> {/* New Invoice Header */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.staffName} {booking.bookingDetails?.vip && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full ml-1">VIP</span>}
                    <p className="text-xs text-gray-500">{booking.phoneNumber}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.bookingDetails?.bookingDate} {booking.bookingDetails?.bookingTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.bookingDetails?.numberOfGuests}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.tableNo || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.status}
                      onChange={(e) => onUpdateBookingStatus(booking._id, e.target.value)}
                      className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border ${
                        booking.status === 'confirmed' || booking.status === 'seated' || booking.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                        'bg-yellow-100 text-yellow-800 border-yellow-300'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={isLoading || !isAuth}
                    >
                      {bookingStatuses.map(statusOption => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.bookingDetails?.invoiceId ? (
                      <a href={`#invoice-${booking.bookingDetails.invoiceId}`} className="text-indigo-600 hover:underline">
                        {booking.bookingDetails.invoiceId}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td> {/* New Invoice Data */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(booking)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || !isAuth}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(booking._id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || !isAuth}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Table Form Component ---
const TableForm = ({ onSave, editingTable, setEditingTable, isLoading, isAuth }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState(2);
  const [status, setStatus] = useState('available');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (editingTable) {
      setTableNumber(editingTable.tableNumber);
      setCapacity(editingTable.capacity);
      setStatus(editingTable.status);
      setLocation(editingTable.location);
    } else {
      setTableNumber('');
      setCapacity(2);
      setStatus('available');
      setLocation('');
    }
  }, [editingTable]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ tableNumber, capacity: parseInt(capacity), status, location });
    setTableNumber('');
    setCapacity(2);
    setStatus('available');
    setLocation('');
    setEditingTable(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingTable ? 'Edit Table' : 'Add New Table'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">Table Number</label>
          <input
            type="text"
            id="tableNumber"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min="1"
            required
            disabled={isLoading || !isAuth}
          />
        </div>
        <div>
          <label htmlFor="tableStatus" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="tableStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="dirty">Dirty</option>
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading || !isAuth}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isAuth}
          >
            {isLoading ? 'Saving...' : (editingTable ? 'Update Table' : 'Add Table')}
          </button>
          {editingTable && (
            <button
              type="button"
              onClick={() => setEditingTable(null)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isAuth}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// --- Table List Component ---
const TableList = ({ tables, onEdit, onDelete, onUpdateTableStatus, isLoading, onSearchChange, searchTerm, isAuth }) => {
  const tableStatuses = ['available', 'occupied', 'reserved', 'dirty'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Tables</h2>
        <button
          onClick={() => onEdit(null)} // Trigger add new table
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !isAuth}
        >
          Add New Table
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tables by number or location..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      {isLoading ? (
        <p className="text-gray-600">Loading tables...</p>
      ) : tables.length === 0 ? (
        <p className="text-gray-600">No tables found. Add one above!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Table Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tables.map((table) => (
                <tr key={table._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {table.tableNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {table.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={table.status}
                      onChange={(e) => onUpdateTableStatus(table._id, e.target.value)}
                      className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border ${
                        table.status === 'available' ? 'bg-green-100 text-green-800 border-green-300' :
                        table.status === 'occupied' || table.status === 'dirty' ? 'bg-red-100 text-red-800 border-red-300' :
                        'bg-yellow-100 text-yellow-800 border-yellow-300'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={isLoading || !isAuth}
                    >
                      {tableStatuses.map(statusOption => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {table.location || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(table)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || !isAuth}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(table._id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || !isAuth}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


// --- Modal Component ---
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-8 rounded-lg shadow-xl bg-white max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-8 rounded-lg shadow-xl bg-white max-w-sm mx-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

export default function App() {
  const [categories, setCategories] = useState(initialCategories);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [orders, setOrders] = useState(initialOrders); // Orders will contain bookings too
  const [bookings, setBookings] = useState(initialBookings); // This will be derived from orders
  const [tables, setTables] = useState(initialTables);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingTable, setEditingTable] = useState(null);

  const [activeTab, setActiveTab] = useState('categories');
  const [showOrderFormModal, setShowOrderFormModal] = useState(false);
  const [showBookingFormModal, setShowBookingFormModal] = useState(false);
  const [showTableFormModal, setShowTableFormModal] = useState(false);

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Loading states for data operations
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isLoadingTables, setIsLoadingTables] = useState(false);

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  // Search terms
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  const [tableSearchTerm, setTableSearchTerm] = useState('');

  // Helper to get auth token from local storage
  const getAuthToken = () => localStorage.getItem("token");

  // Initial data loading and token check
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLoggedIn(true);
      setCurrentUser({ username: 'admin_user', role: 'admin' });
      console.log("Automatically logged in based on existing token.");
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
      console.log("No token found, user is logged out.");
    }

    // Categories and Menu Items are still mocked as no API was provided for them
    // They will remain empty arrays if no initial data is defined
    setIsLoadingCategories(true);
    setTimeout(() => {
      setCategories([]); // No dummy data
      setIsLoadingCategories(false);
    }, 500);

    setIsLoadingMenuItems(true);
    setTimeout(() => {
      setMenuItems([]); // No dummy data
      setIsLoadingMenuItems(false);
    }, 600);

    fetchOrders(); // Fetch all orders, which will include bookings
    fetchTables();
  }, []);

  // --- API Functions ---
  const fetchData = async (url, method = 'GET', body = null) => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const options = { method, headers };
      if (body) {
        options.body = JSON.stringify(body);
      }
      const response = await fetch(url, options);

      if (response.status === 401) {
        console.warn("Unauthorized access. Clearing token and logging out.");
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCurrentUser(null);
        throw new Error("Unauthorized"); // Propagate error to stop further processing
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API call to ${url} failed:`, error);
      throw error; // Re-throw to be caught by specific handlers
    }
  };

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await fetchData(ORDERS_FETCH_ALL_URL);
      console.log("Fetched orders data:", data); // Log fetched data
      // Ensure data is an array before setting state
      const fetchedOrders = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setOrders(fetchedOrders); 
      // Filter bookings from the fetched orders
      setBookings(fetchedOrders.filter(order => order.bookingDetails));
      console.log("Final orders state:", fetchedOrders); // Log final state
    } catch (error) {
      setOrders([]);
      setBookings([]);
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const addOrder = async (orderData) => {
    setIsLoadingOrders(true);
    try {
      await fetchData(ORDERS_CREATE_URL, 'POST', orderData);
      await fetchOrders(); // Refresh orders and bookings
      setShowOrderFormModal(false);
    } catch (error) {
      // Error handled by fetchData, just log here if needed
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setIsLoadingOrders(true);
    try {
      await fetchData(ORDERS_UPDATE_STATUS_URL(orderId), 'PATCH', { status: newStatus });
      await fetchOrders(); // Refresh orders and bookings
    } catch (error) {
      // Error handled by fetchData
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!isLoggedIn) {
      console.warn("Not authorized to perform this action. Please ensure a token is set in localStorage.");
      return;
    }
    setConfirmTitle('Delete Order/Booking');
    setConfirmMessage('Are you sure you want to delete this order/booking? This action cannot be undone.');
    setConfirmAction(() => async () => {
      setIsLoadingOrders(true);
      try {
        await fetchData(ORDERS_DELETE_URL(orderId), 'DELETE');
        await fetchOrders(); // Refresh orders and bookings
        setShowConfirmModal(false);
      } catch (error) {
        // Error handled by fetchData
      } finally {
        setIsLoadingOrders(false);
      }
    });
    setShowConfirmModal(true);
  };


  const fetchOrderDetails = async (orderId) => {
    try {
      const data = await fetchData(ORDERS_DETAILS_URL(orderId));
      console.log(`Details for order ${orderId}:`, data);
      // You can implement a modal or dedicated view to display these details
      return data;
    } catch (error) {
      console.error(`Failed to fetch details for order ${orderId}:`, error);
      return null;
    }
  };

  const fetchInvoiceDetails = async (orderId) => {
    try {
      const data = await fetchData(ORDERS_INVOICE_URL(orderId));
      console.log(`Invoice for order ${orderId}:`, data);
      // You can implement a modal or dedicated view to display invoice
      return data;
    } catch (error) {
      console.error(`Failed to fetch invoice for order ${orderId}:`, error);
      return null;
    }
  };

  // --- Table API Functions ---
  const fetchTables = async () => {
    setIsLoadingTables(true);
    try {
      const data = await fetchData(TABLES_API_URL);
      console.log("Fetched tables data:", data); // Log fetched data
      // Correctly access the 'tables' array from the response object
      const fetchedTables = Array.isArray(data.tables) ? data.tables : [];
      setTables(fetchedTables);
      console.log("Final tables state:", fetchedTables); // Log final state
    } catch (error) {
      setTables([]);
      console.error("Error fetching tables:", error);
    } finally {
      setIsLoadingTables(false);
    }
  };

  const addOrUpdateTable = async (tableData) => {
    setIsLoadingTables(true);
    try {
      if (editingTable) {
        await fetchData(`${TABLES_API_URL}/${editingTable._id}`, 'PUT', tableData);
      } else {
        await fetchData(TABLES_API_URL, 'POST', tableData);
      }
      await fetchTables();
      setEditingTable(null);
      setShowTableFormModal(false);
    } catch (error) {
      // Error handled by fetchData
    } finally {
      setIsLoadingTables(false);
    }
  };

  const deleteTable = async (id) => {
    if (!isLoggedIn) {
      console.warn("Not authorized to perform this action. Please ensure a token is set in localStorage.");
      return;
    }
    setConfirmTitle('Delete Table');
    setConfirmMessage('Are you sure you want to delete this table? This action cannot be undone.');
    setConfirmAction(() => async () => {
      setIsLoadingTables(true);
      try {
        await fetchData(`${TABLES_API_URL}/${id}`, 'DELETE');
        await fetchTables();
        setShowConfirmModal(false);
      } catch (error) {
        // Error handled by fetchData
      } finally {
        setIsLoadingTables(false);
      }
    });
    setShowConfirmModal(true);
  };

  const updateTableStatus = async (id, newStatus) => {
    setIsLoadingTables(true);
    try {
      await fetchData(`${TABLES_API_URL}/${id}`, 'PATCH', { status: newStatus });
      await fetchTables();
    } catch (error) {
      // Error handled by fetchData
    } finally {
      setIsLoadingTables(false);
    }
  };

  // --- Internal Authentication Handlers (not tied to UI buttons) ---
  const handleLoginInternal = () => {
    localStorage.setItem('token', 'mock-jwt-token-123'); // Simulate successful login
    setIsLoggedIn(true);
    setCurrentUser({ username: 'admin_user', role: 'admin' });
    console.log("Token set in localStorage. User is now considered logged in.");
    fetchOrders();
    fetchTables();
  };

  const handleLogoutInternal = () => {
    localStorage.removeItem('token'); // Simulate logout
    setIsLoggedIn(false);
    setCurrentUser(null);
    console.log("Token removed from localStorage. User is now considered logged out.");
    fetchOrders(); // Data will likely be empty or unauthorized
    fetchTables();
  };


  // --- Category Handlers (remain simulated as no API was provided) ---
  const handleAddOrUpdateCategory = (newCategoryData) => {
    if (!isLoggedIn) {
      console.warn("Not authorized to perform this action. Please ensure a token is set in localStorage.");
      return;
    }
    setIsLoadingCategories(true);
    setTimeout(() => {
      if (editingCategory) {
        setCategories(categories.map(cat =>
          cat._id === editingCategory._id ? { ...cat, ...newCategoryData } : cat
        ));
      } else {
        const newId = `cat${categories.length + 1}`;
        setCategories([...categories, { _id: newId, ...newCategoryData, createdAt: new Date().toISOString() }]);
      }
      setEditingCategory(null);
      setIsLoadingCategories(false);
    }, 300);
  };

  const handleDeleteCategory = (id) => {
    if (!isLoggedIn) {
      console.warn("Not authorized to perform this action. Please ensure a token is set in localStorage.");
      return;
    }
    setConfirmTitle('Delete Category');
    setConfirmMessage('Are you sure you want to delete this category? This action cannot be undone.');
    setConfirmAction(() => () => {
      setIsLoadingCategories(true);
      setTimeout(() => {
        setCategories(categories.filter(cat => cat._id !== id));
        setMenuItems(prevItems => prevItems.filter(item => item.category !== categories.find(c => c._id === id)?.name));
        setIsLoadingCategories(false);
        setShowConfirmModal(false);
      }, 300);
    });
    setShowConfirmModal(true);
  };

  const handleToggleCategoryStatus = (id, newStatus) => {
    if (!isLoggedIn) {
      console.warn("Not authorized to perform this action. Please ensure a token is set in localStorage.");
      return;
    }
    setIsLoadingCategories(true);
    setTimeout(() => {
      setCategories(categories.map(cat =>
        cat._id === id ? { ...cat, status: newStatus } : cat
      ));
      setIsLoadingCategories(false);
    }, 300);
  };

  // --- Menu Item Handlers (remain simulated as no API was provided) ---
  const handleAddOrUpdateMenuItem = (newMenuItemData) => {
    if (!isLoggedIn) {
      console.warn("Not authorized to perform this action. Please ensure a token is set in localStorage.");
      return;
    }
    setIsLoadingMenuItems(true);
    setTimeout(() => {
      if (editingMenuItem) {
        setMenuItems(menuItems.map(item =>
          item._id === editingMenuItem._id ? { ...item, ...newMenuItemData } : item
        ));
      } else {
        const newId = `item${menuItems.length + 1}`;
        setMenuItems([...menuItems, { _id: newId, ...newMenuItemData, createdAt: new Date().toISOString() }]);
      }
      setEditingMenuItem(null);
      setIsLoadingMenuItems(false);
    }, 300);
  };

  const handleDeleteMenuItem = (id) => {
    if (!isLoggedIn) {
      console.warn("Not authorized to perform this action. Please ensure a token is set in localStorage.");
      return;
    }
    setConfirmTitle('Delete Menu Item');
    setConfirmMessage('Are you sure you want to delete this menu item? This action cannot be undone.');
    setConfirmAction(() => () => {
      setIsLoadingMenuItems(true);
      setTimeout(() => {
        setMenuItems(menuItems.filter(item => item._id !== id));
        setIsLoadingMenuItems(false);
        setShowConfirmModal(false);
      }, 300);
    });
    setShowConfirmModal(true);
  };

  const handleToggleMenuItemStatus = (id, newStatus) => {
    if (!isLoggedIn) {
      console.warn("Not authorized to perform this action. Please ensure a token is set in localStorage.");
      return;
    }
    setIsLoadingMenuItems(true);
    setTimeout(() => {
      setMenuItems(menuItems.map(item =>
        item._id === id ? { ...item, status: newStatus } : item
      ));
      setIsLoadingMenuItems(false);
    }, 300);
  };

  // Filtered lists for search functionality
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(menuSearchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order.staffName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    order.tableNo.toLowerCase().includes(orderSearchTerm.toLowerCase())
  );

  // Bookings are now filtered from the 'orders' state
  const filteredBookings = bookings.filter(booking =>
    booking.staffName.toLowerCase().includes(bookingSearchTerm.toLowerCase()) || // guestName maps to staffName
    booking.tableNo.toLowerCase().includes(bookingSearchTerm.toLowerCase()) || // tableNumber maps to tableNo
    booking.phoneNumber.includes(bookingSearchTerm) ||
    (booking.bookingDetails?.invoiceId && booking.bookingDetails.invoiceId.toLowerCase().includes(bookingSearchTerm.toLowerCase()))
  );

  const filteredTables = tables.filter(table =>
    table.tableNumber.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
    table.location.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
    table.status.toLowerCase().includes(tableSearchTerm.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      <header className="text-center mb-8 relative bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Restaurant Dashboard</h1>
        <p className="text-gray-600">Manage categories, menu, orders, bookings, and tables</p>
        {/* Removed authentication status display and login/logout button */}
      </header>

      <nav className="mb-6 flex justify-center space-x-4">
        <button
          onClick={() => { setActiveTab('categories'); setShowOrderFormModal(false); setShowBookingFormModal(false); setShowTableFormModal(false); }}
          className={`px-6 py-2 rounded-md text-lg font-medium ${
            activeTab === 'categories'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => { setActiveTab('menu'); setShowOrderFormModal(false); setShowBookingFormModal(false); setShowTableFormModal(false); }}
          className={`px-6 py-2 rounded-md text-lg font-medium ${
            activeTab === 'menu'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => { setActiveTab('orders'); setShowOrderFormModal(false); setShowBookingFormModal(false); setShowTableFormModal(false); }}
          className={`px-6 py-2 rounded-md text-lg font-medium ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => { setActiveTab('bookings'); setShowOrderFormModal(false); setShowBookingFormModal(false); setShowTableFormModal(false); }}
          className={`px-6 py-2 rounded-md text-lg font-medium ${
            activeTab === 'bookings'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          Bookings
        </button>
        <button
          onClick={() => { setActiveTab('tables'); setShowOrderFormModal(false); setShowBookingFormModal(false); setShowTableFormModal(false); }}
          className={`px-6 py-2 rounded-md text-lg font-medium ${
            activeTab === 'tables'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tables
        </button>
      </nav>

      <main className="w-full max-w-6xl mx-auto">
        {activeTab === 'categories' && (
          <>
            <CategoryForm
              onSave={handleAddOrUpdateCategory}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              isLoading={isLoadingCategories}
              isAuth={isLoggedIn}
            />
            <CategoryList
              categories={categories}
              onEdit={setEditingCategory}
              onDelete={handleDeleteCategory}
              onToggleStatus={handleToggleCategoryStatus}
              isLoading={isLoadingCategories}
              isAuth={isLoggedIn}
            />
          </>
        )}

        {activeTab === 'menu' && (
          <>
            <MenuItemForm
              onSave={handleAddOrUpdateMenuItem}
              editingMenuItem={editingMenuItem}
              setEditingMenuItem={setEditingMenuItem}
              categories={categories}
              isLoading={isLoadingMenuItems}
              isAuth={isLoggedIn}
            />
            <MenuList
              menuItems={filteredMenuItems}
              categories={categories}
              onEdit={setEditingMenuItem}
              onDelete={handleDeleteMenuItem}
              onToggleStatus={handleToggleMenuItemStatus}
              isLoading={isLoadingMenuItems}
              onSearchChange={setMenuSearchTerm}
              searchTerm={menuSearchTerm}
              isAuth={isLoggedIn}
            />
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <OrderList
              orders={filteredOrders}
              onAddOrderClick={() => setShowOrderFormModal(true)}
              menuItems={menuItems}
              onUpdateOrderStatus={updateOrderStatus} // Use updated API function
              isLoading={isLoadingOrders}
              onSearchChange={setOrderSearchTerm}
              searchTerm={orderSearchTerm}
              isAuth={isLoggedIn}
            />
            <Modal isOpen={showOrderFormModal} onClose={() => setShowOrderFormModal(false)}>
              <OrderForm onSave={addOrder} onCancel={() => setShowOrderFormModal(false)} menuItems={menuItems} isLoading={isLoadingOrders} isAuth={isLoggedIn} />
            </Modal>
          </>
        )}

        {activeTab === 'bookings' && (
          <>
            {editingBooking || showBookingFormModal ? (
              <BookingForm
                onSave={addOrder} // Bookings now use the addOrder API
                editingBooking={editingBooking}
                setEditingBooking={setEditingBooking}
                isLoading={isLoadingOrders} // Use order loading state for bookings
                isAuth={isLoggedIn}
              />
            ) : (
              <BookingList
                bookings={filteredBookings}
                onEdit={(booking) => { setEditingBooking(booking); setShowBookingFormModal(true); }}
                onDelete={deleteOrder} // Use deleteOrder for bookings
                onUpdateBookingStatus={updateOrderStatus} // Use updateOrderStatus for bookings
                isLoading={isLoadingOrders} // Use order loading state for bookings
                onSearchChange={setBookingSearchTerm}
                searchTerm={bookingSearchTerm}
                isAuth={isLoggedIn}
              />
            )}
            {showBookingFormModal && !editingBooking && (
              <Modal isOpen={showBookingFormModal} onClose={() => setShowBookingFormModal(false)}>
                <BookingForm onSave={addOrder} editingBooking={null} setEditingBooking={setEditingBooking} isLoading={isLoadingOrders} isAuth={isLoggedIn} />
              </Modal>
            )}
          </>
        )}

        {activeTab === 'tables' && (
          <>
            {editingTable || showTableFormModal ? (
              <TableForm
                onSave={addOrUpdateTable}
                editingTable={editingTable}
                setEditingTable={setEditingTable}
                isLoading={isLoadingTables}
                isAuth={isLoggedIn}
              />
            ) : (
              <TableList
                tables={filteredTables}
                onEdit={(table) => { setEditingTable(table); setShowTableFormModal(true); }}
                onDelete={deleteTable}
                onUpdateTableStatus={updateTableStatus}
                isLoading={isLoadingTables}
                onSearchChange={setTableSearchTerm}
                searchTerm={tableSearchTerm}
                isAuth={isLoggedIn}
              />
            )}
            {showTableFormModal && !editingTable && (
              <Modal isOpen={showTableFormModal} onClose={() => setShowTableFormModal(false)}>
                <TableForm onSave={addOrUpdateTable} editingTable={null} setEditingTable={setEditingTable} isLoading={isLoadingTables} isAuth={isLoggedIn} />
              </Modal>
            )}
          </>
        )}
      </main>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          if (confirmAction) {
            confirmAction();
          }
        }}
        title={confirmTitle}
        message={confirmMessage}
      />
    </div>
  );
}
