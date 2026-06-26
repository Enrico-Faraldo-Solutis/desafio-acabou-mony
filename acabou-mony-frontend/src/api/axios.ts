import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('acabou_mony_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? 'unknown'
      const method = error.config?.method?.toUpperCase() ?? 'GET'
      console.error('[API 401]', `${method} ${url}`, error.response?.data ?? 'sem body')
    }
    return Promise.reject(error)
  }
)

export default api
