"use client"

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

interface ObjetivosDonutChartProps {
  objetivos: ObjetivoData[]
}

export function ObjetivosDonutChart({ objetivos }: ObjetivosDonutChartProps) {
  // Configuración de perspectivas con colores
  const perspectivas = [
    { id: 1, nombre: "Financiera", color: "text-green-600", bgColor: "bg-green-500", lightBg: "bg-green-100", fillColor: "#10b981" },
    { id: 2, nombre: "Cliente", color: "text-blue-600", bgColor: "bg-blue-500", lightBg: "bg-blue-100", fillColor: "#3b82f6" },
    { id: 3, nombre: "Procesos", color: "text-purple-600", bgColor: "bg-purple-500", lightBg: "bg-purple-100", fillColor: "#8b5cf6" },
    { id: 4, nombre: "Aprendizaje", color: "text-orange-600", bgColor: "bg-orange-500", lightBg: "bg-orange-100", fillColor: "#f97316" },
  ]

  // Agrupar objetivos por perspectiva
  const getObjetivosByPerspectiva = () => {
    return perspectivas.map(perspectiva => {
      const objetivosPerspectiva = objetivos.filter(obj => 
        obj.perspectiva_id === perspectiva.id
      )
      return {
        ...perspectiva,
        count: objetivosPerspectiva.length,
        objetivos: objetivosPerspectiva,
        percentage: objetivos.length > 0 ? (objetivosPerspectiva.length / objetivos.length) * 100 : 0
      }
    }).filter(p => p.count > 0)
  }

  const perspectivasData = getObjetivosByPerspectiva()

  // Calcular ángulos para el gráfico de dona
  const calculateAngles = () => {
    let currentAngle = 0
    return perspectivasData.map(perspectiva => {
      const angle = (perspectiva.percentage / 100) * 360
      const result = {
        ...perspectiva,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        angle: angle
      }
      currentAngle += angle
      return result
    })
  }

  const anglesData = calculateAngles()

  // Crear path del SVG para cada segmento
  const createPath = (startAngle: number, endAngle: number, innerRadius = 40, outerRadius = 80) => {
    const start = polarToCartesian(100, 100, outerRadius, endAngle)
    const end = polarToCartesian(100, 100, outerRadius, startAngle)
    const innerStart = polarToCartesian(100, 100, innerRadius, endAngle)
    const innerEnd = polarToCartesian(100, 100, innerRadius, startAngle)

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ")
  }

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  // Análisis temporal
  const getObjetivosRecientes = () => {
    const ahora = new Date()
    const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    return objetivos.filter(obj => {
      if (!obj.createdAt) return false
      const fechaCreacion = new Date(obj.createdAt)
      return fechaCreacion >= hace30Dias
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Distribución de Objetivos por Perspectiva</h3>
        <p className="text-sm text-gray-600">Análisis de objetivos estratégicos del BSC</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Dona */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {anglesData.map((perspectiva) => (
                <path
                  key={perspectiva.id}
                  d={createPath(perspectiva.startAngle, perspectiva.endAngle)}
                  fill={perspectiva.fillColor}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>
            
            {/* Estadística central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-800">{objetivos.length}</div>
              <div className="text-sm text-gray-600">Objetivos</div>
              <div className="text-sm text-gray-600">Totales</div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="mt-6 space-y-2">
            {perspectivasData.map((perspectiva) => (
              <div key={perspectiva.id} className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${perspectiva.bgColor} rounded`}></div>
                <span className="text-sm text-gray-700">{perspectiva.nombre}</span>
                <span className="text-sm font-medium text-gray-600">
                  {perspectiva.count} ({perspectiva.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Información detallada */}
        <div className="space-y-4">
          {/* Resumen por perspectiva */}
          <div className="grid grid-cols-2 gap-3">
            {perspectivasData.map((perspectiva) => (
              <div key={perspectiva.id} className={`${perspectiva.lightBg} border border-gray-200 rounded-lg p-4 text-center`}>
                <div className={`w-3 h-3 ${perspectiva.bgColor} rounded-full mx-auto mb-2`}></div>
                <h4 className="font-medium text-gray-800 text-sm mb-1">{perspectiva.nombre}</h4>
                <p className="text-lg font-bold text-gray-700">{perspectiva.count}</p>
                <p className="text-xs text-gray-600">{perspectiva.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>

          {/* Estadísticas adicionales */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Análisis General</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Objetivos:</span>
                <span className="font-medium">{objetivos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Perspectivas Activas:</span>
                <span className="font-medium">{perspectivasData.length}/4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nuevos (últimos 30 días):</span>
                <span className="font-medium text-green-600">{getObjetivosRecientes()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Promedio por perspectiva:</span>
                <span className="font-medium">
                  {perspectivasData.length > 0 ? (objetivos.length / perspectivasData.length).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista detallada de objetivos */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">Objetivos por Perspectiva</h4>
        {perspectivasData.map((perspectiva) => (
          <div key={perspectiva.id} className={`${perspectiva.lightBg} border rounded-lg p-4`}>
            <div className="flex items-center mb-3">
              <div className={`w-3 h-3 ${perspectiva.bgColor} rounded-full mr-2`}></div>
              <h5 className="font-medium text-gray-800">{perspectiva.nombre}</h5>
              <span className="ml-auto text-sm text-gray-600">
                {perspectiva.count} objetivo{perspectiva.count !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {perspectiva.objetivos.map((objetivo) => (
                <div key={objetivo.id} className="bg-white border border-gray-200 rounded p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{objetivo.titulo}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {objetivo.id} • 
                        {objetivo.createdAt && (
                          ` Creado: ${new Date(objetivo.createdAt).toLocaleDateString()}`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
