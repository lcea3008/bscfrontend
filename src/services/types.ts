import api from "./api"

export interface User {
  id: number  // Cambiado de string a number
  email: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  role: string
}

export interface LoginResponse {
  message: string
  token: string
  user: {
    id: number
    nombre: string
    email: string
    role: string
  }
}

export interface RegisterResponse {
  id: number  // Cambiado de string a number
  email: string
}

// Servicios de autenticación
export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.log('🚀 Enviando petición de login:', { 
        email: credentials.email,
        url: 'http://localhost:3000/api/auth/login'
      })
      
      const response = await api.post("/auth/login", credentials)
      
      console.log('✅ Respuesta de login exitosa:', {
        status: response.status,
        data: response.data
      })
      
      return response.data
    } catch (error: any) {
      console.error('❌ Error detallado en login:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      })
      throw error
    }
  },

  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    try {
      console.log('Enviando petición de registro:', { email: userData.email, role: userData.role })
      const response = await api.post("/auth/register", userData)
      console.log('Respuesta de registro exitosa:', response.data)
      return response.data
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }
}

// Interfaces para Objetivos e Indicadores
export interface Objetivo {
  id: number  // Cambiado de string a number
  title: string
  perspectiva: string
  indicadores?: Indicador[]
}

export interface Indicador {
  id: number  // Cambiado de string a number
  nombre: string
  meta: number
  unidad: string
  objetivoId: number  // Cambiado de string a number
  objetivo?: Objetivo
}

// Servicios de Objetivos
export const objetivosService = {
  getAll: async (): Promise<Objetivo[]> => {
    const response = await api.get("/objetivos")
    return response.data
  },

  create: async (objetivo: Omit<Objetivo, "id">): Promise<Objetivo> => {
    const response = await api.post("/objetivos", objetivo)
    return response.data
  },

  update: async (id: number, objetivo: Partial<Objetivo>): Promise<Objetivo> => {
    const response = await api.put(`/objetivos/${id}`, objetivo)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/objetivos/${id}`)
  }
}

// Servicios de Indicadores
export const indicadoresService = {
  getAll: async (): Promise<Indicador[]> => {
    const response = await api.get("/indicadores")
    return response.data
  },

  create: async (indicador: Omit<Indicador, "id">): Promise<Indicador> => {
    const response = await api.post("/indicadores", indicador)
    return response.data
  },

  update: async (id: number, indicador: Partial<Indicador>): Promise<Indicador> => {
    const response = await api.put(`/indicadores/${id}`, indicador)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/indicadores/${id}`)
  }
}
