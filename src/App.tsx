import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Objetivos from './pages/Objetivos'
import React from 'react'

// interface ProtectedRouteProps {
//   children: React.ReactNode
//   roles?: string[]
// }

// function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
//   const { user } = useAuth()
//   if (!user) return <Navigate to="/login" />
//   if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />
//   return children
// }

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/objetivos" element={<Objetivos />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
