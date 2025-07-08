import axios from "axios"
import config from "../config"

const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor para requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para responses - manejo de errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    return response
  },
  (error) => {
    // Log detallado del error para debugging
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message
    })
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
