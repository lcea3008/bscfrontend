import api from './api'
// Interface que coincide con la respuesta del backend
export interface KPIBackendResponse {
    id: number
    nombre: string
    meta: string
    unidad: string
    objetivo_id: number
    estado_actual: string
    fecha_actualizacion: string
}

// Interface para crear/actualizar KPIs
export interface CreateKPIData {
    nombre: string
    meta: string
    unidad: string
    objetivo_id: number
    estado_actual: string
}

export interface UpdateKPIData {
    nombre?: string
    meta?: string
    unidad?: string
    objetivo_id?: number
    estado_actual?: string
}

// Interface para mostrar en el frontend (procesada)
export interface KPIData {
    id: number
    nombre: string
    meta: string
    unidad: string
    objetivo_id: number
    estado_actual: string
    fecha_actualizacion: string
    percentage?: number
    status?: "success" | "warning" | "danger"
    trend?: "up" | "down" | "stable"
}

export const kpidata = {
    // Obtener todos los KPIs con fallback automático
    async getKpis(): Promise<KPIData[]> {
        try {
            console.log("🔄 Iniciando carga de KPIs desde /kpis...");
            
            const response = await api.get<KPIBackendResponse[]>("/kpi");
            
            console.log("📡 Response status:", response.status);
            console.log("✅ KPIs obtenidos del backend:", response.data);
            console.log("📊 Número de KPIs recibidos:", response.data.length);
            
            // Transformar los datos del backend al formato del frontend
            const transformedData = response.data.map(kpi => ({
                ...kpi,
                percentage: this.calculatePercentage(kpi.estado_actual, kpi.meta),
                status: this.calculateStatus(kpi.estado_actual, kpi.meta),
                trend: this.calculateTrend(kpi.estado_actual, kpi.meta)
            }));
            
            console.log("🔄 Datos transformados:", transformedData);
            return transformedData;
        } catch (error) {
            console.error("❌ Error fetching KPIs:", error);
            // No lanzar error aquí, el componente manejará el fallback
            throw error;
        }
    },

  // Obtener un KPI por ID
  async getKpiById(id: number): Promise<KPIData> {
    try {
      console.log("🔄 Obteniendo KPI por ID:", id);
      const response = await api.get<KPIBackendResponse>(`/kpi/${id}`);

      console.log("✅ KPI obtenido:", response.data);

      return {
        ...response.data,
        percentage: this.calculatePercentage(response.data.estado_actual, response.data.meta),
        status: this.calculateStatus(response.data.estado_actual, response.data.meta),
        trend: this.calculateTrend(response.data.estado_actual, response.data.meta)
      };
    } catch (error) {
      console.error("❌ Error fetching KPI:", error);
      throw error;
    }
  },

  // Crear nuevo KPI
  async createKpi(kpiData: CreateKPIData): Promise<KPIData> {
    try {
      console.log("🔄 Creando KPI con datos:", kpiData);

      const response = await api.post<KPIBackendResponse>("/kpi", kpiData);

      console.log("✅ KPI creado exitosamente:", response.data);

      return {
        ...response.data,
        percentage: this.calculatePercentage(response.data.estado_actual, response.data.meta),
        status: this.calculateStatus(response.data.estado_actual, response.data.meta),
        trend: this.calculateTrend(response.data.estado_actual, response.data.meta)
      };
    } catch (error) {
      console.error("❌ Error creating KPI:", error);
      throw error;
    }
  },

  // Actualizar KPI
  async updateKpi(id: number, kpiData: UpdateKPIData): Promise<KPIData> {
    try {
      console.log("🔄 Actualizando KPI con ID:", id, "Datos:", kpiData);

      const response = await api.put<KPIBackendResponse>(`/kpi/${id}`, kpiData);

      console.log("✅ KPI actualizado exitosamente:", response.data);

      return {
        ...response.data,
        percentage: this.calculatePercentage(response.data.estado_actual, response.data.meta),
        status: this.calculateStatus(response.data.estado_actual, response.data.meta),
        trend: this.calculateTrend(response.data.estado_actual, response.data.meta)
      };
    } catch (error) {
      console.error("❌ Error updating KPI:", error);
      throw error;
    }
  },

  // Eliminar KPI
  async deleteKpi(id: number): Promise<void> {
    try {
      console.log("🔄 Eliminando KPI con ID:", id);

      await api.delete(`/kpi/${id}`);

      console.log("✅ KPI eliminado exitosamente");
    } catch (error) {
      console.error("❌ Error deleting KPI:", error);
      throw error;
    }
  },

  // Función auxiliar para calcular porcentaje
  calculatePercentage(estadoActual: string, meta: string): number {
    const actual = parseFloat(estadoActual) || 0;
    const target = parseFloat(meta) || 1;
    return Math.round((actual / target) * 100);
  },

  // Función auxiliar para calcular estado
  calculateStatus(estadoActual: string, meta: string): "success" | "warning" | "danger" {
    const percentage = this.calculatePercentage(estadoActual, meta);

    if (percentage >= 90) return "success";
    if (percentage >= 70) return "warning";
    return "danger";
  },

  // Función auxiliar para calcular tendencia
  calculateTrend(estadoActual: string, meta: string): "up" | "down" | "stable" {
    const percentage = this.calculatePercentage(estadoActual, meta);
    
    // Lógica de tendencias:
    // - Si el porcentaje es >= 95%, tendencia UP (excelente rendimiento)
    // - Si el porcentaje está entre 70-94%, tendencia STABLE (rendimiento bueno/aceptable)
    // - Si el porcentaje es < 70%, tendencia DOWN (necesita atención)
    
    if (percentage >= 95) {
      return "up";
    } else if (percentage >= 70) {
      return "stable";
    } else {
      return "down";
    }
  },

  // datos mock para desarrollo/fallback
  getMockKpis(): KPIData[] {
    return [
      { 
        id: 1, 
        nombre: "KPI de Ventas", 
        meta: "10000", 
        unidad: "USD", 
        objetivo_id: 1, 
        estado_actual: "9600", // 96% - Tendencia UP
        fecha_actualizacion: new Date().toISOString(), 
        percentage: 96, 
        status: "success", 
        trend: "up" 
      },
      { 
        id: 2, 
        nombre: "Satisfacción del Cliente", 
        meta: "90", 
        unidad: "%", 
        objetivo_id: 2, 
        estado_actual: "78", // 87% - Tendencia STABLE
        fecha_actualizacion: new Date().toISOString(), 
        percentage: 87, 
        status: "warning", 
        trend: "stable" 
      },
      { 
        id: 3, 
        nombre: "Reducción de Costos", 
        meta: "15", 
        unidad: "%", 
        objetivo_id: 2, 
        estado_actual: "8", // 53% - Tendencia DOWN
        fecha_actualizacion: new Date().toISOString(), 
        percentage: 53, 
        status: "danger", 
        trend: "down" 
      },
      { 
        id: 4, 
        nombre: "Tiempo de Respuesta", 
        meta: "2", 
        unidad: "horas", 
        objetivo_id: 4, 
        estado_actual: "1.9", // 95% - Tendencia UP
        fecha_actualizacion: new Date().toISOString(), 
        percentage: 95, 
        status: "success", 
        trend: "up" 
      }
    ];
  }
};