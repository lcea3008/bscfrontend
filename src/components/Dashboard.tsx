"use client"

import { useState, useEffect } from "react"
import { KPICard } from "./dashboard/KPICard"
import { KPIChart } from "./dashboard/KPIChart"
import { IniciativasBarChart } from "./dashboard/IniciativasBarChart"
import { ObjetivosDonutChart } from "./dashboard/ObjetivosDonutChart"
import { RegistrosHistoricosLineChart } from "./dashboard/RegistrosHistoricosLineChart"
import { DollarSign, UserCheck, Cog, GraduationCap } from "lucide-react"
import { kpidata, type KPIData as BackendKPIData } from "../services/kpidata"
import { iniciativasService, type Iniciativa } from "../services/iniciativasService"
import { objetivosService, type Objetivo } from "../services/objetivosService"
import { registroHistoricoService, type RegistroHistorico } from "../services/registroHistoricoService"

interface KPIData {
  id: string
  title: string
  value: string
  target: string
  percentage: number
  status: "success" | "warning" | "danger"
  trend: "up" | "down" | "stable"
  perspective: string
}

interface UserData {
  nombre: string // Cambiar 'name' por 'nombre'
  role: string
  avatar?: string
}

// Mock data - esto se reemplazará con datos del backend
const mockKPIs: KPIData[] = [
  {
    id: "1",
    title: "Ingresos Totales",
    value: "$2.4M",
    target: "$2.8M",
    percentage: 85,
    status: "warning",
    trend: "up",
    perspective: "Finanzas",
  },
  {
    id: "2",
    title: "Margen de Utilidad",
    value: "18.5%",
    target: "20%",
    percentage: 92,
    status: "success",
    trend: "up",
    perspective: "Finanzas",
  },
  {
    id: "3",
    title: "Satisfacción Cliente",
    value: "4.2/5",
    target: "4.5/5",
    percentage: 93,
    status: "success",
    trend: "stable",
    perspective: "Cliente",
  },
  {
    id: "4",
    title: "Retención Clientes",
    value: "78%",
    target: "85%",
    percentage: 78,
    status: "warning",
    trend: "down",
    perspective: "Cliente",
  },
  {
    id: "5",
    title: "Tiempo de Proceso",
    value: "2.3 días",
    target: "2.0 días",
    percentage: 65,
    status: "danger",
    trend: "down",
    perspective: "Procesos",
  },
  {
    id: "6",
    title: "Calidad Procesos",
    value: "94%",
    target: "95%",
    percentage: 99,
    status: "success",
    trend: "up",
    perspective: "Procesos",
  },
  {
    id: "7",
    title: "Capacitación Staff",
    value: "85%",
    target: "90%",
    percentage: 94,
    status: "success",
    trend: "up",
    perspective: "Aprendizaje",
  },
  {
    id: "8",
    title: "Innovación",
    value: "12 proyectos",
    target: "15 proyectos",
    percentage: 80,
    status: "warning",
    trend: "stable",
    perspective: "Aprendizaje",
  },
]

const perspectives = [
  { name: "Finanzas", icon: DollarSign, color: "text-green-600" },
  { name: "Cliente", icon: UserCheck, color: "text-blue-600" },
  { name: "Procesos", icon: Cog, color: "text-purple-600" },
  { name: "Aprendizaje", icon: GraduationCap, color: "text-orange-600" },
]

