import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { History, Eye, CheckCircle, Search, Filter } from 'lucide-react'
import { getPredictionHistory } from '../services/predictionApi'

function PredictionHistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecs, setSelectedRecs] = useState(null)

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
        setError('Failed to fetch prediction history.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const filteredHistory = history.filter(record => 
    (record.name && record.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (record.student_id && record.student_id.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString) => {
    const d = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(d)
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="academic-hero-banner rounded-2xl text-white p-6 md:p-7 shadow-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative z-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 block">Audit & Compliance</span>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center">
            <History className="h-6 w-6 mr-2.5 text-indigo-400" />
            Prediction Audit Logs
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Chronological timeline of all ML predictions, confidence metrics, and generated recommendations.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
        <div className="relative rounded-md max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Table View */}
        <div className="lg:w-2/3 bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-red-500 text-center">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted CGPA</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((record) => (
                      <tr 
                        key={record.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedRecs && selectedRecs.id === record.id ? 'bg-indigo-50' : ''}`}
                        onClick={() => setSelectedRecs(record)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.name}</div>
                          <div className="text-sm text-gray-500">{record.student_id} • {record.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-indigo-600">
                            {Number(record.predicted_cgpa).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.risk_level === 'Low' ? 'bg-green-100 text-green-800' :
                            record.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.risk_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedRecs(record)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                        No prediction history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side Panel for Recommendations */}
        <div className="lg:w-1/3">
          {selectedRecs ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Log Details</h3>
                <Link to={`/students/${selectedRecs.student_id}`} className="text-sm text-indigo-600 hover:underline">
                  View Profile
                </Link>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Student</p>
                <p className="font-medium text-gray-900">{selectedRecs.name} ({selectedRecs.student_id})</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500 mb-1">Generated CGPA</p>
                  <p className="text-lg font-bold text-indigo-600">{Number(selectedRecs.predicted_cgpa).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                  <p className={`text-sm font-bold ${
                    selectedRecs.risk_level === 'Low' ? 'text-green-600' :
                    selectedRecs.risk_level === 'Medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {selectedRecs.risk_level}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">AI Recommendations Provided</h4>
                {selectedRecs.recommendations && selectedRecs.recommendations.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedRecs.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 mr-2 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No recommendations were generated for this prediction.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 border-dashed p-10 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <Eye className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">Select a log entry</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">Click on any row in the table to inspect the recommendations that were generated.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default PredictionHistoryPage
