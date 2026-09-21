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
  { name: 'Students', path: '/students', icon: Users },
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
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-indigo-600">SSP Portal</span>
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        onClose()
                      }
                    }}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                {user ? user.name.charAt(0) : 'A'}
              </div>
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{user ? user.name : 'Admin User'}</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{user ? user.email : 'admin@ssp.edu'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
