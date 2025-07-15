import { Layout } from "../components/Layout"

export default function MapaEstrategico() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mapa Estratégico</h1>
            <p className="text-gray-600">Visualización de la estrategia organizacional</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mapa Estratégico</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Esta sección mostrará el mapa estratégico visual con las perspectivas y sus relaciones.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
