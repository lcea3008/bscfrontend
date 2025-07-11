"use client"

import { X, BarChart3, Target, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { Button } from "../../ui/button"

interface KPI {
  id: number
  nombre: string
  meta: number
  unidad: string
  objetivo_id: number
  objetivo_titulo?: string
  estado_actual: number
  fecha_actualizacion: string
}

interface KPIDetailModalProps {
  isOpen: boolean
  onClose: () => void
  kpi: KPI | null
}

export function KPIDetailModal({ isOpen, onClose, kpi }: KPIDetailModalProps) {
  if (!isOpen || !kpi) return null

  const getKpiStatus = () => {
    const percentage = (kpi.estado_actual / kpi.meta) * 100
    if (percentage >= 90) return { status: "success", color: "text-green-600", bg: "bg-green-100", label: "Cumplido" }
    if (percentage >= 70)
      return { status: "warning", color: "text-yellow-600", bg: "bg-yellow-100", label: "En Progreso" }
    return { status: "danger", color: "text-red-600", bg: "bg-red-100", label: "Crítico" }
  }

  const getTrend = () => {
    return kpi.estado_actual >= kpi.meta ? "up" : "down"
  }

  const status = getKpiStatus()
  const trend = getTrend()
  const percentage = Math.round((kpi.estado_actual / kpi.meta) * 100)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Detalles del KPI</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Icon and Status */}
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${status.bg}`}>
              <BarChart3 className={`h-10 w-10 ${status.color}`} />
            </div>
          </div>

          {/* KPI Name */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{kpi.nombre}</h3>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${status.bg} ${status.color}`}>
              {status.label} - {percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso hacia la meta</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  status.status === "success"
                    ? "bg-green-500"
                    : status.status === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          {/* KPI Details */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Value */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {kpi.estado_actual} {kpi.unidad}
              </div>
              <div className="text-sm text-gray-600">Valor Actual</div>
            </div>

            {/* Target Value */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {kpi.meta} {kpi.unidad}
              </div>
              <div className="text-sm text-gray-600">Meta</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Objetivo Asociado</p>
                <p className="font-medium text-gray-900">{kpi.objetivo_titulo}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {trend === "up" ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="text-sm text-gray-500">Tendencia</p>
                <p className={`font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {trend === "up" ? "Positiva" : "Negativa"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Última Actualización</p>
                <p className="font-medium text-gray-900">
                  {new Date(kpi.fecha_actualizacion).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <span className="text-gray-400">#</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID del KPI</p>
                <p className="font-medium text-gray-900">{kpi.id}</p>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Resumen de Rendimiento</h4>
            <p className="text-sm text-gray-600">
              {percentage >= 100
                ? `¡Excelente! Este KPI ha superado su meta en un ${percentage - 100}%.`
                : percentage >= 90
                  ? `Muy bien. Este KPI está muy cerca de alcanzar su meta (${100 - percentage}% restante).`
                  : percentage >= 70
                    ? `En progreso. Este KPI necesita mejorar un ${100 - percentage}% para alcanzar la meta.`
                    : `Atención requerida. Este KPI está significativamente por debajo de la meta y requiere acción inmediata.`}
            </p>
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
