"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KPIData {
  id: number
  nombre: string
  meta: string
  unidad: string
  estado_actual: string
  percentage?: number
  status?: "success" | "warning" | "danger"
  trend?: "up" | "down" | "stable"
}

interface KPITrendChartProps {
  kpis: KPIData[]
}

export function KPITrendChart({ kpis }: KPITrendChartProps) {
  const trendData = useMemo(() => {
    const trends = { up: 0, down: 0, stable: 0 }
    kpis.forEach((kpi) => {
      if (kpi.trend) {
        trends[kpi.trend]++
      }
    })
    return trends
  }, [kpis])

  const total = trendData.up + trendData.down + trendData.stable

  const trendPercentages = {
    up: total > 0 ? (trendData.up / total) * 100 : 0,
    down: total > 0 ? (trendData.down / total) * 100 : 0,
    stable: total > 0 ? (trendData.stable / total) * 100 : 0,
  }

  const kpisByTrend = useMemo(() => {
    return {
      up: kpis.filter((kpi) => kpi.trend === "up"),
      down: kpis.filter((kpi) => kpi.trend === "down"),
      stable: kpis.filter((kpi) => kpi.trend === "stable"),
    }
  }, [kpis])

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">📈</div>
          <p>No hay datos de tendencias disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de dona simplificado */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {/* Círculo de fondo */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />

            {/* Segmento UP (Verde) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray={`${trendPercentages.up * 2.51} 251.2`}
              strokeDashoffset="0"
              className="transition-all duration-1000"
            />

            {/* Segmento STABLE (Amarillo) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeDasharray={`${trendPercentages.stable * 2.51} 251.2`}
              strokeDashoffset={`-${trendPercentages.up * 2.51}`}
              className="transition-all duration-1000"
            />

            {/* Segmento DOWN (Rojo) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeDasharray={`${trendPercentages.down * 2.51} 251.2`}
              strokeDashoffset={`-${(trendPercentages.up + trendPercentages.stable) * 2.51}`}
              className="transition-all duration-1000"
            />
          </svg>

          {/* Centro del gráfico */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-600">KPIs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda y estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        {/* Tendencia UP */}
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-800">{trendData.up}</div>
          <div className="text-sm text-green-600">Mejorando</div>
          <div className="text-xs text-green-500 mt-1">{trendPercentages.up.toFixed(1)}%</div>
        </div>

        {/* Tendencia STABLE */}
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-center mb-2">
            <Minus className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-800">{trendData.stable}</div>
          <div className="text-sm text-yellow-600">Estables</div>
          <div className="text-xs text-yellow-500 mt-1">{trendPercentages.stable.toFixed(1)}%</div>
        </div>

        {/* Tendencia DOWN */}
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-800">{trendData.down}</div>
          <div className="text-sm text-red-600">Declinando</div>
          <div className="text-xs text-red-500 mt-1">{trendPercentages.down.toFixed(1)}%</div>
        </div>
      </div>

      {/* Lista de KPIs por tendencia */}
      <div className="space-y-4">
        {trendData.down > 0 && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center">
              <TrendingDown className="h-4 w-4 mr-2" />
              KPIs que necesitan atención ({trendData.down})
            </h4>
            <div className="space-y-1">
              {kpisByTrend.down.map((kpi) => (
                <div key={kpi.id} className="text-sm text-red-700">
                  • {kpi.nombre} ({kpi.percentage}%)
                </div>
              ))}
            </div>
          </div>
        )}

        {trendData.up > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              KPIs con buen rendimiento ({trendData.up})
            </h4>
            <div className="space-y-1">
              {kpisByTrend.up.map((kpi) => (
                <div key={kpi.id} className="text-sm text-green-700">
                  • {kpi.nombre} ({kpi.percentage}%)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
