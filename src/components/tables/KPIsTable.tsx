"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Alert } from "../ui/alert"
import { KPIModal } from "./modals/KPIModal"
import { KPIDetailModal } from "./modals/KPIDetailModal"
import { kpidata, type KPIData } from "../../services/kpidata"
import { objetivosService, type Objetivo } from "../../services/objetivosService"

// Extender KPIData para incluir objetivo_titulo
interface KPIWithObjetivo extends KPIData {
  objetivo_titulo?: string
}

export function KPIsTable() {
  const [kpis, setKpis] = useState<KPIWithObjetivo[]>([])
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [filteredKpis, setFilteredKpis] = useState<KPIWithObjetivo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedKpi, setSelectedKpi] = useState<KPIWithObjetivo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Función para cargar datos reales del backend
  const loadData = async () => {
    try {
      setLoading(true)
      setConnectionError(null)
      setIsUsingMockData(false)
      
      console.log("🚀 Iniciando carga de datos del backend...")
      
      // Cargar KPIs y objetivos en paralelo
      const [kpisResponse, objetivosResponse] = await Promise.all([
        kpidata.getKpis(),
        objetivosService.getObjetivos()
      ])
      
      console.log("✅ Datos cargados exitosamente del backend")
      console.log("📊 KPIs recibidos:", kpisResponse)
      console.log("🎯 Objetivos recibidos:", objetivosResponse)
      
      // Transformar los datos y agregar información del objetivo
      const kpisWithObjetivos = kpisResponse.map(kpi => ({
        ...kpi,
        objetivo_titulo: objetivosResponse.find(obj => obj.id === kpi.objetivo_id)?.titulo || "Sin objetivo"
      }))
      
      console.log("🔄 KPIs transformados:", kpisWithObjetivos)
      
      setKpis(kpisWithObjetivos)
      setObjetivos(objetivosResponse)
      setFilteredKpis(kpisWithObjetivos)
      
      console.log("✅ Estados actualizados correctamente")
      
    } catch (error) {
      console.error("❌ Error al cargar datos del backend:", error)
      setConnectionError("No se pudo conectar con el servidor. Mostrando datos de ejemplo.")
      setIsUsingMockData(true)
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar datos mock como fallback
  const loadMockData = () => {
    console.log("Cargando datos mock...")
    
    const mockObjetivos: Objetivo[] = [
      { id: 1, titulo: "Incrementar rentabilidad", perspectiva_id: 1 },
      { id: 2, titulo: "Reducir costos operativos", perspectiva_id: 2 },
      { id: 3, titulo: "Mejorar satisfacción del cliente", perspectiva_id: 3 },
      { id: 4, titulo: "Optimizar procesos internos", perspectiva_id: 4 },
    ]

    // Función para cargar datos mock como fallback
    const mockKpis: KPIWithObjetivo[] = kpidata.getMockKpis().map(kpi => ({
      ...kpi,
      objetivo_titulo: mockObjetivos.find(obj => obj.id === kpi.objetivo_id)?.titulo || "Sin objetivo"
    }))

    setObjetivos(mockObjetivos)
    setKpis(mockKpis)
    setFilteredKpis(mockKpis)
  }

  // Función para actualizar datos
  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData()
  }, [])

  // Debug: Monitorear cambios en los estados
  useEffect(() => {
    console.log("🔍 Estado actual de KPIs:", {
      totalKpis: kpis.length,
      filteredKpis: filteredKpis.length,
      loading,
      isUsingMockData,
      connectionError,
      searchTerm
    })
  }, [kpis, filteredKpis, loading, isUsingMockData, connectionError, searchTerm])

  // Filtrar KPIs cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = kpis.filter(
      (kpi) =>
        kpi.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kpi.objetivo_titulo?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredKpis(filtered)
  }, [searchTerm, kpis])

  const getKpiStatus = (kpi: KPIWithObjetivo) => {
    if (kpi.status) {
      switch (kpi.status) {
        case "success":
          return { status: "success", color: "text-green-600", bg: "bg-green-100" }
        case "warning":
          return { status: "warning", color: "text-yellow-600", bg: "bg-yellow-100" }
        case "danger":
          return { status: "danger", color: "text-red-600", bg: "bg-red-100" }
        default:
          return { status: "neutral", color: "text-gray-600", bg: "bg-gray-100" }
      }
    }
    
    // Fallback para calcular status manualmente
    const actual = parseFloat(kpi.estado_actual) || 0
    const meta = parseFloat(kpi.meta) || 1
    const percentage = (actual / meta) * 100
    
    if (percentage >= 90) return { status: "success", color: "text-green-600", bg: "bg-green-100" }
    if (percentage >= 70) return { status: "warning", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { status: "danger", color: "text-red-600", bg: "bg-red-100" }
  }

  const handleEdit = (kpi: KPIWithObjetivo) => {
    setSelectedKpi(kpi)
    setIsModalOpen(true)
  }

  const handleView = (kpi: KPIWithObjetivo) => {
    setSelectedKpi(kpi)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este KPI?")) {
      try {
        if (!isUsingMockData) {
          await kpidata.deleteKpi(id)
        }
        setKpis(kpis.filter((kpi) => kpi.id !== id))
        console.log("KPI eliminado exitosamente")
      } catch (error) {
        console.error("Error al eliminar KPI:", error)
        alert("Error al eliminar el KPI. Inténtalo de nuevo.")
      }
    }
  }

  const handleSave = async (kpiData: any) => {
    try {
      console.log("🚀 Iniciando guardado de KPI:", kpiData)
      
      // Convertir los datos del modal (numbers) al formato del backend (strings)
      const backendData = {
        nombre: kpiData.nombre,
        meta: kpiData.meta.toString(),
        unidad: kpiData.unidad,
        objetivo_id: kpiData.objetivo_id,
        estado_actual: kpiData.estado_actual.toString()
      }
      
      console.log("📤 Datos convertidos para backend:", backendData)
      
      if (!isUsingMockData) {
        if (selectedKpi) {
          console.log("✏️ Actualizando KPI existente con ID:", selectedKpi.id)
          // Actualizar KPI existente
          const updatedKpi = await kpidata.updateKpi(selectedKpi.id, backendData)
          const kpiWithObjetivo = {
            ...updatedKpi,
            objetivo_titulo: objetivos.find(obj => obj.id === updatedKpi.objetivo_id)?.titulo || "Sin objetivo"
          }
          setKpis(kpis.map(kpi => kpi.id === selectedKpi.id ? kpiWithObjetivo : kpi))
          console.log("✅ KPI actualizado correctamente")
        } else {
          console.log("➕ Creando nuevo KPI")
          // Crear nuevo KPI
          const newKpi = await kpidata.createKpi(backendData)
          const kpiWithObjetivo = {
            ...newKpi,
            objetivo_titulo: objetivos.find(obj => obj.id === newKpi.objetivo_id)?.titulo || "Sin objetivo"
          }
          setKpis([...kpis, kpiWithObjetivo])
          console.log("✅ KPI creado correctamente:", newKpi)
        }
      } else {
        console.log("🔧 Modo mock: simulando guardado")
        // Modo mock: simular guardado con datos convertidos a string
        const mockData = {
          ...backendData,
          id: selectedKpi?.id || Date.now(),
          fecha_actualizacion: new Date().toISOString(),
          objetivo_titulo: objetivos.find(obj => obj.id === backendData.objetivo_id)?.titulo || "Sin objetivo"
        }
        
        if (selectedKpi) {
          setKpis(kpis.map(kpi => kpi.id === selectedKpi.id ? mockData : kpi))
          console.log("✅ KPI mock actualizado")
        } else {
          setKpis([...kpis, mockData])
          console.log("✅ KPI mock creado")
        }
      }
      
      // Cerrar modal y limpiar selección
      setIsModalOpen(false)
      setSelectedKpi(null)
      
      // Mostrar mensaje de éxito
      const action = selectedKpi ? "actualizado" : "creado"
      const successMessage = `✅ KPI "${backendData.nombre}" ${action} exitosamente`
      console.log(successMessage)
      
      // Opcional: mostrar notificación toast (si tienes sistema de notificaciones)
      // toast.success(successMessage)
      
    } catch (error) {
      console.error("❌ Error al guardar KPI:", error)
      const errorMessage = selectedKpi ? 
        "Error al actualizar el KPI. Inténtalo de nuevo." : 
        "Error al crear el KPI. Inténtalo de nuevo."
      alert(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-gray-600">Cargando KPIs...</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Alerta de conexión */}
      {connectionError && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <div className="ml-2">
            <h4 className="text-yellow-800 font-medium">Advertencia de Conexión</h4>
            <p className="text-yellow-700 text-sm">{connectionError}</p>
          </div>
        </Alert>
      )}

      {/* Indicador de datos mock */}
      {isUsingMockData && (
        <Alert className="border-blue-200 bg-blue-50">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <span className="text-blue-800 text-sm font-medium">
              Mostrando datos de ejemplo (sin conexión al servidor)
            </span>
          </div>
        </Alert>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de KPIs</h1>
          <p className="text-gray-600">Administra los indicadores clave de rendimiento</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Button
            onClick={() => {
              console.log("🆕 Abriendo modal para nuevo KPI")
              setSelectedKpi(null)
              setIsModalOpen(true)
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={refreshing}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo KPI
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar KPIs..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Objetivo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actual</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Meta</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredKpis.map((kpi) => {
                const status = getKpiStatus(kpi)
                return (
                  <tr key={kpi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">#{kpi.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{kpi.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{kpi.objetivo_titulo}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {kpi.estado_actual} {kpi.unidad}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {kpi.meta} {kpi.unidad}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.color}`}
                      >
                        {kpi.percentage || Math.round((parseFloat(kpi.estado_actual) / parseFloat(kpi.meta)) * 100)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(kpi)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(kpi)}
                          className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                          disabled={isUsingMockData}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(kpi.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          disabled={isUsingMockData}
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

        {filteredKpis.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">
              {searchTerm ? 
                `No se encontraron KPIs que coincidan con "${searchTerm}"` : 
                "No hay KPIs disponibles"
              }
            </p>
            {!isUsingMockData && (
              <p className="text-sm text-gray-400">
                {connectionError ? "Problema de conexión con el servidor" : "Conectado al servidor"}
              </p>
            )}
            <div className="mt-4 text-xs text-gray-400">
              <p>Total KPIs: {kpis.length} | Filtrados: {filteredKpis.length}</p>
              <p>Estado: {isUsingMockData ? "Datos Mock" : "Datos Reales"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <KPIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedKpi(null)
        }}
        onSave={handleSave}
        kpi={selectedKpi ? {
          ...selectedKpi,
          meta: parseFloat(selectedKpi.meta),
          estado_actual: parseFloat(selectedKpi.estado_actual)
        } : null}
        objetivos={objetivos}
      />

      <KPIDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedKpi(null)
        }}
        kpi={selectedKpi ? {
          ...selectedKpi,
          meta: parseFloat(selectedKpi.meta),
          estado_actual: parseFloat(selectedKpi.estado_actual)
        } : null}
      />
    </div>
  )
}
