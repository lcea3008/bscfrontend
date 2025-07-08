// Configuración de desarrollo
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173",
  DEBUG: import.meta.env.DEV,
}

export default config
