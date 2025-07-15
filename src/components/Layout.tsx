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


  return (
    <div className="min-h-screen bg-gray-50 flex">

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      
    </div>
  )
}
