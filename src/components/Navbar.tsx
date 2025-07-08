import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link to="/dashboard" className="mr-4 hover:underline">Dashboard</Link>
        {user.role === "ADMIN" && <Link to="/objetivos" className="hover:underline">Objetivos</Link>}
      </div>
      <div>
        <span className="mr-4">{user.role}</span>
        <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">Salir</button>
      </div>
    </nav>
  )
}
