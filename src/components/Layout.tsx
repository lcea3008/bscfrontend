"use client"

import type React from "react"

import { Header } from "./dashboard/Header"
import { Sidebar } from "./dashboard/Sidebar"
import { useAuth } from "../context/AuthContext"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth()

  // Transformar el usuario del contexto al formato que espera el Header
  const headerUser = user ? {
    nombre: user.nombre || "Usuario",
    role: user.role
  } : null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Always visible */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - Fixed */}
        <Header user={headerUser} onMenuClick={() => {}} />

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
