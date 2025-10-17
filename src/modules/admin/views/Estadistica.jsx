import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    GraduationCap,
    BookOpen,
    Filter,
    RefreshCw,
    Calendar
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useReportes } from '../hooks';
import { reportesService } from '../services/apiAdmin';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Estadistica = () => {
    const {
        estadisticasGenerales,
        loading,
        error,
        getEstadisticasGenerales,
        refreshReportes
    } = useReportes();

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    const [estudiantesPorCiclo, setEstudiantesPorCiclo] = useState([]);

    useEffect(() => {
        // Cargar años disponibles y datos iniciales
        loadAvailableYears();
        loadEstudiantesPorCiclo();
    }, [selectedYear]);

    const loadAvailableYears = async () => {
        try {
            // Los años se cargarán desde el backend junto con los datos de estudiantes
            // Mantener años por defecto como fallback
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let i = currentYear - 5; i <= currentYear + 1; i++) {
                years.push(i);
            }
            setAvailableYears(years);
        } catch (error) {
            console.error('Error loading years:', error);
        }
    };

    const loadEstudiantesPorCiclo = async () => {
        try {
            const data = await reportesService.getEstudiantesPorCiclo(selectedYear);
            setEstudiantesPorCiclo(data.estadisticas || []);

            // Actualizar años disponibles si vienen del backend
            if (data.años_disponibles && data.años_disponibles.length > 0) {
                setAvailableYears(data.años_disponibles);
            }
        } catch (error) {
            console.error('Error loading students by cycle:', error);
            // Mantener datos de ejemplo en caso de error
            const mockData = [
                { ciclo: 'I', numero_estudiantes: 25 },
                { ciclo: 'II', numero_estudiantes: 22 },
                { ciclo: 'III', numero_estudiantes: 18 },
                { ciclo: 'IV', numero_estudiantes: 20 },
                { ciclo: 'V', numero_estudiantes: 15 },
                { ciclo: 'VI', numero_estudiantes: 12 }
            ];
            setEstudiantesPorCiclo(mockData);
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

    const chartData = {
        labels: estudiantesPorCiclo.map(item => `Ciclo ${item.ciclo}`),
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
                    }
                }
            },
            title: {
                display: true,
                text: `Distribución de Estudiantes por Ciclo - ${selectedYear}`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y} estudiantes`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 11
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 11,
                        weight: 'bold'
                    }
                },
                grid: {
                    display: false
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex bg-red-50 border border-red-200 rounded-md p-4">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error al cargar las estadísticas</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                    <button
                        onClick={refreshReportes}
                        className="bg-red-100 mt-2 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Estadísticas Académicas</h1>
                    <p className="text-secondary-600 mt-2">Visualiza estadísticas detalladas del sistema académico</p>
                </div>
                <div className="flex items-center space-x-3">
                    {/* Year Filter */}
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-secondary-400" />
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="px-3 py-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={refreshReportes}
                        className="btn-secondary flex items-center space-x-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Actualizar</span>
                    </button>
                </div>
            </div>

            {/* General Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Students by Cycle Chart and Summary - Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Chart Section */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-secondary-900">Estudiantes por Ciclo</h2>
                            <p className="text-sm text-secondary-600 mt-1">Distribución de estudiantes según su ciclo académico actual</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-secondary-500">
                            <Filter className="w-4 h-4" />
                            <span>Año: {selectedYear}</span>
                        </div>
                    </div>
                    <div className="h-96">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Summary Section */}
                <div className='flex gap-4 flex-col'>
                    <aside className='card p-4'>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                            Resumen por Ciclos
                        </h3>
                        <div className="space-y-3 mb-6">
                            {estudiantesPorCiclo.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 rounded-full" style={{
                                            backgroundColor: chartData.datasets[0].backgroundColor[index]
                                        }}></div>
                                        <span className="font-medium text-secondary-900">Ciclo {item.ciclo}</span>
                                    </div>
                                    <span className="text-lg font-bold text-secondary-900">
                                        {item.numero_estudiantes}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Analysis Section within the same card */}
                    <aside className="card p-4 flex-1">
                        <h4 className="text-md font-semibold text-secondary-900 mb-4">
                            Análisis de Distribución
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-secondary-600">Total de Estudiantes:</span>
                                <span className="font-bold text-secondary-900">
                                    {estudiantesPorCiclo.reduce((sum, item) => sum + item.numero_estudiantes, 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-secondary-600">Ciclo con más estudiantes:</span>
                                <span className="font-bold text-secondary-900">
                                    {estudiantesPorCiclo.length > 0
                                        ? `Ciclo ${estudiantesPorCiclo.reduce((max, item) =>
                                            item.numero_estudiantes > max.numero_estudiantes ? item : max
                                        ).ciclo}`
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-secondary-600">Promedio por ciclo:</span>
                                <span className="font-bold text-secondary-900">
                                    {estudiantesPorCiclo.length > 0
                                        ? Math.round(estudiantesPorCiclo.reduce((sum, item) => sum + item.numero_estudiantes, 0) / estudiantesPorCiclo.length)
                                        : 0
                                    }
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Estadistica;