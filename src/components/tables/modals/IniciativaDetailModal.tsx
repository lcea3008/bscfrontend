"use client"

import { X, Target, User, Calendar, DollarSign, FileText, Clock } from "lucide-react"
import { Button } from "../../ui/button"

interface Iniciativa {
  id: number
  titulo: string
  descripcion: string
  objetivo_id: number
  objetivo_titulo?: string
  responsable: string
  fecha_inicio: string
  fecha_fin: string
  estado: "planificada" | "en_progreso" | "completada" | "cancelada"
  presupuesto: number
}

interface IniciativaDetailModalProps {
  isOpen: boolean
  onClose: () => void
  iniciativa: Iniciativa | null
}

export function IniciativaDetailModal({ isOpen, onClose, iniciativa }: IniciativaDetailModalProps) {
  if (!isOpen || !iniciativa) return null

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completada":
        return { bg: "bg-green-100", text: "text-green-800", icon: "bg-green-500" }
      case "en_progreso":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: "bg-blue-500" }
      case "planificada":
        return { bg: "bg-yellow-100", text: "text-yellow-800", icon: "bg-yellow-500" }
      case "cancelada":
        return { bg: "bg-red-100", text: "text-red-800", icon: "bg-red-500" }
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", icon: "bg-gray-500" }
    }
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "completada":
        return "Completada"
      case "en_progreso":
        return "En Progreso"
      case "planificada":
        return "Planificada"
      case "cancelada":
        return "Cancelada"
      default:
        return estado
    }
  }

  const estadoInfo = getEstadoColor(iniciativa.estado)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Detalles de la Iniciativa</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Icon and Status */}
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${estadoInfo.icon}`}>
              <Target className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Title and Status */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{iniciativa.titulo}</h3>
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${estadoInfo.bg} ${estadoInfo.text}`}
            >
              {getEstadoLabel(iniciativa.estado)}
            </span>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Descripción</p>
                <p className="text-gray-900">{iniciativa.descripcion}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objective */}
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Objetivo Asociado</p>
                <p className="font-medium text-gray-900">{iniciativa.objetivo_titulo}</p>
              </div>
            </div>

            {/* Responsible */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Responsable</p>
                <p className="font-medium text-gray-900">{iniciativa.responsable}</p>
              </div>
            </div>

            {/* Start Date */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha de Inicio</p>
                <p className="font-medium text-gray-900">
                  {new Date(iniciativa.fecha_inicio).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* End Date */}
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha de Fin</p>
                <p className="font-medium text-gray-900">
                  {new Date(iniciativa.fecha_fin).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Presupuesto</p>
                <p className="font-medium text-gray-900">S/ {iniciativa.presupuesto.toLocaleString()}</p>
              </div>
            </div>

            {/* ID */}
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <span className="text-gray-400">#</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID de Iniciativa</p>
                <p className="font-medium text-gray-900">{iniciativa.id}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Cronograma</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duración total:</span>
                <span className="font-medium text-gray-900">
                  {Math.ceil(
                    (new Date(iniciativa.fecha_fin).getTime() - new Date(iniciativa.fecha_inicio).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  días
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    iniciativa.estado === "completada"
                      ? "bg-green-500"
                      : iniciativa.estado === "en_progreso"
                        ? "bg-blue-500"
                        : iniciativa.estado === "cancelada"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                  }`}
                  style={{
                    width:
                      iniciativa.estado === "completada"
                        ? "100%"
                        : iniciativa.estado === "en_progreso"
                          ? "60%"
                          : iniciativa.estado === "cancelada"
                            ? "30%"
                            : "0%",
                  }}
                />
              </div>
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
