import api from './api'

export const predictPerformance = async (studentData) => {
  return await api.post('/predict', studentData)
}

export const bulkPredictPerformance = async (formData) => {
  return await api.post('/predict/bulk', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

export const getPredictionHistory = async () => {
  return await api.get('/predict/history')
}
