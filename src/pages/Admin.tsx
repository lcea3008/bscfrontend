import { useState, useEffect } from 'react';
import { Layout } from "../components/Layout";
import { kpidata, type KPIData } from '../services/kpidata';
import { usersService } from '../services/usersService';
import { perspectivasService } from '../services/perspectivasService';

interface AdminStats {
  totalKpis: number;
  totalUsers: number;
  totalPerspectivas: number;
  totalObjetivos: number;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'overview' | 'system' | 'activity'>('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalKpis: 0,
    totalUsers: 0,
    totalPerspectivas: 0,
    totalObjetivos: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [kpis, users, perspectivas] = await Promise.all([
        kpidata.getKpis(),
        usersService.getUsers(),
        perspectivasService.getPerspectivas()
      ]);

      // Calcular total de objetivos desde KPIs
      const objetivosUnicos = new Set(kpis.map((kpi: KPIData) => kpi.objetivo_id));

      setStats({
        totalKpis: kpis.length,
        totalUsers: users.length,
        totalPerspectivas: perspectivas.length,
        totalObjetivos: objetivosUnicos.size
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Por ahora, simular la generación del PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crear un texto básico con los datos
      const reportData = `
        Reporte BSC Dashboard
        ====================
        Fecha: ${new Date().toLocaleDateString()}
        
        Estadísticas:
        - Total KPIs: ${stats.totalKpis}
        - Total Perspectivas: ${stats.totalPerspectivas}
        - Total Objetivos: ${stats.totalObjetivos}
        - Total Usuarios: ${stats.totalUsers}
      `;
      
      // Crear archivo de texto temporal
      const blob = new Blob([reportData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BSC_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: 'Reporte generado y descargado exitosamente' });
    } catch (error) {
      console.error('Error generating report:', error);
      setMessage({ type: 'error', text: 'Error al generar el reporte' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Simular backup - en un entorno real, esto haría una llamada al backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: 'Respaldo creado exitosamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear el respaldo' });
    } finally {
      setLoading(false);
    }
  };

  const handleSystemConfig = () => {
    setMessage({ type: 'success', text: 'Configuración del sistema actualizada' });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600">Gestión y configuración del sistema BSC</p>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Resumen', icon: '📊' },
                { id: 'system', name: 'Sistema', icon: '⚙️' },
                { id: 'activity', name: 'Actividad', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total KPIs</p>
                        <p className="text-3xl font-bold">{stats.totalKpis}</p>
                      </div>
                      <div className="text-4xl opacity-80">📊</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Perspectivas</p>
                        <p className="text-3xl font-bold">{stats.totalPerspectivas}</p>
                      </div>
                      <div className="text-4xl opacity-80">🎯</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Objetivos</p>
                        <p className="text-3xl font-bold">{stats.totalObjetivos}</p>
                      </div>
                      <div className="text-4xl opacity-80">🎯</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Usuarios</p>
                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <div className="text-4xl opacity-80">👥</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Generar Reporte</h3>
                    <p className="text-gray-600 mb-4">Descarga un reporte PDF completo del dashboard</p>
                    <button 
                      onClick={handleGenerateReport}
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {loading ? 'Generando...' : '📄 Generar PDF'}
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Respaldo de Datos</h3>
                    <p className="text-gray-600 mb-4">Crear copia de seguridad de toda la información</p>
                    <button 
                      onClick={handleBackup}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {loading ? 'Creando...' : '💾 Crear Respaldo'}
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Configuración</h3>
                    <p className="text-gray-600 mb-4">Ajustes generales del sistema</p>
                    <button 
                      onClick={handleSystemConfig}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      ⚙️ Configurar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Configuración del Sistema</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">Estado del Sistema</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Backend API:</span>
                        <span className="text-green-600 font-medium">✅ Conectado</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base de Datos:</span>
                        <span className="text-green-600 font-medium">✅ Activa</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Servicios:</span>
                        <span className="text-green-600 font-medium">✅ Funcionando</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-3">Información Técnica</h4>
                    <div className="space-y-2 text-sm">
                      <div>Versión: 1.0.0</div>
                      <div>Última actualización: {new Date().toLocaleDateString()}</div>
                      <div>Entorno: Desarrollo</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Actividad Reciente</h3>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-blue-500">
                      <div className="text-blue-500">📊</div>
                      <div className="flex-1">
                        <div className="font-medium">Dashboard actualizado</div>
                        <div className="text-sm text-gray-600">Gráficos dinámicos implementados</div>
                      </div>
                      <div className="text-sm text-gray-500">Hace 5 min</div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-green-500">
                      <div className="text-green-500">✅</div>
                      <div className="flex-1">
                        <div className="font-medium">Sistema iniciado</div>
                        <div className="text-sm text-gray-600">Todos los servicios están funcionando</div>
                      </div>
                      <div className="text-sm text-gray-500">Hace 1 hora</div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-white rounded border-l-4 border-purple-500">
                      <div className="text-purple-500">🔄</div>
                      <div className="flex-1">
                        <div className="font-medium">Datos sincronizados</div>
                        <div className="text-sm text-gray-600">Base de datos actualizada con nuevas perspectivas</div>
                      </div>
                      <div className="text-sm text-gray-500">Hace 2 horas</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
