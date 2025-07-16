"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"

interface Iniciativa {
  id: number
  nombre: string
  descripcion: string
  kpi_id: number
  fecha_inicio: string
  fecha_fin: string
  responsable_id: number
  progreso: number
}

interface KPIItem {
  id: number
  nombre: string
}

interface ResponsableItem {
  id: number
  nombre: string
}

interface IniciativaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (iniciativa: Omit<Iniciativa, "id">) => void
  iniciativa: Iniciativa | null
  kpis: KPIItem[]
  responsables: ResponsableItem[]
}

export function IniciativaModal({ isOpen, onClose, onSave, iniciativa, kpis, responsables }: IniciativaModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    kpi_id: 0,
    responsable_id: 0,
    fecha_inicio: "",
    fecha_fin: "",
    progreso: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (iniciativa) {
      setFormData({
        nombre: iniciativa.nombre,
        descripcion: iniciativa.descripcion,
        kpi_id: iniciativa.kpi_id,
        responsable_id: iniciativa.responsable_id,
        fecha_inicio: iniciativa.fecha_inicio.split('T')[0], // Convertir formato de fecha
        fecha_fin: iniciativa.fecha_fin.split('T')[0], // Convertir formato de fecha
        progreso: iniciativa.progreso,
      })
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        kpi_id: kpis.length > 0 ? kpis[0].id : 0,
        responsable_id: responsables.length > 0 ? responsables[0].id : 0,
        fecha_inicio: "",
        fecha_fin: "",
        progreso: 0,
      })
    }
    setErrors({})
  }, [iniciativa, kpis, responsables, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida"
    }

    if (!formData.kpi_id) {
      newErrors.kpi_id = "El KPI es requerido"
    }

    if (!formData.responsable_id) {
      newErrors.responsable_id = "El responsable es requerido"
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = "La fecha de inicio es requerida"
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = "La fecha de fin es requerida"
    }

    if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_inicio > formData.fecha_fin) {
      newErrors.fecha_fin = "La fecha de fin debe ser posterior a la fecha de inicio"
    }

    if (formData.progreso < 0 || formData.progreso > 100) {
      newErrors.progreso = "El progreso debe estar entre 0 y 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Convertir fechas al formato requerido por el backend
      const dataToSave = {
        ...formData,
        fecha_inicio: `${formData.fecha_inicio}T00:00:00.000Z`,
        fecha_fin: `${formData.fecha_fin}T00:00:00.000Z`,
      }
      onSave(dataToSave)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{iniciativa ? "Editar Iniciativa" : "Nueva Iniciativa"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={errors.nombre ? "border-red-500" : ""}
              placeholder="Nombre de la iniciativa"
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.descripcion ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
              placeholder="Descripción detallada de la iniciativa"
            />
            {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
          </div>

          <div>
            <Label htmlFor="kpi_id">KPI Asociado</Label>
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
                  {kpi.nombre}
                </option>
              ))}
            </select>
            {errors.kpi_id && <p className="text-red-500 text-sm mt-1">{errors.kpi_id}</p>}
          </div>

          <div>
            <Label htmlFor="responsable_id">Responsable</Label>
            <select
              id="responsable_id"
              value={formData.responsable_id}
              onChange={(e) => setFormData({ ...formData, responsable_id: Number.parseInt(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.responsable_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={0}>Seleccionar responsable</option>
              {responsables.map((responsable) => (
                <option key={responsable.id} value={responsable.id}>
                  {responsable.nombre}
                </option>
              ))}
            </select>
            {errors.responsable_id && <p className="text-red-500 text-sm mt-1">{errors.responsable_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                className={errors.fecha_inicio ? "border-red-500" : ""}
              />
              {errors.fecha_inicio && <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio}</p>}
            </div>

            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                className={errors.fecha_fin ? "border-red-500" : ""}
              />
              {errors.fecha_fin && <p className="text-red-500 text-sm mt-1">{errors.fecha_fin}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="progreso">Progreso (%)</Label>
            <div className="flex items-center space-x-3">
              <Input
                id="progreso"
                type="range"
                min="0"
                max="100"
                value={formData.progreso}
                onChange={(e) => setFormData({ ...formData, progreso: Number.parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="bg-gray-100 px-3 py-2 rounded-md text-sm font-medium min-w-[60px] text-center">
                {formData.progreso}%
              </span>
            </div>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.progreso}
              onChange={(e) => setFormData({ ...formData, progreso: Math.min(100, Math.max(0, Number.parseInt(e.target.value) || 0)) })}
              className={`mt-2 ${errors.progreso ? "border-red-500" : ""}`}
              placeholder="Ingrese el progreso (0-100)"
            />
            {errors.progreso && <p className="text-red-500 text-sm mt-1">{errors.progreso}</p>}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              {iniciativa ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
