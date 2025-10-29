import React, { useState } from 'react';
import {
    FileText,
    Download,
    BarChart3,
    TrendingUp,
    Users,
    BookOpen,
    Network,
    Filter,
    Calendar,
    FileSpreadsheet
} from 'lucide-react';
import ReportesDinamicos from '../components/ReportesDinamicos';
import EstudiantesModal from '../components/EstudiantesModal';
import { useReportesDinamicos } from '../hooks/useReportesDinamicos';
import { reportesService } from '../services/apiAdmin';
import toast from 'react-hot-toast';

const Reports = () => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('dinamicos');

    // Hook para manejar el estado del modal de estudiantes
    const {
        modalEstudiantes,
        cerrarModalEstudiantes,
        abrirModalEstudiantes
    } = useReportesDinamicos();

    // Función para exportar notas de todos los ciclos
    const exportarTodasLasNotas = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/reportes/exportar/notas-todos-ciclos?formato=excel`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `notas_todos_ciclos_${new Date().toISOString().split('T')[0]}.xlsx`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                toast.success('Archivo de notas descargado exitosamente');
            } else {
                throw new Error('Error en la descarga');
            }
        } catch (error) {
            toast.error('Error al exportar notas');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sistema de Reportes</h1>
                    <p className="text-gray-600">Visualización interactiva y exportación de datos académicos</p>
                </div>

                {/* Botones de exportación rápida */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={exportarTodasLasNotas}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>{loading ? 'Exportando...' : 'Exportar Todas las Notas'}</span>
                    </button>
                </div>
            </div>

            {/* Tabs para diferentes tipos de reportes */}
            <div className="w-full">
                <div className="flex border-b border-gray-200 mt-2">
                    <button
                        onClick={() => setActiveTab('dinamicos')}
                        className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'dinamicos'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Network className="w-4 h-4" />
                        <span>Reportes Dinámicos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('estadisticos')}
                        className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'estadisticos'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>Reportes Estadísticos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('exportacion')}
                        className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'exportacion'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Download className="w-4 h-4" />
                        <span>Exportación</span>
                    </button>
                </div>

                {/* Contenido de Reportes Dinámicos */}
                {activeTab === 'dinamicos' && (
                    <ReportesDinamicos abrirModalEstudiantes={abrirModalEstudiantes} />
                )}

                {/* Contenido de Reportes Estadísticos */}
                {activeTab === 'estadisticos' && (
                    <div className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="w-5 h-5" />
                                        <h3 className="text-lg font-medium">Rendimiento Académico</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Análisis de promedios, tasas de aprobación y tendencias por ciclo
                                    </p>
                                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                        <BarChart3 className="w-4 h-4" />
                                        <span>Ver Estadísticas</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-5 h-5" />
                                        <h3 className="text-lg font-medium">Análisis de Estudiantes</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Distribución de estudiantes por carrera, ciclo y rendimiento
                                    </p>
                                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                        <Users className="w-4 h-4" />
                                        <span>Ver Análisis</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="w-5 h-5" />
                                        <h3 className="text-lg font-medium">Análisis de Cursos</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Rendimiento por curso, docente y dificultad académica
                                    </p>
                                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                        <BookOpen className="w-4 h-4" />
                                        <span>Ver Cursos</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenido de Exportación */}
                {activeTab === 'exportacion' && (
                    <div className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <FileSpreadsheet className="w-5 h-5" />
                                        <h3 className="text-lg font-medium">Exportación de Notas</h3>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        <button
                                            onClick={exportarTodasLasNotas}
                                            disabled={loading}
                                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>{loading ? 'Exportando...' : 'Exportar Todas las Notas (Excel)'}</span>
                                        </button>

                                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                            <Calendar className="w-4 h-4" />
                                            <span>Exportar por Período</span>
                                        </button>

                                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                            <Filter className="w-4 h-4" />
                                            <span>Exportar con Filtros</span>
                                        </button>
                                    </div>

                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                        <p className="font-medium mb-1">Formatos disponibles:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Excel (.xlsx) - Recomendado para análisis</li>
                                            <li>CSV (.csv) - Compatible con otras herramientas</li>
                                            <li>PDF (.pdf) - Para reportes impresos</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="w-5 h-5" />
                                        <h3 className="text-lg font-medium">Reportes Personalizados</h3>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-sm text-gray-600">
                                        Crea reportes personalizados con filtros específicos y formatos adaptados a tus necesidades.
                                    </p>

                                    <div className="space-y-3">
                                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                            <BarChart3 className="w-4 h-4" />
                                            <span>Reporte de Rendimiento</span>
                                        </button>

                                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                            <Users className="w-4 h-4" />
                                            <span>Reporte de Estudiantes</span>
                                        </button>

                                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                            <BookOpen className="w-4 h-4" />
                                            <span>Reporte de Cursos</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de estudiantes - Se renderiza globalmente */}
            <EstudiantesModal 
                isOpen={modalEstudiantes.isOpen}
                onClose={cerrarModalEstudiantes}
                cursoId={modalEstudiantes.cursoId}
                cursoNombre={modalEstudiantes.cursoNombre}
            />
        </div>
    );
};

export default Reports;