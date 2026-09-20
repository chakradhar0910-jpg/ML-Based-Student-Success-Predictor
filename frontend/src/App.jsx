import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'

// Public pages
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

// Dashboard
import Dashboard from './pages/Dashboard.jsx'

// Student Pages
import StudentsList from './pages/StudentsList.jsx'
import AddStudent from './pages/AddStudent.jsx'

// All other authenticated stubs — will be replaced per-phase
import PredictionPage from './pages/PredictionPage.jsx'
import BulkPredictionPage from './pages/BulkPredictionPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import StudentDetailsPage from './pages/StudentDetailsPage.jsx'
import PredictionHistoryPage from './pages/PredictionHistoryPage.jsx'
import RecommendationsPage from './pages/RecommendationsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

// Auth guard
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public Routes ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ── Protected / Authenticated Routes ── */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard"        element={<Dashboard />} />
          <Route path="/students"         element={<StudentsList />} />
          <Route path="/students/new"     element={<AddStudent />} />
          <Route path="/students/:id"     element={<StudentDetailsPage />} />
          <Route path="/students/:id/edit" element={<AddStudent />} />
          <Route path="/prediction"       element={<PredictionPage />} />
          <Route path="/bulk-prediction"  element={<BulkPredictionPage />} />
          <Route path="/predictions"      element={<PredictionHistoryPage />} />
          <Route path="/analytics"        element={<AnalyticsPage />} />
          <Route path="/recommendations"  element={<RecommendationsPage />} />
          <Route path="/profile"          element={<ProfilePage />} />
          <Route path="/settings"         element={<SettingsPage />} />
        </Route>

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
