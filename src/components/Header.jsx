import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Menu, LogOut } from "lucide-react";

const Header = () => {
  const { toggleSidebar } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-20">
      {/* Hamburger Menu for mobile */}
      <button onClick={toggleSidebar} className="text-primary">
        <Menu size={24} />
      </button>

      {/* Title or empty space for center alignment */}
      <div className="flex-1"></div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 rounded-lg bg-[#1f2937] text-[#c2ab65] hover:bg-[#374151] transition-colors duration-200"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Logout
      </button>
    </header>
  );
};

export default Header;
