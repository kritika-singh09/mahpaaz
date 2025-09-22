import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { showToast } from "../../utils/toaster";
import { validateRequired, validatePositiveNumber } from "../../utils/validation";
import Pagination from "../common/Pagination";

const Billing = () => {
  const { axios } = useAppContext();
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [formData, setFormData] = useState({
    orderId: '',
    tableNo: '',
    subtotal: 0,
    discount: 0,
    tax: 0,
    totalAmount: 0,
    paymentMethod: 'cash'
  });
  const [paymentData, setPaymentData] = useState({
    paidAmount: 0,
    paymentMethod: 'cash',
    cardNumber: '',
    upiId: '',
    splitDetails: { cash: 0, card: 0, upi: 0 }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bills/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setBills([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/restaurant-orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchBills();
    fetchOrders();
  }, []);

  const handleOrderSelect = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (order) {
      const subtotal = order.amount || 0;
      const discount = order.discount || 0;
      const tax = Math.round(subtotal * 0.18 * 100) / 100;
      const totalAmount = Math.round((subtotal - discount + tax) * 100) / 100;
      
      setFormData({
        ...formData,
        orderId,
        tableNo: order.tableNo,
        subtotal,
        discount,
        tax,
        totalAmount
      });
    }
  };

  const generateBillNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `BILL-${timestamp}`;
  };

  const validateBillForm = () => {
    if (!validateRequired(formData.orderId)) {
      showToast.error('Please select an order');
      return false;
    }
    
    if (!validateRequired(formData.tableNo)) {
      showToast.error('Table number is required');
      return false;
    }
    
    if (!validatePositiveNumber(formData.subtotal)) {
      showToast.error('Subtotal must be a positive number');
      return false;
    }
    
    if (!validatePositiveNumber(formData.totalAmount)) {
      showToast.error('Total amount must be a positive number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateBillForm()) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const billData = {
        ...formData,
        billNumber: generateBillNumber(),
        cashierId: user?._id || user?.id || 'default'
      };
      
      await axios.post('/api/bills/create ', billData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchBills();
      setShowForm(false);
      setFormData({
        orderId: '',
        tableNo: '',
        subtotal: 0,
        discount: 0,
        tax: 0,
        totalAmount: 0,
        paymentMethod: 'cash'
      });
      showToast.success('🎉 Bill created successfully!');
    } catch (error) {
      console.error('Error creating bill:', error);
      showToast.error('Failed to create bill');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!showPayment || !showPayment._id) {
      showToast.error('Invalid bill selected');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const paymentAmount = parseFloat(paymentData.paidAmount);
      const totalDue = (showPayment.totalAmount || 0) - (showPayment.paidAmount || 0);
      
      if (paymentAmount <= 0) {
        showToast.error('Please enter a valid payment amount');
        return;
      }
      
      const paymentPayload = {
        ...paymentData,
        changeAmount: paymentAmount > totalDue ? paymentAmount - totalDue : 0
      };
      
      await axios.patch(`/api/bills/${showPayment._id}/payment`, paymentPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchBills();
      setShowPayment(null);
      setPaymentData({ paidAmount: 0, paymentMethod: 'cash', cardNumber: '', upiId: '', splitDetails: { cash: 0, card: 0, upi: 0 } });
      showToast.success('💰 Payment processed successfully!');
    } catch (error) {
      console.error('Error processing payment:', error);
      showToast.error('Failed to process payment: ' + (error.response?.data?.message || error.message));
    }
  };

  const getBillDetails = async (billId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/bills/${billId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDetails(response.data);
    } catch (error) {
      console.error('Error fetching bill details:', error);
      showToast.error('Failed to fetch bill details');
    }
  };

  const handleStatusChange = async (billId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/bills/${billId}/status`, 
        { paymentStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBills();
      showToast.success('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast.error('Failed to update status');
    }
  };

  return (
    <div className="p-4 sm:p-6" style={{ backgroundColor: 'hsl(45, 100%, 95%)', color: 'hsl(45, 100%, 20%)' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'hsl(45, 100%, 20%)' }}>Restaurant Billing</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg w-full sm:w-auto"
          style={{ backgroundColor: 'hsl(45, 43%, 58%)', color: 'white' }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(45, 32%, 46%)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(45, 43%, 58%)'}
        >
          Create Bill
        </button>
      </div>

      {showForm && (
        <div className="p-4 sm:p-6 rounded-lg shadow-md mb-6" style={{ backgroundColor: 'white', border: '1px solid hsl(45, 100%, 85%)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(45, 100%, 20%)' }}>Create New Bill</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.orderId}
              onChange={(e) => handleOrderSelect(e.target.value)}
              className="rounded-lg px-3 py-2 w-full text-sm sm:text-base"
              style={{ border: '1px solid hsl(45, 100%, 85%)', color: 'hsl(45, 100%, 20%)' }}
              required
            >
              <option value="">Select Order</option>
              {orders.filter(order => order.status === 'completed').map((order) => {
                const isInHouse = order.bookingId || order.grcNo || order.roomNumber;
                return (
                  <option key={order._id} value={order._id}>
                    {isInHouse ? '🏨 IN-HOUSE' : '🍽️ REGULAR'} - Table {order.tableNo} - ₹{order.amount} - {order.staffName}
                    {isInHouse && order.grcNo && ` (GRC: ${order.grcNo})`}
                    {isInHouse && order.roomNumber && ` (Room: ${order.roomNumber})`}
                  </option>
                );
              })}
            </select>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Table No</label>
                <input
                  type="text"
                  value={formData.tableNo}
                  onChange={(e) => setFormData({...formData, tableNo: e.target.value})}
                  className="rounded-lg px-3 py-2 w-full"
                  style={{ border: '1px solid hsl(45, 100%, 85%)', color: 'hsl(45, 100%, 20%)' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Subtotal</label>
                <input
                  type="number"
                  value={formData.subtotal}
                  onChange={(e) => setFormData({...formData, subtotal: parseFloat(e.target.value)})}
                  className="rounded-lg px-3 py-2 w-full"
                  style={{ border: '1px solid hsl(45, 100%, 85%)', color: 'hsl(45, 100%, 20%)' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Discount</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value)})}
                  className="rounded-lg px-3 py-2 w-full"
                  style={{ border: '1px solid hsl(45, 100%, 85%)', color: 'hsl(45, 100%, 20%)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Tax</label>
                <input
                  type="number"
                  value={formData.tax}
                  onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value)})}
                  className="rounded-lg px-3 py-2 w-full"
                  style={{ border: '1px solid hsl(45, 100%, 85%)', color: 'hsl(45, 100%, 20%)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Total Amount</label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  className="rounded-lg px-3 py-2 w-full"
                  style={{ border: '1px solid hsl(45, 100%, 85%)', backgroundColor: 'hsl(45, 100%, 80%)', color: 'hsl(45, 100%, 20%)' }}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'hsl(45, 100%, 20%)' }}>Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="rounded-lg px-3 py-2 w-full"
                  style={{ border: '1px solid hsl(45, 100%, 85%)', color: 'hsl(45, 100%, 20%)' }}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="split">Split</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                type="submit" 
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'hsl(45, 43%, 58%)', color: 'white' }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(45, 32%, 46%)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(45, 43%, 58%)'}
              >
                Create Bill
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'hsl(45, 71%, 69%)', color: 'hsl(45, 100%, 20%)' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid hsl(45, 100%, 85%)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'hsl(45, 100%, 80%)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Bill #</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Table</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Subtotal</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Discount</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Tax</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Paid</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: 'hsl(45, 100%, 85%)' }}>
              {bills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((bill, index) => (
                <tr key={bill._id} style={{ backgroundColor: index % 2 === 0 ? 'white' : 'hsl(45, 100%, 95%)', borderColor: 'hsl(45, 100%, 85%)' }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'hsl(45, 100%, 20%)' }}>
                    {bill.billNumber}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'hsl(45, 100%, 20%)' }}>
                    {(() => {
                      const order = orders.find(o => o._id === bill.orderId);
                      const isInHouse = order && (order.bookingId || order.grcNo || order.roomNumber);
                      return isInHouse ? '🏨 In-House' : '🍽️ Regular';
                    })()
                    }
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'hsl(45, 100%, 20%)' }}>{bill.tableNo}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'hsl(45, 100%, 20%)' }}>₹{bill.subtotal}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'hsl(45, 100%, 20%)' }}>₹{bill.discount}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'hsl(45, 100%, 20%)' }}>₹{bill.tax}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'hsl(45, 43%, 58%)' }}>₹{bill.totalAmount}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'hsl(45, 43%, 58%)' }}>₹{bill.paidAmount}</td>
                  <td className="px-4 py-3">
                    <select
                      value={bill.paymentStatus}
                      onChange={(e) => handleStatusChange(bill._id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs border-0 ${
                        bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => getBillDetails(bill._id)}
                      className="px-2 py-1 rounded text-xs hover:bg-blue-100 transition-colors"
                      style={{ backgroundColor: 'hsl(45, 71%, 69%)', color: 'hsl(45, 100%, 20%)' }}
                    >
                      📄 Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(bills.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={bills.length}
        />
        
        {bills.length === 0 && (
          <div className="text-center py-8" style={{ color: 'hsl(45, 100%, 20%)' }}>
            No bills found.
          </div>
        )}
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">💳 Process Payment</h3>
                  <p className="text-blue-100 text-sm">Bill #{showPayment.billNumber || 'N/A'}</p>
                </div>
                <button
                  onClick={() => setShowPayment(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handlePayment} className="p-6 space-y-6">
              {/* Bill Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">₹</span>
                  Bill Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-gray-800">₹{showPayment.totalAmount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Already Paid:</span>
                    <span className="font-semibold text-green-600">₹{showPayment.paidAmount || 0}</span>
                  </div>
                  <div className="flex justify-between col-span-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-800 font-semibold">Amount Due:</span>
                    <span className="font-bold text-red-600 text-lg">₹{(showPayment.totalAmount || 0) - (showPayment.paidAmount || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input
                    type="number"
                    value={paymentData.paidAmount}
                    onChange={(e) => setPaymentData({...paymentData, paidAmount: parseFloat(e.target.value)})}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">💳 Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {['cash', 'card', 'upi', 'split'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentData({...paymentData, paymentMethod: method})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        paymentData.paymentMethod === method
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">
                          {method === 'cash' && '💵'}
                          {method === 'card' && '💳'}
                          {method === 'upi' && '📱'}
                          {method === 'split' && '🔄'}
                        </div>
                        <div className="text-sm font-medium capitalize">{method === 'split' ? 'Split Pay' : method}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Payment Method Details */}
              {paymentData.paymentMethod === 'card' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Details</label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Last 4 digits"
                    maxLength="4"
                  />
                </div>
              )}
              
              {paymentData.paymentMethod === 'upi' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">UPI Details</label>
                  <input
                    type="text"
                    value={paymentData.upiId}
                    onChange={(e) => setPaymentData({...paymentData, upiId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="example@upi"
                  />
                </div>
              )}
              
              {paymentData.paymentMethod === 'split' && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h4 className="font-semibold text-gray-700">Split Payment Details</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">💵 Cash Amount</label>
                      <input
                        type="number"
                        value={paymentData.splitDetails.cash}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          splitDetails: {...paymentData.splitDetails, cash: parseFloat(e.target.value) || 0}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">💳 Card Amount</label>
                      <input
                        type="number"
                        value={paymentData.splitDetails.card}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          splitDetails: {...paymentData.splitDetails, card: parseFloat(e.target.value) || 0}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">📱 UPI Amount</label>
                      <input
                        type="number"
                        value={paymentData.splitDetails.upi}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          splitDetails: {...paymentData.splitDetails, upi: parseFloat(e.target.value) || 0}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">Total Split Amount:</span>
                      <span className="font-bold text-blue-900">₹{paymentData.splitDetails.cash + paymentData.splitDetails.card + paymentData.splitDetails.upi}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  💰 Process Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayment(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">📄 Bill Details</h3>
                  <p className="text-indigo-100 text-sm">Complete bill information</p>
                </div>
                <button
                  onClick={() => setShowDetails(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Bill Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Bill Number</span>
                    <span className="font-bold text-blue-800">#{showDetails.billNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Table</span>
                    <span className="font-bold text-gray-800">{showDetails.tableNo || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Date</span>
                    <span className="font-bold text-gray-800">
                      {showDetails.createdAt ? new Date(showDetails.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Time</span>
                    <span className="font-bold text-gray-800">
                      {showDetails.createdAt ? new Date(showDetails.createdAt).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">₹</span>
                  Amount Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{showDetails.subtotal || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-red-600">-₹{showDetails.discount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-semibold text-gray-800">₹{showDetails.tax || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-green-50 px-3 rounded-lg border border-green-200">
                    <span className="font-bold text-green-800">Total Amount</span>
                    <span className="font-bold text-green-800 text-lg">₹{showDetails.totalAmount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">💳</span>
                  Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-semibold text-gray-800 capitalize">
                        {showDetails.paymentMethod || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="font-semibold text-green-600">₹{showDetails.paidAmount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balance Due</span>
                      <span className="font-semibold text-red-600">
                        ₹{(showDetails.totalAmount || 0) - (showDetails.paidAmount || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        showDetails.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {showDetails.paymentStatus || 'Pending'}
                      </span>
                    </div>
                    {showDetails.changeAmount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Change Given</span>
                        <span className="font-semibold text-blue-600">₹{showDetails.changeAmount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {(showDetails.cashierId || showDetails.orderId) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">📁</span>
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {showDetails.cashierId && (
                      <div>
                        <span className="text-gray-600 block">Cashier ID</span>
                        <span className="font-semibold text-gray-800">
                          {typeof showDetails.cashierId === 'object' 
                            ? showDetails.cashierId.username || showDetails.cashierId._id || 'N/A'
                            : showDetails.cashierId
                          }
                        </span>
                      </div>
                    )}
                    {showDetails.orderId && (
                      <div>
                        <span className="text-gray-600 block">Order ID</span>
                        <span className="font-semibold text-gray-800">
                          {typeof showDetails.orderId === 'object' 
                            ? showDetails.orderId._id || 'N/A'
                            : showDetails.orderId
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  🖨️ Print Bill
                </button>
                <button
                  onClick={() => setShowDetails(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;