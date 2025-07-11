import { createContext, useContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

interface User {
  userId: number  // ID del usuario extraído del token
  nombre?: string // ✅ Agregado: se obtiene desde los datos completos del backend
  email?: string  // ✅ Agregado: se obtiene desde los datos completos del backend
  role: string
  exp?: number
}

interface AuthContextType {
  user: User | null
  login: (token: string) => void
  loginWithUserData: (token: string, userData: any) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded = jwtDecode<User>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp ? decoded.exp > currentTime : true
    } catch {
      return false
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("userData")

    if (token && isTokenValid(token)) {
      const decoded = jwtDecode<User>(token)

      // ✅ Corrección: incluir nombre y email desde localStorage si existen
      if (userData) {
        const parsed = JSON.parse(userData)
        setUser({
          userId: decoded.userId,
          role: decoded.role,
          nombre: parsed.nombre, // ✅
          email: parsed.email,   // ✅
        })
      } else {
        setUser(decoded)
      }
    } else if (token) {
      // Token expirado
      localStorage.removeItem("token")
      localStorage.removeItem("userData")
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem("token", token)
    const decoded = jwtDecode<User>(token)
    setUser(decoded)
  }

  // ✅ Corrección importante: mezclar datos del token con datos del backend
  const loginWithUserData = (token: string, userData: any) => {
    console.log("🔐 Login con datos del usuario:", userData)
    
    localStorage.setItem("token", token)
    localStorage.setItem("userData", JSON.stringify(userData))

    const decoded = jwtDecode<User>(token)
    console.log("🔓 Token decodificado:", decoded)

    const completeUser: User = {
      userId: decoded.userId,
      role: decoded.role,
      nombre: userData.nombre, // ✅
      email: userData.email,   // ✅
    }

    console.log("👤 Usuario completo creado:", completeUser)
    setUser(completeUser)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithUserData,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
