"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"

interface RegistroHistorico {
  id: number
  kpi_id: number
  kpi_nombre?: string
  kpi_unidad?: string
  valor: number
  fecha: string
}

interface KPI {
  id: number
  nombre: string
  unidad: string
}

interface RegistroHistoricoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (registro: Omit<RegistroHistorico, "id" | "kpi_nombre" | "kpi_unidad">) => void
  registro: RegistroHistorico | null
  kpis: KPI[]
}

export function RegistroHistoricoModal({ isOpen, onClose, onSave, registro, kpis }: RegistroHistoricoModalProps) {
  const [formData, setFormData] = useState({
    kpi_id: 0,
    valor: 0,
    fecha: new Date().toISOString().split("T")[0],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (registro) {
      setFormData({
        kpi_id: registro.kpi_id,
        valor: registro.valor,
        fecha: registro.fecha,
      })
    } else {
      setFormData({
        kpi_id: kpis.length > 0 ? kpis[0].id : 0,
        valor: 0,
        fecha: new Date().toISOString().split("T")[0],
      })
    }
    setErrors({})
  }, [registro, kpis, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.kpi_id) {
      newErrors.kpi_id = "El KPI es requerido"
    }

    if (formData.valor === 0) {
      newErrors.valor = "El valor es requerido"
    }

    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida"
    }

    // Validar que la fecha no sea futura
    const today = new Date().toISOString().split("T")[0]
    if (formData.fecha > today) {
      newErrors.fecha = "La fecha no puede ser futura"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const selectedKpi = kpis.find((kpi) => kpi.id === formData.kpi_id)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {registro ? "Editar Registro" : "Nuevo Registro Histórico"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="kpi_id">KPI</Label>
            <select
              id="kpi_id"
              value={formData.kpi_id}
              onChange={(e) => setFormData({ ...formData, kpi_id: Number.parseInt(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.kpi_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={0}>Seleccionar KPI</option>
              {kpis.map((kpi) => (
                <option key={kpi.id} value={kpi.id}>
                  {kpi.nombre} ({kpi.unidad})
                </option>
              ))}
            </select>
            {errors.kpi_id && <p className="text-red-500 text-sm mt-1">{errors.kpi_id}</p>}
          </div>

          <div>
            <Label htmlFor="valor">Valor {selectedKpi && `(${selectedKpi.unidad})`}</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: Number.parseFloat(e.target.value) || 0 })}
              className={errors.valor ? "border-red-500" : ""}
              placeholder={selectedKpi ? `Ingrese valor en ${selectedKpi.unidad}` : "Ingrese valor"}
            />
            {errors.valor && <p className="text-red-500 text-sm mt-1">{errors.valor}</p>}
          </div>

          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className={errors.fecha ? "border-red-500" : ""}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
          </div>

          {/* Preview */}
          {selectedKpi && formData.valor > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Vista Previa</h4>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>KPI:</strong> {selectedKpi.nombre}
                </p>
                <p>
                  <strong>Valor:</strong> {formData.valor} {selectedKpi.unidad}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(formData.fecha).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              {registro ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
