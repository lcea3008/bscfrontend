"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye, Calendar, TrendingUp, Filter, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { RegistroHistoricoModal } from "./modals/RegistroHistoricoModal"
import { RegistroHistoricoDetailModal } from "./modals/RegistroHistoricoDetailModal"
import { registroHistoricoService, type RegistroHistorico } from "../../services/registroHistoricoService"
import { kpidata, type KPIData } from "../../services/kpidata"

interface RegistroHistoricoWithKpi extends RegistroHistorico {
  kpi_nombre?: string
  kpi_unidad?: string
}

// Interface para compatibilidad con modales existentes
interface RegistroHistoricoLegacy {
  id: number
  kpi_id: number
  kpi_nombre?: string
  kpi_unidad?: string
  valor: number
  fecha: string
}

export function RegistrosHistoricosTable() {
  const [registros, setRegistros] = useState<RegistroHistoricoWithKpi[]>([])
  const [kpis, setKpis] = useState<KPIData[]>([])
  const [filteredRegistros, setFilteredRegistros] = useState<RegistroHistoricoWithKpi[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedKpi, setSelectedKpi] = useState<number>(0)
  const [dateFilter, setDateFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroHistoricoWithKpi | null>(null)
  const [selectedRegistroModal, setSelectedRegistroModal] = useState<RegistroHistoricoLegacy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnlineMode, setIsOnlineMode] = useState(true)

  // Funciones de conversión entre formatos
  const convertToLegacy = (registro: RegistroHistoricoWithKpi): RegistroHistoricoLegacy => {
    return {
      id: registro.id,
      kpi_id: registro.kpi_id,
      kpi_nombre: registro.kpi_nombre,
      kpi_unidad: registro.kpi_unidad,
      valor: parseFloat(registro.valor) || 0,
      fecha: registro.fecha.split('T')[0] // Convertir formato de fecha
    }
  }

  const convertFromLegacy = (legacy: Omit<RegistroHistoricoLegacy, "id" | "kpi_nombre" | "kpi_unidad">): any => {
    return {
      kpi_id: legacy.kpi_id,
      valor: legacy.valor.toString(),
      fecha: `${legacy.fecha}T00:00:00.000Z`
    }
  }

  // Cargar datos reales del backend
  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log("🔄 Cargando registros históricos y KPIs...")
      
      // Cargar datos en paralelo
      const [registrosData, kpisData] = await Promise.all([
        registroHistoricoService.getRegistrosHistoricos(),
        kpidata.getKpis()
      ])
      
      // Enriquecer registros con información de KPIs
      const registrosEnriquecidos: RegistroHistoricoWithKpi[] = registrosData.map(registro => ({
        ...registro,
        kpi_nombre: kpisData.find(k => k.id === registro.kpi_id)?.nombre || `KPI ${registro.kpi_id}`,
        kpi_unidad: kpisData.find(k => k.id === registro.kpi_id)?.unidad || ""
      }))
      
      setRegistros(registrosEnriquecidos)
      setFilteredRegistros(registrosEnriquecidos)
      setKpis(kpisData)
      setIsOnlineMode(true)
      
      console.log("✅ Datos cargados exitosamente:", {
        registros: registrosEnriquecidos.length,
        kpis: kpisData.length
      })
      
    } catch (error: any) {
      console.error("❌ Error al cargar datos:", error)
      setError("Error de conexión. Mostrando datos de ejemplo.")
      setIsOnlineMode(false)
      
      // Usar datos mock como fallback
      const mockRegistrosData = await registroHistoricoService.getRegistrosHistoricosMock()
      const mockKpisData = kpidata.getMockKpis()
      
      const registrosEnriquecidos: RegistroHistoricoWithKpi[] = mockRegistrosData.map(registro => ({
        ...registro,
        kpi_nombre: mockKpisData.find((k: any) => k.id === registro.kpi_id)?.nombre || `KPI ${registro.kpi_id}`,
        kpi_unidad: mockKpisData.find((k: any) => k.id === registro.kpi_id)?.unidad || ""
      }))
      
      setRegistros(registrosEnriquecidos)
      setFilteredRegistros(registrosEnriquecidos)
      setKpis(mockKpisData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtrar registros
  useEffect(() => {
    let filtered = registros

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter((registro) => registro.kpi_nombre?.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filtro por KPI seleccionado
    if (selectedKpi > 0) {
      filtered = filtered.filter((registro) => registro.kpi_id === selectedKpi)
    }

    // Filtro por fecha
    if (dateFilter) {
      filtered = filtered.filter((registro) => registro.fecha >= dateFilter)
    }

    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

    setFilteredRegistros(filtered)
  }, [searchTerm, selectedKpi, dateFilter, registros])

  const handleEdit = (registro: RegistroHistoricoWithKpi) => {
    // Convertir al formato legacy para el modal
    const registroLegacy = convertToLegacy(registro)
    setSelectedRegistro(registro)
    setSelectedRegistroModal(registroLegacy)
    setIsModalOpen(true)
  }

  const handleViewDetails = (registro: RegistroHistoricoWithKpi) => {
    const registroLegacy = convertToLegacy(registro)
    setSelectedRegistroModal(registroLegacy)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este registro histórico?")) {
      try {
        await registroHistoricoService.deleteRegistroHistorico(id)
        setRegistros(registros.filter((registro) => registro.id !== id))
        console.log("✅ Registro histórico eliminado exitosamente")
      } catch (error) {
        console.error("❌ Error al eliminar registro histórico:", error)
        alert("Error al eliminar el registro histórico. Inténtalo de nuevo.")
      }
    }
  }

  const handleSave = async (registroData: any) => {
    try {
      let savedRegistro: RegistroHistorico
      
      // Convertir de formato legacy al nuevo formato
      const convertedData = convertFromLegacy(registroData)
      
      if (selectedRegistro) {
        // Actualizar registro existente
        savedRegistro = await registroHistoricoService.updateRegistroHistorico(selectedRegistro.id, convertedData)
      } else {
        // Crear nuevo registro
        savedRegistro = await registroHistoricoService.createRegistroHistorico(convertedData)
      }
      
      // Enriquecer con datos de KPI
      const registroEnriquecido: RegistroHistoricoWithKpi = {
        ...savedRegistro,
        kpi_nombre: kpis.find(k => k.id === savedRegistro.kpi_id)?.nombre || `KPI ${savedRegistro.kpi_id}`,
        kpi_unidad: kpis.find(k => k.id === savedRegistro.kpi_id)?.unidad || ""
      }
      
      if (selectedRegistro) {
        setRegistros(registros.map(registro => 
          registro.id === selectedRegistro.id ? registroEnriquecido : registro
        ))
      } else {
        setRegistros([...registros, registroEnriquecido])
      }
      
      setIsModalOpen(false)
      setSelectedRegistro(null)
      setSelectedRegistroModal(null)
      console.log("✅ Registro histórico guardado exitosamente")
    } catch (error: any) {
      console.error("❌ Error al guardar registro histórico:", error)
      alert(error.message || "Error al guardar el registro histórico. Inténtalo de nuevo.")
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedKpi(0)
    setDateFilter("")
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
          <h1 className="text-3xl font-bold text-gray-900">Registros Históricos</h1>
          <p className="text-gray-600">Historial de valores de KPIs a lo largo del tiempo</p>
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
              setSelectedRegistro(null)
              setSelectedRegistroModal(null)
              setIsModalOpen(true)
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Registro
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por KPI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* KPI Filter */}
          <select
            value={selectedKpi}
            onChange={(e) => setSelectedKpi(Number.parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value={0}>Todos los KPIs</option>
            {kpis.map((kpi) => (
              <option key={kpi.id} value={kpi.id}>
                {kpi.nombre}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10"
              placeholder="Desde fecha..."
            />
          </div>

          {/* Clear Filters */}
          <Button variant="outline" onClick={clearFilters} className="bg-transparent">
            Limpiar Filtros
          </Button>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
          <span>
            Mostrando {filteredRegistros.length} de {registros.length} registros
          </span>
          {(searchTerm || selectedKpi > 0 || dateFilter) && <span className="text-blue-600">• Filtros activos</span>}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">KPI</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Valor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tendencia</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRegistros.map((registro) => {
                // Calcular tendencia comparando con el registro anterior del mismo KPI
                const previousRecord = filteredRegistros
                  .filter((r) => r.kpi_id === registro.kpi_id && r.fecha < registro.fecha)
                  .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0]

                const currentValue = parseFloat(registro.valor) || 0
                const previousValue = previousRecord ? parseFloat(previousRecord.valor) || 0 : 0

                const trend = previousRecord
                  ? currentValue > previousValue
                    ? "up"
                    : currentValue < previousValue
                      ? "down"
                      : "stable"
                  : "stable"

                return (
                  <tr key={registro.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{registro.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{registro.kpi_nombre}</div>
                        <div className="text-xs text-gray-500">ID: {registro.kpi_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                         {registro.kpi_unidad} {registro.valor} 
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(registro.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {trend === "up" && <TrendingUp className="h-5 w-5 text-green-600" />}
                      {trend === "down" && <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />}
                      {trend === "stable" && <div className="h-5 w-5 bg-gray-400 rounded-full" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(registro)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(registro)}
                          className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(registro.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredRegistros.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay registros</h3>
            <p className="text-gray-500">
              {searchTerm || selectedKpi > 0 || dateFilter
                ? "No se encontraron registros con los filtros aplicados"
                : "No hay registros históricos disponibles"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <RegistroHistoricoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedRegistro(null)
          setSelectedRegistroModal(null)
        }}
        onSave={handleSave}
        registro={selectedRegistroModal}
        kpis={kpis}
      />

      <RegistroHistoricoDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedRegistroModal(null)
        }}
        registro={selectedRegistroModal}
      />
    </div>
  )
}
