// "use client"

// import { useState, useEffect } from "react"
// import { Header } from "./dashboard/Header"
// import { Sidebar } from "./dashboard/Sidebar"
// import { KPICard } from "./dashboard/KPICard"
// import { KPIChart } from "./dashboard/KPIChart"
// import { DollarSign, UserCheck, Cog, GraduationCap } from "lucide-react"
// import { useAuth } from "../context/AuthContext"
// import { kpidata } from "../services/kpidata"

// interface KPIData {
//   id: string
//   title: string
//   value: string
//   target: string
//   percentage: number
//   status: "success" | "warning" | "danger"
//   trend: "up" | "down" | "stable"
//   perspective: string
// }

// // Interfaz para el Header (mantenemos separada para compatibilidad)
// interface UserData {
//   nombre: string
//   role: string
//   avatar?: string
// }

// // Mock data - esto se reemplazará con datos del backend cuando esté disponible
// // Por ahora se usa para desarrollo y testing

// const perspectives = [
//   { name: "Finanzas", icon: DollarSign, color: "text-green-600" },
//   { name: "Cliente", icon: UserCheck, color: "text-blue-600" },
//   { name: "Procesos", icon: Cog, color: "text-purple-600" },
//   { name: "Aprendizaje", icon: GraduationCap, color: "text-orange-600" },
// ]

// export default function Dashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [kpis, setKpis] = useState<KPIData[]>([])
//   const [loading, setLoading] = useState(true)
  
//   // ✅ Usar directamente el contexto de autenticación
//   const { user } = useAuth()

//   // Debug: Verificar datos del usuario
//   useEffect(() => {
//     console.log("👤 Usuario desde contexto:", user)
//     if (user) {
//       console.log("✅ Datos del usuario:", {
//         nombre: user.nombre,
//         role: user.role,
//         email: user.email
//       })
//     }
//   }, [user])

//   // Transformar el usuario del contexto al formato que espera el Header
//   const headerUser: UserData | null = user ? {
//     nombre: user.nombre || "Usuario",
//     role: user.role || "Sin rol",
//     avatar: undefined // Por ahora no manejamos avatars
//   } : null

//   // Simular carga de datos del backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Solo cargar KPIs, el usuario ya viene del contexto
//         const kpiData = await kpidata.getKpis()

//         setKpis(kpiData)
//         setLoading(false)
//       } catch (error) {
//         console.error("Error al obtener datos del dashboard:", error)
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])


//   const getKPIsByPerspective = (perspective: string) => {
//     return kpis.filter((kpi) => kpi.perspective === perspective)
//   }

//   const getKPIStats = () => {
//     const total = kpis.length
//     const success = kpis.filter((kpi) => kpi.status === "success").length
//     const warning = kpis.filter((kpi) => kpi.status === "warning").length
//     const danger = kpis.filter((kpi) => kpi.status === "danger").length

//     return { total, success, warning, danger }
//   }

//   const stats = getKPIStats()

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Cargando dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar - Fixed */}
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col lg:ml-64">
//         {/* Header - Fixed */}
//         <Header onMenuClick={() => setSidebarOpen(true)} user={headerUser} />

//         {/* Dashboard Content - Scrollable */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {/* Welcome Section */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Principal</h1>
//             <p className="text-gray-600">
//               Monitoreo en tiempo real de indicadores clave de rendimiento
//               {headerUser && ` - Bienvenido, ${headerUser.nombre}`}
//             </p>
//           </div>

//           {/* KPI Summary Chart */}
//           <div className="mb-8">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen General de KPIs</h2>
//               <KPIChart stats={stats} />
//             </div>
//           </div>

//           {/* KPIs by Perspective */}
//           <div className="space-y-8">
//             {perspectives.map((perspective) => {
//               const perspectiveKpis = getKPIsByPerspective(perspective.name)
//               const Icon = perspective.icon

//               if (perspectiveKpis.length === 0) return null

//               return (
//                 <div key={perspective.name} className="bg-white rounded-xl shadow-lg p-6">
//                   <div className="flex items-center mb-6">
//                     <div className="p-3 bg-gray-100 rounded-lg mr-4">
//                       <Icon className={`h-6 w-6 ${perspective.color}`} />
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-800">Perspectiva: {perspective.name}</h2>
//                       <p className="text-gray-600">Indicadores de {perspective.name.toLowerCase()}</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//                     {perspectiveKpis.map((kpi) => (
//                       <KPICard key={kpi.id} kpi={kpi} />
//                     ))}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//           {/* Footer spacing */}
//           <div className="h-8" />
//         </main>
//       </div>
//     </div>
//   )
// }
