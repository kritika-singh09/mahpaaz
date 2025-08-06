import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Filter,
  X,
  Save,
  DollarSign,
  User,
  Package,
  List,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

// Main App Component
const App = () => {
  const { axios } = useAppContext();

  const [orders, setOrders] = useState([]);

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [editingOrder, setEditingOrder] = useState(null);

  const [filterStatus, setFilterStatus] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");

  const getAuthToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error("Authentication token not found in localStorage.");
        return;
      }

      try {
        const response = await axios.get("/api/laundry", {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from localStorage
          },
        });
        const data = response.data;

        if (data && Array.isArray(data.laundry)) {
          console.log("Successfully fetched laundry data.");
          setOrders(data.laundry);
        } else {
          console.error(
            'API response is not a valid object with a "laundry" array:',
            data
          );
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Function to save (add or update) an order via the API
  const handleSaveOrder = async (orderData) => {
    const token = getAuthToken();
    if (!token) {
      console.error("Authentication token not found in localStorage.");
      return;
    }

    if (editingOrder) {
      // If editing an existing order, update it with a PUT request
      try {
        const response = await axios.put(
          `/api/laundry/${editingOrder._id}`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedOrder = response.data;
        setOrders(
          orders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      } catch (error) {
        console.error("Error updating order:", error);
      }
    } else {
      // If adding a new order, create it with a POST request
      try {
        const response = await axios.post("/api/laundry", orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log("API response for new order:", data);

        const newOrder = data.laundry || data.order || data;

        setOrders([...orders, newOrder]);
      } catch (error) {
        console.error("Error adding new order:", error);
      }
    }
    setShowOrderForm(false);
    setEditingOrder(null);
  };

  // Function to delete an order via the API
  const handleDeleteOrder = async (id) => {
    const token = getAuthToken();
    if (!token) {
      console.error("Authentication token not found in localStorage.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`/api/laundry/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(orders.filter((order) => order._id !== id));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  // Function to open the order form for adding a new order
  const handleAddOrder = () => {
    setEditingOrder(null);
    setShowOrderForm(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  // Filter and sort orders based on current criteria
  const filteredOrders = orders
    .filter((order) => {
      // Filter by status
      if (filterStatus !== "All" && order.laundryStatus !== filterStatus) {
        return false;
      }
      // Filter by search query (customer name or order ID)
      if (
        searchQuery &&
        !order.requestedByName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !order._id?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Simple sorting by created date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Component for the Order Form (Modal)
  const OrderForm = ({ order, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      ...order,
      laundryStatus: order?.laundryStatus || "pending",
      requestedByName: order?.requestedByName || "",

      items: order?.items || [
        { itemName: "", quantity: 1, laundryServiceType: "wash", itemType: "" },
      ],
      totalCharge: order?.totalCharge || 0,
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleItemChange = (index, e) => {
      const { name, value } = e.target;
      const newItems = [...formData.items];
      newItems[index] = {
        ...newItems[index],
        [name]: name === "quantity" ? parseInt(value) || 0 : value,
      };
      setFormData({ ...formData, items: newItems });
    };

    const handleAddItem = () => {
      // FIX: Add itemType to the new item object
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            itemName: "",
            quantity: 1,
            laundryServiceType: "wash",
            itemType: "",
          },
        ],
      });
    };

    const handleRemoveItem = (index) => {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative transform transition-all duration-300 scale-100 opacity-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
            {order ? "Edit Order" : "Add New Order"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="requestedByName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <User size={16} className="inline-block mr-1 text-blue-500" />{" "}
                Customer Name
              </label>
              <input
                type="text"
                id="requestedByName"
                name="requestedByName"
                value={formData.requestedByName}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package
                  size={16}
                  className="inline-block mr-1 text-green-500"
                />{" "}
                Items
              </label>
              <div className="space-y-3">
                {formData.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <input
                      type="text"
                      name="itemName"
                      placeholder="Item Name"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, e)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:[color:var(--color-primary)]  focus:border-[color:var(--color-primary)] "
                      required
                    />

                    <select
                      name="itemType"
                      value={item.itemType}
                      onChange={(e) => handleItemChange(index, e)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:[color:var(--color-primary)]  focus:border-[color:var(--color-primary)] "
                      required
                    >
                      <option value="">Select Item Type</option>
                      <option value="guest">Guest</option>
                      <option value="house">House</option>
                      <option value="uniform">Uniform</option>
                    </select>

                    <input
                      type="number"
                      name="quantity"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-center focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus size={16} className="mr-2" /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="laundryStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <List
                    size={16}
                    className="inline-block mr-1 text-purple-500"
                  />{" "}
                  Status
                </label>
                <select
                  id="laundryStatus"
                  name="laundryStatus"
                  value={formData.laundryStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="partially_delivered">
                    Partially Delivered
                  </option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="laundryServiceType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <DollarSign
                    size={16}
                    className="inline-block mr-1 text-yellow-600"
                  />{" "}
                  Laundry Service Type
                </label>
                <select
                  id="laundryServiceType"
                  name="laundryServiceType"
                  value={formData.laundryServiceType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select Service</option>
                  <option value="wash">Wash</option>
                  <option value="iron">Iron</option>
                  <option value="dry_clean">Dry Clean</option>
                  <option value="wash+iron">Wash + Iron</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Save size={16} className="mr-2" /> Save Order
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" /> Pending
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" /> In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" /> Completed
          </span>
        );
      case "partially_delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Truck size={12} className="mr-1" /> Partial Delivery
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X size={12} className="mr-1" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
          Laundry Order Management
        </h1>
        <button
          onClick={handleAddOrder}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-[color:var(--color-primary)]  hover:bg-[color:var(--color-primary)]  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
        >
          <Plus size={20} className="mr-2" /> Add New Order
        </button>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-md mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center w-full md:w-auto">
          <Filter size={20} className="text-gray-500 mr-2" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="partially_delivered">Partial Delivery</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by Customer or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm border border-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
          />
          <User
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.requestedByName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.items?.map((item, index) => (
                        <div key={index}>
                          {item.quantity}x {item.itemName} ({item.itemType})
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(order.laundryStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${order.totalCharge?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                          aria-label={`Edit order ${order._id}`}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                          aria-label={`Delete order ${order._id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showOrderForm && (
        <OrderForm
          order={editingOrder}
          onSave={handleSaveOrder}
          onClose={() => setShowOrderForm(false)}
        />
      )}
    </div>
  );
};

export default App;
