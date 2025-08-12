import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const Table = () => {
  const { axios } = useAppContext();
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    location: 'restaurant',
    status: 'available',
    isActive: true
  });

  const fetchTables = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/restaurant/tables', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle different response structures
      const tablesData = Array.isArray(response.data) ? response.data : 
                        (response.data.tables ? response.data.tables : []);
      setTables(tablesData);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setTables([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingTable) {
        await axios.put(`/api/restaurant/tables/${editingTable._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/restaurant/tables', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTables();
      setShowForm(false);
      setEditingTable(null);
      setFormData({ tableNumber: '', capacity: '', location: 'restaurant', status: 'available', isActive: true });
    } catch (error) {
      console.error('Error saving table:', error);
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location,
      status: table.status,
      isActive: table.isActive
    });
    setShowForm(true);
  };

  const updateTableStatus = async (tableId, status) => {
    try {
      const token = localStorage.getItem('token');
      // Try PATCH first, then PUT for status endpoint
      try {
        await axios.patch(`/api/restaurant/tables/${tableId}/status`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (patchError) {
        try {
          await axios.put(`/api/restaurant/tables/${tableId}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (putError) {
          // If both status endpoints fail, try updating the entire table
          const table = tables.find(t => t._id === tableId);
          if (table) {
            await axios.put(`/api/restaurant/tables/${tableId}`, { ...table, status }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        }
      }
      fetchTables();
    } catch (error) {
      console.error('Error updating table status:', error);
      alert('Failed to update table status. Please try again.');
    }
  };

  const deleteTable = async (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/restaurant/tables/${tableId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTables();
      } catch (error) {
        console.error('Error deleting table:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading tables...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Tables</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Table
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingTable ? 'Edit' : 'Add'} Table</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Table Number"
              value={formData.tableNumber}
              onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2"
              min="1"
              required
            />
            <select
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="border rounded-lg px-3 py-2"
              required
            >
              <option value="restaurant">Restaurant</option>
              <option value="bar">Bar</option>
              <option value="terrace">Terrace</option>
              <option value="private_dining">Private Dining</option>
            </select>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="border rounded-lg px-3 py-2"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <div className="col-span-2 flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                />
                Active
              </label>
            </div>
            <div className="col-span-2 flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                {editingTable ? 'Update' : 'Add'} Table
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTable(null);
                  setFormData({ tableNumber: '', capacity: '', location: 'restaurant', status: 'available', isActive: true });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.isArray(tables) && tables.length > 0 ? tables.map((table) => (
          <div key={table._id} className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
            table.status === 'available' ? 'border-green-500' :
            table.status === 'occupied' ? 'border-red-500' :
            table.status === 'reserved' ? 'border-yellow-500' :
            'border-gray-500'
          } ${!table.isActive ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">Table {table.tableNumber}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                table.status === 'available' ? 'bg-green-100 text-green-800' :
                table.status === 'occupied' ? 'bg-red-100 text-red-800' :
                table.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {table.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Capacity: {table.capacity}</p>
            <p className="text-gray-600 text-sm mb-3 capitalize">Location: {table.location.replace('_', ' ')}</p>
            <div className="space-y-2">
              <select
                value={table.status}
                onChange={(e) => updateTableStatus(table._id, e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full"
                disabled={!table.isActive}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(table)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTable(table._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No tables found. Click "Add Table" to create your first table.
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;