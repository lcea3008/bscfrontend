import api from "./api"

// Interfaz para el objetivo que viene del backend (con perspectiva anidada)
export interface Objetivo {
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

// Interfaz para crear/actualizar objetivo
export interface CreateObjetivoData {
    nombre: string
    perspectivaId: number
}

export interface UpdateObjetivoData {
    nombre: string
    perspectivaId: number
}

export const objetivosService = {
    // Obtener todos los objetivos
    async getObjetivos(): Promise<Objetivo[]> {
        try {
            console.log("🔄 Obteniendo objetivos desde la API...")
            const response = await api.get<Objetivo[]>("/objetivos")
            
            console.log("✅ Objetivos obtenidos exitosamente:", response.data.length)
            return response.data
        } catch (error: any) {
            console.error("❌ Error al obtener objetivos:", error)
            
            // Si es error de red, timeout o servidor, usar datos mock para desarrollo
            if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.response?.status >= 500) {
                console.warn("⚠️ Usando datos mock debido a error del servidor")
                return this.getMockObjetivos()
            }
            
            // Para otros errores, también usar mock pero mostrar el error
            console.warn("⚠️ Usando datos mock debido a error:", error.message)
            return this.getMockObjetivos()
        }
    },

    // Obtener un objetivo por ID
    async getObjetivoById(id: number): Promise<Objetivo> {
        try {
            console.log(`🔄 Obteniendo objetivo con ID: ${id}`)
            const response = await api.get<Objetivo>(`/objetivos/${id}`)
            
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
                nombre: objetivoData.nombre,
                perspectivaId: objetivoData.perspectivaId
            })
            
            const response = await api.post<Objetivo>("/objetivos", objetivoData)
            
            console.log("✅ Objetivo creado exitosamente")
            return response.data
        } catch (error: any) {
            console.error("❌ Error al crear objetivo:", error)
            console.error("📦 Datos que causaron el error:", {
                nombre: objetivoData.nombre,
                perspectivaId: objetivoData.perspectivaId
            })
            
            // Mostrar mensaje específico para error 400
            if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || "Datos inválidos"
                console.error("🔴 Error 400 - Bad Request:", errorMessage)
                console.error("🔴 Detalles del backend:", error.response?.data)
                throw new Error(`Error de validación: ${errorMessage}`)
            }
            
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
            console.log(`🔄 Actualizando objetivo ${id}`)
            console.log("📦 Datos originales recibidos:", objetivoData)
            console.log("📦 Tipo de datos:", typeof objetivoData)
            console.log("📦 Keys del objeto:", Object.keys(objetivoData))
            console.log("📦 Values del objeto:", Object.values(objetivoData))
            
            // Asegurar que los datos estén en el formato correcto
            const dataToSend = {
                nombre: objetivoData.nombre,
                perspectivaId: objetivoData.perspectivaId
            }
            
            console.log("📦 Datos a enviar al backend:", dataToSend)
            console.log("📦 JSON stringify:", JSON.stringify(dataToSend))
            
            const response = await api.put<Objetivo>(`/objetivos/${id}`, dataToSend)
            
            console.log("✅ Objetivo actualizado exitosamente")
            return response.data
        } catch (error: any) {
            console.error(`❌ Error al actualizar objetivo ${id}:`, error)
            console.error("📦 Request config:", error.config)
            console.error("📦 Request data:", error.config?.data)
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
            await api.delete(`/objetivos/${id}`)
            
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
                perspectiva: {
                    id: 1,
                    nombre: "Financiera",
                    descripcion: "Perspectiva financiera que mide el desempeño económico y la rentabilidad"
                },
                createdAt: "2024-01-15T10:00:00Z"
            },
            { 
                id: 2, 
                titulo: "Mejorar la satisfacción del cliente al 90%", 
                perspectiva_id: 2,
                perspectiva: {
                    id: 2,
                    nombre: "Cliente",
                    descripcion: "Perspectiva del cliente que mide la satisfacción y retención"
                },
                createdAt: "2024-01-16T11:00:00Z"
            },
            { 
                id: 3, 
                titulo: "Reducir tiempo de procesamiento en 30%", 
                perspectiva_id: 3,
                perspectiva: {
                    id: 3,
                    nombre: "Procesos",
                    descripcion: "Perspectiva de procesos internos que mide la eficiencia operativa"
                },
                createdAt: "2024-01-17T12:00:00Z"
            },
            { 
                id: 4, 
                titulo: "Capacitar al 100% del personal en nuevas tecnologías", 
                perspectiva_id: 4,
                perspectiva: {
                    id: 4,
                    nombre: "Aprendizaje",
                    descripcion: "Perspectiva de aprendizaje y crecimiento del capital humano"
                },
                createdAt: "2024-01-18T13:00:00Z"
            },
        ]
    }
}