// Función para convertir KPI del backend al formato del dashboard
const convertBackendKPIToCardFormat = (backendKPI: BackendKPIData): KPIData => {
  // Mapear objetivo_id a perspectiva
  const getPerspectivaByObjetivoId = (objetivo_id: number): string => {
    switch (objetivo_id) {
      case 1: return "Finanzas"
      case 2: return "Cliente"
      case 3: return "Procesos"
      case 4: return "Aprendizaje"
      default: return "Otros"
    }
  }

  return {
    id: backendKPI.id.toString(),
    title: backendKPI.nombre,
    value: `${backendKPI.estado_actual} ${backendKPI.unidad}`,
    target: `${backendKPI.meta} ${backendKPI.unidad}`,
    percentage: backendKPI.percentage || 0,
    status: backendKPI.status || "warning",
    trend: backendKPI.trend || "stable",
    perspective: getPerspectivaByObjetivoId(backendKPI.objetivo_id)
  }
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIData[]>([])
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([])
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [registrosHistoricos, setRegistrosHistoricos] = useState<RegistroHistorico[]>([])
  const [user] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log("🔄 Cargando datos desde el backend...")
        
        // Cargar todos los datos en paralelo
        const [backendKPIs, backendIniciativas, backendObjetivos, backendRegistros] = await Promise.all([
          kpidata.getKpis(),
          iniciativasService.getIniciativas(),
          objetivosService.getObjetivos(),
          registroHistoricoService.getRegistrosHistoricos()
        ])
        
        // Convertir KPIs al formato que espera el dashboard
        const convertedKPIs = backendKPIs.map(convertBackendKPIToCardFormat)
        
        setKpis(convertedKPIs)
        setIniciativas(backendIniciativas)
        setObjetivos(backendObjetivos)
        setRegistrosHistoricos(backendRegistros)
        
        console.log("✅ Datos cargados exitosamente:", {
          kpis: convertedKPIs.length,
          iniciativas: backendIniciativas.length,
          objetivos: backendObjetivos.length,
          registrosHistoricos: backendRegistros.length
        })
        
      } catch (error: any) {
        console.error("❌ Error al obtener datos del backend:", error)
        setError("No se pudieron cargar los datos desde el servidor")
        
        // En caso de error, usar datos mock como fallback
        console.warn("🔄 Usando datos mock como fallback...")
        setKpis(mockKPIs)
        setIniciativas([]) // Datos vacíos en caso de error
        setObjetivos([])
        setRegistrosHistoricos([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getKPIsByPerspective = (perspective: string) => {
    return kpis.filter((kpi) => kpi.perspective === perspective)
  }

  const getKPIStats = () => {
    const total = kpis.length
    const success = kpis.filter((kpi) => kpi.status === "success").length
    const warning = kpis.filter((kpi) => kpi.status === "warning").length
    const danger = kpis.filter((kpi) => kpi.status === "danger").length

    return { total, success, warning, danger }
  }

  const stats = getKPIStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">        {/* Dashboard Content - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Error message if any */}
          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Aviso</h3>
                  <p className="text-yellow-600 mt-1">{error}. Mostrando datos de ejemplo.</p>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Principal</h1>
          <p className="text-gray-600">
            Monitoreo en tiempo real de indicadores clave de rendimiento
            {user && ` - Bienvenido, ${user.nombre}`}
          </p>
        </div>

        {/* KPI Summary Chart */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen General de KPIs</h2>
            <KPIChart stats={stats} />
          </div>
        </div>

        {/* Iniciativas Bar Chart */}
        {iniciativas.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <IniciativasBarChart iniciativas={iniciativas} />
            </div>
          </div>
        )}

        {/* Objetivos Donut Chart */}
        {objetivos.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ObjetivosDonutChart objetivos={objetivos} />
            </div>
          </div>
        )}

        {/* Registros Históricos Line Chart */}
        {registrosHistoricos.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <RegistrosHistoricosLineChart registros={registrosHistoricos} />
            </div>
          </div>
        )}

        {/* KPIs by Perspective */}
        <div className="space-y-8">
          {perspectives.map((perspective) => {
            const perspectiveKpis = getKPIsByPerspective(perspective.name)
            const Icon = perspective.icon

            if (perspectiveKpis.length === 0) return null

            return (
              <div key={perspective.name} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gray-100 rounded-lg mr-4">
                    <Icon className={`h-6 w-6 ${perspective.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Perspectiva: {perspective.name}</h2>
                    <p className="text-gray-600">Indicadores de {perspective.name.toLowerCase()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {perspectiveKpis.map((kpi) => (
                    <KPICard key={kpi.id} kpi={kpi} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer spacing */}
        <div className="h-8" />
      </main>
    </div>
    
  )
}
