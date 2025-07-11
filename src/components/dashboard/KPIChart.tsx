"use client"

interface KPIStats {
  total: number
  success: number
  warning: number
  danger: number
}

interface KPIChartProps {
  stats: KPIStats
}

export function KPIChart({ stats }: KPIChartProps) {
  const successPercentage = (stats.success / stats.total) * 100
  const warningPercentage = (stats.warning / stats.total) * 100
  const dangerPercentage = (stats.danger / stats.total) * 100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Chart */}
      <div className="flex items-center justify-center">
        <div className="relative w-64 h-64">
          {/* Donut Chart */}
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />

            {/* Success arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray={`${successPercentage * 2.51} 251.2`}
              strokeDashoffset="0"
              className="transition-all duration-1000"
            />

            {/* Warning arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeDasharray={`${warningPercentage * 2.51} 251.2`}
              strokeDashoffset={`-${successPercentage * 2.51}`}
              className="transition-all duration-1000"
            />

            {/* Danger arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeDasharray={`${dangerPercentage * 2.51} 251.2`}
              strokeDashoffset={`-${(successPercentage + warningPercentage) * 2.51}`}
              className="transition-all duration-1000"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total KPIs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend and Stats */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Success */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="font-medium text-green-800">Cumplidos</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">{stats.success}</div>
              <div className="text-sm text-green-600">{successPercentage.toFixed(1)}%</div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span className="font-medium text-yellow-800">En Progreso</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-800">{stats.warning}</div>
              <div className="text-sm text-yellow-600">{warningPercentage.toFixed(1)}%</div>
            </div>
          </div>

          {/* Danger */}
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="font-medium text-red-800">Críticos</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-800">{stats.danger}</div>
              <div className="text-sm text-red-600">{dangerPercentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Resumen Ejecutivo</h4>
          <p className="text-sm text-gray-600">
            {stats.success} de {stats.total} KPIs están cumpliendo sus metas.
            {stats.danger > 0 && ` ${stats.danger} requieren atención inmediata.`}
          </p>
        </div>
      </div>
    </div>
  )
}
