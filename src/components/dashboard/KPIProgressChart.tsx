"use client"

import { useMemo } from "react"

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

interface KPIProgressChartProps {
  kpis: KPIData[]
}

export function KPIProgressChart({ kpis }: KPIProgressChartProps) {
  const sortedKpis = useMemo(() => {
    return [...kpis].sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
  }, [kpis])

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "from-green-400 to-green-600"
    if (percentage >= 70) return "from-yellow-400 to-yellow-600"
    return "from-red-400 to-red-600"
  }

  const getProgressBg = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100"
    if (percentage >= 70) return "bg-yellow-100"
    return "bg-red-100"
  }

  if (sortedKpis.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">📊</div>
          <p>No hay datos de progreso disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{sortedKpis.length}</div>
          <div className="text-sm text-gray-600">Total KPIs</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-800">
            {sortedKpis.filter((kpi) => (kpi.percentage || 0) >= 90).length}
          </div>
          <div className="text-sm text-green-600">Excelentes</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-800">
            {sortedKpis.filter((kpi) => (kpi.percentage || 0) >= 70 && (kpi.percentage || 0) < 90).length}
          </div>
          <div className="text-sm text-yellow-600">Buenos</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-800">
            {sortedKpis.filter((kpi) => (kpi.percentage || 0) < 70).length}
          </div>
          <div className="text-sm text-red-600">Críticos</div>
        </div>
      </div>

      {/* Barras de progreso individuales */}
      <div className="space-y-4">
        {sortedKpis.map((kpi, index) => {
          const percentage = kpi.percentage || 0
          return (
            <div key={kpi.id} className={`p-4 rounded-lg border ${getProgressBg(percentage)}`}>
              {/* Header del KPI */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{kpi.nombre}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>
                      Actual: {kpi.estado_actual} {kpi.unidad}
                    </span>
                    <span>
                      Meta: {kpi.meta} {kpi.unidad}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      percentage >= 90
                        ? "bg-green-200 text-green-800"
                        : percentage >= 70
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                    }`}
                  >
                    #{index + 1}
                  </div>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="relative">
                <div className="w-full bg-white rounded-full h-4 shadow-inner">
                  <div
                    className={`h-4 rounded-full bg-gradient-to-r ${getProgressColor(percentage)} transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      minWidth: percentage > 0 ? "20px" : "0px",
                    }}
                  >
                    {percentage >= 15 && <span className="text-white text-xs font-medium">{percentage}%</span>}
                  </div>
                </div>

                {/* Marcadores de referencia */}
                <div className="absolute top-0 left-0 w-full h-4 flex justify-between items-center pointer-events-none">
                  <div className="w-px h-2 bg-gray-400 opacity-50"></div>
                  <div className="w-px h-2 bg-gray-400 opacity-50"></div>
                  <div className="w-px h-2 bg-gray-400 opacity-50"></div>
                  <div className="w-px h-2 bg-gray-400 opacity-50"></div>
                  <div className="w-px h-2 bg-gray-400 opacity-50"></div>
                </div>
              </div>

              {/* Etiquetas de referencia */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>

              {/* Análisis rápido */}
              <div className="mt-3 text-sm">
                {percentage >= 100 && (
                  <div className="text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                    🎉 ¡Meta superada!
                  </div>
                )}
                {percentage >= 90 && percentage < 100 && (
                  <div className="text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                    ✅ Muy cerca de la meta
                  </div>
                )}
                {percentage >= 70 && percentage < 90 && (
                  <div className="text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full inline-block">
                    ⚠️ Progreso moderado
                  </div>
                )}
                {percentage < 70 && (
                  <div className="text-red-700 bg-red-100 px-3 py-1 rounded-full inline-block">
                    🚨 Requiere atención
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
