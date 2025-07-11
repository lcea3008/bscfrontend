"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KPIData {
  id: string
  title: string
  value: string
  target: string
  percentage: number
  status: "success" | "warning" | "danger"
  trend: "up" | "down" | "stable"
  perspective: string
}

interface KPICardProps {
  kpi: KPIData
}

export function KPICard({ kpi }: KPICardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 border-green-300 text-green-800"
      case "warning":
        return "bg-yellow-100 border-yellow-300 text-yellow-800"
      case "danger":
        return "bg-red-100 border-red-300 text-red-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  const getStatusDot = (status: string) => {
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getProgressColor = (status: string) => {
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

  return (
    <div
      className={`border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${getStatusColor(kpi.status)}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusDot(kpi.status)}`} />
          <h3 className="font-semibold text-lg">{kpi.title}</h3>
        </div>
        {getTrendIcon(kpi.trend)}
      </div>

      {/* Values */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Actual:</span>
          <span className="text-2xl font-bold">{kpi.value}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Meta:</span>
          <span className="text-lg font-semibold">{kpi.target}</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso</span>
            <span className="font-semibold">{kpi.percentage}%</span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(kpi.status)}`}
              style={{ width: `${Math.min(kpi.percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
