"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"

interface Objetivo {
  id: number
  titulo: string
  perspectiva_id: number
  perspectiva_nombre?: string
}

interface Perspectiva {
  id: number
  nombre: string
}

interface ObjetivoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (objetivo: Omit<Objetivo, "id" | "perspectiva_nombre">) => void
  objetivo: Objetivo | null
  perspectivas: Perspectiva[]
}

export function ObjetivoModal({ isOpen, onClose, onSave, objetivo, perspectivas }: ObjetivoModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    perspectiva_id: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (objetivo) {
      setFormData({
        titulo: objetivo.titulo,
        perspectiva_id: objetivo.perspectiva_id,
      })
    } else {
      setFormData({
        titulo: "",
        perspectiva_id: perspectivas.length > 0 ? perspectivas[0].id : 0,
      })
    }
    setErrors({})
  }, [objetivo, perspectivas, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido"
    }

    if (!formData.perspectiva_id) {
      newErrors.perspectiva_id = "La perspectiva es requerida"
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
            <Label htmlFor="perspectiva_id">Perspectiva</Label>
            <select
              id="perspectiva_id"
              value={formData.perspectiva_id}
              onChange={(e) => setFormData({ ...formData, perspectiva_id: Number.parseInt(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.perspectiva_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={0}>Seleccionar perspectiva</option>
              {perspectivas.map((perspectiva) => (
                <option key={perspectiva.id} value={perspectiva.id}>
                  {perspectiva.nombre}
                </option>
              ))}
            </select>
            {errors.perspectiva_id && <p className="text-red-500 text-sm mt-1">{errors.perspectiva_id}</p>}
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
