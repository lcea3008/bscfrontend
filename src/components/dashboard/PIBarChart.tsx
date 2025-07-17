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
}

interface KPIBarChartProps {
  kpis: KPIData[]
}

export function KPIBarChart({ kpis }: KPIBarChartProps) {
  const chartData = useMemo(() => {
    return kpis.map((kpi) => ({
      name: kpi.nombre,
      actual: Number.parseFloat(kpi.estado_actual) || 0,
      meta: Number.parseFloat(kpi.meta) || 0,
      percentage: kpi.percentage || 0,
      status: kpi.status || "warning",
      unidad: kpi.unidad,
    }))
  }, [kpis])

  const maxValue = useMemo(() => {
    const allValues = chartData.flatMap((item) => [item.actual, item.meta])
    return Math.max(...allValues) * 1.1 // 10% más para padding
  }, [chartData])

  const getBarColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "danger":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getBarColorLight = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-200"
      case "warning":
        return "bg-yellow-200"
      case "danger":
        return "bg-red-200"
      default:
        return "bg-gray-200"
    }
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">📊</div>
          <p>No hay datos de KPIs disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {chartData.map((item, index) => (
        <div key={index} className="space-y-2">
          {/* Header del KPI */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
              <p className="text-sm text-gray-500">
                {item.actual} / {item.meta} {item.unidad}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === "success"
                    ? "bg-green-100 text-green-800"
                    : item.status === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {item.percentage}%
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="relative">
            {/* Barra de fondo (meta) */}
            <div className={`w-full h-6 rounded-lg ${getBarColorLight(item.status)}`}>
              {/* Barra de progreso (actual) */}
              <div
                className={`h-6 rounded-lg ${getBarColor(item.status)} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                style={{
                  width: `${Math.min((item.actual / item.meta) * 100, 100)}%`,
                }}
              >
                {item.percentage >= 20 && (
                  <span className="text-white text-xs font-medium">
                    {item.actual} {item.unidad}
                  </span>
                )}
              </div>
            </div>

            {/* Línea de meta */}
            <div className="absolute top-0 right-0 h-6 w-1 bg-gray-600 rounded-r-lg"></div>
          </div>

          {/* Información adicional */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              Actual: {item.actual} {item.unidad}
            </span>
            <span>
              Meta: {item.meta} {item.unidad}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
