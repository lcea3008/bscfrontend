"use client"

import { X, Target, Eye } from "lucide-react"
import { Button } from "../../ui/button"

interface Objetivo {
  id: number
  titulo: string
  perspectiva_id: number
  perspectiva_nombre?: string
}

interface ObjetivoDetailModalProps {
  isOpen: boolean
  onClose: () => void
  objetivo: Objetivo | null
}

export function ObjetivoDetailModal({ isOpen, onClose, objetivo }: ObjetivoDetailModalProps) {
  if (!isOpen || !objetivo) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Detalles del Objetivo</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Target className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Título</p>
                <p className="font-medium text-gray-900">{objetivo.titulo}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Perspectiva</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {objetivo.perspectiva_nombre}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <span className="text-gray-400">#</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium text-gray-900">{objetivo.id}</p>
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
