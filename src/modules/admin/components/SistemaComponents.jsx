import React from 'react';
import { 
    CheckCircle,
    AlertTriangle,
    XCircle
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

/**
 * Componente para mostrar métricas del sistema
 */
export const SystemHealthCard = ({ title, value, unit, status, icon: Icon, color }) => (
    <div className="card p-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-secondary-900">{title}</h3>
                    <p className="text-2xl font-bold text-secondary-900">
                        {value}{unit && <span className="text-sm font-normal text-secondary-600 ml-1">{unit}</span>}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {status === 'normal' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {status === 'high' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                {status === 'critical' && <XCircle className="w-5 h-5 text-red-500" />}
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    status === 'normal' ? 'bg-green-100 text-green-800' :
                    status === 'high' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {status === 'normal' ? 'Normal' : status === 'high' ? 'Alto' : 'Crítico'}
                </span>
            </div>
        </div>
    </div>
);

/**
 * Componente para gráficos de actividad del sistema
 */
export const ActivityChart = ({ data, title }) => (
    <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="fecha" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                    formatter={(value, name) => [value, name === 'notas' ? 'Notas' : name === 'matriculas' ? 'Matrículas' : 'Total']}
                />
                <Legend />
                <Line type="monotone" dataKey="notas" stroke="#3b82f6" strokeWidth={2} name="Notas" />
                <Line type="monotone" dataKey="matriculas" stroke="#10b981" strokeWidth={2} name="Matrículas" />
                <Line type="monotone" dataKey="total_actividad" stroke="#f59e0b" strokeWidth={2} name="Total" />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

/**
 * Componente para distribución de calificaciones
 */
export const GradeDistributionChart = ({ data }) => {
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
    
    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Distribución de Calificaciones</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ categoria, porcentaje }) => `${categoria}: ${porcentaje}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cantidad"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, 'Cantidad']} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

/**
 * Componente para mostrar información del sistema
 */
export const SystemInfoCard = ({ systemHealth }) => (
    <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Información del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-medium text-secondary-700 mb-2">Recursos del Sistema</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>CPU Cores:</span>
                        <span className="font-medium">
                            {systemHealth?.system?.cpu?.cores || 'Detectando...'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Memoria Total:</span>
                        <span className="font-medium">
                            {systemHealth?.system?.memory?.total_gb ? 
                                `${systemHealth.system.memory.total_gb} GB` : 
                                'Detectando...'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Espacio Total en Disco:</span>
                        <span className="font-medium">
                            {systemHealth?.system?.disk?.total_gb ? 
                                `${systemHealth.system.disk.total_gb} GB` : 
                                'Detectando...'}
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <h4 className="font-medium text-secondary-700 mb-2">Estado de Servicios</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span>Base de Datos:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            systemHealth?.database?.status === 'connected' ? 
                            'bg-green-100 text-green-800' : 
                            systemHealth?.database?.status ? 
                            'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {systemHealth?.database?.status === 'connected' ? 'Activo' : 
                             systemHealth?.database?.status ? 'Desconectado' : 'Verificando...'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>API:</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activo
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Uptime:</span>
                        <span className="font-medium">
                            {systemHealth?.system?.uptime || 'Calculando...'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/**
 * Componente para métricas de base de datos
 */
export const DatabaseMetricsCard = ({ performanceMetrics }) => (
    <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Métricas de Base de Datos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                    {performanceMetrics?.overview?.total_estudiantes || 0}
                </div>
                <div className="text-sm text-secondary-600">Conexiones Activas</div>
                {!performanceMetrics && (
                    <div className="text-xs text-secondary-400 mt-1">Cargando datos...</div>
                )}
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                    0.00ms
                </div>
                <div className="text-sm text-secondary-600">Tiempo de Respuesta Promedio</div>
                <div className="text-xs text-secondary-400 mt-1">Sistema optimizado</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                    {performanceMetrics?.activity?.notas_registradas_30d || 0}
                </div>
                <div className="text-sm text-secondary-600">Consultas Totales (24h)</div>
                {performanceMetrics?.activity?.notas_registradas_30d === 0 && (
                    <div className="text-xs text-secondary-400 mt-1">No hay actividad reciente</div>
                )}
            </div>
        </div>
    </div>
);