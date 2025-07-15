"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { type CreateObjetivoData, type UpdateObjetivoData } from "../../../services/objetivosService"
import { type Perspectiva } from "../../../services/perspectivasService"

interface ObjetivoWithPerspectiva {
  id: number
  titulo: string
  perspectiva_id: number
  perspectiva: {
    id: number
    nombre: string
    descripcion: string
  }
}

interface ObjetivoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (objetivo: CreateObjetivoData | UpdateObjetivoData) => void
  objetivo: ObjetivoWithPerspectiva | null
  perspectivas: Perspectiva[]
}

export function ObjetivoModal({ isOpen, onClose, onSave, objetivo, perspectivas }: ObjetivoModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    perspectivaId: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    console.log("🔄 Configurando modal de objetivo...")
    console.log("📋 Perspectivas disponibles:", perspectivas)
    
    if (objetivo) {
      console.log("✏️ Editando objetivo:", objetivo)
      setFormData({
        nombre: objetivo.titulo,
        perspectivaId: objetivo.perspectiva_id,
      })
    } else {
      console.log("➕ Creando nuevo objetivo")
      setFormData({
        nombre: "",
        perspectivaId: perspectivas.length > 0 ? perspectivas[0].id : 0,
      })
    }
    setErrors({})
  }, [objetivo, perspectivas, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El título es requerido"
    }

    if (!formData.perspectivaId || formData.perspectivaId === 0) {
      newErrors.perspectivaId = "La perspectiva es requerida"
    }

    // Validar que la perspectiva existe en la lista
    const perspectivaExists = perspectivas.find(p => p.id === formData.perspectivaId)
    if (formData.perspectivaId !== 0 && !perspectivaExists) {
      newErrors.perspectivaId = "La perspectiva seleccionada no es válida"
    }

    console.log("🔍 Validación del formulario:", {
      nombre: formData.nombre,
      perspectivaId: formData.perspectivaId,
      perspectivaExists: !!perspectivaExists,
      errors: newErrors
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("📝 Enviando formulario con datos:", formData)
    
    if (validateForm()) {
      console.log("✅ Formulario válido, enviando datos...")
      onSave(formData)
    } else {
      console.log("❌ Formulario inválido")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{objetivo ? "Editar Objetivo" : "Nuevo Objetivo"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="nombre">Título</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={errors.nombre ? "border-red-500" : ""}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <Label htmlFor="perspectivaId">Perspectiva</Label>
            <select
              id="perspectivaId"
              value={formData.perspectivaId}
              onChange={(e) => setFormData({ ...formData, perspectivaId: Number.parseInt(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.perspectivaId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={0}>Seleccionar perspectiva</option>
              {perspectivas.map((perspectiva) => (
                <option key={perspectiva.id} value={perspectiva.id}>
                  {perspectiva.nombre}
                </option>
              ))}
            </select>
            {errors.perspectivaId && <p className="text-red-500 text-sm mt-1">{errors.perspectivaId}</p>}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              {objetivo ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
