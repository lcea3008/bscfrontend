"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { KPIModal } from "./modals/KPIModal"
import { KPIDetailModal } from "./modals/KPIDetailModal"

interface KPI {
  id: number
  nombre: string
  meta: number
  unidad: string
  objetivo_id: number
  objetivo_titulo?: string
  estado_actual: number
  fecha_actualizacion: string
}

interface Objetivo {
  id: number
  titulo: string
}

export function KPIsTable() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [filteredKpis, setFilteredKpis] = useState<KPI[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockObjetivos: Objetivo[] = [
      { id: 1, titulo: "Incrementar rentabilidad" },
      { id: 2, titulo: "Reducir costos operativos" },
      { id: 3, titulo: "Mejorar satisfacción del cliente" },
      { id: 4, titulo: "Optimizar procesos internos" },
    ]

    const mockKpis: KPI[] = [
      {
        id: 1,
        nombre: "ROI Anual",
        meta: 15.0,
        unidad: "%",
        objetivo_id: 1,
        objetivo_titulo: "Incrementar rentabilidad",
        estado_actual: 12.5,
        fecha_actualizacion: "2024-01-15",
      },
      {
        id: 2,
        nombre: "Reducción de Costos",
        meta: 10.0,
        unidad: "%",
        objetivo_id: 2,
        objetivo_titulo: "Reducir costos operativos",
        estado_actual: 8.2,
        fecha_actualizacion: "2024-01-14",
      },
      {
        id: 3,
        nombre: "Satisfacción Cliente",
        meta: 4.5,
        unidad: "puntos",
        objetivo_id: 3,
        objetivo_titulo: "Mejorar satisfacción del cliente",
        estado_actual: 4.2,
        fecha_actualizacion: "2024-01-13",
      },
      {
        id: 4,
        nombre: "Tiempo de Proceso",
        meta: 2.0,
        unidad: "veces",
        objetivo_id: 4,
        objetivo_titulo: "Optimizar procesos internos",
        estado_actual: 2.3,
        fecha_actualizacion: "2024-01-12",
      },
    ]

    setTimeout(() => {
      setObjetivos(mockObjetivos)
      setKpis(mockKpis)
      setFilteredKpis(mockKpis)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = kpis.filter(
      (kpi) =>
        kpi.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kpi.objetivo_titulo?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredKpis(filtered)
  }, [searchTerm, kpis])

  const getKpiStatus = (kpi: KPI) => {
    const percentage = (kpi.estado_actual / kpi.meta) * 100
    if (percentage >= 90) return { status: "success", color: "text-green-600", bg: "bg-green-100" }
    if (percentage >= 70) return { status: "warning", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { status: "danger", color: "text-red-600", bg: "bg-red-100" }
  }

  const getTrend = (kpi: KPI) => {
    // Simulamos tendencia basada en si está por encima o debajo de la meta
    return kpi.estado_actual >= kpi.meta ? "up" : "down"
  }

  const handleEdit = (kpi: KPI) => {
    setSelectedKpi(kpi)
    setIsModalOpen(true)
  }

  const handleView = (kpi: KPI) => {
    setSelectedKpi(kpi)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este KPI?")) {
      setKpis(kpis.filter((kpi) => kpi.id !== id))
    }
  }

  const handleSave = (kpiData: Omit<KPI, "id" | "objetivo_titulo" | "fecha_actualizacion">) => {
    const objetivo = objetivos.find((o) => o.id === kpiData.objetivo_id)
    const kpiWithObjetivo = {
      ...kpiData,
      objetivo_titulo: objetivo?.titulo,
      fecha_actualizacion: new Date().toISOString().split("T")[0],
    }

    if (selectedKpi) {
      setKpis(kpis.map((kpi) => (kpi.id === selectedKpi.id ? { ...kpiWithObjetivo, id: selectedKpi.id } : kpi)))
    } else {
      const newKpi = { ...kpiWithObjetivo, id: Date.now() }
      setKpis([...kpis, newKpi])
    }
    setIsModalOpen(false)
    setSelectedKpi(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de KPIs</h1>
          <p className="text-gray-600">Administra los indicadores clave de rendimiento</p>
        </div>
        <Button
          onClick={() => {
            setSelectedKpi(null)
            setIsModalOpen(true)
          }}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo KPI
        </Button>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Objetivo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actual</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Meta</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tendencia</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredKpis.map((kpi) => {
                const status = getKpiStatus(kpi)
                const trend = getTrend(kpi)
                return (
                  <tr key={kpi.id} className="hover:bg-gray-50 transition-colors">
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
                        {Math.round((kpi.estado_actual / kpi.meta) * 100)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {trend === "up" ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
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
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(kpi.id)}
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

        {filteredKpis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron KPIs</p>
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
        kpi={selectedKpi}
        objetivos={objetivos}
      />

      <KPIDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedKpi(null)
        }}
        kpi={selectedKpi}
      />
    </div>
  )
}
