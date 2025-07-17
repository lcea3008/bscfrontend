"use client"

import { useState } from "react"
import { Menu, Bell, Search, User, LogOut, Settings, Building2 } from "lucide-react"
import { Button } from "../ui/button"

interface UserData {
  nombre: string  // Cambiado de name a nombre para coincidir con el backend
  role: string
  avatar?: string
}

interface HeaderProps {
  onMenuClick: () => void
  user: UserData | null
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden hover:bg-gray-100">
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo - Only visible on mobile */}
          <div className="flex items-center space-x-3 lg:hidden">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Balance Scorecard</h1>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar KPIs..."
              className="bg-transparent border-none outline-none text-sm w-64"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt={user.nombre} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.nombre || "Usuario"}</p>
                <p className="text-xs text-gray-600">{user?.role || "Rol"}</p>
              </div>
            </Button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="h-4 w-4 mr-3" />
                  Mi Perfil
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="h-4 w-4 mr-3" />
                  Configuración
                </a>
                <hr className="my-2" />
                <a href="/login" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-3" />
                  Cerrar Sesión
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
