import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, FileText, Settings, TrendingUp, Calendar, RefreshCw, BarChart3, UserPlus } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDashboard } from '../hooks/useDashboard';
import { dashboardService } from '../services/apiAdmin';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { dashboardData, estadisticasGenerales, estudiantesPorCiclo, selectedYear, availableYears, loading, error, refreshDashboard, changeYear } = useDashboard();
    const [gradeDistribution, setGradeDistribution] = useState([]);
    const [gradeLoading, setGradeLoading] = useState(false);

    // Cargar distribución de calificaciones
    useEffect(() => {
        loadGradeDistribution();
    }, []);

    const loadGradeDistribution = async () => {
        try {
            setGradeLoading(true);
            const data = await dashboardService.getGradeDistribution();
            setGradeDistribution(data);
        } catch (error) {
            console.error('Error loading grade distribution:', error);
            toast.error('Error al cargar la distribución de calificaciones');
        } finally {
            setGradeLoading(false);
        }
    };

    // Configuración del gráfico de barras
    const chartData = {
        labels: estudiantesPorCiclo.map(item => item.ciclo),
        datasets: [
            {
                label: 'Número de Estudiantes',
                data: estudiantesPorCiclo.map(item => item.numero_estudiantes),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    color: '#374151'
                }
            },
            title: {
                display: true,
                text: `Distribución de Estudiantes por Ciclo - ${selectedYear}`,
                font: {
                    size: 16,
                    weight: 'bold'
                },
                color: '#1f2937'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#374151',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `Estudiantes: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.3)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    },
                    stepSize: 1
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11,
                        weight: 'bold'
                    }
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    };

    // Cálculos para el análisis
    const totalEstudiantesCiclos = estudiantesPorCiclo.reduce((sum, item) => sum + item.numero_estudiantes, 0);
    const cicloConMasEstudiantes = estudiantesPorCiclo.reduce((max, item) =>
        item.numero_estudiantes > max.numero_estudiantes ? item : max,
        { ciclo: '', numero_estudiantes: 0 }
    );
    const promedioEstudiantesPorCiclo = estudiantesPorCiclo.length > 0
        ? Math.round(totalEstudiantesCiclos / estudiantesPorCiclo.length)
        : 0;
    React.useEffect(() => {
        if (error) {
            toast.error(String(error));
        }
    }, [error]);

    const recentActivity = [
        { id: 1, action: 'Nuevo estudiante registrado', time: '2 horas ago' },
        { id: 2, action: 'Curso actualizado', time: '4 horas ago' },
        { id: 3, action: 'Notas cargadas', time: '1 día ago' }
    ];

    const StatCard = ({ title, value, icon: Icon, color, link }) => (
        <Link to={link} className="block">
            <div className="card p-4 px-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-secondary-600">{title}</p>
                        <p className="text-3xl font-bold text-secondary-900">
                            {loading ? '...' : value}
                        </p>
                    </div>
                    <div className={`p-3 rounded-full ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </Link>
    );

    const QuickAction = ({ title, description, icon: Icon, link, color }) => (
        <Link to={link} className="card p-3 hover:shadow-lg transition-shadow cursor-pointer flex items-center space-x-2">
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="font-semibold text-secondary-900">{title}</h3>
                <p className="text-sm text-secondary-600 mt-1">{description}</p>
            </div>
        </Link>
    );

    return (
        <div className="space-y-4 p-3">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-secondary-900">Dashboard Administrativo</h1>
                <p className="text-secondary-600 text-sm">Gestiona usuarios, cursos y supervisa el sistema educativo</p>
            </div>

            {/* Estadísticas principales */}
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-800">Estadísticas Principales</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Estudiantes"
                        value={estadisticasGenerales?.total_estudiantes || dashboardData?.totalEstudiantes || 0}
                        icon={GraduationCap}
                        color="bg-green-500"
                        link="/admin/students"
                    />
                    <StatCard
                        title="Docentes"
                        value={estadisticasGenerales?.total_docentes || dashboardData?.totalDocentes || 0}
                        icon={Users}
                        color="bg-purple-500"
                        link="/admin/docentes"
                    />
                    <StatCard
                        title="Cursos"
                        value={estadisticasGenerales?.total_cursos || dashboardData?.totalCursos || 0}
                        icon={BookOpen}
                        color="bg-orange-500"
                        link="/admin/courses"
                    />
                    <StatCard
                        title="Promedio General"
                        value={estadisticasGenerales?.promedio_general ? `${estadisticasGenerales.promedio_general.toFixed(1)}` : (dashboardData?.promedioGeneral ? `${dashboardData.promedioGeneral.toFixed(1)}` : '0.0')}
                        icon={TrendingUp}
                        color="bg-blue-500"
                        link="/admin/analytics"
                    />
                </div>
            </div>

            {/* Gráfico de Estudiantes por Ciclo */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className='flex items-center justify-between'>
                    <h2 className="text-base font-semibold text-gray-800">Estudiantes por Ciclo Académico</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <select
                                value={selectedYear}
                                onChange={(e) => changeYear(parseInt(e.target.value))}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={refreshDashboard}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 300, }}>
                    {/* Gráfico */}
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : estudiantesPorCiclo.length > 0 ? (
                        <div className="flex-1" style={{ height: '100%' }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay datos disponibles para el año {selectedYear}</p>
                        </div>
                    )}

                    {/* Distribucion de calificaciones */}
                    <aside className='flex-1' style={{ height: '100%' }}>
                        <h3 className="text-base font-semibold text-gray-800 mb-2">Distribución de Calificaciones</h3>
                        {gradeLoading ? (
                            <div className="flex items-center justify-center h-48">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                        ) : gradeDistribution.length > 0 ? (
                            <div className="flex-1" style={{ height: 'calc(100% - 3rem)' }}>
                                <Pie
                                    data={{
                                        labels: gradeDistribution.map(item => `${item.categoria} - ${item.cantidad}`),
                                        datasets: [{
                                            data: gradeDistribution.map(item => item.cantidad),
                                            backgroundColor: [
                                                '#10b981', // Verde para Excelente
                                                '#3b82f6', // Azul para Bueno
                                                '#f59e0b', // Amarillo para Regular
                                                '#ef4444'  // Rojo para Deficiente
                                            ],
                                            borderWidth: 2,
                                            borderColor: '#ffffff',
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    font: { size: 10 },
                                                    padding: 10
                                                }
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        const item = gradeDistribution[context.dataIndex];
                                                        return `${item.categoria}: ${item.cantidad} (${item.porcentaje}%)`;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No hay datos de calificaciones disponibles</p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
            {/* Acciones rápidas */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <aside className="space-y-2">
                    {/* Resumen por ciclos */}
                    <h3 className="text-base font-semibold text-gray-700">Resumen por Ciclos</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {estudiantesPorCiclo.map((item, index) => (
                            <div key={item.ciclo} className="text-center p-3 card rounded-lg flex-1">
                                <div
                                    className="w-4 h-4 rounded-full mx-auto mb-2"
                                    style={{
                                        backgroundColor: chartData.datasets[0].backgroundColor[index]
                                    }}
                                ></div>
                                <div className="text-sm font-medium text-gray-600">Ciclo {item.ciclo}</div>
                                <div className="text-lg font-bold text-gray-800">{item.numero_estudiantes}</div>
                            </div>
                        ))}

                        {/* Distribucion de estudiantes */}
                        <div className="text-center p-3 card rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{totalEstudiantesCiclos}</div>
                            <div className="text-blue-700 text-sm">Total de Estudiantes</div>
                        </div>
                        <div className="text-center p-3 card rounded-lg">
                            <div className="text-xl font-bold text-green-600">
                                Ciclo {cicloConMasEstudiantes.ciclo}
                            </div>
                            <div className="text-green-700 text-sm">Ciclo con más estudiantes</div>
                            <div className="text-xs text-gray-600">({cicloConMasEstudiantes.numero_estudiantes} estudiantes)</div>
                        </div>
                        <div className="text-center p-3 card rounded-lg">
                            <div className="text-xl font-bold text-purple-600">{promedioEstudiantesPorCiclo}</div>
                            <div className="text-purple-700 text-sm">Promedio por ciclo</div>
                        </div>
                    </div>
                </aside>
                <aside className='space-y-2'>
                    <h2 className="text-base font-semibold text-gray-700">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <QuickAction
                            title="Crear Usuario"
                            description="Registrar nuevo estudiante, docente"
                            icon={UserPlus}
                            link="/admin/users/create"
                            color="bg-primary-500"
                        />
                        <QuickAction
                            title="Gestionar Cursos"
                            description="Crear, editar y asignar cursos"
                            icon={BookOpen}
                            link="/admin/courses"
                            color="bg-secondary-500"
                        />
                        <QuickAction
                            title="Ver Reportes"
                            description="Generar reportes de notas y estadísticas"
                            icon={BarChart3}
                            link="/admin/reports"
                            color="bg-green-500"
                        />
                        <QuickAction
                            title="Configuración"
                            description="Configurar parámetros del sistema"
                            icon={Settings}
                            link="/admin/settings"
                            color="bg-gray-500"
                        />
                        <QuickAction
                            title="Exportar Datos"
                            description="Exportar información en Excel o PDF"
                            icon={FileText}
                            link="/admin/export"
                            color="bg-indigo-500"
                        />
                        <QuickAction
                            title="Estadísticas"
                            description="Ver métricas detalladas del sistema"
                            icon={TrendingUp}
                            link="/admin/analytics"
                            color="bg-red-500"
                        />
                    </div>
                </aside>
            </div>

            {/* Actividad reciente */}
            <div>
                <h2 className="text-base font-semibold text-secondary-900 mb-2">Actividad Reciente</h2>
                <div className="card">
                    <div className="p-6">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse flex space-x-4">
                                        <div className="rounded-full bg-secondary-200 h-10 w-10"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-4">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-secondary-900">
                                                {activity.action}
                                            </p>
                                            <p className="text-xs text-secondary-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;