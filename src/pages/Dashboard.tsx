import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import * as services from "../services/types"
import type { Objetivo, Indicador } from "../services/types"
import { useAuth } from "../context/AuthContext"

interface DashboardData {
  nombre: string
  cumplimiento: number
  total: number
}

export default function Dashboard() {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [indicadores, setIndicadores] = useState<Indicador[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [objetivosData, indicadoresData] = await Promise.all([
        services.objetivosService.getAll(),
        services.indicadoresService.getAll()
      ])
      
      setObjetivos(objetivosData)
      setIndicadores(indicadoresData)
      
      // Procesar datos para el gráfico
      const perspectivas = Array.from(new Set(objetivosData.map(obj => obj.perspectiva)))
      
      if (perspectivas.length === 0) {
        // Si no hay objetivos, crear datos por defecto
        setDashboardData([
          { nombre: "Sin objetivos", cumplimiento: 0, total: 0 }
        ])
      } else {
        const chartData = perspectivas.map(perspectiva => {
          const objetivosPerspectiva = objetivosData.filter(obj => obj.perspectiva === perspectiva)
          const totalIndicadores = indicadoresData.filter(ind => 
            objetivosPerspectiva.some(obj => obj.id === ind.objetivoId)
          ).length
          
          // Por ahora simulamos cumplimiento, puedes agregar lógica real aquí
          const cumplimiento = Math.floor(Math.random() * 40) + 60
          
          return {
            nombre: perspectiva,
            cumplimiento,
            total: totalIndicadores
          }
        })
        
        setDashboardData(chartData)
      }
    } catch (error) {
      console.error("Error cargando datos:", error)
      // Datos por defecto en caso de error
      setDashboardData([
        { nombre: "Error cargando datos", cumplimiento: 0, total: 0 }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Cargando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Balance ScoreCard</h2>
        <div className="text-sm text-gray-600">
          Bienvenido, {user?.role} 
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Objetivos</h3>
          <p className="text-3xl font-bold text-blue-600">{objetivos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Indicadores</h3>
          <p className="text-3xl font-bold text-green-600">{indicadores.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Perspectivas</h3>
          <p className="text-3xl font-bold text-purple-600">{dashboardData.length}</p>
        </div>
      </div>

      {/* Gráfico de cumplimiento */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Cumplimiento por Perspectiva</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dashboardData}>
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Cumplimiento']}
              labelFormatter={(label) => `Perspectiva: ${label}`}
            />
            <Legend />
            <Bar dataKey="cumplimiento" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Lista de objetivos recientes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Objetivos Registrados</h3>
        <div className="space-y-2">
          {objetivos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay objetivos registrados aún.</p>
              <p className="text-sm">Los objetivos aparecerán aquí una vez que se agreguen.</p>
            </div>
          ) : (
            objetivos.slice(0, 5).map((objetivo) => (
              <div key={objetivo.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{objetivo.title}</span>
                  <span className="text-sm text-gray-600 ml-2">({objetivo.perspectiva})</span>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {objetivo.indicadores?.length || 0} indicadores
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
