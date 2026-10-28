import React, { useState, useRef } from 'react'
import { Upload, FileType, CheckCircle, AlertTriangle, Download, Trash2 } from 'lucide-react'
import { bulkPredictPerformance } from '../services/predictionApi'

function BulkPredictionPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
      setError(null)
      setResults([])
    } else {
      setFile(null)
      setError('Please select a valid CSV file.')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile)
      setError(null)
      setResults([])
    } else {
      setError('Please drop a valid CSV file.')
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await bulkPredictPerformance(formData)
      if (response.success) {
        setResults(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err.message || 'Failed to process bulk upload.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (results.length === 0) return

    // Get all column headers
    const headers = Object.keys(results[0])
    
    // Create CSV string
    const csvContent = [
      headers.join(','),
      ...results.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n')

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'bulk_predictions_results.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadSample = () => {
    const csvContent = [
      'student_id,name,gender,age,department,semester,attendance,previous_cgpa,mid1,mid2,internal_marks,backlogs',
      'STU201,Rohan Verma,Male,20,CSE,4,84.5,8.20,41.0,43.5,17.5,0',
      'STU202,Ananya Sen,Female,19,ECE,3,66.0,5.80,26.5,29.0,12.0,2',
      'STU203,Karan Malhotra,Male,21,IT,5,92.0,9.10,47.0,48.0,19.0,0',
      'STU204,Deepa Krishnan,Female,20,CSE,4,74.0,6.90,34.0,36.0,14.5,0',
      'STU205,Vikram Reddy,Male,22,MECH,6,58.5,4.80,22.0,24.0,10.0,3'
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'sample_student_records.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 block">Batch Processing</span>
          <h1 className="text-2xl font-black text-white tracking-tight">Cohort Bulk Prediction</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Upload a CSV file of student records to generate cohort-wide predictions.</p>
        </div>
        <button
          onClick={handleDownloadSample}
          className="relative z-10 inline-flex items-center px-4 py-2 border border-indigo-400/30 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex-shrink-0"
          id="download-sample-csv-btn"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Sample CSV Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Upload Zone */}
        {!results.length && (
          <div 
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${file ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            
            {!file ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Click or drag a CSV file here</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-sm">Upload student records with attendance, previous CGPA, and assessment marks.</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  >
                    Browse Files
                  </button>
                  <button 
                    onClick={handleDownloadSample}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    Get Sample CSV
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <FileType className="h-12 w-12 text-indigo-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">{file.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{(file.size / 1024).toFixed(2)} KB</p>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setFile(null)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Generate Predictions
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Data Table */}
        {results.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Successfully processed {results.length} records
              </h3>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    setResults([])
                    setFile(null)
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Upload Another File
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted CGPA</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence (95%)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.student_id || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.department || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-indigo-600">
                        {row.Predicted_CGPA !== undefined ? Number(row.Predicted_CGPA).toFixed(2) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-gray-600 font-mono">
                        {row.Confidence_Interval || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {row.Grade || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.Risk_Level === 'Low' ? 'bg-green-100 text-green-800' :
                          row.Risk_Level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          row.Risk_Level === 'High' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {row.Risk_Level || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.length > 10 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Showing first 10 rows. Download the CSV to see all {results.length} results.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default BulkPredictionPage
