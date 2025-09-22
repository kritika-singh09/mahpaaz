import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { showToast } from '../../utils/toaster';
import Pagination from '../common/Pagination';

const Users = () => {
  const { axios } = useAppContext();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showDetails, setShowDetails] = useState(null);
  const [showEdit, setShowEdit] = useState(null);
  const [editUser, setEditUser] = useState({});

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      // Try different endpoints based on user role
      let endpoint = `/api/auth/all-users?page=${page}&limit=15`;
      
      // Fallback endpoints if main one fails
      const fallbackEndpoints = [
        `/api/users?page=${page}&limit=15`,
        `/api/auth/users?page=${page}&limit=15`,
        `/api/search/universal?query=&type=users`,
        `/api/search/field?model=users&field=role&value=restaurant`,
        `/api/search/field?model=users&field=role&value=admin`
      ];
      
      let response;
      try {
        response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        if (error.response?.status === 403) {
          // Try fallback endpoints
          for (const fallback of fallbackEndpoints) {
            try {
              response = await axios.get(fallback, {
                headers: { Authorization: `Bearer ${token}` }
              });
              break;
            } catch (fallbackError) {
              console.log(`Fallback ${fallback} failed:`, fallbackError.response?.status);
            }
          }
        }
        if (!response) throw error;
      }
      
      console.log('API Response:', response.data);
      
      // Handle different response structures
      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data.users && Array.isArray(response.data.users)) {
        usersData = response.data.users;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      }
      
      setUsers(usersData);
      setFilteredUsers(usersData);
      setTotalPages(response.data.totalPages || Math.ceil(usersData.length / itemsPerPage));
      setTotalUsers(response.data.totalUsers || usersData.length);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast.error('Failed to fetch users');
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/search/universal?query=${searchQuery}&type=users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const searchResults = Array.isArray(response.data.users) ? response.data.users : [];
        setFilteredUsers(searchResults);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error searching users:', error);
        showToast.error('Failed to search users');
      }
    } else {
      setFilteredUsers(users);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'restaurant': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/users/${userId}/status`, {
        isActive: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast.success('User status updated successfully!');
      fetchUsers(currentPage);
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast.error('Failed to update user status');
    }
  };

  const viewUserDetails = (user) => {
    console.log('Restaurant Details:', user.restaurantRole);
    console.log('Full User Object:', user);
    setShowDetails(user);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowEdit(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/auth/users/${editUser._id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast.success('User updated successfully!');
      setShowEdit(false);
      fetchUsers(currentPage);
    } catch (error) {
      console.error('Error updating user:', error);
      showToast.error('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast.success('User deleted successfully!');
        fetchUsers(currentPage);
      } catch (error) {
        console.error('Error deleting user:', error);
        showToast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-text">All Users</h1>
        

        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, username, email, or role..."
                  className="flex-1 p-2 border border-border rounded bg-white text-text focus:border-primary focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-primary text-text px-4 py-2 rounded hover:bg-hover transition-colors whitespace-nowrap text-sm"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-text">Username</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-text">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-text">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-text">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-text">Restaurant Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-text">Department</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-text">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-sm text-text">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id} className={index % 2 === 0 ? 'bg-background' : 'bg-white'}>
                      <td className="px-4 py-3 text-sm text-text font-medium">{user.username}</td>
                      <td className="px-4 py-3 text-sm text-text">{user.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-text">{user.email || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text">
                        {user.restaurantRole || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-text">
                        {Array.isArray(user.department) 
                          ? user.department.map(dept => typeof dept === 'object' ? dept.name : dept).join(', ')
                          : (typeof user.department === 'object' ? user.department.name : user.department) || 'N/A'
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(user.isActive !== false)}`}>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => viewUserDetails(user)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalUsers}
            />
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? 'No users found matching your search.' : 'No users found.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">👤 User Details</h3>
                  <p className="text-blue-100 text-sm">{showDetails.username}</p>
                </div>
                <button
                  onClick={() => setShowDetails(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Username</label>
                  <p className="text-gray-800 font-semibold">{showDetails.username}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-800">{showDetails.name || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{showDetails.email || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Role</label>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${getRoleColor(showDetails.role)}`}>
                    {showDetails.role}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Department</label>
                  <p className="text-gray-800">
                    {Array.isArray(showDetails.department) 
                      ? showDetails.department.map(dept => typeof dept === 'object' ? dept.name : dept).join(', ')
                      : (typeof showDetails.department === 'object' ? showDetails.department.name : showDetails.department) || 'Not assigned'
                    }
                  </p>
                </div>
                
                {showDetails.restaurantRole && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Restaurant Role</label>
                    <p className="text-gray-800">{showDetails.restaurantRole}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(showDetails.isActive !== false)}`}>
                    {showDetails.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Created At</label>
                  <p className="text-gray-800">
                    {showDetails.createdAt 
                      ? new Date(showDetails.createdAt).toLocaleDateString() 
                      : 'Not available'
                    }
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetails(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">✏️ Edit User</h3>
                  <p className="text-green-100 text-sm">{editUser.username}</p>
                </div>
                <button
                  onClick={() => setShowEdit(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  value={editUser.username || ''}
                  onChange={(e) => setEditUser({...editUser, username: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editUser.name || ''}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={editUser.email || ''}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <select
                  value={editUser.role || ''}
                  onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  value={editUser.password || ''}
                  onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave blank to keep current password"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if you don't want to change the password</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;