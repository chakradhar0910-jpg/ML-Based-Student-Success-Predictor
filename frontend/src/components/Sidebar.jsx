import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Activity, 
  Upload,
  BarChart2,
  AlertTriangle,
  Settings,
  X,
  LogOut
} from 'lucide-react'
import { clearAuthData, getUser } from '../utils/auth.js'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', path: '/students', icon: Users, end: true },
  { name: 'Add Student', path: '/students/new', icon: UserPlus },
  { name: 'Prediction', path: '/prediction', icon: Activity },
  { name: 'Bulk Prediction', path: '/bulk-prediction', icon: Upload },
  { name: 'History', path: '/predictions', icon: BarChart2 },
  { name: 'Recommendations', path: '/recommendations', icon: AlertTriangle },
  { name: 'Settings', path: '/settings', icon: Settings },
]

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    clearAuthData()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-100 border-r border-slate-800 transform transition-transform duration-200 ease-in-out flex flex-col shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Activity size={20} />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block leading-none">SSP Portal</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Academic ML Suite</span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Core Modules
          </div>
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        onClose()
                      }
                    }}
                    className={({ isActive }) => 
                      `flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Model status footer widget */}
        <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-300 truncate">Random Forest (R²: 0.7404)</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow">
                {user ? user.name.charAt(0) : 'A'}
              </div>
              <div className="ml-3 truncate">
                <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user ? user.name : 'Admin User'}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user ? user.email : 'admin@ssp.edu'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
