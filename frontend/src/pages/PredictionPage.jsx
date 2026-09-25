import React, { useState } from 'react'
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { predictPerformance } from '../services/predictionApi'

function PredictionPage() {
  const [formData, setFormData] = useState({
    attendance: '',
    previous_cgpa: '',
    mid1: '',
    mid2: '',
    internal_marks: '',
    backlogs: '0'
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      // Parse numbers
      const payload = {
        attendance: parseFloat(formData.attendance),
        previous_cgpa: parseFloat(formData.previous_cgpa),
        mid1: parseFloat(formData.mid1),
        mid2: parseFloat(formData.mid2),
        internal_marks: parseFloat(formData.internal_marks),
        backlogs: parseInt(formData.backlogs, 10)
      }
      
      const response = await predictPerformance(payload)
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the prediction server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Academic Prediction</h1>
        <p className="text-sm text-gray-500">Run the ML model to predict a student's semester CGPA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Academic Input Features</h2>
            
            {error && (
              <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Percentage *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Semester CGPA *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  name="previous_cgpa"
                  value={formData.previous_cgpa}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00 - 10.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mid-1 Marks *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  name="mid1"
                  value={formData.mid1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mid-2 Marks *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  name="mid2"
                  value={formData.mid2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Internal Marks *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  name="internal_marks"
                  value={formData.internal_marks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Backlogs</label>
                <input
                  type="number"
                  required
                  name="backlogs"
                  value={formData.backlogs}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running ML Model...
                  </>
                ) : (
                  <>
                    <Activity className="-ml-1 mr-2 h-5 w-5" />
                    Predict Semester CGPA
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-1">
          {result ? (
            <div className="bg-white shadow-lg rounded-xl border border-indigo-100 overflow-hidden relative animate-fade-in">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Prediction Results
                </h3>
                
                <div className="flex flex-col items-center justify-center py-6 bg-indigo-50 rounded-lg mb-6 border border-indigo-100">
                  <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-1">Predicted CGPA</span>
                  <span className="text-5xl font-black text-indigo-900">{result.predicted_cgpa.toFixed(2)}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Academic Grade</span>
                    <span className="text-sm font-bold text-gray-900 px-3 py-1 bg-gray-100 rounded-md">{result.grade}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Performance</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      result.performance_category === 'Excellent' ? 'bg-green-100 text-green-800' :
                      result.performance_category === 'Good' ? 'bg-blue-100 text-blue-800' :
                      result.performance_category === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.performance_category}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Risk Level</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      result.risk_level === 'Low' ? 'bg-green-100 text-green-800' :
                      result.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.risk_level} Risk
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider flex items-center">
                    <Info className="h-4 w-4 mr-2 text-indigo-500" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 h-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No Prediction Yet</h3>
              <p className="text-sm text-gray-500 max-w-[200px]">Fill out the academic inputs on the left and click predict to see results.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default PredictionPage
