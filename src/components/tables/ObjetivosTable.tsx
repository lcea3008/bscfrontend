"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ObjetivoModal } from "./modals/ObjetivoModal"
import { ObjetivoDetailModal } from "./modals/ObjetivoDetailModal"

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

export function ObjetivosTable() {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [perspectivas, setPerspectivas] = useState<Perspectiva[]>([])
  const [filteredObjetivos, setFilteredObjetivos] = useState<Objetivo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedObjetivo, setSelectedObjetivo] = useState<Objetivo | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockPerspectivas: Perspectiva[] = [
      { id: 1, nombre: "Finanzas" },
      { id: 2, nombre: "Cliente" },
      { id: 3, nombre: "Procesos" },
      { id: 4, nombre: "Aprendizaje" },
    ]

    const mockObjetivos: Objetivo[] = [
      { id: 1, titulo: "Incrementar rentabilidad", perspectiva_id: 1, perspectiva_nombre: "Finanzas" },
      { id: 2, titulo: "Reducir costos operativos", perspectiva_id: 1, perspectiva_nombre: "Finanzas" },
      { id: 3, titulo: "Mejorar satisfacción del cliente", perspectiva_id: 2, perspectiva_nombre: "Cliente" },
      { id: 4, titulo: "Optimizar procesos internos", perspectiva_id: 3, perspectiva_nombre: "Procesos" },
      { id: 5, titulo: "Desarrollar competencias del personal", perspectiva_id: 4, perspectiva_nombre: "Aprendizaje" },
    ]

    setTimeout(() => {
      setPerspectivas(mockPerspectivas)
      setObjetivos(mockObjetivos)
      setFilteredObjetivos(mockObjetivos)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = objetivos.filter(
      (objetivo) =>
        objetivo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        objetivo.perspectiva_nombre?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredObjetivos(filtered)
  }, [searchTerm, objetivos])

  const handleEdit = (objetivo: Objetivo) => {
    setSelectedObjetivo(objetivo)
    setIsModalOpen(true)
  }

  const handleView = (objetivo: Objetivo) => {
    setSelectedObjetivo(objetivo)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este objetivo?")) {
      setObjetivos(objetivos.filter((objetivo) => objetivo.id !== id))
    }
  }

  const handleSave = (objetivoData: Omit<Objetivo, "id" | "perspectiva_nombre">) => {
    const perspectiva = perspectivas.find((p) => p.id === objetivoData.perspectiva_id)
    const objetivoWithPerspectiva = {
      ...objetivoData,
      perspectiva_nombre: perspectiva?.nombre,
    }

    if (selectedObjetivo) {
      setObjetivos(
        objetivos.map((objetivo) =>
          objetivo.id === selectedObjetivo.id ? { ...objetivoWithPerspectiva, id: selectedObjetivo.id } : objetivo,
        ),
      )
    } else {
      const newObjetivo = { ...objetivoWithPerspectiva, id: Date.now() }
      setObjetivos([...objetivos, newObjetivo])
    }
    setIsModalOpen(false)
    setSelectedObjetivo(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Objetivos</h1>
          <p className="text-gray-600">Administra los objetivos estratégicos por perspectiva</p>
        </div>
        <Button
          onClick={() => {
            setSelectedObjetivo(null)
            setIsModalOpen(true)
          }}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Objetivo
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar objetivos..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Título</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Perspectiva</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredObjetivos.map((objetivo) => (
                <tr key={objetivo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{objetivo.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{objetivo.titulo}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {objetivo.perspectiva_nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(objetivo)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(objetivo)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(objetivo.id)}
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

        {filteredObjetivos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron objetivos</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ObjetivoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedObjetivo(null)
        }}
        onSave={handleSave}
        objetivo={selectedObjetivo}
        perspectivas={perspectivas}
      />

      <ObjetivoDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedObjetivo(null)
        }}
        objetivo={selectedObjetivo}
      />
    </div>
  )
}
