import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Filter, Users, BookOpen, Target, AlertTriangle } from 'lucide-react'
import { getDashboardAnalytics } from '../services/analyticsApi'

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042']
const RISK_COLORS = {'Low Risk': '#10B981', 'Medium Risk': '#F59E0B', 'High Risk': '#EF4444'}

function AnalyticsPage() {
  const [filters, setFilters] = useState({ department: 'All', semester: 'All' })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await getDashboardAnalytics(filters)
      if (res.success) {
        setData(res.data)
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError("Failed to fetch analytics data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [filters])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-sm text-gray-500">Explore and filter academic data across departments.</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <Filter className="h-4 w-4 text-gray-400 ml-2" />
          <select 
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="MECH">MECH</option>
            <option value="EEE">EEE</option>
          </select>
          <select 
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="All">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="3">Semester 3</option>
            <option value="5">Semester 5</option>
            <option value="7">Semester 7</option>
          </select>
        </div>
      </div>

      {loading && !data ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : data && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Filtered Students</p>
                <Users className="h-5 w-5 text-indigo-500" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{data.kpis.totalStudents}</h4>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Avg Attendance</p>
                <BookOpen className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{data.kpis.avgAttendance}%</h4>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Avg Prior CGPA</p>
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{data.kpis.avgCGPA}</h4>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Avg Backlogs</p>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{data.kpis.avgBacklogs}</h4>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Historical Grade Distribution</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <BarChart data={data.gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                    <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Historical Risk Categories</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.performanceCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.performanceCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AnalyticsPage
