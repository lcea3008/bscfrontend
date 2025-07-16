"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { IniciativaModal } from "./modals/IniciativaModal"
import { IniciativaDetailModal } from "./modals/IniciativaDetailModal"
import { iniciativasService, type Iniciativa } from "../../services/iniciativasService"
import { kpidata, type KPIData } from "../../services/kpidata"
import { usersService, type User } from "../../services/usersService"

interface IniciativaWithKpi extends Iniciativa {
  kpi_nombre?: string
  responsable_nombre?: string
}

// Interface para compatibilidad con modales existentes
interface IniciativaLegacy {
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

export function IniciativasTable() {
  const [iniciativas, setIniciativas] = useState<IniciativaWithKpi[]>([])
  const [kpis, setKpis] = useState<KPIData[]>([])
  const [responsables, setResponsables] = useState<User[]>([])
  const [filteredIniciativas, setFilteredIniciativas] = useState<IniciativaWithKpi[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedIniciativa, setSelectedIniciativa] = useState<IniciativaWithKpi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnlineMode, setIsOnlineMode] = useState(true)

  // Función de conversión para compatibilidad con modal de detalle
  const convertToLegacy = (iniciativa: IniciativaWithKpi): IniciativaLegacy => {
    const progresoToEstado = (progreso: number): "planificada" | "en_progreso" | "completada" | "cancelada" => {
      if (progreso === 0) return "planificada"
      if (progreso === 100) return "completada"
      return "en_progreso"
    }

    return {
      id: iniciativa.id,
      titulo: iniciativa.nombre,
      descripcion: iniciativa.descripcion,
      objetivo_id: iniciativa.kpi_id,
      objetivo_titulo: iniciativa.kpi_nombre,
      responsable: iniciativa.responsable_nombre || `Responsable ${iniciativa.responsable_id}`,
      fecha_inicio: iniciativa.fecha_inicio.split('T')[0],
      fecha_fin: iniciativa.fecha_fin.split('T')[0],
      estado: progresoToEstado(iniciativa.progreso),
      presupuesto: 50000
    }
  }

  // Cargar datos
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log("🔄 Cargando datos de iniciativas, KPIs y usuarios...")
      
      // Cargar datos en paralelo
      const [iniciativasData, kpisData, usuariosData] = await Promise.all([
        iniciativasService.getIniciativas(),
        kpidata.getKpis(),
        usersService.getUsers()
      ])
      
      // Enriquecer iniciativas con nombres de KPIs y responsables
      const iniciativasEnriquecidas: IniciativaWithKpi[] = iniciativasData.map(iniciativa => ({
        ...iniciativa,
        kpi_nombre: kpisData.find(k => k.id === iniciativa.kpi_id)?.nombre || `KPI ${iniciativa.kpi_id}`,
        responsable_nombre: usuariosData.find(u => u.id === iniciativa.responsable_id)?.nombre || `Usuario ${iniciativa.responsable_id}`
      }))
      
      setIniciativas(iniciativasEnriquecidas)
      setFilteredIniciativas(iniciativasEnriquecidas)
      setKpis(kpisData)
      setResponsables(usuariosData)
      setIsOnlineMode(true)
      
