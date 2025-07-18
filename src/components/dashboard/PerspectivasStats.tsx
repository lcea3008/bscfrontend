"use client"

import { DollarSign, UserCheck, Cog, GraduationCap, Leaf, Building, Shield, Lightbulb } from "lucide-react"

// Interfaces simplificadas y consistentes
interface KPIData {
  id: string
  title: string
  value: string
  target: string
  percentage: number
  status: "success" | "warning" | "danger"
  trend: "up" | "down" | "stable"
  perspective: string
  objetivo_id?: number
}

interface ObjetivoData {
  id: number
  titulo: string
  perspectiva_id: number
  perspectiva?: {
    id: number
    nombre: string
    descripcion: string
  }
}

interface IniciativaData {
  id: number
  nombre: string
  descripcion: string
  progreso: number
  fecha_inicio: string
  fecha_fin: string
  responsable_id: number
  kpi_id: number
}

interface PerspectivaBackend {
  id: number
  nombre: string
  descripcion?: string
}

interface PerspectivasStatsProps {
  kpis: KPIData[]
  objetivos: ObjetivoData[]
  iniciativas: IniciativaData[]
  perspectivas: PerspectivaBackend[] // Nuevas perspectivas dinámicas
}

export function PerspectivasStats({ kpis, objetivos, iniciativas, perspectivas }: PerspectivasStatsProps) {
  
  // Función simplificada para obtener ícono y colores
  const getPerspectivaVisuals = (nombre: string, id: number) => {
    const normalized = nombre.toLowerCase()
    
    // Mapeo simplificado por palabras clave
    if (normalized.includes("finanz") || normalized.includes("económic")) {
      return {
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-500",
        lightBg: "bg-green-50",
        borderColor: "border-green-200"
      }
    }
    
    if (normalized.includes("client") || normalized.includes("usuario")) {
      return {
        icon: UserCheck,
        color: "text-blue-600",
        bgColor: "bg-blue-500",
        lightBg: "bg-blue-50",
        borderColor: "border-blue-200"
      }
    }
    
    if (normalized.includes("proces") || normalized.includes("operac")) {
      return {
        icon: Cog,
        color: "text-purple-600",
        bgColor: "bg-purple-500",
        lightBg: "bg-purple-50",
        borderColor: "border-purple-200"
      }
    }
    
    if (normalized.includes("aprendiz") || normalized.includes("desarroll")) {
      return {
        icon: GraduationCap,
        color: "text-orange-600",
        bgColor: "bg-orange-500",
        lightBg: "bg-orange-50",
        borderColor: "border-orange-200"
      }
    }
    
    // Fallback basado en ID
    const colors = [
      { color: "text-gray-600", bgColor: "bg-gray-500", lightBg: "bg-gray-50", borderColor: "border-gray-200" },
      { color: "text-red-600", bgColor: "bg-red-500", lightBg: "bg-red-50", borderColor: "border-red-200" },
      { color: "text-pink-600", bgColor: "bg-pink-500", lightBg: "bg-pink-50", borderColor: "border-pink-200" },
      { color: "text-cyan-600", bgColor: "bg-cyan-500", lightBg: "bg-cyan-50", borderColor: "border-cyan-200" },
    ]
    
    return {
      icon: Building,
      ...colors[id % colors.length]
    }
  }

  // Configuración de perspectivas dinámicas
  const perspectivasConfig = perspectivas.map(perspectiva => ({
    id: perspectiva.id,
    nombre: perspectiva.nombre,
    descripcion: perspectiva.descripcion,
    ...getPerspectivaVisuals(perspectiva.nombre, perspectiva.id)
  }))

  // Mapeo simplificado de perspectiva por nombre
  const mapPerspectiveName = (perspective: string): number => {
    const normalized = perspective.toLowerCase()
    
    const encontrada = perspectivasConfig.find(p => 
      p.nombre.toLowerCase().includes(normalized) ||
      normalized.includes(p.nombre.toLowerCase())
    )
    
    if (encontrada) return encontrada.id
    
    // Fallback para nombres estándar BSC
    const fallbackMap: Record<string, string> = {
      "finanzas": "finanz",
      "financiera": "finanz", 
      "cliente": "client",
      "clientes": "client",
      "procesos": "proces",
      "proceso": "proces",
      "aprendizaje": "aprendiz"
    }
    
    const keyword = fallbackMap[normalized]
    if (keyword) {
      const found = perspectivasConfig.find(p => p.nombre.toLowerCase().includes(keyword))
      if (found) return found.id
    }
    
    return 0 // Sin perspectiva encontrada
  }

  // Función para calcular estadísticas por perspectiva
  const getStatsPerPerspectiva = () => {
    // Crear mapa objetivo_id -> perspectiva_id
    const objetivoToPerspectiva = new Map<number, number>()
    objetivos.forEach(objetivo => {
      objetivoToPerspectiva.set(objetivo.id, objetivo.perspectiva_id)
    })

    return perspectivasConfig.map(perspectiva => {
      // Contar KPIs usando relación objetivo_id
      const kpisCount = kpis.filter(kpi => {
        if (kpi.objetivo_id) {
          const perspectivaId = objetivoToPerspectiva.get(kpi.objetivo_id)
          return perspectivaId === perspectiva.id
        }
        return mapPerspectiveName(kpi.perspective) === perspectiva.id
      }).length

      // Contar objetivos directamente
      const objetivosCount = objetivos.filter(objetivo => 
        objetivo.perspectiva_id === perspectiva.id ||
        objetivo.perspectiva?.id === perspectiva.id
      ).length

      // Contar iniciativas a través de KPIs
      const kpisDeEstaPerspectiva = kpis.filter(kpi => {
        if (kpi.objetivo_id) {
          const perspectivaId = objetivoToPerspectiva.get(kpi.objetivo_id)
          return perspectivaId === perspectiva.id
        }
        return mapPerspectiveName(kpi.perspective) === perspectiva.id
      })
      
      const kpisIds = kpisDeEstaPerspectiva.map(kpi => parseInt(kpi.id))
      const iniciativasCount = iniciativas.filter(iniciativa => 
        kpisIds.includes(iniciativa.kpi_id)
      ).length

      const total = kpisCount + objetivosCount + iniciativasCount

      return {
        ...perspectiva,
        kpis: kpisCount,
        objetivos: objetivosCount,
        iniciativas: iniciativasCount,
        total
      }
    })
  }

  const stats = getStatsPerPerspectiva()
  const totalGeneral = stats.reduce((acc, curr) => acc + curr.total, 0)

  // Estadísticas del backend
  const backendStats = {
    totalKPIs: kpis.length,
    totalObjetivos: objetivos.length,
    totalIniciativas: iniciativas.length,
    perspectivasActivas: stats.filter(s => s.total > 0).length,
    perspectivaLider: stats.reduce((prev, current) => prev.total > current.total ? prev : current)
  }

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Distribución por Perspectiva BSC</h3>
        <p className="text-sm text-gray-600">Datos reales registrados en la base de datos por perspectiva estratégica</p>
      </div>

      {/* Resumen general del backend */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{backendStats.totalKPIs}</div>
            <div className="text-xs text-blue-700">KPIs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{backendStats.totalObjetivos}</div>
            <div className="text-xs text-green-700">Objetivos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{backendStats.totalIniciativas}</div>
            <div className="text-xs text-purple-700">Iniciativas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{totalGeneral}</div>
            <div className="text-xs text-orange-700">Total</div>
          </div>
        </div>
      </div>

      {/* Grid de perspectivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((perspectiva) => {
          const Icon = perspectiva.icon
          const percentage = totalGeneral > 0 ? ((perspectiva.total / totalGeneral) * 100) : 0

          return (
            <div key={perspectiva.id} className={`${perspectiva.lightBg} ${perspectiva.borderColor} border rounded-lg p-4 hover:shadow-md transition-shadow`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 ${perspectiva.bgColor} rounded-lg mr-3`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{perspectiva.nombre}</h4>
                    <p className="text-xs text-gray-600">{percentage.toFixed(1)}% del total</p>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${perspectiva.color}`}>
                  {perspectiva.total}
                </div>
              </div>

              {/* Desglose con datos del backend */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">📊 KPIs:</span>
                  <span className="font-medium">{perspectiva.kpis}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">🎯 Objetivos:</span>
                  <span className="font-medium">{perspectiva.objetivos}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">🚀 Iniciativas:</span>
                  <span className="font-medium">{perspectiva.iniciativas}</span>
                </div>
              </div>

              {/* Barra de progreso visual */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 ${perspectiva.bgColor} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  ></div>
                </div>
              </div>

              {/* Estado basado en datos reales */}
              <div className="mt-2 text-center">
                {perspectiva.total === 0 ? (
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Sin datos en BD</span>
                ) : perspectiva.total < 3 ? (
                  <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">Pocos datos</span>
                ) : (
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">Bien documentado</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Análisis del balance con datos del backend */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">📊 Análisis de Balance BSC (Base de Datos)</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Perspectivas activas:</span>
            <span className="ml-2 font-medium text-blue-600">{backendStats.perspectivasActivas}/{perspectivasConfig.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Perspectiva líder:</span>
            <span className="ml-2 font-medium text-green-600">{backendStats.perspectivaLider.nombre}</span>
          </div>
          <div>
            <span className="text-gray-600">Total en BD:</span>
            <span className="ml-2 font-medium text-purple-600">{totalGeneral} elementos</span>
          </div>
          <div>
            <span className="text-gray-600">Promedio/perspectiva:</span>
            <span className="ml-2 font-medium text-orange-600">
              {backendStats.perspectivasActivas > 0 ? (totalGeneral / backendStats.perspectivasActivas).toFixed(1) : 0}
            </span>
          </div>
        </div>

        {/* Recomendaciones basadas en datos reales */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800 text-sm">
            💡 <strong>Análisis BSC:</strong> 
            {backendStats.perspectivasActivas === perspectivasConfig.length 
              ? " ¡Excelente! Tienes datos en todas las perspectivas del BSC en tu base de datos."
              : backendStats.perspectivasActivas >= 2
              ? ` Tienes ${backendStats.perspectivasActivas} perspectivas activas. Considera completar las ${perspectivasConfig.length - backendStats.perspectivasActivas} restantes.`
              : " Tu BSC necesita más balance. Agrega datos en más perspectivas para un mejor análisis estratégico."}
          </p>
        </div>

        {/* Estado de conexión con backend */}
        <div className="mt-2 text-xs text-center text-gray-500">
          🔗 Conectado a la base de datos • Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
