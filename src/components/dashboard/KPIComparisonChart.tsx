"use client"

interface KPIComparisonData {
  id: number
  nombre: string
  actual: number
  meta: number
  unidad: string
  porcentaje: number
  estado: "success" | "warning" | "danger"
}

interface KPIComparisonChartProps {
  kpis: KPIComparisonData[]
}

export function KPIComparisonChart({ kpis }: KPIComparisonChartProps) {
  const maxValue = Math.max(...kpis.map((kpi) => Math.max(kpi.actual, kpi.meta)))
  const chartHeight = 400
  const barHeight = 40
  const spacing = 60

  const getColor = (estado: string) => {
    switch (estado) {
      case "success":
        return "#10b981"
      case "warning":
        return "#f59e0b"
      case "danger":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const formatValue = (value: number, unidad: string) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unidad}`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${unidad}`
    }
    return `${value.toLocaleString()} ${unidad}`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparación Actual vs Meta</h3>
        <p className="text-gray-600">Rendimiento de cada KPI comparado con su objetivo</p>
      </div>

      <div className="space-y-6">
        {kpis.map((kpi, index) => {
          const actualWidth = (kpi.actual / maxValue) * 100
          const metaWidth = (kpi.meta / maxValue) * 100

          return (
            <div key={kpi.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 text-sm">{kpi.nombre}</h4>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      kpi.estado === "success"
                        ? "bg-emerald-100 text-emerald-800"
                        : kpi.estado === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {kpi.porcentaje}%
                  </span>
                </div>
              </div>

              <div className="relative">
                {/* Meta bar (background) */}
                <div className="w-full bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-gray-300 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${metaWidth}%` }}
                  >
                    <span className="text-xs text-gray-600 font-medium">Meta: {formatValue(kpi.meta, kpi.unidad)}</span>
                  </div>
                </div>

                {/* Actual bar (overlay) */}
                <div
                  className="absolute top-0 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{
                    width: `${actualWidth}%`,
                    backgroundColor: getColor(kpi.estado),
                    opacity: 0.8,
                  }}
                >
                  <span className="text-xs text-white font-medium">{formatValue(kpi.actual, kpi.unidad)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{formatValue(maxValue, kpi.unidad)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-gray-600">Meta</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 rounded opacity-80"></div>
            <span className="text-gray-600">Actual</span>
          </div>
        </div>
      </div>
    </div>
  )
}
