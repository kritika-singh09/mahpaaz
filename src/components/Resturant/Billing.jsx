import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const Billing = () => {
  const { axios } = useAppContext();
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState(null);
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

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bills/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching bills:', error);
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
      const tax = subtotal * 0.18; // 18% GST
      const totalAmount = subtotal - discount + tax;
      
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/bills/create', formData, {
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
      alert('🎉 Bill created successfully!');
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/bills/${showPayment._id}/payment`, paymentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBills();
      setShowPayment(null);
      setPaymentData({ paidAmount: 0, paymentMethod: 'cash', cardNumber: '', upiId: '', splitDetails: { cash: 0, card: 0, upi: 0 } });
      alert('💰 Payment processed successfully!');
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: 'hsl(45, 100%, 95%)' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Restaurant Billing</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Create Bill
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Bill</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={formData.orderId}
              onChange={(e) => handleOrderSelect(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
              required
            >
              <option value="">Select Order</option>
              {orders.filter(order => order.status === 'completed').map((order) => (
                <option key={order._id} value={order._id}>
                  Table {order.tableNo} - ₹{order.amount} - {order.staffName}
                </option>
              ))}
            </select>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Table No"
                value={formData.tableNo}
                onChange={(e) => setFormData({...formData, tableNo: e.target.value})}
                className="border rounded-lg px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Subtotal"
                value={formData.subtotal}
                onChange={(e) => setFormData({...formData, subtotal: parseFloat(e.target.value)})}
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
              <input
                type="number"
                placeholder="Tax"
                value={formData.tax}
                onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value)})}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Total Amount"
                value={formData.totalAmount}
                className="border rounded-lg px-3 py-2"
                readOnly
              />
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="border rounded-lg px-3 py-2"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="split">Split</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Create Bill
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
        {bills.map((bill) => (
          <div key={bill._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Bill #{bill.billNumber}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                bill.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {bill.paymentStatus}
              </span>
            </div>
            <p className="text-gray-600 mb-1">Table: {bill.tableNo}</p>
            <p className="text-gray-600 mb-1">Subtotal: ₹{bill.subtotal}</p>
            <p className="text-gray-600 mb-1">Tax: ₹{bill.tax}</p>
            <p className="text-blue-600 font-semibold mb-2">Total: ₹{bill.totalAmount}</p>
            <p className="text-green-600 mb-2">Paid: ₹{bill.paidAmount}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowPayment(bill)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                disabled={bill.paymentStatus === 'paid'}
              >
                Payment
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Process Payment</h3>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <p className="text-gray-600">Bill: #{showPayment.billNumber}</p>
                <p className="text-gray-600">Total: ₹{showPayment.totalAmount}</p>
                <p className="text-gray-600">Paid: ₹{showPayment.paidAmount}</p>
                <p className="font-semibold">Due: ₹{showPayment.totalAmount - showPayment.paidAmount}</p>
              </div>
              <input
                type="number"
                placeholder="Payment Amount"
                value={paymentData.paidAmount}
                onChange={(e) => setPaymentData({...paymentData, paidAmount: parseFloat(e.target.value)})}
                className="border rounded-lg px-3 py-2 w-full"
                required
              />
              <select
                value={paymentData.paymentMethod}
                onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="split">Split Payment</option>
              </select>
              
              {paymentData.paymentMethod === 'card' && (
                <input
                  type="text"
                  placeholder="Card Number (Last 4 digits)"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                  className="border rounded-lg px-3 py-2 w-full"
                  maxLength="4"
                />
              )}
              
              {paymentData.paymentMethod === 'upi' && (
                <input
                  type="text"
                  placeholder="UPI ID"
                  value={paymentData.upiId}
                  onChange={(e) => setPaymentData({...paymentData, upiId: e.target.value})}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              )}
              
              {paymentData.paymentMethod === 'split' && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Split Payment Details:</p>
                  <input
                    type="number"
                    placeholder="Cash Amount"
                    value={paymentData.splitDetails.cash}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      splitDetails: {...paymentData.splitDetails, cash: parseFloat(e.target.value) || 0}
                    })}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Card Amount"
                    value={paymentData.splitDetails.card}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      splitDetails: {...paymentData.splitDetails, card: parseFloat(e.target.value) || 0}
                    })}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                  <input
                    type="number"
                    placeholder="UPI Amount"
                    value={paymentData.splitDetails.upi}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      splitDetails: {...paymentData.splitDetails, upi: parseFloat(e.target.value) || 0}
                    })}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                  <p className="text-sm text-gray-600">
                    Total Split: ₹{paymentData.splitDetails.cash + paymentData.splitDetails.card + paymentData.splitDetails.upi}
                  </p>
                </div>
              )}
              <div className="flex space-x-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                  Process Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayment(null)}
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

export default Billing;