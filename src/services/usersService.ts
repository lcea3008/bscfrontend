import api from "./api"

// Interfaz para el usuario que viene del backend
export interface User {
  id: number
  nombre: string
  email: string
  role: string
  password?: string
  createdAt?: string
  updatedAt?: string
}

// Interfaz para crear/actualizar usuario
export interface CreateUserData {
  nombre: string
  email: string
  role: string
  password: string
}

export interface UpdateUserData {
  nombre: string
  email: string
  role: string
  password?: string // Opcional en actualización
}

export const usersService = {
  // Obtener todos los usuarios
  async getUsers(): Promise<User[]> {
    try {
      console.log("🔄 Obteniendo usuarios desde la API...")
      const response = await api.get<User[]>("/users")
      
      console.log("✅ Usuarios obtenidos exitosamente:", response.data.length)
      return response.data
    } catch (error: any) {
      console.error("❌ Error al obtener usuarios:", error)
      
      // Si es error de red o servidor, usar datos mock para desarrollo
      if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
        console.warn("⚠️ Usando datos mock debido a error del servidor")
        return this.getMockUsers()
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al obtener usuarios"
      )
    }
  },

  // Obtener un usuario por ID
  async getUserById(id: number): Promise<User> {
    try {
      console.log(`🔄 Obteniendo usuario con ID: ${id}`)
      const response = await api.get<User>(`/users/${id}`)
      
      console.log("✅ Usuario obtenido exitosamente")
      return response.data
    } catch (error: any) {
      console.error(`❌ Error al obtener usuario ${id}:`, error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al obtener usuario"
      )
    }
  },

  // Crear nuevo usuario
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      console.log("🔄 Creando nuevo usuario...")
      console.log("📦 Datos enviados al backend:", {
        nombre: userData.nombre,
        email: userData.email,
        password: userData.password,
        role: userData.role
      })
      
      const response = await api.post<User>("auth/register", userData)
      
      console.log("✅ Usuario creado exitosamente")
      return response.data
    } catch (error: any) {
      console.error("❌ Error al crear usuario:", error)
      console.error("📦 Datos que causaron el error:", {
        nombre: userData.nombre,
        email: userData.email,
        password: "[HIDDEN]",
        role: userData.role
      })
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al crear usuario"
      )
    }
  },

  // Actualizar usuario
  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    try {
      console.log(`🔄 Actualizando usuario ${id}:`, { 
        ...userData, 
        password: userData.password ? "[HIDDEN]" : undefined 
      })
      const response = await api.put<User>(`/users/${id}`, userData)
      
      console.log("✅ Usuario actualizado exitosamente")
      return response.data
    } catch (error: any) {
      console.error(`❌ Error al actualizar usuario ${id}:`, error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al actualizar usuario"
      )
    }
  },

  // Eliminar usuario
  async deleteUser(id: number): Promise<void> {
    try {
      console.log(`🔄 Eliminando usuario ${id}`)
      await api.delete(`/users/${id}`)
      
      console.log("✅ Usuario eliminado exitosamente")
    } catch (error: any) {
      console.error(`❌ Error al eliminar usuario ${id}:`, error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al eliminar usuario"
      )
    }
  },

  // Datos mock para desarrollo/fallback
  getMockUsers(): User[] {
    return [
      { 
        id: 1, 
        nombre: "Administrador del Sistema", 
        email: "admin@bsc.com", 
        role: "Admin",
        password: "$2b$10$GZQ9ceCgeS4gL42Gf3pCq.aspzDBKVwhUdgIqcNCItr5D74Ip1r3C",
        createdAt: "2024-01-15T10:00:00Z"
      },
      { 
        id: 2, 
        nombre: "María García", 
        email: "maria@empresa.com", 
        role: "Usuario",
        password: "$2b$10$example123456789",
        createdAt: "2024-01-16T11:00:00Z"
      },
      { 
        id: 3, 
        nombre: "Carlos López", 
        email: "carlos@empresa.com", 
        role: "Supervisor",
        password: "$2b$10$example123456789",
        createdAt: "2024-01-17T12:00:00Z"
      },
    ]
  }
}
