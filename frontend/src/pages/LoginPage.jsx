import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { isAuthenticated, setAuthData } from '../utils/auth.js'

/**
 * LoginPage
 *
 * Phase 1: Uses a hardcoded mock login for frontend development.
 * Phase 3: Will connect to POST /api/auth/login via Axios.
 *
 * Mock credentials (will be removed in Phase 3):
 *   admin@ssp.edu  / admin123
 *   faculty@ssp.edu / faculty123
 */

// Mock users — REMOVE in Phase 3 when Flask auth API is ready
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@ssp.edu',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    email: 'faculty@ssp.edu',
    password: 'faculty123',
    role: 'faculty',
    department: 'Computer Science',
  },
]

function LoginPage() {
  const navigate = useNavigate()
  const location  = useLocation()

  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const from = location.state?.from?.pathname ?? '/dashboard'

  /* ── Validation ─────────────────────────────────── */
  function validate() {
    const errors = {}
    if (!form.email.trim())                   errors.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (!form.password)                         errors.password = 'Password is required.'
    else if (form.password.length < 6)          errors.password = 'Password must be at least 6 characters.'
    return errors
  }

  /* ── Submit ─────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setLoading(true)

    try {
      const { default: api } = await import('../services/api.js')
      const res = await api.post('/auth/login', { email: form.email, password: form.password })
      if (res.success) {
        setAuthData(res.data.token, res.data.user)
        navigate(from, { replace: true })
      } else {
        setError(res.message || 'Invalid email or password.')
      }
    } catch (err) {
      setError(err.message || 'A network error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Handlers ───────────────────────────────────── */
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  /* ── Quick-fill helpers (dev convenience, remove in production) ── */
  const fillAdmin   = () => setForm((p) => ({ ...p, email: 'admin@ssp.edu',   password: 'password123' }))
  const fillFaculty = () => setForm((p) => ({ ...p, email: 'faculty@ssp.edu', password: 'password123' }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50
                    flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Back to home */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-surface-500
                       hover:text-surface-700 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </div>

        {/* Card */}
        <div className="card shadow-card-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14
                            rounded-2xl bg-primary-600 shadow-lg mb-4">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
            <p className="text-surface-500 text-sm mt-1">
              Sign in to the Student Success Predictor
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50
                            border border-red-200 mb-5 animate-scale-in">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@university.edu"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${fieldErrors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="form-error">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="form-label mb-0">Password</label>
                <button
                  type="button"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={`form-input pr-11 ${fieldErrors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-surface-400 hover:text-surface-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="form-error">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={handleChange}
                className="w-4 h-4 rounded border-surface-300 text-primary-600 accent-primary-600"
                disabled={loading}
              />
              <label htmlFor="remember" className="text-sm text-surface-600">
                Remember me for 7 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg"
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Dev helper — remove in Phase 3 */}
          <div className="mt-6 p-4 rounded-xl bg-surface-50 border border-surface-200">
            <p className="text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wide">
              Quick fill (dev only)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillAdmin}
                className="flex-1 text-xs py-1.5 px-3 rounded-lg bg-white border border-surface-200
                           text-surface-600 hover:bg-surface-50 transition-colors font-medium"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={fillFaculty}
                className="flex-1 text-xs py-1.5 px-3 rounded-lg bg-white border border-surface-200
                           text-surface-600 hover:bg-surface-50 transition-colors font-medium"
              >
                Faculty
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-surface-400 mt-6">
          ML-Based Student Success Predictor · Academic Analytics Platform
        </p>
      </div>
    </div>
  )
}

export default LoginPage
