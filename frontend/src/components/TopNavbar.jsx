import React from 'react'
import { Menu, Search, Bell, User } from 'lucide-react'

function TopNavbar({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        
        <div className="w-full max-w-md hidden sm:flex">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students, departments..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="ml-4 flex items-center space-x-4">
        <button className="text-gray-400 hover:text-gray-500 relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 overflow-hidden">
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
