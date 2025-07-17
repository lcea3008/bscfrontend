"use client"

import { useState } from "react"

interface RegistroHistoricoData {
  id: number
  kpi_id: number
  valor: string
  fecha: string
  kpi_nombre?: string // Agregamos el nombre del KPI
  unidad?: string // Agregamos la unidad
  meta?: string // Agregamos la meta
}

interface RegistrosHistoricosLineChartProps {
  registros: RegistroHistoricoData[]
  kpiNames?: { [key: number]: { nombre: string; unidad: string; meta: string } }
}

export function RegistrosHistoricosLineChart({ registros, kpiNames = {} }: RegistrosHistoricosLineChartProps) {
  const [selectedKPIs, setSelectedKPIs] = useState<number[]>([])
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line")
  const [timeRange, setTimeRange] = useState<"all" | "3m" | "6m" | "1y">("all")

  // Configuración de colores mejorada
  const kpiColors = [
    { color: "#10b981", bgColor: "bg-emerald-500", lightBg: "bg-emerald-50", name: "Emerald" },
    { color: "#3b82f6", bgColor: "bg-blue-500", lightBg: "bg-blue-50", name: "Blue" },
    { color: "#8b5cf6", bgColor: "bg-violet-500", lightBg: "bg-violet-50", name: "Violet" },
    { color: "#f59e0b", bgColor: "bg-amber-500", lightBg: "bg-amber-50", name: "Amber" },
    { color: "#ef4444", bgColor: "bg-red-500", lightBg: "bg-red-50", name: "Red" },
    { color: "#06b6d4", bgColor: "bg-cyan-500", lightBg: "bg-cyan-50", name: "Cyan" },
    { color: "#84cc16", bgColor: "bg-lime-500", lightBg: "bg-lime-50", name: "Lime" },
    { color: "#f97316", bgColor: "bg-orange-500", lightBg: "bg-orange-50", name: "Orange" },
    { color: "#ec4899", bgColor: "bg-pink-500", lightBg: "bg-pink-50", name: "Pink" },
    { color: "#6366f1", bgColor: "bg-indigo-500", lightBg: "bg-indigo-50", name: "Indigo" },
  ]

  // Filtrar registros por rango de tiempo
  const getFilteredRegistros = () => {
    if (timeRange === "all") return registros

    const now = new Date()
    const cutoffDate = new Date()

    switch (timeRange) {
      case "3m":
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case "6m":
        cutoffDate.setMonth(now.getMonth() - 6)
        break
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
    }

    return registros.filter((r) => new Date(r.fecha) >= cutoffDate)
  }

  const filteredRegistros = getFilteredRegistros()

  // Agrupar registros por KPI con información mejorada
  const getRegistrosByKPI = () => {
    const kpiMap = new Map<number, RegistroHistoricoData[]>()

    filteredRegistros.forEach((registro) => {
      const kpiId = registro.kpi_id
      if (!kpiMap.has(kpiId)) {
        kpiMap.set(kpiId, [])
      }
      kpiMap.get(kpiId)!.push(registro)
    })

    // Ordenar registros por fecha dentro de cada KPI
    kpiMap.forEach((registrosKPI) => {
      registrosKPI.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    })

    return Array.from(kpiMap.entries()).map(([kpiId, registrosKPI], index) => ({
      kpiId,
      registros: registrosKPI,
      color: kpiColors[index % kpiColors.length],
      colorIndex: index % kpiColors.length,
      nombre: kpiNames[kpiId]?.nombre || `KPI ${kpiId}`,
      unidad: kpiNames[kpiId]?.unidad || "",
      meta: kpiNames[kpiId]?.meta || "",
    }))
  }

  const kpiData = getRegistrosByKPI()

  // Filtrar KPIs seleccionados
  const displayedKPIs = selectedKPIs.length > 0 ? kpiData.filter((kpi) => selectedKPIs.includes(kpi.kpiId)) : kpiData

  // Obtener todas las fechas únicas y ordenarlas
  const getAllDates = () => {
    const dates = [...new Set(filteredRegistros.map((r) => r.fecha))]
    return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  }

  const allDates = getAllDates()

  // Calcular dimensiones del gráfico (más grande)
  const chartWidth = 800
  const chartHeight = 400
  const padding = { top: 30, right: 120, bottom: 80, left: 80 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Calcular valores máximo y mínimo para el eje Y
  const allValues = filteredRegistros.map((r) => Number.parseFloat(r.valor)).filter((v) => !isNaN(v))
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const valueRange = maxValue - minValue
  const yMin = Math.max(0, minValue - valueRange * 0.1)
  const yMax = maxValue + valueRange * 0.1

  // Funciones de escala
  const getXPosition = (fecha: string) => {
    const dateIndex = allDates.indexOf(fecha)
    return (dateIndex / Math.max(allDates.length - 1, 1)) * innerWidth
  }

  const getYPosition = (valor: string) => {
    const numValue = Number.parseFloat(valor)
    if (isNaN(numValue)) return innerHeight
    return innerHeight - ((numValue - yMin) / (yMax - yMin)) * innerHeight
  }

  // Crear path para línea SVG
  const createLinePath = (registrosKPI: RegistroHistoricoData[]) => {
    if (registrosKPI.length === 0) return ""

    const points = registrosKPI.map((registro) => {
      const x = getXPosition(registro.fecha)
      const y = getYPosition(registro.valor)
      return `${x},${y}`
    })

    return `M ${points.join(" L ")}`
  }

  // Crear path para área
  const createAreaPath = (registrosKPI: RegistroHistoricoData[]) => {
    if (registrosKPI.length === 0) return ""

    const linePath = createLinePath(registrosKPI)
    const firstX = getXPosition(registrosKPI[0].fecha)
    const lastX = getXPosition(registrosKPI[registrosKPI.length - 1].fecha)

    return `${linePath} L ${lastX},${innerHeight} L ${firstX},${innerHeight} Z`
  }

  // Formatear fecha para mostrar
  const formatDate = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
  }

  // Formatear valor mejorado
  const formatValue = (valor: string, unidad = "") => {
    const num = Number.parseFloat(valor)
    if (isNaN(num)) return valor

    let formattedNum = ""
    if (num >= 1000000) {
      formattedNum = `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      formattedNum = `${(num / 1000).toFixed(1)}K`
    } else {
      formattedNum = num.toLocaleString("es-ES", { maximumFractionDigits: 2 })
    }

    return unidad ? `${formattedNum} ${unidad}` : formattedNum
  }

  // Análisis de tendencias mejorado
  const getTrendAnalysis = () => {
    return displayedKPIs.map(({ kpiId, registros: registrosKPI, meta }) => {
      if (registrosKPI.length < 2)
        return {
          kpiId,
          trend: "stable",
          change: 0,
          performance: "unknown",
          lastValue: registrosKPI[0]?.valor || "0",
        }

      const firstValue = Number.parseFloat(registrosKPI[0].valor)
      const lastValue = Number.parseFloat(registrosKPI[registrosKPI.length - 1].valor)

      if (isNaN(firstValue) || isNaN(lastValue)) {
        return {
          kpiId,
          trend: "stable",
          change: 0,
          performance: "unknown",
          lastValue: registrosKPI[registrosKPI.length - 1].valor,
        }
      }

      const change = ((lastValue - firstValue) / firstValue) * 100
      const trend = change > 5 ? "up" : change < -5 ? "down" : "stable"

      // Calcular rendimiento vs meta
      let performance = "unknown"
      if (meta) {
        const metaValue = Number.parseFloat(meta)
        if (!isNaN(metaValue)) {
          const percentage = (lastValue / metaValue) * 100
          performance = percentage >= 90 ? "excellent" : percentage >= 70 ? "good" : "needs_attention"
        }
      }

      return {
        kpiId,
        trend,
        change: Math.abs(change),
        performance,
        lastValue: lastValue.toString(),
      }
    })
  }

  const trendAnalysis = getTrendAnalysis()

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "📈"
      case "down":
        return "📉"
      default:
        return "➡️"
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-emerald-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "text-emerald-600 bg-emerald-50"
      case "good":
        return "text-blue-600 bg-blue-50"
      case "needs_attention":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getPerformanceText = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "Excelente"
      case "good":
        return "Bueno"
      case "needs_attention":
        return "Necesita Atención"
      default:
        return "Sin Meta"
    }
  }

  // Toggle KPI selection
  const toggleKPISelection = (kpiId: number) => {
    setSelectedKPIs((prev) => (prev.includes(kpiId) ? prev.filter((id) => id !== kpiId) : [...prev, kpiId]))
  }

  if (registros.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay registros históricos</h3>
        <p className="text-gray-500">Los datos aparecerán aquí cuando se agreguen registros históricos</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Análisis Histórico de KPIs</h3>
            <p className="text-gray-600">Evolución temporal de {kpiData.length} indicadores clave de rendimiento</p>
          </div>

          {/* Controles */}
          <div className="flex flex-wrap gap-3">
            {/* Selector de tipo de gráfico */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(["line", "area", "bar"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    chartType === type ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {type === "line" ? "Línea" : type === "area" ? "Área" : "Barras"}
                </button>
              ))}
            </div>

            {/* Selector de rango de tiempo */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todo el tiempo</option>
              <option value="1y">Último año</option>
              <option value="6m">Últimos 6 meses</option>
              <option value="3m">Últimos 3 meses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Selector de KPIs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Seleccionar KPIs a mostrar</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {kpiData.map((kpi) => {
            const isSelected = selectedKPIs.includes(kpi.kpiId)
            const analysis = trendAnalysis.find((t) => t.kpiId === kpi.kpiId)

            return (
              <button
                key={kpi.kpiId}
                onClick={() => toggleKPISelection(kpi.kpiId)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected || selectedKPIs.length === 0
                    ? `border-blue-500 bg-blue-50`
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: kpi.color.color }} />
                    <span className="font-medium text-sm text-gray-900 truncate">{kpi.nombre}</span>
                  </div>
                  <span className="text-xs text-gray-500">{kpi.registros.length} reg.</span>
                </div>

                {analysis && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{getTrendIcon(analysis.trend)}</span>
                      <span className={`text-xs font-medium ${getTrendColor(analysis.trend)}`}>
                        {analysis.change.toFixed(1)}%
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{formatValue(analysis.lastValue, kpi.unidad)}</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {selectedKPIs.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedKPIs.length} KPI{selectedKPIs.length > 1 ? "s" : ""} seleccionado
              {selectedKPIs.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={() => setSelectedKPIs([])}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Mostrar todos
            </button>
          </div>
        )}
      </div>

      {/* Gráfico principal */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-center mb-6">
          <svg width={chartWidth} height={chartHeight} className="border border-gray-100 bg-gray-50 rounded-lg">
            <defs>
              {displayedKPIs.map((kpi) => (
                <linearGradient
                  key={`gradient-${kpi.kpiId}`}
                  id={`gradient-${kpi.kpiId}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: kpi.color.color, stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: kpi.color.color, stopOpacity: 0.05 }} />
                </linearGradient>
              ))}
            </defs>

            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {/* Grid lines */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1={0}
                  y1={ratio * innerHeight}
                  x2={innerWidth}
                  y2={ratio * innerHeight}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray={ratio === 0 || ratio === 1 ? "0" : "2,2"}
                />
              ))}

              {allDates
                .filter((_, i) => i % Math.ceil(allDates.length / 8) === 0)
                .map((fecha) => (
                  <line
                    key={fecha}
                    x1={getXPosition(fecha)}
                    y1={0}
                    x2={getXPosition(fecha)}
                    y2={innerHeight}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}

              {/* Data visualization */}
              {displayedKPIs.map((kpi) => (
                <g key={kpi.kpiId}>
                  {/* Area chart */}
                  {chartType === "area" && (
                    <path d={createAreaPath(kpi.registros)} fill={`url(#gradient-${kpi.kpiId})`} stroke="none" />
                  )}

                  {/* Line chart */}
                  {(chartType === "line" || chartType === "area") && (
                    <path
                      d={createLinePath(kpi.registros)}
                      fill="none"
                      stroke={kpi.color.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Bar chart */}
                  {chartType === "bar" &&
                    kpi.registros.map((registro, index) => {
                      const barWidth = Math.max(innerWidth / (allDates.length * displayedKPIs.length) - 2, 8)
                      const barHeight = innerHeight - getYPosition(registro.valor)
                      const xPos =
                        getXPosition(registro.fecha) - (barWidth * displayedKPIs.length) / 2 + kpi.colorIndex * barWidth

                      return (
                        <rect
                          key={`${kpi.kpiId}-${registro.id}`}
                          x={xPos}
                          y={getYPosition(registro.valor)}
                          width={barWidth}
                          height={barHeight}
                          fill={kpi.color.color}
                          opacity={0.8}
                          rx={2}
                        />
                      )
                    })}

                  {/* Data points */}
                  {(chartType === "line" || chartType === "area") &&
                    kpi.registros.map((registro) => (
                      <circle
                        key={`${kpi.kpiId}-${registro.id}`}
                        cx={getXPosition(registro.fecha)}
                        cy={getYPosition(registro.valor)}
                        r="5"
                        fill={kpi.color.color}
                        stroke="white"
                        strokeWidth="2"
                        className="hover:r-7 transition-all cursor-pointer"
                      >
                        <title>
                          {kpi.nombre}: {formatValue(registro.valor, kpi.unidad)} - {formatDate(registro.fecha)}
                        </title>
                      </circle>
                    ))}
                </g>
              ))}

              {/* X-axis labels */}
              {allDates
                .filter((_, i) => i % Math.ceil(allDates.length / 6) === 0)
                .map((fecha) => (
                  <text
                    key={fecha}
                    x={getXPosition(fecha)}
                    y={innerHeight + 25}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                    className="font-medium"
                  >
                    {formatDate(fecha)}
                  </text>
                ))}

              {/* Y-axis labels */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => {
                const value = yMin + (yMax - yMin) * (1 - ratio)
                return (
                  <text
                    key={ratio}
                    x={-15}
                    y={ratio * innerHeight + 5}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                    className="font-medium"
                  >
                    {formatValue(value.toString())}
                  </text>
                )
              })}

              {/* Axis lines */}
              <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#374151" strokeWidth="2" />
              <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#374151" strokeWidth="2" />
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4">
          {displayedKPIs.map((kpi) => (
            <div key={kpi.kpiId} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              <div className="w-4 h-3 rounded" style={{ backgroundColor: kpi.color.color }} />
              <span className="text-sm font-medium text-gray-700">{kpi.nombre}</span>
              <span className="text-xs text-gray-500">({kpi.registros.length} registros)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Análisis de rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendAnalysis.map((analysis) => {
          const kpiInfo = displayedKPIs.find((k) => k.kpiId === analysis.kpiId)
          if (!kpiInfo) return null

          return (
            <div key={analysis.kpiId} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: kpiInfo.color.color }} />
                  <h4 className="font-semibold text-gray-900 truncate">{kpiInfo.nombre}</h4>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(analysis.performance)}`}
                >
                  {getPerformanceText(analysis.performance)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor Actual:</span>
                  <span className="font-semibold text-gray-900">{formatValue(analysis.lastValue, kpiInfo.unidad)}</span>
                </div>

                {kpiInfo.meta && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Meta:</span>
                    <span className="font-medium text-gray-700">{formatValue(kpiInfo.meta, kpiInfo.unidad)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tendencia:</span>
                  <div className="flex items-center space-x-1">
                    <span>{getTrendIcon(analysis.trend)}</span>
                    <span className={`text-sm font-medium ${getTrendColor(analysis.trend)}`}>
                      {analysis.change.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Registros:</span>
                  <span className="text-sm text-gray-700">{kpiInfo.registros.length} puntos de datos</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resumen estadístico */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Resumen del Análisis</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{filteredRegistros.length}</p>
            <p className="text-sm text-gray-600">Total Registros</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{displayedKPIs.length}</p>
            <p className="text-sm text-gray-600">KPIs Analizados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{allDates.length}</p>
            <p className="text-sm text-gray-600">Períodos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{trendAnalysis.filter((t) => t.trend === "up").length}</p>
            <p className="text-sm text-gray-600">Mejorando</p>
          </div>
        </div>
      </div>
    </div>
  )
}
