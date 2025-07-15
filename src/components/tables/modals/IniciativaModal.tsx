"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"

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

interface Objetivo {
  id: number
  titulo: string
}

interface IniciativaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (iniciativa: Omit<Iniciativa, "id" | "objetivo_titulo">) => void
  iniciativa: Iniciativa | null
  objetivos: Objetivo[]
}

export function IniciativaModal({ isOpen, onClose, onSave, iniciativa, objetivos }: IniciativaModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    objetivo_id: 0,
    responsable: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "planificada" as "planificada" | "en_progreso" | "completada" | "cancelada",
    presupuesto: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const estados = [
    { value: "planificada", label: "Planificada" },
    { value: "en_progreso", label: "En Progreso" },
    { value: "completada", label: "Completada" },
    { value: "cancelada", label: "Cancelada" },
  ]

  useEffect(() => {
    if (iniciativa) {
      setFormData({
        titulo: iniciativa.titulo,
        descripcion: iniciativa.descripcion,
        objetivo_id: iniciativa.objetivo_id,
        responsable: iniciativa.responsable,
        fecha_inicio: iniciativa.fecha_inicio,
        fecha_fin: iniciativa.fecha_fin,
        estado: iniciativa.estado,
        presupuesto: iniciativa.presupuesto,
      })
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        objetivo_id: objetivos.length > 0 ? objetivos[0].id : 0,
        responsable: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: "planificada",
        presupuesto: 0,
      })
    }
    setErrors({})
  }, [iniciativa, objetivos, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido"
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida"
    }

    if (!formData.objetivo_id) {
      newErrors.objetivo_id = "El objetivo es requerido"
    }

    if (!formData.responsable.trim()) {
      newErrors.responsable = "El responsable es requerido"
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

    if (formData.presupuesto < 0) {
      newErrors.presupuesto = "El presupuesto no puede ser negativo"
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
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className={errors.titulo ? "border-red-500" : ""}
            />
            {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
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
            />
            {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
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
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                className={errors.responsable ? "border-red-500" : ""}
              />
              {errors.responsable && <p className="text-red-500 text-sm mt-1">{errors.responsable}</p>}
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {estados.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>
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
            <Label htmlFor="presupuesto">Presupuesto (S/)</Label>
            <Input
              id="presupuesto"
              type="number"
              step="0.01"
              value={formData.presupuesto}
              onChange={(e) => setFormData({ ...formData, presupuesto: Number.parseFloat(e.target.value) || 0 })}
              className={errors.presupuesto ? "border-red-500" : ""}
            />
            {errors.presupuesto && <p className="text-red-500 text-sm mt-1">{errors.presupuesto}</p>}
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
