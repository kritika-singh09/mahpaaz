import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const Booking = () => {
  const { axios } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [showBilling, setShowBilling] = useState(null);
  const [billFormData, setBillFormData] = useState({
    orderId: '',
    tableNo: '',
    subtotal: 0,
    discount: 0,
    tax: 0,
    totalAmount: 0,
    paymentMethod: 'cash',
    cardNumber: '',
    cardHolderName: '',
    upiId: '',
    cashReceived: 0,
    splitDetails: { cash: 0, card: 0, upi: 0 }
  });
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    date: '',
    time: '',
    guests: 1,
    tableType: '',
    specialRequests: '',
    advanceAmount: 0
  });

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/restaurant-orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/restaurant-categories/all');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/restaurant/tables', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchCategories();
    fetchTables();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/restaurant-orders/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
      setShowForm(false);
      setFormData({
        customerName: '',
        phoneNumber: '',
        email: '',
        date: '',
        time: '',
        guests: 1,
        tableType: '',
        specialRequests: '',
        advanceAmount: 0
      });
      alert('🎉 Booking created successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      // Try PATCH first, then PUT for status endpoint
      try {
        await axios.patch(`/api/restaurant-orders/${bookingId}/status`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (patchError) {
        await axios.put(`/api/restaurant-orders/${bookingId}/status`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status. Please try again.');
    }
  };



  const handleBillSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/bills/create', billFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowBilling(null);
      setBillFormData({
        orderId: '',
        tableNo: '',
        subtotal: 0,
        discount: 0,
        tax: 0,
        totalAmount: 0,
        paymentMethod: 'cash',
        cardNumber: '',
        cardHolderName: '',
        upiId: '',
        cashReceived: 0,
        splitDetails: { cash: 0, card: 0, upi: 0 }
      });
      alert('🎉 Bill created successfully!');
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6" style={{ backgroundColor: 'hsl(45, 100%, 95%)' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Restaurant Bookings</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base"
        >
          New Booking
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Booking</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
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
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                className="border rounded-lg px-3 py-2"
                min="1"
                required
              />
              <select
                value={formData.tableType}
                onChange={(e) => setFormData({...formData, tableType: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Table</option>
                {tables.filter(table => table.status === 'available').map((table) => (
                  <option key={table._id} value={table.tableNumber}>
                    Table {table.tableNumber} - {table.capacity} seats ({table.location})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Advance Amount"
                value={formData.advanceAmount}
                onChange={(e) => setFormData({...formData, advanceAmount: parseFloat(e.target.value)})}
                className="border rounded-lg px-3 py-2"
              />
            </div>
            <textarea
              placeholder="Special Requests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
              className="border rounded-lg px-3 py-2 w-full"
              rows="3"
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Create Booking
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

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.staffName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {booking.phoneNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {booking.tableNo}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">
                    ₹{booking.amount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                      {booking.status === 'completed' && (
                        <button
                          onClick={() => {
                            const subtotal = booking.amount || 0;
                            const discount = booking.discount || 0;
                            const tax = subtotal * 0.18;
                            const totalAmount = subtotal - discount + tax;
                            setBillFormData({
                              orderId: booking._id,
                              tableNo: booking.tableNo,
                              subtotal,
                              discount,
                              tax,
                              totalAmount,
                              paymentMethod: 'cash',
                              cardNumber: '',
                              cardHolderName: '',
                              upiId: '',
                              cashReceived: 0,
                              splitDetails: { cash: 0, card: 0, upi: 0 }
                            });
                            setShowBilling(booking);
                          }}
                          className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Create Bill
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{booking.staffName}</h3>
                <p className="text-sm text-gray-600">{booking.phoneNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <span className="text-gray-500">Table:</span>
                <span className="ml-1 font-medium">{booking.tableNo}</span>
              </div>
              <div>
                <span className="text-gray-500">Amount:</span>
                <span className="ml-1 font-semibold text-blue-600">₹{booking.amount}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
              <select
                value={booking.status}
                onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                className="border rounded px-3 py-2 text-sm flex-1"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              {booking.status === 'completed' && (
                <button
                  onClick={() => {
                    const subtotal = booking.amount || 0;
                    const discount = booking.discount || 0;
                    const tax = subtotal * 0.18;
                    const totalAmount = subtotal - discount + tax;
                    setBillFormData({
                      orderId: booking._id,
                      tableNo: booking.tableNo,
                      subtotal,
                      discount,
                      tax,
                      totalAmount,
                      paymentMethod: 'cash',
                      cardNumber: '',
                      cardHolderName: '',
                      upiId: '',
                      cashReceived: 0,
                      splitDetails: { cash: 0, card: 0, upi: 0 }
                    });
                    setShowBilling(booking);
                  }}
                  className="bg-purple-500 text-white px-4 py-2 rounded text-sm"
                >
                  Create Bill
                </button>
              )}
            </div>
          </div>
        ))}
      </div>



      {showBilling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Bill</h3>
              <button onClick={() => setShowBilling(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <form onSubmit={handleBillSubmit} className="space-y-4">
              <div>
                <p className="text-gray-600">Order: Table {showBilling.tableNo}</p>
                <p className="text-gray-600">Staff: {showBilling.staffName}</p>
              </div>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Subtotal"
                  value={billFormData.subtotal}
                  onChange={(e) => setBillFormData({...billFormData, subtotal: parseFloat(e.target.value)})}
                  className="border rounded-lg px-3 py-2 w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount"
                  value={billFormData.discount}
                  onChange={(e) => setBillFormData({...billFormData, discount: parseFloat(e.target.value)})}
                  className="border rounded-lg px-3 py-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Tax (18%)"
                  value={billFormData.tax}
                  className="border rounded-lg px-3 py-2 w-full"
                  readOnly
                />
                <input
                  type="number"
                  placeholder="Total Amount"
                  value={billFormData.totalAmount}
                  className="border rounded-lg px-3 py-2 w-full font-semibold"
                  readOnly
                />
                <select
                  value={billFormData.paymentMethod}
                  onChange={(e) => setBillFormData({...billFormData, paymentMethod: e.target.value})}
                  className="border rounded-lg px-3 py-2 w-full"
                >
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="upi">📱 UPI</option>
                  <option value="split">🔄 Split Payment</option>
                </select>
                
                {billFormData.paymentMethod === 'cash' && (
                  <div className="p-3 bg-green-50 rounded-lg space-y-2">
                    <p className="text-sm text-green-700 mb-2">💵 Cash Payment</p>
                    <input
                      type="number"
                      placeholder="Cash Received"
                      value={billFormData.cashReceived}
                      onChange={(e) => setBillFormData({...billFormData, cashReceived: parseFloat(e.target.value)})}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                    {billFormData.cashReceived > billFormData.totalAmount && (
                      <p className="text-xs text-green-600">Change: ₹{billFormData.cashReceived - billFormData.totalAmount}</p>
                    )}
                  </div>
                )}
                
                {billFormData.paymentMethod === 'card' && (
                  <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                    <p className="text-sm text-blue-700 mb-2">💳 Card Payment</p>
                    <input
                      type="text"
                      placeholder="Card Number (Last 4 digits)"
                      value={billFormData.cardNumber}
                      onChange={(e) => setBillFormData({...billFormData, cardNumber: e.target.value})}
                      className="border rounded-lg px-3 py-2 w-full"
                      maxLength="4"
                    />
                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={billFormData.cardHolderName}
                      onChange={(e) => setBillFormData({...billFormData, cardHolderName: e.target.value})}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                    <p className="text-xs text-gray-600">Swipe/Insert card or use contactless payment</p>
                  </div>
                )}
                
                {billFormData.paymentMethod === 'upi' && (
                  <div className="p-3 bg-purple-50 rounded-lg space-y-2">
                    <p className="text-sm text-purple-700 mb-2">📱 UPI Payment</p>
                    <input
                      type="text"
                      placeholder="UPI ID (e.g., user@paytm)"
                      value={billFormData.upiId}
                      onChange={(e) => setBillFormData({...billFormData, upiId: e.target.value})}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                    <p className="text-xs text-gray-600">Scan QR code or enter UPI ID</p>
                  </div>
                )}
                
                {billFormData.paymentMethod === 'split' && (
                  <div className="p-3 bg-orange-50 rounded-lg space-y-2">
                    <p className="text-sm text-orange-700 mb-2">🔄 Split Payment</p>
                    <input
                      type="number"
                      placeholder="Cash Amount"
                      value={billFormData.splitDetails.cash}
                      onChange={(e) => setBillFormData({
                        ...billFormData,
                        splitDetails: {...billFormData.splitDetails, cash: parseFloat(e.target.value) || 0}
                      })}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                    <input
                      type="number"
                      placeholder="Card Amount"
                      value={billFormData.splitDetails.card}
                      onChange={(e) => setBillFormData({
                        ...billFormData,
                        splitDetails: {...billFormData.splitDetails, card: parseFloat(e.target.value) || 0}
                      })}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                    <input
                      type="number"
                      placeholder="UPI Amount"
                      value={billFormData.splitDetails.upi}
                      onChange={(e) => setBillFormData({
                        ...billFormData,
                        splitDetails: {...billFormData.splitDetails, upi: parseFloat(e.target.value) || 0}
                      })}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                    <p className="text-xs text-gray-600">
                      Total Split: ₹{billFormData.splitDetails.cash + billFormData.splitDetails.card + billFormData.splitDetails.upi}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                  Create Bill
                </button>
                <button
                  type="button"
                  onClick={() => setShowBilling(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;