import React, { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  BarChart2,
  FileText,
  HelpCircle,
  Settings,
  UserCheck,
  ChartBarStacked,
  BedDouble,
  LogOut,
  UserRound,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Package,
  X,
  Bell,
} from "lucide-react";
import logoImage from "../assets/buddhaavenuelogo.png";

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLaundaryDropdownOpen, setIsLaundaryDropdownOpen] = useState(false);

  const [userRole, setUserRole] = useState("");
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role ? role.toUpperCase() : "");
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role ? role.toUpperCase() : "");

    if (role === "staff") {
      fetchTaskCount();
      const interval = setInterval(fetchTaskCount, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchTaskCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) return;

      const response = await axios.get(
        "http://localhost:5000/api/housekeeping/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && Array.isArray(response.data.tasks)) {
        const userPendingTasks = response.data.tasks.filter(
          (task) =>
            task.assignedTo &&
            task.assignedTo._id === userId &&
            task.status === "pending"
        );
        setTaskCount(userPendingTasks.length);
      }
    } catch (err) {
      console.error("Error fetching task count:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleLaundaryDropdown = () => {
    setIsLaundaryDropdownOpen(!isLaundaryDropdownOpen);
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: UserCheck, label: "Task Assigned", path: "/tasks" },
    { icon: ChartBarStacked, label: "Category", path: "/category" },
    { icon: BedDouble, label: "Room", path: "/room" },
    { icon: FileText, label: "Booking", path: "/booking" },
    { icon: FileText, label: "Reservation", path: "/reservation" },
    { icon: UserRound, label: "Staff", path: "/staff" },

    {
      icon: UserRound,
      label: "Laundary",
      path: "/laundry",
      isDropdown: true,
      children: [
        {
          label: "Order Management",
          path: "/laundry/ordermanagement",
          icon: ListChecks,
        },
        {
          label: "Inventory Management",
          path: "/laundry/inventorymanagement",
          icon: Package,
        },
      ],
    },
    { icon: UserRound, label: "Cab", path: "/cab" },
    { icon: UserRound, label: "Pantry", path: "/pantry" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },

    { icon: Bell, label: "My Task", path: "/staff-work", count: taskCount },

    { icon: Users, label: "Customers", path: "/customers" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
  ];

  const bottomNavItems = [
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
    { icon: Settings, label: "Setting", path: "/settings" },
  ];

  return (
    <aside
      className={`fixed top-0 inset-y-0 left-0 bg-[#1f2937] text-[#c2ab65] w-64 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out  md:translate-x-0 md:flex md:flex-col z-30`}
    >
      <div className="flex flex-col items-center p-2 relative">
        <img src={logoImage} alt="Buddha Avenue" className="h-30 mx-auto" />
        <div className="text-center mt-2 font-bold text-lg">{userRole}</div>

        <button
          onClick={closeSidebar}
          className="md:hidden absolute top-4 right-4 text-[#c2ab65] hover:text-white"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>

      <nav
        className="flex-1 p-4 space-y-2 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors duration-200 ${
              location.pathname === item.path
                ? "bg-[#c2ab65] text-[#1f2937] font-semibold"
                : "hover:bg-secondary hover:text-[#1f2937]"
            }`}
            onClick={() => window.innerWidth < 768 && closeSidebar()}
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </div>
            {item.count > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.count > 99 ? "99+" : item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-secondary">
        {bottomNavItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-4 py-2.5 rounded-lg hover:bg-hover transition-colors duration-200"
            onClick={() => window.innerWidth < 768 && closeSidebar()}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="md:flex items-center px-4 py-2.5 rounded-lg hover:bg-hover transition-colors duration-200 w-full text-left hidden"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
