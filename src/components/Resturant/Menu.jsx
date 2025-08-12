import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const Menu = () => {
  const { axios } = useAppContext();
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    Price: 0,
    category: '',
    Discount: 0,
    status: 'available',
    in_oostock: true,
    image: '',
    description: ''
  });

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('/api/items/all');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingItem) {
        await axios.put(`/api/items/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/items/add', formData);
      }
      fetchMenuItems();
      setShowForm(false);
      setEditingItem(null);
      setFormData({ name: '', Price: 0, category: '', Discount: 0, status: 'available', in_oostock: true, image: '', description: '' });
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: 'hsl(45, 100%, 95%)' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Menu Items</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingItem ? 'Edit' : 'Add'} Menu Item</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.Price}
              onChange={(e) => setFormData({...formData, Price: Number(e.target.value)})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Discount"
              value={formData.Discount}
              onChange={(e) => setFormData({...formData, Discount: Number(e.target.value)})}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="border rounded-lg px-3 py-2 col-span-2"
              rows="3"
            />
            <div className="col-span-2 flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                {editingItem ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setFormData({ name: '', Price: 0, category: '', Discount: 0, status: 'available', in_oostock: true, image: '', description: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            <p className="text-blue-600 font-semibold">₹{item.Price}</p>
            {item.Discount > 0 && <p className="text-green-600 text-sm">Discount: ₹{item.Discount}</p>}
            <p className="text-sm text-gray-500">Category: {item.category}</p>
            <div className="flex justify-between items-center text-sm">
              <span className={`${item.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                {item.status}
              </span>
              <span className={`${item.in_oostock ? 'text-green-600' : 'text-red-600'}`}>
                {item.in_oostock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;