"use client"

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

interface IniciativasBarChartProps {
  iniciativas: IniciativaData[]
}

export function IniciativasBarChart({ iniciativas }: IniciativasBarChartProps) {
  // Función para obtener color según el progreso
  const getProgressColor = (progreso: number) => {
    if (progreso >= 90) return "bg-green-500"
    if (progreso >= 70) return "bg-yellow-500"
    if (progreso >= 50) return "bg-orange-500"
    return "bg-red-500"
  }

  const getProgressColorLight = (progreso: number) => {
    if (progreso >= 90) return "bg-green-100"
    if (progreso >= 70) return "bg-yellow-100"
    if (progreso >= 50) return "bg-orange-100"
    return "bg-red-100"
  }

  // Función para obtener estado del progreso
  const getProgressStatus = (progreso: number) => {
    if (progreso >= 90) return "Excelente"
    if (progreso >= 70) return "Bueno"
    if (progreso >= 50) return "Regular"
    return "Crítico"
  }

  // Agrupar iniciativas por estado de progreso
  const getInitiativesByStatus = () => {
    const excelente = iniciativas.filter(i => i.progreso >= 90).length
    const bueno = iniciativas.filter(i => i.progreso >= 70 && i.progreso < 90).length
    const regular = iniciativas.filter(i => i.progreso >= 50 && i.progreso < 70).length
    const critico = iniciativas.filter(i => i.progreso < 50).length

    return { excelente, bueno, regular, critico }
  }

  const statusData = getInitiativesByStatus()

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Progreso de Iniciativas</h3>
        <p className="text-sm text-gray-600">Estado actual de las iniciativas en curso</p>
      </div>

      {/* Resumen por estado */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-green-800">Excelente</p>
          <p className="text-lg font-bold text-green-600">{statusData.excelente}</p>
          <p className="text-xs text-green-600">≥90%</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-yellow-800">Bueno</p>
          <p className="text-lg font-bold text-yellow-600">{statusData.bueno}</p>
          <p className="text-xs text-yellow-600">70-89%</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-orange-800">Regular</p>
          <p className="text-lg font-bold text-orange-600">{statusData.regular}</p>
          <p className="text-xs text-orange-600">50-69%</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-red-800">Crítico</p>
          <p className="text-lg font-bold text-red-600">{statusData.critico}</p>
          <p className="text-xs text-red-600">&lt;50%</p>
        </div>
      </div>

      {/* Gráfico de barras individual */}
      <div className="space-y-3">
        {iniciativas.map((iniciativa) => (
          <div key={iniciativa.id} className={`${getProgressColorLight(iniciativa.progreso)} border rounded-lg p-4`}>
            {/* Información de la iniciativa */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm mb-1">{iniciativa.nombre}</h4>
                <p className="text-xs text-gray-600 mb-2">{iniciativa.descripcion}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Inicio: {new Date(iniciativa.fecha_inicio).toLocaleDateString()}</span>
                  <span>Fin: {new Date(iniciativa.fecha_fin).toLocaleDateString()}</span>
                  <span>KPI ID: {iniciativa.kpi_id}</span>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className={`text-lg font-bold ${
                  iniciativa.progreso >= 90 ? 'text-green-600' : 
                  iniciativa.progreso >= 70 ? 'text-yellow-600' : 
                  iniciativa.progreso >= 50 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {iniciativa.progreso}%
                </div>
                <div className="text-xs text-gray-600">{getProgressStatus(iniciativa.progreso)}</div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div 
                  className={`h-full ${getProgressColor(iniciativa.progreso)} transition-all duration-700 ease-out flex items-center justify-end pr-2`}
                  style={{ width: `${iniciativa.progreso}%` }}
                >
                  {iniciativa.progreso > 15 && (
                    <span className="text-white text-xs font-medium">{iniciativa.progreso}%</span>
                  )}
                </div>
              </div>
              {iniciativa.progreso <= 15 && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-xs font-medium">
                  {iniciativa.progreso}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas generales */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-gray-800 mb-3">Estadísticas Generales</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{iniciativas.length}</p>
            <p className="text-sm text-gray-600">Total Iniciativas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {iniciativas.length > 0 ? Math.round(iniciativas.reduce((acc, i) => acc + i.progreso, 0) / iniciativas.length) : 0}%
            </p>
            <p className="text-sm text-gray-600">Progreso Promedio</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {iniciativas.filter(i => i.progreso >= 70).length}
            </p>
            <p className="text-sm text-gray-600">En Buen Estado</p>
          </div>
        </div>
      </div>
    </div>
  )
}
