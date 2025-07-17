"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ObjetivoModal } from "./modals/ObjetivoModal"
import { ObjetivoDetailModal } from "./modals/ObjetivoDetailModal"
import { objetivosService, type CreateObjetivoData, type UpdateObjetivoData } from "../../services/objetivosService"
import { perspectivasService, type Perspectiva } from "../../services/perspectivasService"

// Interfaz para objetivo con perspectiva anidada (como viene del backend)
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

export function ObjetivosTable() {
  const [objetivos, setObjetivos] = useState<ObjetivoWithPerspectiva[]>([])
  const [perspectivas, setPerspectivas] = useState<Perspectiva[]>([])
  const [filteredObjetivos, setFilteredObjetivos] = useState<ObjetivoWithPerspectiva[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedObjetivo, setSelectedObjetivo] = useState<ObjetivoWithPerspectiva | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log("🔄 Cargando objetivos y perspectivas...")
      
      // Intentar cargar datos reales, pero si falla usar mock
      try {
        const [objetivosData, perspectivasData] = await Promise.all([
          objetivosService.getObjetivos(),
          perspectivasService.getPerspectivas()
        ])

        // Los objetivos ya vienen con la perspectiva anidada desde el backend
        const objetivosWithPerspectivas = objetivosData.map(objetivo => ({
          id: objetivo.id,
          titulo: objetivo.titulo,
          perspectiva_id: objetivo.perspectiva_id,
          perspectiva: objetivo.perspectiva || {
            id: objetivo.perspectiva_id,
            nombre: 'Sin perspectiva',
            descripcion: ''
          }
        })) as ObjetivoWithPerspectiva[]

        setPerspectivas(perspectivasData)
        setObjetivos(objetivosWithPerspectivas)
        setFilteredObjetivos(objetivosWithPerspectivas)
        
        console.log("✅ Datos cargados exitosamente:", {
          objetivos: objetivosWithPerspectivas.length,
          perspectivas: perspectivasData.length
        })
      } catch (error: any) {
        console.error("❌ Error al cargar datos desde API, usando datos mock:", error)
        setError("No se pudo conectar al servidor. Mostrando datos de ejemplo.")
        loadMockData()
      }
    } catch (error: any) {
      console.error("❌ Error general:", error)
      setError("Error al cargar los datos")
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    console.log("📦 Cargando datos mock...")
    
    const mockPerspectivas: Perspectiva[] = [
      { id: 1, nombre: "Financiera", descripcion: "Perspectiva financiera" },
      { id: 2, nombre: "Cliente", descripcion: "Perspectiva del cliente" },
      { id: 3, nombre: "Procesos", descripcion: "Perspectiva de procesos internos" },
      { id: 4, nombre: "Aprendizaje", descripcion: "Perspectiva de aprendizaje y crecimiento" },
    ]

    const mockObjetivos: ObjetivoWithPerspectiva[] = [
      { 
        id: 1, 
        titulo: "Incrementar los ingresos en un 25% anual", 
        perspectiva_id: 1, 
        perspectiva: { id: 1, nombre: "Financiera", descripcion: "Perspectiva financiera" }
      },
      { 
        id: 2, 
        titulo: "Mejorar la satisfacción del cliente al 90%", 
        perspectiva_id: 2, 
        perspectiva: { id: 2, nombre: "Cliente", descripcion: "Perspectiva del cliente" }
      },
      { 
        id: 3, 
        titulo: "Reducir tiempo de procesamiento en 30%", 
        perspectiva_id: 3, 
        perspectiva: { id: 3, nombre: "Procesos", descripcion: "Perspectiva de procesos internos" }
      },
      { 
        id: 4, 
        titulo: "Capacitar al 100% del personal en nuevas tecnologías", 
        perspectiva_id: 4, 
        perspectiva: { id: 4, nombre: "Aprendizaje", descripcion: "Perspectiva de aprendizaje y crecimiento" }
      },
    ]

    setPerspectivas(mockPerspectivas)
    setObjetivos(mockObjetivos)
    setFilteredObjetivos(mockObjetivos)
    
    console.log("✅ Datos mock cargados exitosamente")
  }

  useEffect(() => {
    const filtered = objetivos.filter(
      (objetivo) =>
        objetivo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        objetivo.perspectiva.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredObjetivos(filtered)
  }, [searchTerm, objetivos])

  const handleEdit = (objetivo: ObjetivoWithPerspectiva) => {
    setSelectedObjetivo(objetivo)
    setIsModalOpen(true)
  }

  const handleView = (objetivo: ObjetivoWithPerspectiva) => {
    setSelectedObjetivo(objetivo)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este objetivo?")) {
      try {
        await objetivosService.deleteObjetivo(id)
        setObjetivos(objetivos.filter((objetivo) => objetivo.id !== id))
        console.log("✅ Objetivo eliminado exitosamente")
      } catch (error: any) {
        console.error("❌ Error al eliminar objetivo:", error)
        alert("Error al eliminar el objetivo: " + error.message)
      }
    }
  }

  const handleSave = async (objetivoData: CreateObjetivoData | UpdateObjetivoData) => {
    try {
      console.log("📤 Datos recibidos del modal:", objetivoData)
      console.log("📤 Datos a enviar al backend:", {
        nombre: objetivoData.nombre,
        perspectivaId: objetivoData.perspectivaId
      })

      if (selectedObjetivo) {
        // Actualizar objetivo existente
        console.log(`🔄 Actualizando objetivo ID: ${selectedObjetivo.id}`)
        await objetivosService.updateObjetivo(selectedObjetivo.id, objetivoData)
      } else {
        // Crear nuevo objetivo
        console.log("🔄 Creando nuevo objetivo")
        await objetivosService.createObjetivo(objetivoData as CreateObjetivoData)
      }
      
      // Recargar los datos para obtener la estructura completa con perspectiva anidada
      await loadData()
      
      setIsModalOpen(false)
      setSelectedObjetivo(null)
      console.log("✅ Objetivo guardado exitosamente")
    } catch (error: any) {
      console.error("❌ Error al guardar objetivo:", error)
      alert("Error al guardar el objetivo: " + error.message)
    }
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
      {/* Error message if any */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Aviso</h3>
              <p className="text-yellow-600 mt-1">{error}</p>
            </div>
            <Button
              onClick={loadData}
              variant="outline"
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Objetivos</h1>
          <p className="text-gray-600">Administra los objetivos estratégicos por perspectiva</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadData}
            variant="outline"
            className="border-gray-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
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
                      {objetivo.perspectiva.nombre}
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
