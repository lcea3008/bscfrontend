"use client"

import { LayoutDashboard, BarChart3, Target, Map, ClipboardCheck, Settings, X, Building2 } from "lucide-react"
import { Button } from "../ui/button"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { name: "Indicadores", icon: BarChart3, href: "/indicadores", active: false },
  { name: "Iniciativas", icon: Target, href: "/iniciativas", active: false },
  { name: "Mapa Estratégico", icon: Map, href: "/mapa-estrategico", active: false },
  { name: "Seguimiento", icon: ClipboardCheck, href: "/seguimiento", active: false },
  { name: "Admin", icon: Settings, href: "/admin", active: false },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-red-600 via-red-700 to-red-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
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

          {/* Close button (mobile only) */}
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden text-white hover:bg-red-500">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                      ${
                        item.active
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
            <p className="text-red-100 text-sm font-medium">Empresa LCA</p>
            <p className="text-red-200 text-xs">Sistema de Gestión</p>
          </div>
        </div>
      </div>
    </>
  )
}
