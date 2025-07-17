"use client"

interface HeatmapData {
  kpi_id: number
  kpi_nombre: string
  fecha: string
  valor: number
  porcentaje: number
  estado: "success" | "warning" | "danger"
}

interface KPIHeatmapChartProps {
  data: HeatmapData[]
}

export function KPIHeatmapChart({ data }: KPIHeatmapChartProps) {
  // Agrupar datos por KPI y fecha
  const groupedData = data.reduce(
    (acc, item) => {
      const key = `${item.kpi_id}-${item.fecha}`
      acc[key] = item
      return acc
    },
    {} as Record<string, HeatmapData>,
  )

  // Obtener KPIs únicos
  const uniqueKPIs = [...new Set(data.map((d) => d.kpi_id))].map((id) => ({
    id,
    nombre: data.find((d) => d.kpi_id === id)?.kpi_nombre || `KPI ${id}`,
  }))

  // Obtener fechas únicas y ordenarlas
  const uniqueDates = [...new Set(data.map((d) => d.fecha))].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  )

  const getColorIntensity = (porcentaje: number) => {
    if (porcentaje >= 90) return "bg-emerald-500"
    if (porcentaje >= 80) return "bg-emerald-400"
    if (porcentaje >= 70) return "bg-yellow-400"
    if (porcentaje >= 60) return "bg-yellow-500"
    if (porcentaje >= 50) return "bg-orange-400"
    if (porcentaje >= 40) return "bg-orange-500"
    if (porcentaje >= 30) return "bg-red-400"
    return "bg-red-500"
  }

  const formatDate = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      month: "short",
      day: "2-digit",
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mapa de Calor de Rendimiento</h3>
        <p className="text-gray-600">Visualización del rendimiento de KPIs a lo largo del tiempo</p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header con fechas */}
          <div className="flex mb-2">
            <div className="w-48 flex-shrink-0"></div>
            {uniqueDates.map((fecha) => (
              <div key={fecha} className="w-16 text-center">
                <span className="text-xs text-gray-600 font-medium">{formatDate(fecha)}</span>
              </div>
            ))}
          </div>

          {/* Filas de KPIs */}
          {uniqueKPIs.map((kpi) => (
            <div key={kpi.id} className="flex items-center mb-2">
              <div className="w-48 flex-shrink-0 pr-4">
                <span className="text-sm font-medium text-gray-900 truncate block">{kpi.nombre}</span>
              </div>
              {uniqueDates.map((fecha) => {
                const cellData = groupedData[`${kpi.id}-${fecha}`]
                return (
                  <div key={fecha} className="w-16 px-1">
                    <div
                      className={`h-12 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                        cellData ? getColorIntensity(cellData.porcentaje) : "bg-gray-100"
                      }`}
                      title={
                        cellData
                          ? `${kpi.nombre}\n${formatDate(fecha)}\nValor: ${cellData.valor}\nRendimiento: ${cellData.porcentaje}%`
                          : "Sin datos"
                      }
                    >
                      {cellData && <span className="text-xs font-bold text-white">{cellData.porcentaje}%</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Rendimiento:</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">0%</span>
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <div className="w-4 h-4 bg-emerald-400 rounded"></div>
              <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            </div>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
