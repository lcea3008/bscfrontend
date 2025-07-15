"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { IniciativaModal } from "./modals/IniciativaModal"
import { IniciativaDetailModal } from "./modals/IniciativaDetailModal"

interface Iniciativa {
  id: number
  titulo: string
  descripcion: string
  objetivo_id: number
  objetivo_titulo?: string
  responsable: string
  fecha_inicio: string
  fecha_fin: string
  estado: "planificada" | "en_progreso" | "completada" | "cancelada"
  presupuesto: number
}

interface Objetivo {
  id: number
  titulo: string
}

export function IniciativasTable() {
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([])
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [filteredIniciativas, setFilteredIniciativas] = useState<Iniciativa[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedIniciativa, setSelectedIniciativa] = useState<Iniciativa | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockObjetivos: Objetivo[] = [
      { id: 1, titulo: "Incrementar rentabilidad" },
      { id: 2, titulo: "Reducir costos operativos" },
      { id: 3, titulo: "Mejorar satisfacción del cliente" },
      { id: 4, titulo: "Optimizar procesos internos" },
    ]

    const mockIniciativas: Iniciativa[] = [
      {
        id: 1,
        titulo: "Implementar sistema CRM",
        descripcion: "Implementación de sistema de gestión de relaciones con clientes",
        objetivo_id: 3,
        objetivo_titulo: "Mejorar satisfacción del cliente",
        responsable: "María García",
        fecha_inicio: "2024-01-15",
        fecha_fin: "2024-06-15",
        estado: "en_progreso",
        presupuesto: 50000,
      },
      {
        id: 2,
        titulo: "Automatización de procesos",
        descripcion: "Automatizar procesos manuales para reducir tiempos",
        objetivo_id: 4,
        objetivo_titulo: "Optimizar procesos internos",
        responsable: "Carlos López",
        fecha_inicio: "2024-02-01",
        fecha_fin: "2024-08-01",
        estado: "planificada",
        presupuesto: 75000,
      },
      {
        id: 3,
        titulo: "Programa de capacitación",
        descripcion: "Capacitación del personal en nuevas tecnologías",
        objetivo_id: 1,
        objetivo_titulo: "Incrementar rentabilidad",
        responsable: "Ana Rodríguez",
        fecha_inicio: "2024-01-01",
        fecha_fin: "2024-03-31",
        estado: "completada",
        presupuesto: 25000,
      },
    ]

    setTimeout(() => {
      setObjetivos(mockObjetivos)
      setIniciativas(mockIniciativas)
      setFilteredIniciativas(mockIniciativas)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = iniciativas.filter(
      (iniciativa) =>
        iniciativa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iniciativa.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        iniciativa.objetivo_titulo?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredIniciativas(filtered)
  }, [searchTerm, iniciativas])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completada":
        return "bg-green-100 text-green-800"
      case "en_progreso":
        return "bg-blue-100 text-blue-800"
      case "planificada":
        return "bg-yellow-100 text-yellow-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "completada":
        return "Completada"
      case "en_progreso":
        return "En Progreso"
      case "planificada":
        return "Planificada"
      case "cancelada":
        return "Cancelada"
      default:
        return estado
    }
  }

  const handleEdit = (iniciativa: Iniciativa) => {
    setSelectedIniciativa(iniciativa)
    setIsModalOpen(true)
  }

  const handleView = (iniciativa: Iniciativa) => {
    setSelectedIniciativa(iniciativa)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta iniciativa?")) {
      setIniciativas(iniciativas.filter((iniciativa) => iniciativa.id !== id))
    }
  }

  const handleSave = (iniciativaData: Omit<Iniciativa, "id" | "objetivo_titulo">) => {
    const objetivo = objetivos.find((o) => o.id === iniciativaData.objetivo_id)
    const iniciativaWithObjetivo = {
      ...iniciativaData,
      objetivo_titulo: objetivo?.titulo,
    }

    if (selectedIniciativa) {
      setIniciativas(
        iniciativas.map((iniciativa) =>
          iniciativa.id === selectedIniciativa.id
            ? { ...iniciativaWithObjetivo, id: selectedIniciativa.id }
            : iniciativa,
        ),
      )
    } else {
      const newIniciativa = { ...iniciativaWithObjetivo, id: Date.now() }
      setIniciativas([...iniciativas, newIniciativa])
    }
    setIsModalOpen(false)
    setSelectedIniciativa(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Iniciativas</h1>
          <p className="text-gray-600">Administra las iniciativas estratégicas del proyecto</p>
        </div>
        <Button
          onClick={() => {
            setSelectedIniciativa(null)
            setIsModalOpen(true)
          }}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Iniciativa
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar iniciativas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Título</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Objetivo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Responsable</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha Fin</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Presupuesto</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIniciativas.map((iniciativa) => (
                <tr key={iniciativa.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{iniciativa.titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{iniciativa.objetivo_titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{iniciativa.responsable}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(iniciativa.estado)}`}
                    >
                      {getEstadoLabel(iniciativa.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(iniciativa.fecha_fin).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    S/ {iniciativa.presupuesto.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(iniciativa)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(iniciativa)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(iniciativa.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredIniciativas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron iniciativas</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <IniciativaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedIniciativa(null)
        }}
        onSave={handleSave}
        iniciativa={selectedIniciativa}
        objetivos={objetivos}
      />

      <IniciativaDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedIniciativa(null)
        }}
        iniciativa={selectedIniciativa}
      />
    </div>
  )
}
