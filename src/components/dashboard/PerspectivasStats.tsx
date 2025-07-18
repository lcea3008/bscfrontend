"use client"

import { DollarSign, UserCheck, Cog, GraduationCap, Leaf, Building, Shield, Lightbulb } from "lucide-react"

// Interfaces basadas en los datos reales del backend
interface KPIData {
  id: string
  title: string
  value: string
  target: string
  percentage: number
  status: "success" | "warning" | "danger"
  trend: "up" | "down" | "stable"
  perspective: string
  objetivo_id?: number // Para relación con backend
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
  createdAt?: string
  updatedAt?: string
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

// Interfaz para perspectivas dinámicas del backend
interface PerspectivaBackend {
  id: number
  nombre: string
  descripcion?: string
  createdAt?: string
  updatedAt?: string
}

interface PerspectivasStatsProps {
  kpis: KPIData[]
  objetivos: ObjetivoData[]
  iniciativas: IniciativaData[]
  perspectivas: PerspectivaBackend[] // Nuevas perspectivas dinámicas
}

export function PerspectivasStats({ kpis, objetivos, iniciativas, perspectivas }: PerspectivasStatsProps) {
  
  // Función para obtener ícono y colores basados en el nombre de la perspectiva
  const getPerspectivaVisuals = (nombre: string, id: number) => {
    const normalized = nombre.toLowerCase()
    
    // Mapeo por nombre común
    if (normalized.includes("finanz") || normalized.includes("económic") || normalized.includes("monetar")) {
      return {
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-500",
        lightBg: "bg-green-50",
        borderColor: "border-green-200"
      }
    }
    
    if (normalized.includes("client") || normalized.includes("usuario") || normalized.includes("customer")) {
      return {
        icon: UserCheck,
        color: "text-blue-600",
        bgColor: "bg-blue-500",
        lightBg: "bg-blue-50",
        borderColor: "border-blue-200"
      }
    }
    
    if (normalized.includes("proces") || normalized.includes("operac") || normalized.includes("intern")) {
      return {
        icon: Cog,
        color: "text-purple-600",
        bgColor: "bg-purple-500",
        lightBg: "bg-purple-50",
        borderColor: "border-purple-200"
      }
    }
    
    if (normalized.includes("aprendiz") || normalized.includes("crecimient") || normalized.includes("desarroll") || normalized.includes("capacit")) {
      return {
        icon: GraduationCap,
        color: "text-orange-600",
        bgColor: "bg-orange-500",
        lightBg: "bg-orange-50",
        borderColor: "border-orange-200"
      }
    }
    
    if (normalized.includes("sosteni") || normalized.includes("ambient") || normalized.includes("verde") || normalized.includes("ecolog")) {
      return {
        icon: Leaf,
        color: "text-emerald-600",
        bgColor: "bg-emerald-500",
        lightBg: "bg-emerald-50",
        borderColor: "border-emerald-200"
      }
    }
    
    if (normalized.includes("social") || normalized.includes("comunidad") || normalized.includes("responsabil")) {
      return {
        icon: Shield,
        color: "text-indigo-600",
        bgColor: "bg-indigo-500",
        lightBg: "bg-indigo-50",
        borderColor: "border-indigo-200"
      }
    }
    
    if (normalized.includes("innovac") || normalized.includes("tecnolog") || normalized.includes("digital")) {
      return {
        icon: Lightbulb,
        color: "text-yellow-600",
        bgColor: "bg-yellow-500",
        lightBg: "bg-yellow-50",
        borderColor: "border-yellow-200"
      }
    }
    
    // Fallback: usar colores basados en ID
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

  // Configuración dinámica de perspectivas basada en la base de datos
  const perspectivasConfig = perspectivas.map(perspectiva => ({
    id: perspectiva.id,
    nombre: perspectiva.nombre,
    descripcion: perspectiva.descripcion,
    ...getPerspectivaVisuals(perspectiva.nombre, perspectiva.id)
  }))

  console.log("🏛️ Perspectivas dinámicas configuradas:", perspectivasConfig)

  // Función mejorada para mapear perspectiva por nombre (considerando datos del backend)
  const mapPerspectiveName = (perspective: string): number => {
    const normalized = perspective.toLowerCase()
    
    // Buscar en las perspectivas dinámicas primero
    const encontrada = perspectivasConfig.find(p => 
      p.nombre.toLowerCase() === normalized ||
      p.nombre.toLowerCase().includes(normalized) ||
      normalized.includes(p.nombre.toLowerCase())
    )
    
    if (encontrada) return encontrada.id
    
    // Fallback para nombres comunes de BSC
    switch (normalized) {
      case "finanzas": 
      case "financiera": 
      case "financiero": 
        return perspectivasConfig.find(p => p.nombre.toLowerCase().includes("finanz"))?.id || 1
      case "cliente": 
      case "clientes": 
        return perspectivasConfig.find(p => p.nombre.toLowerCase().includes("client"))?.id || 2
      case "procesos": 
      case "proceso": 
      case "procesos internos":
        return perspectivasConfig.find(p => p.nombre.toLowerCase().includes("proces"))?.id || 3
      case "aprendizaje": 
      case "aprendizaje y crecimiento":
      case "aprendizaje y desarrollo":
        return perspectivasConfig.find(p => p.nombre.toLowerCase().includes("aprendiz"))?.id || 4
      default: 
        console.warn(`⚠️ Perspectiva no reconocida: "${perspective}"`);
        return 0
    }
  }



  // Contar datos por perspectiva con logging para debug
  const getStatsPerPerspectiva = () => {
    console.log("🔍 Analizando datos por perspectiva:")
    console.log("📊 KPIs recibidos:", kpis.length)
    console.log("🎯 Objetivos recibidos:", objetivos.length)
    console.log("🚀 Iniciativas recibidas:", iniciativas.length)

    // Crear mapa de objetivo_id -> perspectiva_id basado en los datos reales
    const objetivoToPerspectiva = new Map<number, number>()
    objetivos.forEach(objetivo => {
      objetivoToPerspectiva.set(objetivo.id, objetivo.perspectiva_id)
    })

    console.log("🗺️ Mapa objetivo -> perspectiva:", Object.fromEntries(objetivoToPerspectiva))

    // Debug detallado de KPIs
    console.log("🔍 Análisis detallado de KPIs:")
    kpis.forEach(kpi => {
      console.log(`📊 KPI "${kpi.title}":`, {
        id: kpi.id,
        perspective: kpi.perspective,
        objetivo_id: kpi.objetivo_id,
        mapped_perspectiva: kpi.objetivo_id ? objetivoToPerspectiva.get(kpi.objetivo_id) : mapPerspectiveName(kpi.perspective)
      })
    })

    return perspectivasConfig.map(perspectiva => {
      // Contar KPIs usando la relación real: KPI.objetivo_id -> Objetivo.perspectiva_id
      const kpisCount = kpis.filter(kpi => {
        // Si tenemos objetivo_id, usar la relación real
        if (kpi.objetivo_id) {
          const perspectivaId = objetivoToPerspectiva.get(kpi.objetivo_id)
          return perspectivaId === perspectiva.id
        }
        
        // Fallback: usar el mapeo de perspectiva existente
        const mappedId = mapPerspectiveName(kpi.perspective)
        return mappedId === perspectiva.id
      }).length

      // Contar Objetivos por perspectiva_id del backend
      const objetivosCount = objetivos.filter(objetivo => {
        // Primero intentar por perspectiva_id directo
        if (objetivo.perspectiva_id === perspectiva.id) return true
        
        // Luego intentar por perspectiva anidada
        if (objetivo.perspectiva?.id === perspectiva.id) return true
        
        // Finalmente por nombre de perspectiva anidada
        if (objetivo.perspectiva?.nombre) {
          const mappedId = mapPerspectiveName(objetivo.perspectiva.nombre)
          return mappedId === perspectiva.id
        }
        
        return false
      }).length

      // Contar Iniciativas usando la relación real a través de KPIs
      const kpisDeEstaPerspectiva = kpis.filter(kpi => {
        if (kpi.objetivo_id) {
          const perspectivaId = objetivoToPerspectiva.get(kpi.objetivo_id)
          return perspectivaId === perspectiva.id
        }
        const mappedId = mapPerspectiveName(kpi.perspective)
        return mappedId === perspectiva.id
      })
      
      const kpisIds = kpisDeEstaPerspectiva.map(kpi => parseInt(kpi.id))
      
      const iniciativasCount = iniciativas.filter(iniciativa => 
        kpisIds.includes(iniciativa.kpi_id)
      ).length

      const total = kpisCount + objetivosCount + iniciativasCount

      // Debug logging mejorado
      console.log(`📈 ${perspectiva.nombre} (ID: ${perspectiva.id}):`, {
        kpis: kpisCount,
        objetivos: objetivosCount,
        iniciativas: iniciativasCount,
        total,
        kpisEncontrados: kpisDeEstaPerspectiva.map(k => `${k.title} (obj_id: ${k.objetivo_id}, perspective: ${k.perspective})`),
        kpisIds
      })

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

  // Estadísticas adicionales del backend
  const backendStats = {
    totalKPIs: kpis.length,
    totalObjetivos: objetivos.length,
    totalIniciativas: iniciativas.length,
    perspectivasActivas: stats.filter(s => s.total > 0).length,
    perspectivaLider: stats.reduce((prev, current) => prev.total > current.total ? prev : current)
  }

  console.log("📈 Estadísticas finales del backend:", backendStats)

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
