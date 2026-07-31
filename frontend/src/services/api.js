import axios from 'axios'

const API_BASE = 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: attempt refresh on 401 and retry once
const plain = axios.create({ baseURL: API_BASE })

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config
    if (!originalRequest) return Promise.reject(err)

    const status = err.response?.status
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const resp = await plain.post('/auth/refresh', { refresh_token: refreshToken })
          const { access_token } = resp.data
          if (access_token) {
            localStorage.setItem('access_token', access_token)
            originalRequest.headers.Authorization = `Bearer ${access_token}`
            return api(originalRequest)
          }
        } catch (refreshErr) {
          // refresh failed
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          return Promise.reject(refreshErr)
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api
