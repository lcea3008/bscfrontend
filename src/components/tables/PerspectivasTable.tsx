"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { PerspectivaModal } from "./modals/PerspectivaModal"
import { PerspectivaDetailModal } from "./modals/PerspectivaDetailModal"

interface Perspectiva {
  id: number
  nombre: string
  descripcion: string
}

export function PerspectivasTable() {
  const [perspectivas, setPerspectivas] = useState<Perspectiva[]>([])
  const [filteredPerspectivas, setFilteredPerspectivas] = useState<Perspectiva[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPerspectiva, setSelectedPerspectiva] = useState<Perspectiva | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockPerspectivas: Perspectiva[] = [
      { id: 1, nombre: "Finanzas", descripcion: "Perspectiva financiera del balanced scorecard" },
      { id: 2, nombre: "Cliente", descripcion: "Perspectiva del cliente y satisfacción" },
      { id: 3, nombre: "Procesos", descripcion: "Perspectiva de procesos internos" },
      { id: 4, nombre: "Aprendizaje", descripcion: "Perspectiva de aprendizaje y crecimiento" },
    ]

    setTimeout(() => {
      setPerspectivas(mockPerspectivas)
      setFilteredPerspectivas(mockPerspectivas)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = perspectivas.filter(
      (perspectiva) =>
        perspectiva.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perspectiva.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPerspectivas(filtered)
  }, [searchTerm, perspectivas])

  const handleEdit = (perspectiva: Perspectiva) => {
    setSelectedPerspectiva(perspectiva)
    setIsModalOpen(true)
  }

  const handleView = (perspectiva: Perspectiva) => {
    setSelectedPerspectiva(perspectiva)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta perspectiva?")) {
      setPerspectivas(perspectivas.filter((perspectiva) => perspectiva.id !== id))
    }
  }

  const handleSave = (perspectivaData: Omit<Perspectiva, "id">) => {
    if (selectedPerspectiva) {
      setPerspectivas(
        perspectivas.map((perspectiva) =>
          perspectiva.id === selectedPerspectiva.id ? { ...perspectivaData, id: selectedPerspectiva.id } : perspectiva,
        ),
      )
    } else {
      const newPerspectiva = { ...perspectivaData, id: Date.now() }
      setPerspectivas([...perspectivas, newPerspectiva])
    }
    setIsModalOpen(false)
    setSelectedPerspectiva(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Perspectivas</h1>
          <p className="text-gray-600">Administra las perspectivas del Balanced Scorecard</p>
        </div>
        <Button
          onClick={() => {
            setSelectedPerspectiva(null)
            setIsModalOpen(true)
          }}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Perspectiva
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar perspectivas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Descripción</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPerspectivas.map((perspectiva) => (
                <tr key={perspectiva.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{perspectiva.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{perspectiva.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{perspectiva.descripcion}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(perspectiva)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(perspectiva)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(perspectiva.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPerspectivas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron perspectivas</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <PerspectivaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPerspectiva(null)
        }}
        onSave={handleSave}
        perspectiva={selectedPerspectiva}
      />

      <PerspectivaDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedPerspectiva(null)
        }}
        perspectiva={selectedPerspectiva}
      />
    </div>
  )
}
