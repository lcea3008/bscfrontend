import { createContext, useContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

interface User {
  userId: number  // Cambiado de string a number para coincidir con la BD
  role: string
  exp?: number
}

interface AuthContextType {
  user: User | null
  login: (token: string) => void
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
    if (token && isTokenValid(token)) {
      const decoded = jwtDecode<User>(token)
      setUser(decoded)
    } else if (token) {
      // Token expirado
      localStorage.removeItem("token")
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem("token", token)
    const decoded = jwtDecode<User>(token)
    setUser(decoded)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
