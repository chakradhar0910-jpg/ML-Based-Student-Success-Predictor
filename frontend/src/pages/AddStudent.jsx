import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Activity } from 'lucide-react'

function AddStudent() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    gender: 'Male',
    age: '',
    department: 'CSE',
    semester: '1',
    attendance: '',
    previous_cgpa: '',
    mid1: '',
    mid2: '',
    internal_marks: '',
    backlogs: '0'
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.student_id) newErrors.student_id = 'Student ID is required'
    if (!formData.name) newErrors.name = 'Name is required'
    if (formData.attendance === '' || formData.attendance < 0 || formData.attendance > 100) {
      newErrors.attendance = 'Attendance must be between 0 and 100'
    }
    if (formData.previous_cgpa !== '' && (formData.previous_cgpa < 0 || formData.previous_cgpa > 10)) {
      newErrors.previous_cgpa = 'CGPA must be between 0 and 10'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      console.log('Form data to submit:', formData)
      // Mock API call would go here
      navigate('/students')
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="academic-hero-banner rounded-2xl text-white p-6 md:p-7 shadow-xl border border-slate-700/60 flex items-center justify-between">
        <div className="relative z-10 flex items-center">
          <Link to="/students" className="mr-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-0.5 block">Student Registry</span>
            <h1 className="text-2xl font-black text-white tracking-tight">Enroll New Student</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Register academic profile and historical performance parameters</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.student_id ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="e.g. STU1024"
              />
              {errors.student_id && <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Academic Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="IT">Information Tech (IT)</option>
                <option value="MECH">Mechanical (MECH)</option>
                <option value="CIVIL">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Percentage *</label>
              <input
                type="number"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.attendance ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="0-100"
              />
              {errors.attendance && <p className="mt-1 text-sm text-red-600">{errors.attendance}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Semester CGPA</label>
              <input
                type="number"
                step="0.01"
                name="previous_cgpa"
                value={formData.previous_cgpa}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.previous_cgpa ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="0.00 - 10.00"
              />
              {errors.previous_cgpa && <p className="mt-1 text-sm text-red-600">{errors.previous_cgpa}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Backlogs</label>
              <input
                type="number"
                name="backlogs"
                value={formData.backlogs}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
              />
            </div>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Current Assessment (Internal Marks)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mid-1 Marks</label>
              <input
                type="number"
                name="mid1"
                value={formData.mid1}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mid-2 Marks</label>
              <input
                type="number"
                name="mid2"
                value={formData.mid2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Internal Marks</label>
              <input
                type="number"
                name="internal_marks"
                value={formData.internal_marks}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="-ml-1 mr-2 h-5 w-5" />
              Save Student
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Activity className="-ml-1 mr-2 h-5 w-5" />
              Save & Predict
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStudent
