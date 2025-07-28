import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, User } from "lucide-react";
import axios from "axios";
import StaffForm from "../staff/StaffForm";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    _id: null,
    email: "",
    username: "",
    password: "",
    role: "staff",
    department: [],
  });

  // Add this after your useState declarations
  useEffect(() => {
    // Use dummy data if API fails
    const dummyStaff = [
      {
        _id: "1",
        username: "admin123",
        email: "admin@example.com",
        role: "admin",
        department: [],
      },
      {
        _id: "2",
        username: "kitchen1",
        email: "kitchen@example.com",
        role: "staff",
        department: [{ id: 1, name: "kitchen" }],
      },
      {
        _id: "3",
        username: "maintenance1",
        email: "maintenance@example.com",
        role: "staff",
        department: [
          { id: 4, name: "maintenance" },
          { id: 5, name: "other" },
        ],
      },
      {
        _id: "4",
        username: "reception1",
        email: "reception@example.com",
        role: "staff",
        department: [{ id: 3, name: "reception" }],
      },
    ];

    // Try to fetch from API first
    fetchStaff().catch(() => {
      // If API fails, use dummy data
      setStaff(dummyStaff);
      setLoading(false);
    });
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/housekeeping/available-staff",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response has the expected structure
      if (response.data && response.data.availableStaff) {
        setStaff(response.data.availableStaff);
      } else {
        setStaff(response.data || []);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = () => {
    setEditMode(false);
    setCurrentStaff({
      _id: null,
      email: "",
      username: "",
      password: "",
      role: "", // Set to empty string instead of "staff"
      department: [],
    });
    setShowModal(true);
  };

  const handleEditStaff = (staffMember) => {
    setEditMode(true);
    setCurrentStaff({
      _id: staffMember._id,
      email: staffMember.email,
      username: staffMember.username,
      password: "",
      role: staffMember.role,
      department: staffMember.department,
    });
    setShowModal(true);
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        setStaff(staff.filter((staffMember) => staffMember._id !== id));
      } catch (err) {
        console.error("Error deleting staff:", err);
        alert("Failed to delete staff member");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const staffData = { ...currentStaff };
      const config = {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      };

      if (editMode) {
        // If password is empty, remove it from the request
        if (!staffData.password) {
          delete staffData.password;
        }

        const response = await axios.put(
          `http://localhost:5000/api/auth/update/${currentStaff._id}`,
          staffData,
          config
        );
        setStaff(
          staff.map((s) => (s._id === currentStaff._id ? response.data : s))
        );
      } else {
        // Make sure department is properly formatted for staff role
        if (staffData.role === "staff" && staffData.department.length === 0) {
          alert("Please select a department for staff member");
          return;
        }

        // For admin role, ensure department is an empty array
        if (staffData.role === "admin") {
          staffData.department = [];
        }

        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          staffData,
          config
        );

        // Add the new staff member to the list
        if (response.data) {
          setStaff([...staff, response.data]);
        }
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error saving staff:", err);
      alert(err.response?.data?.message || "Failed to save staff member");
    }
  };

  const getDepartmentName = (departments) => {
    if (!departments || departments.length === 0) return "None";
    return departments
      .map((dept) => dept.name.charAt(0).toUpperCase() + dept.name.slice(1))
      .join(", ");
  };

  return (
    <div className="p-6 overflow-auto h-full bg-background">
      <div className="flex justify-between items-center mb-8 mt-6 ">
        <h1 className="text-3xl font-extrabold text-[#1f2937]">Staff</h1>
        <button
          onClick={handleAddStaff}
          className="bg-secondary text-dark px-4 py-2 cursor-pointer rounded-lg hover:shadow-lg transition-shadow font-medium"
        >
          <Plus size={18} className="w-4 h-4 inline mr-2" /> Add Staff
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading staff...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((staffMember) => (
                <tr key={staffMember._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                        {staffMember.username
                          ? staffMember.username.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                      <div className="font-medium">
                        {staffMember.username || "Unknown"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staffMember.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staffMember.password ? "••••••••" : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {staffMember.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staffMember.role === "admin"
                      ? "N/A"
                      : staffMember.department &&
                        staffMember.department.length > 0
                      ? staffMember.department
                          .map(
                            (dept) =>
                              dept.name.charAt(0).toUpperCase() +
                              dept.name.slice(1)
                          )
                          .join(", ")
                      : "None"}
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <StaffForm
        showModal={showModal}
        setShowModal={setShowModal}
        currentStaff={currentStaff}
        setCurrentStaff={setCurrentStaff}
        handleSubmit={handleSubmit}
        editMode={editMode}
      />
    </div>
  );
};

export default StaffList;
