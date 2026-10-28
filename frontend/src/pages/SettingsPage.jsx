import React from 'react'
import { Bell, Shield, Database, Layout, Globe, Save } from 'lucide-react'

function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="academic-hero-banner rounded-2xl text-white p-6 md:p-7 shadow-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative z-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 block">Platform Configuration</span>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center">
            <Layout className="h-6 w-6 mr-2.5 text-indigo-400" />
            System & Model Governance
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Configure machine learning parameters, risk classification cutoffs, and institutional alert thresholds.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        
        {/* ML Configuration Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <Database className="h-5 w-5 mr-2 text-indigo-500" />
            Machine Learning Configuration
          </h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="risk-threshold" className="block text-sm font-medium text-gray-700">
                High Risk CGPA Threshold
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="risk-threshold"
                  id="risk-threshold"
                  defaultValue={5.0}
                  step={0.1}
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-md sm:text-sm border-gray-300 border p-2"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">Students predicted below this CGPA will be flagged as High Risk.</p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="model-version" className="block text-sm font-medium text-gray-700">
                Active Prediction Model
              </label>
              <select
                id="model-version"
                name="model-version"
                defaultValue="xgboost-v1"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="xgboost-v1">XGBoost (v1.0.3) - Production</option>
                <option value="randomforest-v2">Random Forest (v2.1) - Beta</option>
                <option value="linear-base">Linear Regression - Baseline</option>
              </select>
            </div>
            
            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="auto-retrain"
                    name="auto-retrain"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="auto-retrain" className="font-medium text-gray-700">Auto-Retrain Model</label>
                  <p className="text-gray-500">Automatically retrain the model at the end of every semester when new final grades are imported.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <Bell className="h-5 w-5 mr-2 text-indigo-500" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">High Risk Alerts</h4>
                <p className="text-sm text-gray-500">Email me immediately when a student is predicted as High Risk.</p>
              </div>
              <button type="button" className="bg-indigo-600 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" role="switch" aria-checked="true">
                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Weekly Digest</h4>
                <p className="text-sm text-gray-500">Receive a weekly summary of department performance changes.</p>
              </div>
              <button type="button" className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" role="switch" aria-checked="false">
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <Layout className="h-5 w-5 mr-2 text-indigo-500" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-base font-medium text-gray-900">Theme Preference</label>
              <p className="text-sm leading-5 text-gray-500">Choose how the dashboard looks to you.</p>
              <fieldset className="mt-4">
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                  <div className="flex items-center">
                    <input id="theme-light" name="theme-preference" type="radio" defaultChecked className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="theme-light" className="ml-3 block text-sm font-medium text-gray-700">Light (Default)</label>
                  </div>
                  <div className="flex items-center">
                    <input id="theme-dark" name="theme-preference" type="radio" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="theme-dark" className="ml-3 block text-sm font-medium text-gray-700">Dark</label>
                  </div>
                  <div className="flex items-center">
                    <input id="theme-system" name="theme-preference" type="radio" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="theme-system" className="ml-3 block text-sm font-medium text-gray-700">System</label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
            Cancel
          </button>
          <button type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  )
}

export default SettingsPage
