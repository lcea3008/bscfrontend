import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Sidebar } from './components/dashboard/Sidebar'
import { Header } from './components/dashboard/Header'

// Import all pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Objetivos from './pages/Objetivos'
import Usuarios from './pages/Users'
import Perspectivas from './pages/Perspectivas'
import KPIs from './pages/KPIs'
import Admin from './pages/Admin'

// Layout component with static sidebar and header
function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // Transformar el usuario del contexto al formato que espera el Header
  const headerUser = user ? {
    nombre: user.nombre || "Usuario Demo",
    role: user.role || "Usuario",
    avatar: undefined
  } : {
    nombre: "Usuario Demo",
    role: "Usuario",
    avatar: undefined
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Static */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - Static */}
        <Header user={headerUser} onMenuClick={() => {}} />

        {/* Page Content - Dynamic (this changes based on route) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login sin layout */}
          <Route path="/login" element={<Login />} />
          
          {/* Todas las demás páginas con layout estático */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/users" element={<AppLayout><Usuarios /></AppLayout>} />
          <Route path="/perspectivas" element={<AppLayout><Perspectivas /></AppLayout>} />
          <Route path="/objetivos" element={<AppLayout><Objetivos /></AppLayout>} />
          <Route path="/kpis" element={<AppLayout><KPIs /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
