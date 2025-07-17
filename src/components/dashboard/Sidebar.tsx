"use client"

import { LayoutDashboard, BarChart3, Target, Map, ClipboardCheck, Settings, Building2, Users, Eye, X } from "lucide-react"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: false },
  { name: "Usuarios", icon: Users, href: "/users", active: false },
  { name: "Perspectivas", icon: Eye, href: "/perspectivas", active: false },
  { name: "Objetivos", icon: Target, href: "/objetivos", active: false },
  { name: "Indicadores", icon: BarChart3, href: "/kpis", active: false },
  { name: "Iniciativas", icon: Target, href: "/iniciativas", active: false },
  { name: "Registro Historico", icon: Map, href: "/registros-historicos", active: false },
  // { name: "Admin", icon: Settings, href: "/admin", active: false },
]

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const currentPath = window.location.pathname

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-red-600 via-red-700 to-red-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-red-500">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-400 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Balance</h2>
            <p className="text-red-200 text-sm">Scorecard</p>
          </div>
        </div>
        
        {/* Botón de cerrar para móvil */}
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden text-white hover:bg-red-500 rounded-lg p-2"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? "bg-yellow-400 text-red-800 font-semibold shadow-lg"
                        : "text-red-100 hover:bg-red-500 hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-red-500">
        <div className="bg-red-500/50 rounded-lg p-4 text-center">
          <p className="text-red-100 text-sm font-medium">Empresa Plaza Vea</p>
          <p className="text-red-200 text-xs">Sistema de Gestión</p>
        </div>
      </div>
    </div>
    </>
  )
}
