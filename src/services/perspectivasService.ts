import api from "./api"

// Interfaz para la perspectiva que viene del backend
export interface Perspectiva {
    id: number
    nombre: string
    descripcion: string
    createdAt?: string
    updatedAt?: string
}

// Interfaz para crear/actualizar perspectiva
export interface CreatePerspectivaData {
    nombre: string
    descripcion: string
}

export interface UpdatePerspectivaData {
    nombre: string
    descripcion: string
}

export const perspectivasService = {
    // Obtener todas las perspectivas
    async getPerspectivas(): Promise<Perspectiva[]> {
        try {
            console.log("🔄 Obteniendo perspectivas desde la API...")
            const response = await api.get<Perspectiva[]>("/perspectivas")
            
            console.log("✅ Perspectivas obtenidas exitosamente:", response.data.length)
            return response.data
        } catch (error: any) {
            console.error("❌ Error al obtener perspectivas:", error)
            
            // Si es error de red, timeout o servidor, usar datos mock para desarrollo
            if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.response?.status >= 500) {
                console.warn("⚠️ Usando datos mock debido a error del servidor")
                return this.getMockPerspectivas()
            }
            
            // Para cualquier otro error, también usar mock
            console.warn("⚠️ Usando datos mock debido a error:", error.message)
            return this.getMockPerspectivas()
        }
    },

    // Obtener una perspectiva por ID
    async getPerspectivaById(id: number): Promise<Perspectiva> {
        try {
            console.log(`🔄 Obteniendo perspectiva con ID: ${id}`)
            const response = await api.get<Perspectiva>(`/perspectivas/${id}`)
            
            console.log("✅ Perspectiva obtenida exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al obtener perspectiva ${id}:`, error)
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                "Error al obtener perspectiva"
            )
        }
    },

    // Crear nueva perspectiva
    async createPerspectiva(perspectivaData: CreatePerspectivaData): Promise<Perspectiva> {
        try {
            console.log("🔄 Creando nueva perspectiva...")
            console.log("📦 Datos enviados al backend:", {
                nombre: perspectivaData.nombre,
                descripcion: perspectivaData.descripcion
            })
            
            const response = await api.post<Perspectiva>("/perspectivas", perspectivaData)
            
            console.log("✅ Perspectiva creada exitosamente")
            return response.data
        } catch (error: any) {
            console.error("❌ Error al crear perspectiva:", error)
            console.error("📦 Datos que causaron el error:", {
                nombre: perspectivaData.nombre,
                descripcion: perspectivaData.descripcion
            })
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                "Error al crear perspectiva"
            )
        }
    },

    // Actualizar perspectiva
    async updatePerspectiva(id: number, perspectivaData: UpdatePerspectivaData): Promise<Perspectiva> {
        try {
            console.log(`🔄 Actualizando perspectiva ${id}:`, perspectivaData)
            const response = await api.put<Perspectiva>(`/perspectivas/${id}`, perspectivaData)
            
            console.log("✅ Perspectiva actualizada exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al actualizar perspectiva ${id}:`, error)
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                "Error al actualizar perspectiva"
            )
        }
    },

    // Eliminar perspectiva
    async deletePerspectiva(id: number): Promise<void> {
        try {
            console.log(`🔄 Eliminando perspectiva ${id}`)
            await api.delete(`/perspectivas/${id}`)
            
            console.log("✅ Perspectiva eliminada exitosamente")
        } catch (error: any) {
            console.error(`❌ Error al eliminar perspectiva ${id}:`, error)
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                "Error al eliminar perspectiva"
            )
        }
    },

    // Datos mock para desarrollo/fallback
    getMockPerspectivas(): Perspectiva[] {
        return [
            { 
                id: 1, 
                nombre: "Financiera", 
                descripcion: "Perspectiva financiera de la organización que mide el rendimiento económico",
                createdAt: "2024-01-15T10:00:00Z"
            },
            { 
                id: 2, 
                nombre: "Cliente", 
                descripcion: "Perspectiva centrada en el cliente y la satisfacción de sus necesidades",
                createdAt: "2024-01-16T11:00:00Z"
            },
            { 
                id: 3, 
                nombre: "Procesos Internos", 
                descripcion: "Perspectiva de procesos internos que generan valor para los clientes",
                createdAt: "2024-01-17T12:00:00Z"
            },
            { 
                id: 4, 
                nombre: "Aprendizaje y Crecimiento", 
                descripcion: "Perspectiva de desarrollo del capital humano e innovación organizacional",
                createdAt: "2024-01-18T13:00:00Z"
            },
        ]
    }
}