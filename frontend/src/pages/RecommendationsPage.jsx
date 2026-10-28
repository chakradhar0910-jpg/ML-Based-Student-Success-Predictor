import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Target, AlertTriangle, CheckCircle, ArrowRight, User } from 'lucide-react'
import { getPredictionHistory } from '../services/predictionApi'

function RecommendationsPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getPredictionHistory()
        if (res.success) {
          setHistory(res.data)
        } else {
          setError(res.message)
        }
      } catch (err) {
        setError('Failed to fetch data.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  // Filter for High and Medium risk, and keep only the latest prediction per student
  const getAtRiskStudents = () => {
    const atRisk = history.filter(h => h.risk_level === 'High Risk' || h.risk_level === 'High' || h.risk_level === 'Medium Risk' || h.risk_level === 'Medium')
    
    // Deduplicate: Keep only the most recent prediction for each student ID
    const uniqueStudents = {}
    atRisk.forEach(record => {
      if (!uniqueStudents[record.student_id]) {
        uniqueStudents[record.student_id] = record
      }
    })
    
    return Object.values(uniqueStudents)
  }

  const atRiskStudents = getAtRiskStudents()

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="academic-hero-banner rounded-2xl text-white p-6 md:p-7 shadow-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative z-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 block">Targeted Academic Remediation</span>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center">
            <Target className="h-6 w-6 mr-2.5 text-amber-400" />
            Intervention Action Plans
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Automated pedagogical interventions and advisory workflows for students flagged as high or moderate risk.</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="p-6 text-red-500 bg-red-50 rounded-lg">{error}</div>
      ) : (
        <div className="space-y-6">
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Found <strong>{atRiskStudents.length}</strong> students currently classified as High or Medium risk based on recent ML predictions. Immediate intervention is recommended.
                </p>
              </div>
            </div>
          </div>

          {atRiskStudents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">All clear!</h3>
              <p className="text-gray-500">No students are currently flagged as at-risk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {atRiskStudents.map(student => (
                <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                  
                  <div className={`px-4 py-3 border-b border-gray-100 flex justify-between items-center ${student.risk_level.includes('High') ? 'bg-red-50' : 'bg-yellow-50'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-700 font-bold shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">{student.name}</h3>
                        <p className="text-xs text-gray-500">{student.student_id}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${student.risk_level.includes('High') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {student.risk_level}
                    </span>
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Predicted CGPA</p>
                        <p className="text-xl font-bold text-gray-900">{Number(student.predicted_cgpa).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Dept</p>
                        <p className="text-sm font-medium text-gray-900">{student.department}</p>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">AI Action Plan</h4>
                    {student.recommendations && student.recommendations.length > 0 ? (
                      <ul className="space-y-2">
                        {student.recommendations.slice(0, 3).map((rec, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <span className="h-4 w-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold mr-2 mt-0.5 flex-shrink-0">{idx + 1}</span>
                            <span className="line-clamp-2">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No specific recommendations available.</p>
                    )}
                  </div>

                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <Link to={`/students/${student.student_id}`} className="text-sm text-indigo-600 font-medium hover:text-indigo-900 flex items-center justify-center w-full">
                      View Full Profile
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RecommendationsPage
