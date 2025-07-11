// Servicio para manejar las llamadas al backend

interface UserData {
  nombre: string  // Cambiado de name a nombre para coincidir con el backend
  role: string
  avatar?: string
}

export const dashboardService = {  

  // Obtener datos del usuario
  async getUserData(): Promise<UserData> {
    try {
      // Obtener datos del usuario desde localStorage
      const userData = localStorage.getItem("userData")
      
      if (userData) {
        const parsedUserData = JSON.parse(userData)
        return {
          nombre: parsedUserData.nombre, // Usar nombre del backend
          role: parsedUserData.role,
          avatar: parsedUserData.avatar,
        }
      }

      // Si no hay datos guardados, usar datos del token
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No hay token de autenticación")
      }

      // Mock data como fallback que coincide con el formato del backend
      return {
        nombre: "Usuario Demo", // Usar nombre en lugar de name
        role: "admin",
        avatar: undefined,
      }

      // Código comentado para cuando el backend tenga el endpoint correcto:
      /*
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Error al obtener datos del usuario")
      }

      return await response.json()
      */
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Fallback a datos mock
      return {
        nombre: "Usuario Demo",
        role: "admin",
        avatar: undefined,
      }
    }
  },

  
}
