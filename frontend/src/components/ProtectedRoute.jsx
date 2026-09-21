import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth.js'

/**
 * ProtectedRoute — Wraps children and redirects to /login if not authenticated.
 * Passes the originally requested URL so we can redirect back after login.
 */
function ProtectedRoute({ children }) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
