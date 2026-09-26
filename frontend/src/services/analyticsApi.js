import api from './api'

export const getDashboardAnalytics = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.department) params.append('department', filters.department)
  if (filters.semester) params.append('semester', filters.semester)
  
  return await api.get(`/analytics/dashboard?${params.toString()}`)
}
