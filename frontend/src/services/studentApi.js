import api from './api'

export const getAllStudents = async () => {
  return await api.get('/students')
}

export const getStudentById = async (studentId) => {
  return await api.get(`/students/${studentId}`)
}

export const createStudent = async (studentData) => {
  return await api.post('/students', studentData)
}
