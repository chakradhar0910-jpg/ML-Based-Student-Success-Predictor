import React from 'react'
import { Menu, Search, Bell, User } from 'lucide-react'

function TopNavbar({ onMenuClick }) {
  return (
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 transition-colors">
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden mr-4 text-slate-500 hover:text-slate-800 focus:outline-none p-1.5 rounded-lg hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
        
        <div className="w-full max-w-md hidden sm:flex">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search students, roll numbers, departments..."
              className="block w-full pl-10 pr-12 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50/70 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-xs sm:text-sm transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded border border-slate-300/50">⌘K</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="ml-4 flex items-center space-x-3 sm:space-x-4">
        {/* Academic term indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span>Semester Evaluation Cycle 2026-27</span>
        </div>

        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl relative transition-colors" title="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
        </button>
        
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-slate-100 overflow-hidden">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
