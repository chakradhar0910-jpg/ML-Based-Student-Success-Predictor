import React from 'react'
import { User, Mail, Briefcase, MapPin, Building, Key, Shield } from 'lucide-react'

function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administrator Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your personal information and security settings.</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        
        {/* Profile Header */}
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white bg-white flex items-center justify-center text-4xl font-bold text-indigo-600 shadow-md">
                A
              </div>
            </div>
            <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">Administrator</h1>
                <p className="text-sm font-medium text-gray-500">System Admin</p>
              </div>
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button type="button" className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Mail className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>
          <div className="hidden sm:block md:hidden mt-6 min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 truncate">Administrator</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-500">
                <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                Dean of Academics
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Building className="h-5 w-5 mr-3 text-gray-400" />
                University Administration
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                Campus Main Building, Room 101
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-5 w-5 mr-3 text-gray-400" />
                admin@university.edu
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Security Settings */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-indigo-500" />
              Security Settings
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 flex items-center">
                    <Key className="h-4 w-4 mr-2 text-gray-400" />
                    Change Password
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
                </div>
                <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Update
                </button>
              </div>
              
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                </div>
                <button className="px-3 py-1.5 border border-transparent rounded text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log stub */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Account Activity</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                <li className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">Logged in from <span className="font-medium text-gray-900">Chrome on Windows</span></p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        Today
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage
