import api from './api'

//formato que recibe datos del backend
export interface Iniciativa {
    id: number
    nombre: string
    descripcion: string
    kpi_id: number
    fecha_inicio: string
    fecha_fin: string
    responsable_id: number
    progreso: number
}

//formato que se envia al backend
export interface CreateIniciativaData {
    nombre: string
    descripcion: string
    kpi_id: number
    fecha_inicio: string
    fecha_fin: string
    responsable_id: number
    progreso: number
}

export interface UpdateIniciativaData {
    nombre?: string
    descripcion?: string
    kpi_id?: number
    fecha_inicio?: string
    fecha_fin?: string
    responsable_id?: number
    progreso?: number
}
export const iniciativasService = {
    // Obtener todas las iniciativas
    async getIniciativas(): Promise<Iniciativa[]> {
        try {
            console.log("🔄 Obteniendo iniciativas desde la API...")
            const response = await api.get<Iniciativa[]>("/iniciativas")
            console.log("✅ Iniciativas obtenidas exitosamente:", response.data.length)
            return response.data
        } catch (error: any) {
            console.error("❌ Error al obtener iniciativas:", error)
            console.warn("🔄 Usando datos mock como fallback...")
            return await this.getIniciativasMock()
        }
    },

    // Obtener una iniciativa por ID
    async getIniciativaById(id: number): Promise<Iniciativa> {
        try {
            console.log(`🔄 Obteniendo iniciativa con ID: ${id}`)
            const response = await api.get<Iniciativa>(`/iniciativas/${id}`)
            console.log("✅ Iniciativa obtenida exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al obtener iniciativa ${id}:`, error)
            // Buscar en datos mock
            const mockData = await this.getIniciativasMock()
            const iniciativa = mockData.find(i => i.id === id)
            if (iniciativa) {
                console.warn("🔄 Usando datos mock como fallback...")
                return iniciativa
            }
            throw new Error(error.response?.data?.message || error.message || "Error al obtener iniciativa")
        }
    },

    // Crear nueva iniciativa
    async createIniciativa(data: CreateIniciativaData): Promise<Iniciativa> {
        try {
            console.log("🔄 Creando nueva iniciativa:", data)
            const response = await api.post<Iniciativa>("/iniciativas", data)
            console.log("✅ Iniciativa creada exitosamente")
            return response.data
        } catch (error: any) {
            console.error("❌ Error al crear iniciativa:", error)
            // En modo mock, simular creación
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn("🔄 Simulando creación en modo mock...")
                const mockIniciativa: Iniciativa = {
                    id: Date.now(),
                    ...data
                }
                return mockIniciativa
            }
            throw new Error(error.response?.data?.message || error.message || "Error al crear iniciativa")
        }
    },

    // Actualizar iniciativa
    async updateIniciativa(id: number, data: UpdateIniciativaData): Promise<Iniciativa> {
        try {
            console.log(`🔄 Actualizando iniciativa ${id}:`, data)
            const response = await api.put<Iniciativa>(`/iniciativas/${id}`, data)
            console.log("✅ Iniciativa actualizada exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al actualizar iniciativa ${id}:`, error)
            // En modo mock, simular actualización
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn("🔄 Simulando actualización en modo mock...")
                const mockData = await this.getIniciativasMock()
                const iniciativa = mockData.find(i => i.id === id)
                if (iniciativa) {
                    return { ...iniciativa, ...data } as Iniciativa
                }
            }
            throw new Error(error.response?.data?.message || error.message || "Error al actualizar iniciativa")
        }
    },

    // Eliminar iniciativa
    async deleteIniciativa(id: number): Promise<void> {
        try {
            console.log(`🔄 Eliminando iniciativa ${id}`)
            await api.delete(`/iniciativas/${id}`)
            console.log("✅ Iniciativa eliminada exitosamente")
        } catch (error: any) {
            console.error(`❌ Error al eliminar iniciativa ${id}:`, error)
            // En modo mock, simular eliminación
            if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
                console.warn("🔄 Simulando eliminación en modo mock...")
                return
            }
            throw new Error(error.response?.data?.message || error.message || "Error al eliminar iniciativa")
        }
    },

    //datos mock para desarrollo
    async getIniciativasMock(): Promise<Iniciativa[]> {
        return [
            {
                id: 1,
                nombre: "Campaña de Marketing Digital 2024",
                descripcion: "Implementar estrategia de marketing digital para incrementar ventas online y offline",
                kpi_id: 1,
                fecha_inicio: "2024-01-01T00:00:00.000Z",
                fecha_fin: "2024-12-31T00:00:00.000Z",
                responsable_id: 2,
                progreso: 65
            },
            {
                id: 2,
                nombre: "Optimización de Procesos Internos",
                descripcion: "Mejorar eficiencia operacional mediante automatización de procesos",
                kpi_id: 2,
                fecha_inicio: "2024-02-01T00:00:00.000Z",
                fecha_fin: "2024-11-30T00:00:00.000Z",
                responsable_id: 3,
                progreso: 45
            },
            {
                id: 3,
                nombre: "Capacitación del Personal",
                descripcion: "Programa integral de formación y desarrollo profesional",
                kpi_id: 3,
                fecha_inicio: "2024-03-01T00:00:00.000Z",
                fecha_fin: "2024-10-31T00:00:00.000Z",
                responsable_id: 1,
                progreso: 80
            }
        ]
    }
}