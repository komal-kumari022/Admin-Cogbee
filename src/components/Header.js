import React, { useState } from "react";
import { Search, Share2, ChevronDown, LogOut } from "lucide-react";

export default function Header({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 p-4 sticky top-0 z-10">

      {/* Client Dropdown */}
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-500 hidden sm:block">Client:</span>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-gray-800 font-semibold"
          >
            Cogbee
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {isOpen && (
            <div className="absolute top-full mt-2 w-48 bg-white shadow-xl border rounded-lg">
              {/* <a className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 text-sm">Switch Client</a> */}
              {/* <a className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 text-sm">Manage Clients</a> */}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Search className="w-5 h-5 text-gray-500" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Share2 className="w-5 h-5 text-gray-500" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-8 h-8 flex items-center justify-center bg-purple-500 text-white font-bold rounded-full hover:bg-purple-600 cursor-pointer transition-colors"
          >
            K
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl border rounded-lg z-20">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">User</p>
                <p className="text-xs text-gray-500 mt-1">user@company.com</p>
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  onLogout?.();
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

    </header>
  );
}
