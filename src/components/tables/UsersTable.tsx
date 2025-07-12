"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { UserModal } from "./modals/UserModal"
import { UserDetailModal } from "./modals/UserDetailModal"
import { usersService, type User, type CreateUserData, type UpdateUserData } from "../../services/usersService"

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar usuarios desde la API
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedUsers = await usersService.getUsers()
      setUsers(fetchedUsers)
      setFilteredUsers(fetchedUsers)
    } catch (err: any) {
      console.error("Error al cargar usuarios:", err)
      setError(err.message || "Error al cargar usuarios")
      // En caso de error, usar datos mock
      const mockUsers = usersService.getMockUsers()
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        setLoading(true)
        await usersService.deleteUser(id)
        // Recargar la lista de usuarios después de eliminar
        await loadUsers()
      } catch (err: any) {
        console.error("Error al eliminar usuario:", err)
        setError(err.message || "Error al eliminar usuario")
        // Si falla la eliminación en el servidor, quitar localmente para UX
        setUsers(users.filter((user) => user.id !== id))
        setFilteredUsers(filteredUsers.filter((user) => user.id !== id))
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSave = async (userData: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      
      if (selectedUser) {
        // Editar usuario existente
        const updateData: UpdateUserData = {
          nombre: userData.nombre,
          email: userData.email,
          role: userData.role,
          password: userData.password // Solo incluir si se proporciona
        }
        console.log("📝 Actualizando usuario:", updateData)
        await usersService.updateUser(selectedUser.id, updateData)
      } else {
        // Crear nuevo usuario - formato exacto para el backend
        const createData: CreateUserData = {
          nombre: userData.nombre,
          email: userData.email,
          password: userData.password || "", // Requerido para creación
          role: userData.role
        }
        console.log("✨ Creando usuario con formato backend:", createData)
        await usersService.createUser(createData)
      }
      
      // Recargar la lista de usuarios
      await loadUsers()
      setIsModalOpen(false)
      setSelectedUser(null)
    } catch (err: any) {
      console.error("Error al guardar usuario:", err)
      setError(err.message || "Error al guardar usuario")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 underline mt-2"
          >
            Cerrar
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadUsers}
            variant="outline"
            disabled={loading}
            className="text-gray-600 hover:text-gray-800"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            onClick={() => {
              setSelectedUser(null)
              setIsModalOpen(true)
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar usuarios..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rol</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "Administrador" || user.role === "Admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "Supervisor"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(user)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleSave}
        user={selectedUser}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
      />
    </div>
  )
}
