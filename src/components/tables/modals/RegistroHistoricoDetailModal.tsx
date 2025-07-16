"use client"

import { X, BarChart3, Calendar, TrendingUp, Hash } from "lucide-react"
import { Button } from "../../ui/button"

interface RegistroHistorico {
  id: number
  kpi_id: number
  kpi_nombre?: string
  kpi_unidad?: string
  valor: number
  fecha: string
}

interface RegistroHistoricoDetailModalProps {
  isOpen: boolean
  onClose: () => void
  registro: RegistroHistorico | null
}

export function RegistroHistoricoDetailModal({ isOpen, onClose, registro }: RegistroHistoricoDetailModalProps) {
  if (!isOpen || !registro) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Hace 1 día"
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`
    return `Hace ${Math.floor(diffDays / 365)} años`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Detalle del Registro</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Icon and Value */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {registro.valor} {registro.kpi_unidad}
            </div>
            <p className="text-gray-600">{registro.kpi_nombre}</p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">KPI</p>
                <p className="font-medium text-gray-900">{registro.kpi_nombre}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Valor Registrado</p>
                <p className="font-medium text-gray-900">
                  {registro.valor} {registro.kpi_unidad}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha del Registro</p>
                <p className="font-medium text-gray-900">{formatDate(registro.fecha)}</p>
                <p className="text-xs text-gray-500">{getTimeAgo(registro.fecha)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">ID del Registro</p>
                <p className="font-medium text-gray-900">{registro.id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <span className="text-gray-400 text-sm">KPI</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID del KPI</p>
                <p className="font-medium text-gray-900">{registro.kpi_id}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Información Adicional</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Este registro forma parte del historial del KPI "{registro.kpi_nombre}"</p>
              <p>• Los valores se utilizan para análisis de tendencias y reportes</p>
              <p>• La fecha indica cuándo se registró este valor específico</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
