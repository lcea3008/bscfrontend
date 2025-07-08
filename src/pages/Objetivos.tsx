import { useEffect, useState } from "react"
import api from "../services/api"

interface Objetivo {
  id: string
  title: string
  perspectiva: string
}

export default function Objetivos() {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])

  useEffect(() => {
    api.get("/objetivos").then((res) => setObjetivos(res.data))
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Objetivos Estratégicos</h2>
      <ul className="space-y-2">
        {objetivos.map((o) => (
          <li key={o.id} className="bg-white p-4 rounded shadow">
            <strong>{o.title}</strong> – {o.perspectiva}
          </li>
        ))}
      </ul>
    </div>
  )
}
