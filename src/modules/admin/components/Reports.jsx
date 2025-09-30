import React, { useState } from 'react';
import { 
    FileText, 
    Download, 
    BarChart3, 
    TrendingUp, 
    Users, 
    BookOpen,
    GraduationCap,
    Calendar,
    Filter,
    RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useReportes } from '../hooks';

const Reports = () => {
    const { 
        estadisticasGenerales,
        rendimientoEstudiantes,
        rendimientoCursos,
        loading, 
        error, 
        getEstadisticasGenerales,
        getRendimientoEstudiantes,
        getRendimientoCursos,
        exportarEstudiantes,
        exportarDocentes,
        exportarNotas,
        refreshReportes
    } = useReportes();

    const [activeTab, setActiveTab] = useState('estadisticas');
    const [dateRange, setDateRange] = useState({
        fechaInicio: '',
        fechaFin: ''
    });

    const handleExport = async (type) => {
        try {
            let blob;
            let filename;
            
            switch (type) {
                case 'estudiantes':
                    blob = await exportarEstudiantes();
                    filename = 'estudiantes.xlsx';
                    break;
                case 'docentes':
                    blob = await exportarDocentes();
                    filename = 'docentes.xlsx';
                    break;
                case 'notas':
                    blob = await exportarNotas();
                    filename = 'notas.xlsx';
                    break;
                default:
                    throw new Error('Tipo de exportación no válido');
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            toast.success(`${type} exportado exitosamente`);
        } catch (error) {
            toast.error(`Error al exportar ${type}`);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, change }) => (
        <div className="card p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-secondary-600">{title}</p>
                    <p className="text-2xl font-bold text-secondary-900">{value}</p>
                    {change && (
                        <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change}% vs mes anterior
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    const ExportCard = ({ title, description, icon: Icon, color, onExport, type }) => (
        <div className="card p-6">
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900">{title}</h3>
                    <p className="text-sm text-secondary-600">{description}</p>
                </div>
                <button
                    onClick={() => onExport(type)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Download className="w-4 h-4" />
                    <span>Exportar</span>
                </button>
            </div>
        </div>
    );

    const PerformanceTable = ({ data, title, type }) => (
        <div className="card">
            <div className="px-6 py-4 border-b border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                {type === 'estudiantes' ? 'Estudiante' : 'Curso'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                Promedio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                Estado
                            </th>
                            {type === 'estudiantes' && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    Cursos
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-secondary-200">
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-secondary-900">
                                        {type === 'estudiantes' 
                                            ? `${item.nombres} ${item.apellidos}`
                                            : item.nombre
                                        }
                                    </div>
                                    {type === 'estudiantes' && (
                                        <div className="text-sm text-secondary-500">
                                            DNI: {item.dni}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        item.promedio >= 14 
                                            ? 'bg-green-100 text-green-800'
                                            : item.promedio >= 11
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {item.promedio?.toFixed(2) || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        item.promedio >= 11 
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {item.promedio >= 11 ? 'Aprobado' : 'Desaprobado'}
                                    </span>
                                </td>
                                {type === 'estudiantes' && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                                        {item.total_cursos || 0}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Reportes y Estadísticas</h1>
                    <p className="text-secondary-600 mt-2">
                        Visualiza estadísticas y exporta datos del sistema
                    </p>
                </div>
                <button
                    onClick={refreshReportes}
                    className="btn-secondary flex items-center space-x-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Actualizar</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="card">
                <div className="border-b border-secondary-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { key: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
                            { key: 'rendimiento', label: 'Rendimiento', icon: TrendingUp },
                            { key: 'exportar', label: 'Exportar Datos', icon: Download }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === key
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'estadisticas' && (
                <div className="space-y-6">
                    {/* General Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Estudiantes"
                            value={estadisticasGenerales?.total_estudiantes || 0}
                            icon={Users}
                            color="bg-blue-500"
                            change={estadisticasGenerales?.cambio_estudiantes}
                        />
                        <StatCard
                            title="Total Docentes"
                            value={estadisticasGenerales?.total_docentes || 0}
                            icon={GraduationCap}
                            color="bg-green-500"
                            change={estadisticasGenerales?.cambio_docentes}
                        />
                        <StatCard
                            title="Total Cursos"
                            value={estadisticasGenerales?.total_cursos || 0}
                            icon={BookOpen}
                            color="bg-purple-500"
                            change={estadisticasGenerales?.cambio_cursos}
                        />
                        <StatCard
                            title="Promedio General"
                            value={estadisticasGenerales?.promedio_general?.toFixed(2) || '0.00'}
                            icon={BarChart3}
                            color="bg-orange-500"
                            change={estadisticasGenerales?.cambio_promedio}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'rendimiento' && (
                <div className="space-y-6">
                    {/* Date Range Filter */}
                    <div className="card p-6">
                        <div className="flex items-center space-x-4">
                            <Filter className="w-5 h-5 text-secondary-400" />
                            <div className="flex items-center space-x-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">
                                        Fecha Inicio
                                    </label>
                                    <input
                                        type="date"
                                        value={dateRange.fechaInicio}
                                        onChange={(e) => setDateRange(prev => ({
                                            ...prev,
                                            fechaInicio: e.target.value
                                        }))}
                                        className="mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700">
                                        Fecha Fin
                                    </label>
                                    <input
                                        type="date"
                                        value={dateRange.fechaFin}
                                        onChange={(e) => setDateRange(prev => ({
                                            ...prev,
                                            fechaFin: e.target.value
                                        }))}
                                        className="mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        getRendimientoEstudiantes(dateRange);
                                        getRendimientoCursos(dateRange);
                                    }}
                                    className="btn-primary mt-6"
                                >
                                    Filtrar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Performance Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PerformanceTable
                            data={rendimientoEstudiantes}
                            title="Rendimiento de Estudiantes"
                            type="estudiantes"
                        />
                        <PerformanceTable
                            data={rendimientoCursos}
                            title="Rendimiento de Cursos"
                            type="cursos"
                        />
                    </div>
                </div>
            )}

            {activeTab === 'exportar' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ExportCard
                            title="Exportar Estudiantes"
                            description="Descarga la lista completa de estudiantes en formato Excel"
                            icon={Users}
                            color="bg-blue-500"
                            onExport={handleExport}
                            type="estudiantes"
                        />
                        <ExportCard
                            title="Exportar Docentes"
                            description="Descarga la lista completa de docentes en formato Excel"
                            icon={GraduationCap}
                            color="bg-green-500"
                            onExport={handleExport}
                            type="docentes"
                        />
                        <ExportCard
                            title="Exportar Notas"
                            description="Descarga todas las calificaciones en formato Excel"
                            icon={FileText}
                            color="bg-purple-500"
                            onExport={handleExport}
                            type="notas"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;