      console.log("✅ Datos cargados exitosamente:", {
        iniciativas: iniciativasEnriquecidas.length,
        kpis: kpisData.length,
        usuarios: usuariosData.length
      })
      
    } catch (error: any) {
      console.error("❌ Error al cargar datos:", error)
      setError("Error de conexión. Mostrando datos de ejemplo.")
      setIsOnlineMode(false)
      
      // Usar datos mock como fallback
      const mockData = await iniciativasService.getIniciativasMock()
      const mockKpis = kpidata.getMockKpis() // Usar método correcto para KPIs mock
      const mockUsuarios: User[] = [
        { id: 1, nombre: "Juan Pérez", email: "juan@example.com", role: "admin" },
        { id: 2, nombre: "María García", email: "maria@example.com", role: "user" },
        { id: 3, nombre: "Carlos López", email: "carlos@example.com", role: "user" }
      ]
      
      const iniciativasEnriquecidas: IniciativaWithKpi[] = mockData.map(iniciativa => ({
        ...iniciativa,
        kpi_nombre: mockKpis.find((k: any) => k.id === iniciativa.kpi_id)?.nombre || `KPI ${iniciativa.kpi_id}`,
        responsable_nombre: mockUsuarios.find(u => u.id === iniciativa.responsable_id)?.nombre || `Usuario ${iniciativa.responsable_id}`
      }))
      
      setIniciativas(iniciativasEnriquecidas)
      setFilteredIniciativas(iniciativasEnriquecidas)
      setKpis(mockKpis)
      setResponsables(mockUsuarios)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = iniciativas.filter(
      (iniciativa) =>
        iniciativa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iniciativa.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iniciativa.kpi_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iniciativa.responsable_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredIniciativas(filtered)
  }, [searchTerm, iniciativas])

  const getProgresoColor = (progreso: number) => {
    if (progreso >= 80) return "bg-green-100 text-green-800"
    if (progreso >= 50) return "bg-yellow-100 text-yellow-800"
    if (progreso >= 20) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES")
  }

  const handleEdit = (iniciativa: IniciativaWithKpi) => {
    setSelectedIniciativa(iniciativa)
    setIsModalOpen(true)
  }

  const handleView = (iniciativa: IniciativaWithKpi) => {
    setSelectedIniciativa(iniciativa)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta iniciativa?")) {
      try {
        await iniciativasService.deleteIniciativa(id)
        setIniciativas(iniciativas.filter((iniciativa) => iniciativa.id !== id))
        console.log("✅ Iniciativa eliminada exitosamente")
      } catch (error) {
        console.error("❌ Error al eliminar iniciativa:", error)
        alert("Error al eliminar la iniciativa. Inténtalo de nuevo.")
      }
    }
  }

  const handleSave = async (iniciativaData: any) => {
    try {
      let savedIniciativa: Iniciativa
      
      if (selectedIniciativa) {
        // Actualizar iniciativa existente
        savedIniciativa = await iniciativasService.updateIniciativa(selectedIniciativa.id, iniciativaData)
        
        // Enriquecer con datos adicionales
        const iniciativaEnriquecida: IniciativaWithKpi = {
          ...savedIniciativa,
          kpi_nombre: kpis.find(k => k.id === savedIniciativa.kpi_id)?.nombre || `KPI ${savedIniciativa.kpi_id}`,
          responsable_nombre: responsables.find(r => r.id === savedIniciativa.responsable_id)?.nombre || `Responsable ${savedIniciativa.responsable_id}`
        }
        
        setIniciativas(iniciativas.map(iniciativa => 
          iniciativa.id === selectedIniciativa.id ? iniciativaEnriquecida : iniciativa
        ))
      } else {
        // Crear nueva iniciativa
        savedIniciativa = await iniciativasService.createIniciativa(iniciativaData)
        
        // Enriquecer con datos adicionales
        const iniciativaEnriquecida: IniciativaWithKpi = {
          ...savedIniciativa,
          kpi_nombre: kpis.find(k => k.id === savedIniciativa.kpi_id)?.nombre || `KPI ${savedIniciativa.kpi_id}`,
          responsable_nombre: responsables.find(r => r.id === savedIniciativa.responsable_id)?.nombre || `Responsable ${savedIniciativa.responsable_id}`
        }
        
        setIniciativas([...iniciativas, iniciativaEnriquecida])
      }
      
      setIsModalOpen(false)
      setSelectedIniciativa(null)
      console.log("✅ Iniciativa guardada exitosamente")
    } catch (error: any) {
      console.error("❌ Error al guardar iniciativa:", error)
      alert(error.message || "Error al guardar la iniciativa. Inténtalo de nuevo.")
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Iniciativas</h1>
          <p className="text-gray-600">Administra las iniciativas estratégicas del proyecto</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadData}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button
            onClick={() => {
              setSelectedIniciativa(null)
              setIsModalOpen(true)
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Iniciativa
          </Button>
        </div>
      </div>

      {/* Error/Warning Banner */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-yellow-800 font-medium">Modo sin conexión</p>
            <p className="text-yellow-700 text-sm">{error}</p>
          </div>
          {!isOnlineMode && (
            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
              DATOS MOCK
            </span>
          )}
        </div>
      )}

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar iniciativas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredIniciativas.length} iniciativa{filteredIniciativas.length !== 1 ? 's' : ''} encontrada{filteredIniciativas.length !== 1 ? 's' : ''}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">KPI</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Responsable</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progreso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha Fin</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIniciativas.map((iniciativa) => (
                <tr key={iniciativa.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{iniciativa.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{iniciativa.nombre}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{iniciativa.descripcion}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{iniciativa.kpi_nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{iniciativa.responsable_nombre}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(iniciativa.progreso, 100)}%` }}
                        />
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProgresoColor(iniciativa.progreso)}`}>
                        {iniciativa.progreso}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatFecha(iniciativa.fecha_fin)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(iniciativa)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(iniciativa)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(iniciativa.id)}
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

        {filteredIniciativas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron iniciativas</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <IniciativaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedIniciativa(null)
        }}
        onSave={handleSave}
        iniciativa={selectedIniciativa}
        kpis={kpis}
        responsables={responsables}
      />

      <IniciativaDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedIniciativa(null)
        }}
        iniciativa={selectedIniciativa ? convertToLegacy(selectedIniciativa) : null}
      />
    </div>
  )
}
