/**
 * auth.js — Authentication utilities
 *
 * Phase 1: Uses localStorage for auth state.
 * Phase 3: Will be replaced with JWT token management + API calls.
 */

const TOKEN_KEY = 'ssp_token'
const USER_KEY  = 'ssp_user'

/** Retrieve stored JWT token */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/** Retrieve stored user object */
export function getUser() {
  const raw = localStorage.getItem(USER_KEY)
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Check if a user is currently authenticated */
export function isAuthenticated() {
  return !!getToken()
}

/** Persist auth data after successful login */
export function setAuthData(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** Clear auth data on logout */
export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
