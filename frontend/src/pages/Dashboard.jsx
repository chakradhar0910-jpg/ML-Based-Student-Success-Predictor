import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, GraduationCap, AlertTriangle, TrendingUp } from 'lucide-react'
import { getDashboardAnalytics } from '../services/analyticsApi'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
const RISK_COLORS = {'Low Risk': '#10B981', 'Medium Risk': '#F59E0B', 'High Risk': '#EF4444'}

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardAnalytics()
        if (res.success) {
          setData(res.data)
        } else {
          setError(res.message)
        }
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-6">Error: {error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      
      {/* Executive Hero Banner */}
      <div className="academic-hero-banner rounded-2xl text-white p-6 md:p-8 shadow-xl border border-slate-700/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap size={14} className="text-indigo-400" /> Academic Performance Intelligence
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Institutional Analytics Dashboard</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Real-time monitoring across registered academic cohorts, continuous assessment tracking, and ML risk evaluation.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-inner">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">ML Pipeline Status</span>
              <span className="text-xs font-bold text-white">Random Forest (Active)</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
          <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600 mr-4 group-hover:scale-105 transition-transform">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Enrolled</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">{data.kpis.totalStudents}</h4>
            <span className="text-[11px] text-slate-400">Active records in registry</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 mr-4 group-hover:scale-105 transition-transform">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Attendance</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">{data.kpis.avgAttendance}%</h4>
            <span className="text-[11px] text-emerald-600 font-medium">Target: ≥ 75.0%</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
          <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600 mr-4 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cohort Avg CGPA</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">{data.kpis.avgCGPA}</h4>
            <span className="text-[11px] text-blue-600 font-medium">Out of 10.0 scale</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600 mr-4 group-hover:scale-105 transition-transform">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Backlogs</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">{data.kpis.avgBacklogs}</h4>
            <span className="text-[11px] text-slate-400">Uncleared courses</span>
          </div>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Historical Grade Distribution</h3>
              <p className="text-xs text-slate-500">Student cohort count grouped by performance brackets</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-semibold">
              Scale: O, A, B, F
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={data.gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}/>
                <Bar dataKey="students" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Risk Level Overview</h3>
              <p className="text-xs text-slate-500">Proportion of students by academic risk priority</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-semibold">
              Live Evaluation
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.performanceCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.performanceCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}/>
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
