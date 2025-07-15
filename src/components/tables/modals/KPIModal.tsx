"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"

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

interface Objetivo {
  id: number
  titulo: string
}

interface KPIModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (kpi: Omit<KPI, "id" | "objetivo_titulo" | "fecha_actualizacion">) => void
  kpi: KPI | null
  objetivos: Objetivo[]
}

export function KPIModal({ isOpen, onClose, onSave, kpi, objetivos }: KPIModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    meta: 0,
    unidad: "%",
    objetivo_id: 0,
    estado_actual: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const unidades = ["%", "S/", "veces", "puntos"]

  useEffect(() => {
    if (kpi) {
      setFormData({
        nombre: kpi.nombre,
        meta: kpi.meta,
        unidad: kpi.unidad,
        objetivo_id: kpi.objetivo_id,
        estado_actual: kpi.estado_actual,
      })
    } else {
      setFormData({
        nombre: "",
        meta: 0,
        unidad: "%",
        objetivo_id: objetivos.length > 0 ? objetivos[0].id : 0,
        estado_actual: 0,
      })
    }
    setErrors({})
  }, [kpi, objetivos, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (formData.meta <= 0) {
      newErrors.meta = "La meta debe ser mayor a 0"
    }

    if (!formData.objetivo_id) {
      newErrors.objetivo_id = "El objetivo es requerido"
    }

    if (formData.estado_actual < 0) {
      newErrors.estado_actual = "El estado actual no puede ser negativo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 Enviando datos del formulario:", formData)
    
    if (validateForm()) {
      console.log("✅ Formulario válido, enviando datos...")
      onSave(formData)
    } else {
      console.log("❌ Formulario inválido:", errors)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{kpi ? "Editar KPI" : "Nuevo KPI"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {objetivos.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-yellow-800 text-sm">
                ⚠️ No hay objetivos disponibles. Necesitas crear al menos un objetivo antes de agregar KPIs.
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={errors.nombre ? "border-red-500" : ""}
              placeholder="Ej: ROI Anual, Satisfacción del Cliente..."
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <Label htmlFor="objetivo_id">Objetivo</Label>
            <select
              id="objetivo_id"
              value={formData.objetivo_id}
              onChange={(e) => setFormData({ ...formData, objetivo_id: Number.parseInt(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.objetivo_id ? "border-red-500" : "border-gray-300"
              }`}
              disabled={objetivos.length === 0}
            >
              <option value={0}>Seleccionar objetivo</option>
              {objetivos.map((objetivo) => (
                <option key={objetivo.id} value={objetivo.id}>
                  {objetivo.titulo}
                </option>
              ))}
            </select>
            {errors.objetivo_id && <p className="text-red-500 text-sm mt-1">{errors.objetivo_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meta">Meta</Label>
              <Input
                id="meta"
                type="number"
                step="0.01"
                value={formData.meta}
                onChange={(e) => setFormData({ ...formData, meta: Number.parseFloat(e.target.value) || 0 })}
                className={errors.meta ? "border-red-500" : ""}
                placeholder="Ej: 1000"
              />
              {errors.meta && <p className="text-red-500 text-sm mt-1">{errors.meta}</p>}
            </div>

            <div>
              <Label htmlFor="unidad">Unidad</Label>
              <select
                id="unidad"
                value={formData.unidad}
                onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {unidades.map((unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="estado_actual">Estado Actual</Label>
            <Input
              id="estado_actual"
              type="number"
              step="0.01"
              value={formData.estado_actual}
              onChange={(e) => setFormData({ ...formData, estado_actual: Number.parseFloat(e.target.value) || 0 })}
              className={errors.estado_actual ? "border-red-500" : ""}
              placeholder="Ej: 850"
            />
            {errors.estado_actual && <p className="text-red-500 text-sm mt-1">{errors.estado_actual}</p>}
            <p className="text-gray-500 text-xs mt-1">Valor actual del indicador</p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={objetivos.length === 0}
            >
              {kpi ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
