import api from './api'

// Formato de los datos que envía el backend
export interface RegistroHistorico {
    id: number
    kpi_id: number
    valor: string
    fecha: string
}

// Formato para crear un nuevo registro
export interface CreateRegistroHistoricoData {
    kpi_id: number
    valor: string
    fecha: string
}

// Formato para actualizar un registro
export interface UpdateRegistroHistoricoData {
    kpi_id?: number
    valor?: string
    fecha?: string
}

export const registroHistoricoService = {
    // Obtener todos los registros históricos
    async getRegistrosHistoricos(): Promise<RegistroHistorico[]> {
        try {
            console.log("🔄 Obteniendo registros históricos desde la API...")
            const response = await api.get<RegistroHistorico[]>("/registroHistorico")
            console.log("✅ Registros históricos obtenidos exitosamente:", response.data.length)
            return response.data
        } catch (error: any) {
            console.error("❌ Error al obtener registros históricos:", error)
            console.warn("🔄 Usando datos mock como fallback...")
            return await this.getRegistrosHistoricosMock()
        }
    },

    // Obtener registros históricos por KPI
    async getRegistrosByKpiId(kpiId: number): Promise<RegistroHistorico[]> {
        try {
            console.log(`🔄 Obteniendo registros históricos para KPI: ${kpiId}`)
            const response = await api.get<RegistroHistorico[]>(`/registroHistorico/kpi/${kpiId}`)
            console.log("✅ Registros históricos por KPI obtenidos exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al obtener registros históricos para KPI ${kpiId}:`, error)
            // Buscar en datos mock
            const mockData = await this.getRegistrosHistoricosMock()
            return mockData.filter(registro => registro.kpi_id === kpiId)
        }
    },

    // Obtener un registro histórico por ID
    async getRegistroHistoricoById(id: number): Promise<RegistroHistorico> {
        try {
            console.log(`🔄 Obteniendo registro histórico con ID: ${id}`)
            const response = await api.get<RegistroHistorico>(`/registroHistorico/${id}`)
            console.log("✅ Registro histórico obtenido exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al obtener registro histórico ${id}:`, error)
            // Buscar en datos mock
            const mockData = await this.getRegistrosHistoricosMock()
            const registro = mockData.find(r => r.id === id)
            if (registro) {
                console.warn("🔄 Usando datos mock como fallback...")
                return registro
            }
            throw new Error(error.response?.data?.message || error.message || "Error al obtener registro histórico")
        }
    },

    // Crear nuevo registro histórico
    async createRegistroHistorico(data: CreateRegistroHistoricoData): Promise<RegistroHistorico> {
        try {
            console.log("🔄 Creando nuevo registro histórico:", data)
            const response = await api.post<RegistroHistorico>("/registroHistorico", data)
            console.log("✅ Registro histórico creado exitosamente")
            return response.data
        } catch (error: any) {
            console.error("❌ Error al crear registro histórico:", error)
            // En modo mock, simular creación
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn("🔄 Simulando creación en modo mock...")
                const mockRegistro: RegistroHistorico = {
                    id: Date.now(),
                    ...data
                }
                return mockRegistro
            }
            throw new Error(error.response?.data?.message || error.message || "Error al crear registro histórico")
        }
    },

    // Actualizar registro histórico
    async updateRegistroHistorico(id: number, data: UpdateRegistroHistoricoData): Promise<RegistroHistorico> {
        try {
            console.log(`🔄 Actualizando registro histórico ${id}:`, data)
            const response = await api.put<RegistroHistorico>(`/registroHistorico/${id}`, data)
            console.log("✅ Registro histórico actualizado exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al actualizar registro histórico ${id}:`, error)
            // En modo mock, simular actualización
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn("🔄 Simulando actualización en modo mock...")
                const mockData = await this.getRegistrosHistoricosMock()
                const registro = mockData.find(r => r.id === id)
                if (registro) {
                    return { ...registro, ...data } as RegistroHistorico
                }
            }
            throw new Error(error.response?.data?.message || error.message || "Error al actualizar registro histórico")
        }
    },

    // Eliminar registro histórico
    async deleteRegistroHistorico(id: number): Promise<void> {
        try {
            console.log(`🔄 Eliminando registro histórico ${id}`)
            await api.delete(`/registroHistorico/${id}`)
            console.log("✅ Registro histórico eliminado exitosamente")
        } catch (error: any) {
            console.error(`❌ Error al eliminar registro histórico ${id}:`, error)
            // En modo mock, simular eliminación
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn("🔄 Simulando eliminación en modo mock...")
                return
            }
            throw new Error(error.response?.data?.message || error.message || "Error al eliminar registro histórico")
        }
    },

    // Datos mock para desarrollo
    async getRegistrosHistoricosMock(): Promise<RegistroHistorico[]> {
        return [
            {
                id: 1,
                kpi_id: 1,
                valor: "380000",
                fecha: "2023-07-31T00:00:00.000Z"
            },
            {
                id: 2,
                kpi_id: 1,
                valor: "420000",
                fecha: "2023-08-31T00:00:00.000Z"
            },
            {
                id: 3,
                kpi_id: 2,
                valor: "85",
                fecha: "2023-07-31T00:00:00.000Z"
            },
            {
                id: 4,
                kpi_id: 2,
                valor: "88",
                fecha: "2023-08-31T00:00:00.000Z"
            },
            {
                id: 5,
                kpi_id: 3,
                valor: "92",
                fecha: "2023-07-31T00:00:00.000Z"
            },
            {
                id: 6,
                kpi_id: 3,
                valor: "94",
                fecha: "2023-08-31T00:00:00.000Z"
            }
        ]
    }
}