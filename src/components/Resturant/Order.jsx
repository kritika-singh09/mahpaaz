import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const Order = () => {
  const { axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [showInvoice, setShowInvoice] = useState(null);
  const [formData, setFormData] = useState({
    staffName: '',
    phoneNumber: '',
    tableNo: '',
    items: [],
    notes: '',
    amount: 0,
    discount: 0,
    couponCode: '',
    isMembership: false,
    isLoyalty: false
  });

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/restaurant-orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('/api/items/all');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: '', quantity: 1 }]
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/restaurant-orders/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
      setShowForm(false);
      setFormData({
        staffName: '',
        phoneNumber: '',
        tableNo: '',
        items: [],
        notes: '',
        amount: 0,
        discount: 0,
        couponCode: '',
        isMembership: false,
        isLoyalty: false
      });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      // Try PATCH first, then PUT for status endpoint
      try {
        await axios.patch(`/api/restaurant-orders/${orderId}/status`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (patchError) {
        await axios.put(`/api/restaurant-orders/${orderId}/status`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/restaurant-orders/details/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const generateInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/restaurant-orders/invoice/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowInvoice(response.data);
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: 'hsl(45, 100%, 95%)' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          New Order
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Order</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Staff Name"
                value={formData.staffName}
                onChange={(e) => setFormData({...formData, staffName: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Table No"
                value={formData.tableNo}
                onChange={(e) => setFormData({...formData, tableNo: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Items</h4>
                <button type="button" onClick={addItem} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                  Add Item
                </button>
              </div>
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={item.itemId}
                    onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                    className="border rounded px-3 py-2 flex-1"
                    required
                  >
                    <option value="">Select Item</option>
                    {menuItems.map((menuItem) => (
                      <option key={menuItem._id} value={menuItem._id}>
                        {menuItem.name} - ₹{menuItem.Price}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="border rounded px-3 py-2 w-20"
                    min="1"
                    required
                  />
                  <button type="button" onClick={() => removeItem(index)} className="bg-red-500 text-white px-3 py-2 rounded">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Discount"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value)})}
                className="border rounded-lg px-3 py-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Coupon Code"
                value={formData.couponCode}
                onChange={(e) => setFormData({...formData, couponCode: e.target.value})}
                className="border rounded-lg px-3 py-2"
              />
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isMembership}
                    onChange={(e) => setFormData({...formData, isMembership: e.target.checked})}
                    className="mr-2"
                  />
                  Membership
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isLoyalty}
                    onChange={(e) => setFormData({...formData, isLoyalty: e.target.checked})}
                    className="mr-2"
                  />
                  Loyalty
                </label>
              </div>
            </div>
            
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="border rounded-lg px-3 py-2 w-full"
              rows="3"
            />
            
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Create Order
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Table {order.tableNo}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'ready' ? 'bg-green-100 text-green-800' :
                order.status === 'served' ? 'bg-purple-100 text-purple-800' :
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-gray-600 mb-1">Staff: {order.staffName}</p>
            <p className="text-gray-600 mb-1">Phone: {order.phoneNumber}</p>
            <p className="text-blue-600 font-semibold mb-3">Amount: ₹{order.amount}</p>
            {order.discount > 0 && <p className="text-green-600 text-sm mb-2">Discount: ₹{order.discount}</p>}
            <div className="flex flex-wrap gap-2">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="served">Served</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => viewOrderDetails(order._id)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                Details
              </button>
              <button
                onClick={() => generateInvoice(order._id)}
                className="bg-green-500 text-white px-2 py-1 rounded text-sm"
              >
                Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <button onClick={() => setShowDetails(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <p><strong>Staff:</strong> {showDetails.staffName}</p>
              <p><strong>Phone:</strong> {showDetails.phoneNumber}</p>
              <p><strong>Table:</strong> {showDetails.tableNo}</p>
              <p><strong>Status:</strong> {showDetails.status}</p>
              <p><strong>Amount:</strong> ₹{showDetails.amount}</p>
              <p><strong>Discount:</strong> ₹{showDetails.discount}</p>
              {showDetails.couponCode && <p><strong>Coupon:</strong> {showDetails.couponCode}</p>}
              {showDetails.notes && <p><strong>Notes:</strong> {showDetails.notes}</p>}
              <div>
                <strong>Items:</strong>
                <ul className="list-disc list-inside mt-1">
                  {showDetails.items?.map((item, index) => (
                    <li key={index}>Qty: {item.quantity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Invoice</h3>
              <button onClick={() => setShowInvoice(null)} className="text-gray-500 hover:text-gray-700 text-xl">
                ✕
              </button>
            </div>
            <div className="invoice-content">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Restaurant Invoice</h2>
                <p className="text-gray-600">Order ID: {showInvoice._id}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Order Details:</h4>
                  <p>Staff: {showInvoice.staffName}</p>
                  <p>Phone: {showInvoice.phoneNumber}</p>
                  <p>Table: {showInvoice.tableNo}</p>
                  <p>Date: {new Date(showInvoice.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Details:</h4>
                  <p>Amount: ₹{showInvoice.amount}</p>
                  <p>Discount: ₹{showInvoice.discount}</p>
                  <p className="font-semibold">Total: ₹{showInvoice.amount - showInvoice.discount}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Items:</h4>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showInvoice.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">Item {index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {showInvoice.notes && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Notes:</h4>
                  <p className="text-gray-700">{showInvoice.notes}</p>
                </div>
              )}
              
              <div className="text-center mt-8 pt-4 border-t">
                <p className="text-gray-600">Thank you for your business!</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;