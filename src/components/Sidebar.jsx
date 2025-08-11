

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
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
  Bell,
} from "lucide-react";
import logoImage from "../assets/buddhaavenuelogo.png";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const { isSidebarOpen, closeSidebar, axios } = useAppContext();
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

      const { data } = await axios.get("/api/housekeeping/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && Array.isArray(data.tasks)) {
        const userPendingTasks = data.tasks.filter(
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

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: UserCheck, label: "Task Assigned", path: "/tasks" },
    { icon: ChartBarStacked, label: "Category", path: "/category" },
    { icon: BedDouble, label: "Room", path: "/room" },
    { icon: FileText, label: "Booking", path: "/booking" },
    { icon: FileText, label: "Reservation", path: "/reservation" },
    { icon: Bell, label: "My Task", path: "/staff-work", count: taskCount },
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
    {
      icon: UserRound,
      label: "Pantry",
      path: "/pantry",
      isDropdown: true,
      children: [
        { label: "Item", path: "/pantry/item", icon: ListChecks },
        { label: "Orders", path: "/pantry/orders", icon: Package },
      ],
    },
    {
      icon: UserRound,
      label: "Cab",
      path: "/cab",
      isDropdown: true,
      children: [
        { label: "Driver Management", path: "/cab/driver", icon: ListChecks },
        { label: "Vehicle Management", path: "/cab/vehicle", icon: Package },
      ],
    },
    {
      icon: UserRound,
      label: "Restaurant",
      path: "/resturant",
      isDropdown: true,
      children: [
        { label: "Restaurant", path: "/resturant", icon: UserRound },
        { label: "Orders", path: "/orders", icon: ShoppingCart },
      ],
    },
    { icon: Users, label: "Customers", path: "/customers" },
  ];

  const bottomNavItems = [
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
    { icon: Settings, label: "Setting", path: "/settings" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-[#1f2937] text-[#c2ab65] w-64 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-30 flex flex-col h-screen overflow-y-auto`}
    >
      <div className="flex items-center justify-center p-2">
        <button
          onClick={closeSidebar}
          className="md:hidden p-2 text-[#c2ab65] hover:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img src={logoImage} alt="Buddha Avenue" className="h-30 mx-auto" />
      </div>
      <div className="text-center mt-2 font-bold text-lg">{userRole}</div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <div key={index}>
            {item.isDropdown ? (
              <>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none
                    ${
                      location.pathname.startsWith(item.path) ||
                      item.children.some(
                        (child) => location.pathname === child.path
                      )
                        ? "bg-[#c2ab65] text-[#1f2937] font-semibold"
                        : "hover:bg-secondary hover:text-[#1f2937]"
                    }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </div>
                  {openDropdown === item.label ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openDropdown === item.label && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        onClick={() =>
                          window.innerWidth < 768 && closeSidebar()
                        }
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 text-sm
                          ${
                            location.pathname === subItem.path
                              ? "bg-[#c2ab65] text-[#1f2937] font-semibold"
                              : "hover:bg-secondary hover:text-[#1f2937]"
                          }`}
                      >
                        {subItem.icon && (
                          <subItem.icon className="w-4 h-4 mr-2" />
                        )}
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                onClick={() => window.innerWidth < 768 && closeSidebar()}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-[#c2ab65] text-[#1f2937] font-semibold"
                    : "hover:bg-secondary hover:text-[#1f2937]"
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
                {item.count !== undefined && (
                  <span className={`text-xs rounded-full px-2 py-1 min-w-[20px] text-center ${
                    item.count > 0 ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-secondary">
        {bottomNavItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={() => window.innerWidth < 768 && closeSidebar()}
            className="flex items-center px-4 py-2.5 rounded-lg hover:bg-hover transition-colors duration-200"
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2.5 rounded-lg hover:bg-hover transition-colors duration-200 w-full text-left"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
