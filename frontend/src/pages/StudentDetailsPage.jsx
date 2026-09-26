import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, BookOpen, AlertCircle, CheckCircle, Brain, Target, Calendar, Activity } from 'lucide-react'
import { getStudentById } from '../services/studentApi'
import { predictPerformance } from '../services/predictionApi'

function StudentDetailsPage() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [prediction, setPrediction] = useState(null)
  
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudentAndPredict = async () => {
      try {
        setLoading(true)
        
        // 1. Fetch Student from DB
        const studentRes = await getStudentById(id)
        if (!studentRes.success) {
          setError(studentRes.message || 'Failed to load student details')
          setLoading(false)
          return
        }
        
        const studentData = studentRes.data
        setStudent(studentData)
        
        // 2. Automatically Predict Performance using ML Service
        setPredicting(true)
        
        // Prepare data matching the ML expected schema
        const features = {
          student_id: studentData.student_id,
          name: studentData.name,
          department: studentData.department,
          semester: studentData.semester,
          attendance: studentData.attendance,
          previous_cgpa: studentData.previous_cgpa,
          internal_marks_avg: studentData.internal_marks_avg,
          assignments_completed: studentData.assignments_completed,
          backlogs: studentData.backlogs,
          extracurricular_activities: studentData.extracurricular_activities,
          study_hours_per_week: studentData.study_hours_per_week
        }
        
        const predictRes = await predictPerformance(features)
        
        if (predictRes.success) {
          setPrediction(predictRes.data)
        } else {
          console.error("Prediction failed:", predictRes.message)
        }
        
      } catch (err) {
        setError('An unexpected error occurred while fetching details.')
      } finally {
        setLoading(false)
        setPredicting(false)
      }
    }

    if (id) {
      fetchStudentAndPredict()
    }
  }, [id])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 mt-10 text-center">
        <AlertCircle className="h-10 w-10 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-bold mb-2">Error Loading Student</h2>
        <p>{error || "Student not found"}</p>
        <Link to="/students" className="mt-4 inline-block text-red-700 font-medium hover:underline">
          &larr; Back to Students List
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/students" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-sm text-gray-500">Detailed view and ML predictions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end">
                <div className="flex items-center -mt-12">
                  <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-4xl font-bold text-indigo-600">
                    {student.name.charAt(0)}
                  </div>
                  <div className="ml-4 mt-12">
                    <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                    <p className="text-sm font-medium text-gray-500">{student.student_id}</p>
                  </div>
                </div>
                <div className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-sm font-medium border border-indigo-100">
                  {student.department} • Sem {student.semester}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Metrics Grid */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
              Academic History
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Attendance</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                      <div className={`h-2.5 rounded-full ${student.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${student.attendance}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{student.attendance}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Previous CGPA</span>
                  <span className="text-sm font-bold text-gray-900">{student.previous_cgpa}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Internal Marks Avg</span>
                  <span className="text-sm font-bold text-gray-900">{student.internal_marks_avg}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Active Backlogs</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${student.backlogs > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {student.backlogs}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Assignments Completed</span>
                  <span className="text-sm font-bold text-gray-900">{student.assignments_completed}%</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Study Hours/Week</span>
                  <span className="text-sm font-bold text-gray-900">{student.study_hours_per_week} hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Predictions & Recommendations */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-gradient-to-b from-slate-900 to-indigo-900 rounded-lg shadow-lg overflow-hidden border border-slate-800 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-indigo-400" />
                  AI Prediction
                </h3>
                {predicting && <span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span></span>}
              </div>

              {predicting ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                  <p className="text-indigo-200 text-sm">Analyzing academic data...</p>
                </div>
              ) : prediction ? (
                <div className="space-y-6">
                  
                  <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <p className="text-indigo-200 text-sm font-medium mb-1">Predicted Semester CGPA</p>
                    <div className="text-5xl font-bold text-white tracking-tight">
                      {prediction.predicted_cgpa.toFixed(2)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <p className="text-xs text-indigo-300 mb-1">Expected Grade</p>
                      <p className="text-lg font-semibold text-white">{prediction.grade}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <p className="text-xs text-indigo-300 mb-1">Risk Level</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold
                        ${prediction.risk_level === 'Low' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                          prediction.risk_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 
                          'bg-red-500/20 text-red-300 border border-red-500/30'}`}
                      >
                        {prediction.risk_level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Actionable Recommendations
                    </h4>
                    <ul className="space-y-3">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-200">
                          <CheckCircle className="h-4 w-4 mr-2 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="py-8 text-center text-red-300">
                  Prediction model unavailable.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StudentDetailsPage
