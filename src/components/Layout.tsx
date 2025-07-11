"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "./dashboard/Header"
import { Sidebar } from "./dashboard/Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [user] = useState({
    name: "Juan Pérez",
    role: "Administrador",
  })

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Always visible */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - Fixed */}
        <Header user={user} />

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
