import React, { useState } from 'react'
import config from '../config'

const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const testConnection = async () => {
    setStatus('testing')
    setMessage('Probando conexión...')
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/health`)
      if (response.ok) {
        setStatus('success')
        setMessage('✅ Conexión exitosa con el backend')
      } else {
        setStatus('error')
        setMessage(`❌ Error: ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Test de Conexión Backend</h3>
      <p className="text-sm text-gray-600 mb-3">
        Backend URL: <code className="bg-gray-200 px-1 rounded">{config.API_BASE_URL}</code>
      </p>
      
      <button 
        onClick={testConnection}
        disabled={status === 'testing'}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {status === 'testing' ? 'Probando...' : 'Probar Conexión'}
      </button>
      
      {message && (
        <div className={`mt-3 p-2 rounded ${
          status === 'success' ? 'bg-green-100 text-green-800' :
          status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default ConnectionTest
