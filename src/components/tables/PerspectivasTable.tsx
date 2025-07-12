"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { PerspectivaModal } from "./modals/PerspectivaModal"
import { PerspectivaDetailModal } from "./modals/PerspectivaDetailModal"
import { perspectivasService, type Perspectiva, type CreatePerspectivaData, type UpdatePerspectivaData } from "../../services/perspectivasService"

export function PerspectivasTable() {
  const [perspectivas, setPerspectivas] = useState<Perspectiva[]>([])
  const [filteredPerspectivas, setFilteredPerspectivas] = useState<Perspectiva[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPerspectiva, setSelectedPerspectiva] = useState<Perspectiva | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar perspectivas desde la API
  useEffect(() => {
    loadPerspectivas()
  }, [])

  const loadPerspectivas = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedPerspectivas = await perspectivasService.getPerspectivas()
      setPerspectivas(fetchedPerspectivas)
      setFilteredPerspectivas(fetchedPerspectivas)
    } catch (err: any) {
      console.error("Error al cargar perspectivas:", err)
      setError(err.message || "Error al cargar perspectivas")
      // En caso de error, usar datos mock
      const mockPerspectivas = perspectivasService.getMockPerspectivas()
      setPerspectivas(mockPerspectivas)
      setFilteredPerspectivas(mockPerspectivas)
    } finally {
      setLoading(false)
    }
  }

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
      try {
        setLoading(true)
        await perspectivasService.deletePerspectiva(id)
        // Recargar la lista de perspectivas después de eliminar
        await loadPerspectivas()
      } catch (err: any) {
        console.error("Error al eliminar perspectiva:", err)
        setError(err.message || "Error al eliminar perspectiva")
        // Si falla la eliminación en el servidor, quitar localmente para UX
        setPerspectivas(perspectivas.filter((perspectiva) => perspectiva.id !== id))
        setFilteredPerspectivas(filteredPerspectivas.filter((perspectiva) => perspectiva.id !== id))
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSave = async (perspectivaData: Omit<Perspectiva, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      
      if (selectedPerspectiva) {
        // Editar perspectiva existente
        const updateData: UpdatePerspectivaData = {
          nombre: perspectivaData.nombre,
          descripcion: perspectivaData.descripcion
        }
        console.log("📝 Actualizando perspectiva:", updateData)
        await perspectivasService.updatePerspectiva(selectedPerspectiva.id, updateData)
      } else {
        // Crear nueva perspectiva
        const createData: CreatePerspectivaData = {
          nombre: perspectivaData.nombre,
          descripcion: perspectivaData.descripcion
        }
        console.log("✨ Creando perspectiva con formato backend:", createData)
        await perspectivasService.createPerspectiva(createData)
      }
      
      // Recargar la lista de perspectivas
      await loadPerspectivas()
      setIsModalOpen(false)
      setSelectedPerspectiva(null)
    } catch (err: any) {
      console.error("Error al guardar perspectiva:", err)
      setError(err.message || "Error al guardar perspectiva")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando perspectivas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 underline mt-2"
          >
            Cerrar
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Perspectivas</h1>
          <p className="text-gray-600">Administra las perspectivas del Balanced Scorecard</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadPerspectivas}
            variant="outline"
            disabled={loading}
            className="text-gray-600 hover:text-gray-800"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
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
