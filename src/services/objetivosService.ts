import api from "./api"

// Interfaz para el objetivo que viene del backend
export interface Objetivo {
    id: number
    titulo: string
    perspectiva_id: number
    createdAt?: string
    updatedAt?: string
}

// Interfaz para crear/actualizar objetivo
export interface CreateObjetivoData {
    titulo: string
    perspectiva_id: number
}

export interface UpdateObjetivoData {
    titulo: string
    perspectiva_id: number
}

export const objetivosService = {
    // Obtener todos los objetivos
    async getObjetivos(): Promise<Objetivo[]> {
        try {
            console.log("🔄 Obteniendo objetivos desde la API...")
            const response = await api.get<Objetivo[]>("/api/objetivos")
            
            console.log("✅ Objetivos obtenidos exitosamente:", response.data.length)
            return response.data
        } catch (error: any) {
            console.error("❌ Error al obtener objetivos:", error)
            
            // Si es error de red o servidor, usar datos mock para desarrollo
            if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
                console.warn("⚠️ Usando datos mock debido a error del servidor")
                return this.getMockObjetivos()
            }
            
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                "Error al obtener objetivos"
            )
        }
    },

    // Obtener un objetivo por ID
    async getObjetivoById(id: number): Promise<Objetivo> {
        try {
            console.log(`🔄 Obteniendo objetivo con ID: ${id}`)
            const response = await api.get<Objetivo>(`/api/objetivos/${id}`)
            
            console.log("✅ Objetivo obtenido exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al obtener objetivo ${id}:`, error)
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                "Error al obtener objetivo"
            )
        }
    },

    // Crear nuevo objetivo
    async createObjetivo(objetivoData: CreateObjetivoData): Promise<Objetivo> {
        try {
            console.log("🔄 Creando nuevo objetivo...")
            console.log("📦 Datos enviados al backend:", {
                titulo: objetivoData.titulo,
                perspectiva_id: objetivoData.perspectiva_id
            })
            
            const response = await api.post<Objetivo>("/api/objetivos", objetivoData)
            
            console.log("✅ Objetivo creado exitosamente")
            return response.data
        } catch (error: any) {
            console.error("❌ Error al crear objetivo:", error)
            console.error("📦 Datos que causaron el error:", {
                titulo: objetivoData.titulo,
                perspectiva_id: objetivoData.perspectiva_id
            })
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                "Error al crear objetivo"
            )
        }
    },

    // Actualizar objetivo
    async updateObjetivo(id: number, objetivoData: UpdateObjetivoData): Promise<Objetivo> {
        try {
            console.log(`🔄 Actualizando objetivo ${id}:`, objetivoData)
            const response = await api.put<Objetivo>(`/api/objetivos/${id}`, objetivoData)
            
            console.log("✅ Objetivo actualizado exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al actualizar objetivo ${id}:`, error)
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                "Error al actualizar objetivo"
            )
        }
    },

    // Eliminar objetivo
    async deleteObjetivo(id: number): Promise<void> {
        try {
            console.log(`🔄 Eliminando objetivo ${id}`)
            await api.delete(`/api/objetivos/${id}`)
            
            console.log("✅ Objetivo eliminado exitosamente")
        } catch (error: any) {
            console.error(`❌ Error al eliminar objetivo ${id}:`, error)
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                "Error al eliminar objetivo"
            )
        }
    },

    // Datos mock para desarrollo/fallback
    getMockObjetivos(): Objetivo[] {
        return [
            { 
                id: 1, 
                titulo: "Incrementar los ingresos en un 25% anual", 
                perspectiva_id: 1,
                createdAt: "2024-01-15T10:00:00Z"
            },
            { 
                id: 2, 
                titulo: "Mejorar la satisfacción del cliente al 90%", 
                perspectiva_id: 2,
                createdAt: "2024-01-16T11:00:00Z"
            },
            { 
                id: 3, 
                titulo: "Reducir tiempo de procesamiento en 30%", 
                perspectiva_id: 3,
                createdAt: "2024-01-17T12:00:00Z"
            },
            { 
                id: 4, 
                titulo: "Capacitar al 100% del personal en nuevas tecnologías", 
                perspectiva_id: 4,
                createdAt: "2024-01-18T13:00:00Z"
            },
        ]
    }
}
