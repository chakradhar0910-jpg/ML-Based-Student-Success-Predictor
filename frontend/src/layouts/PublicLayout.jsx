import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * PublicLayout — Wrapper for landing page and login.
 * No sidebar; just renders the child route.
 */
function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  )
}

export default PublicLayout
