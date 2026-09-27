/**
 * formatters.js — Shared formatting utilities
 */

/** Format a CGPA number to 2 decimal places */
export function formatCGPA(value) {
  if (value === null || value === undefined) return '—'
  return Number(value).toFixed(2)
}

/** Derive grade letter from CGPA */
export function getGrade(cgpa) {
  if (cgpa >= 9.0) return 'O'
  if (cgpa >= 8.0) return 'A+'
  if (cgpa >= 7.0) return 'A'
  if (cgpa >= 6.0) return 'B+'
  if (cgpa >= 5.0) return 'B'
  if (cgpa >= 4.0) return 'C'
  return 'F'
}

/** Derive performance category from CGPA */
export function getPerformanceCategory(cgpa) {
  if (cgpa >= 8.5) return 'Excellent'
  if (cgpa >= 7.0) return 'Good'
  if (cgpa >= 5.0) return 'Average'
  return 'At Risk'
}

/** Derive risk level from CGPA */
export function getRiskLevel(cgpa) {
  if (cgpa >= 7.0) return 'Low'
  if (cgpa >= 5.0) return 'Medium'
  return 'High'
}

/** Format a date string into a readable format */
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

/** Format a date string with time */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Capitalize first letter of a string */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
