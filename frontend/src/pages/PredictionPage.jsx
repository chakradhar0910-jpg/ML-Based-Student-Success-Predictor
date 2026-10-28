import React, { useState } from 'react'
import { Activity, AlertTriangle, CheckCircle, Info, Printer, Download, Sparkles, User, FileText } from 'lucide-react'
import { predictPerformance } from '../services/predictionApi'

function PredictionPage() {
  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    department: 'CSE',
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
      const payload = {
        student_id: formData.student_id.trim() || undefined,
        department: formData.department,
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

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      {/* ── Screen UI ── */}
      <div className="max-w-7xl mx-auto animate-fade-in space-y-6 print:hidden">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 block">Supervised Regression</span>
            <h1 className="text-2xl font-black text-white tracking-tight">Academic Prediction Engine</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Forecast individual semester CGPA and generate tailored intervention recommendations.</p>
          </div>
          {result && (
            <button
              onClick={handlePrint}
              className="relative z-10 inline-flex items-center px-4 py-2 border border-indigo-400/30 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex-shrink-0"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print / Save PDF Report
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2 flex items-center justify-between">
                <span>Academic Input Parameters</span>
                <span className="text-xs font-normal text-gray-500">* Required for ML Pipeline</span>
              </h2>
              
              {error && (
                <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Optional Student Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Student ID (Optional)</label>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    placeholder="e.g. STU101"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Student Name (Optional)</label>
                  <input
                    type="text"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    placeholder="e.g. Aarav Patel"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
              </div>

              {/* Core ML Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Percentage *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0 - 100 %"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Semester CGPA *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    name="previous_cgpa"
                    value={formData.previous_cgpa}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00 - 10.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mid-1 Marks (Out of 50) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    required
                    name="mid1"
                    value={formData.mid1}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0 - 50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mid-2 Marks (Out of 50) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    required
                    name="mid2"
                    value={formData.mid2}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0 - 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal / Lab Marks (Out of 20) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    required
                    name="internal_marks"
                    value={formData.internal_marks}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0 - 20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Active Backlogs</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="20"
                    name="backlogs"
                    value={formData.backlogs}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  id="predict-submit-btn"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Executing Trained ML Pipeline…
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Activity className="-ml-1 mr-2 h-5 w-5" />
                      Predict Semester CGPA
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {result ? (
              <div className="bg-white shadow-lg rounded-xl border border-indigo-100 overflow-hidden relative animate-fade-in flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Prediction Results
                    </h3>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                      ML Regression
                    </span>
                  </div>
                  
                  {/* CGPA Display */}
                  <div className="flex flex-col items-center justify-center py-5 bg-gradient-to-b from-indigo-50 to-white rounded-xl mb-5 border border-indigo-100 shadow-inner">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Predicted Semester CGPA</span>
                    <span className="text-5xl font-black text-indigo-900 tracking-tight">{result.predicted_cgpa.toFixed(2)}</span>
                    
                    {/* Confidence Interval Feature */}
                    {result.confidence_interval && (
                      <div className="mt-3 px-3 py-1 bg-white border border-indigo-200 rounded-full shadow-sm text-center">
                        <span className="text-xs font-bold text-indigo-700 flex items-center gap-1 justify-center">
                          <Sparkles className="h-3 w-3 text-indigo-500" />
                          95% Confidence: {result.confidence_interval.range_text}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          Expected range: [{result.confidence_interval.lower.toFixed(2)} — {result.confidence_interval.upper.toFixed(2)}]
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Academic Grade</span>
                      <span className="text-sm font-bold text-gray-900 px-3 py-0.5 bg-gray-100 rounded-md">{result.grade}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Performance Category</span>
                      <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                        result.performance_category === 'Excellent' ? 'bg-green-100 text-green-800' :
                        result.performance_category === 'Good' ? 'bg-blue-100 text-blue-800' :
                        result.performance_category === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.performance_category}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Risk Assessment</span>
                      <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                        result.risk_level === 'Low' ? 'bg-green-100 text-green-800' :
                        result.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.risk_level} Risk
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider flex items-center">
                      <Info className="h-4 w-4 mr-1.5 text-indigo-500" />
                      Academic Recommendations
                    </h4>
                    <ul className="space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="text-indigo-500 mr-2 font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Print Report Button */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-indigo-200 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                      <Printer className="h-4 w-4" />
                      Download Assessment Report (PDF)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 h-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Awaiting Academic Inputs</h3>
                <p className="text-sm text-gray-500 max-w-[220px]">
                  Provide attendance, assessment marks, and CGPA on the left to generate the predictive report.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Official Printable Assessment Report (Active only in Print Mode) ── */}
      {result && (
        <div className="hidden print:block p-8 font-sans max-w-4xl mx-auto text-gray-900 bg-white">
          {/* Header */}
          <div className="border-b-2 border-indigo-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-indigo-950 uppercase tracking-wide">Academic Assessment & Success Prediction Report</h1>
              <p className="text-sm text-gray-600">Student Success Predictor Platform · Machine Learning Department Analysis</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p className="font-semibold text-indigo-900">Status: Verified Prediction</p>
            </div>
          </div>

          {/* Student & Assessment Information */}
          <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded border border-gray-300 text-sm">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Student Information</p>
              <p className="font-bold text-base text-gray-900">{formData.student_name || 'Individual Student Candidate'}</p>
              <p className="text-gray-600">Student ID: <span className="font-medium text-gray-900">{formData.student_id || 'STU-PROVISIONAL'}</span></p>
              <p className="text-gray-600">Department: <span className="font-medium text-gray-900">{formData.department}</span></p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Evaluation Pipeline</p>
              <p className="text-gray-600">Model: <span className="font-semibold text-gray-900">Random Forest Regressor (Ensemble)</span></p>
              <p className="text-gray-600">Confidence Metric: <span className="font-semibold text-indigo-800">95% Standard Empirical Interval</span></p>
              <p className="text-gray-600">Model $R^2$ Baseline: <span className="font-semibold text-gray-900">0.7404</span></p>
            </div>
          </div>

          {/* Academic Input Parameters Table */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Input Performance Parameters</h3>
            <table className="w-full text-left text-sm border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2">Parameter</th>
                  <th className="border border-gray-300 p-2 text-right">Value Recorded</th>
                  <th className="border border-gray-300 p-2">Standard Benchmark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Classroom Attendance</td>
                  <td className="border border-gray-300 p-2 text-right font-bold">{formData.attendance}%</td>
                  <td className="border border-gray-300 p-2 text-gray-500">Min. 75.0% required</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Previous Semester CGPA</td>
                  <td className="border border-gray-300 p-2 text-right font-bold">{formData.previous_cgpa} / 10.0</td>
                  <td className="border border-gray-300 p-2 text-gray-500">Cumulative average</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Mid-1 Assessment</td>
                  <td className="border border-gray-300 p-2 text-right font-bold">{formData.mid1} / 50.0</td>
                  <td className="border border-gray-300 p-2 text-gray-500">Internal theory assessment</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Mid-2 Assessment</td>
                  <td className="border border-gray-300 p-2 text-right font-bold">{formData.mid2} / 50.0</td>
                  <td className="border border-gray-300 p-2 text-gray-500">Internal theory assessment</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Continuous Lab / Internal Marks</td>
                  <td className="border border-gray-300 p-2 text-right font-bold">{formData.internal_marks} / 20.0</td>
                  <td className="border border-gray-300 p-2 text-gray-500">Practical & assignment work</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Active Backlogs</td>
                  <td className="border border-gray-300 p-2 text-right font-bold">{formData.backlogs}</td>
                  <td className="border border-gray-300 p-2 text-gray-500">0 backlogs optimal</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Prediction Outcome Block */}
          <div className="mb-6 border-2 border-indigo-600 rounded-lg p-5 bg-indigo-50/50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-3">Model Predictive Classification</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-white rounded border border-indigo-200">
                <span className="text-xs text-gray-500 block uppercase">Predicted CGPA</span>
                <span className="text-3xl font-black text-indigo-950">{result.predicted_cgpa.toFixed(2)}</span>
                {result.confidence_interval && (
                  <span className="text-[11px] font-semibold text-indigo-700 block mt-1">
                    ({result.confidence_interval.range_text})
                  </span>
                )}
              </div>
              <div className="p-3 bg-white rounded border border-indigo-200">
                <span className="text-xs text-gray-500 block uppercase">Academic Grade</span>
                <span className="text-3xl font-black text-gray-900">{result.grade}</span>
                <span className="text-[11px] text-gray-500 block mt-1">Institutional Scale</span>
              </div>
              <div className="p-3 bg-white rounded border border-indigo-200">
                <span className="text-xs text-gray-500 block uppercase">Performance</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">{result.performance_category}</span>
                <span className="text-[11px] text-gray-500 block">Relative Standing</span>
              </div>
              <div className="p-3 bg-white rounded border border-indigo-200">
                <span className="text-xs text-gray-500 block uppercase">Risk Level</span>
                <span className={`text-xl font-bold mt-1 block ${
                  result.risk_level === 'Low' ? 'text-green-700' :
                  result.risk_level === 'Medium' ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {result.risk_level} Risk
                </span>
                <span className="text-[11px] text-gray-500 block">Intervention Priority</span>
              </div>
            </div>
          </div>

          {/* Academic Recommendations */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Prescriptive Academic Recommendations</h3>
            <div className="border border-gray-300 rounded p-4 bg-gray-50">
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="leading-relaxed">{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="border-t border-gray-400 pt-8 mt-12 grid grid-cols-2 gap-8 text-sm">
            <div>
              <div className="border-b border-gray-400 w-48 mb-1"></div>
              <p className="font-semibold text-gray-800">Faculty Advisor / Mentor Signature</p>
              <p className="text-xs text-gray-500">Department of Computer Science & Engineering</p>
            </div>
            <div className="text-right">
              <div className="border-b border-gray-400 w-48 mb-1 ml-auto"></div>
              <p className="font-semibold text-gray-800">Academic Head / Dean</p>
              <p className="text-xs text-gray-500">Student Academic Evaluation Committee</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PredictionPage
