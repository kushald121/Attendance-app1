
import React, { useState } from 'react'
import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 md:px-8 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block md:hidden text-gray-700"
        >
          <Menu size={28} />
        </button>
        
        {/* Upasthit Logo */}
        <img src="/Upashit_logo.png" alt="Upasthit Logo" className="h-12 w-auto object-contain"/>
      </div>
      <div className="hidden md:flex flex-1 justify-center">
        <input
          type="text"
          placeholder="Enter clubs or resources..."
          className="w-full max-w-lg rounded-2xl px-4 py-2 border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2 relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition border border-transparent"
        >
          <img
            src="/Profile.png"
            alt="profile"
            className="h-8 w-8 rounded-full text-3xl"
          />
          <div className="hidden sm:block">
            <p className="text-gray-700 font-medium text-lg">{user?.name || 'Profile'}</p>
            <p className="text-gray-500 text-sm capitalize">{user?.role || ''}</p>
          </div>
        </button>
        
        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 text-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
