import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Users,
    TrendingUp,
    FileText,
    Calendar,
    Award,
    Clock,
    AlertTriangle,
    CheckCircle,
    Target,
    BarChart3,
    Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../auth/store/authStore';
import { dashboardService } from '../services/apiTeacher';

const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="card p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-secondary-600">{title}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                {subtitle && (
                    <p className="text-xs text-secondary-500 mt-1">{subtitle}</p>
                )}
                {trend && (
                    <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">{trend}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
        </div>
    </div>
);

const QuickAction = ({ title, description, icon: Icon, to, color }) => (
    <Link
        to={to}
        className="card p-4 hover:shadow-lg group"
    >
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-secondary-600">{description}</p>
            </div>
        </div>
    </Link>
);

// Componente de barra de progreso
const ProgressBar = ({ label, current, max, color = "bg-blue-500" }) => {
    const percentage = max > 0 ? Math.round((current / max) * 100) : 0;

    return (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-secondary-700">{label}</span>
                <span className="text-xs text-secondary-600">{current}/{max} - {percentage}%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${color}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

const CourseCard = ({ curso }) => {

    return (
        <div className="card p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-secondary-900">{curso.nombre} - {curso.ciclo_nombre} {curso.ciclo_año}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="flex items-center gap-2 justify-center p-2 bg-secondary-100 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">{curso.total_estudiantes}</p>
                    <p className="text-xs text-secondary-600">Estudiantes</p>
                </div>
                <div className="flex items-center gap-2 justify-center p-2 bg-secondary-100 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{curso.total_notas_registradas || 0}</p>
                    <p className="text-xs text-secondary-600">Notas Registradas</p>
                </div>
            </div>

            {/* Barras de progreso para tipos de notas */}
            <h4 className="text-sm font-semibold text-secondary-800 mb-2">Progreso de Evaluaciones</h4>
            <ProgressBar
                label="Evaluaciones"
                current={curso.total_evaluaciones || 0}
                max={curso.max_evaluaciones || 0}
                color="bg-blue-500"
            />

            <ProgressBar
                label="Prácticas"
                current={curso.total_practicas || 0}
                max={curso.max_practicas || 0}
                color="bg-green-500"
            />

            <ProgressBar
                label="Parciales"
                current={curso.total_parciales || 0}
                max={curso.max_parciales || 0}
                color="bg-purple-500"
            />

            <div className="grid grid-cols-2 gap-4 mb-3 mt-3">
                <div className="flex items-center justify-center gap-3 bg-secondary-100">
                    <p className="text-lg font-semibold text-green-600">{curso.estudiantes_aprobados || 0}</p>
                    <p className="text-xs text-secondary-600">Aprobados</p>
                </div>
                <div className="flex items-center justify-center gap-3 bg-secondary-100">
                    <p className="text-lg font-semibold text-red-600">{curso.estudiantes_desaprobados || 0}</p>
                    <p className="text-xs text-secondary-600">Desaprobados</p>
                </div>
            </div>

            {curso.promedio_curso && (
                <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-sm text-secondary-600">Promedio General:</span>
                    <span className={`font-semibold ${curso.promedio_curso >= 13 ? 'text-green-600' : 'text-red-600'}`}>{curso.promedio_curso}</span>
                </div>
            )}
        </div>
    );
};

const ActivityItem = ({ actividad }) => {
    const getActivityIcon = (tipo) => {
        switch (tipo) {
            case 'NOTA_ACTUALIZADA': return CheckCircle;
            case 'NOTA_CREADA': return Target;
            default: return Clock;
        }
    };

    const getActivityColor = (tipo) => {
        switch (tipo) {
            case 'NOTA_ACTUALIZADA': return 'text-blue-600';
            case 'NOTA_CREADA': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const Icon = getActivityIcon(actividad.tipo);
    const color = getActivityColor(actividad.tipo);

    return (
        <div className="flex items-start space-x-2 p-3 hover:bg-secondary-50 rounded-lg transition-colors">
            <div className={`p-2 rounded-full bg-secondary-100`}>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900">
                    {actividad.descripcion}
                </p>
                <p className="text-xs text-secondary-600 mt-1">
                    {actividad.curso} • {actividad.tiempo_relativo}
                </p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuthStore();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getDashboard();
            setDashboardData(response);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            toast.error('Error al cargar los datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Header skeleton */}
                <div className="animate-pulse">
                    <div className="h-8 bg-secondary-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                </div>

                {/* Stats skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card p-6 animate-pulse">
                            <div className="h-4 bg-secondary-200 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-secondary-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-secondary-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        Error al cargar el dashboard
                    </h3>
                    <p className="text-secondary-600 mb-4">
                        No se pudieron cargar los datos del dashboard
                    </p>
                    <button
                        onClick={loadDashboardData}
                        className="btn btn-primary"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const { docente_info, cursos_actuales, estadisticas_generales, actividad_reciente } = dashboardData;

    return (
        <div className="space-y-3 p-3">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">¡Bienvenido, {docente_info.nombres}!</h1>
                    <p className="text-secondary-600 mt-1">Aquí tienes un resumen de tu actividad académica</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-secondary-600">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            {/* Main Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Mis Cursos"
                    value={estadisticas_generales.total_cursos}
                    icon={BookOpen}
                    color="text-primary-600"
                    subtitle="Cursos activos"
                />
                <StatCard
                    title="Estudiantes"
                    value={estadisticas_generales.total_estudiantes}
                    icon={Users}
                    color="text-blue-600"
                    subtitle={`Promedio: ${estadisticas_generales.promedio_estudiantes_por_curso} por curso`}
                />
                <StatCard
                    title="Notas Pendientes"
                    value={estadisticas_generales.total_notas_pendientes}
                    icon={Clock}
                    color="text-orange-600"
                    subtitle="Requieren calificación"
                />
                <StatCard
                    title="Promedio General"
                    value={estadisticas_generales.promedio_general_docente || 'N/A'}
                    icon={Award}
                    color={estadisticas_generales.promedio_general_docente >= 13 ? "text-green-600" : "text-red-600"}
                    subtitle="Todos los cursos"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickAction
                    title="Subir Calificaciones"
                    description="Actualizar notas de estudiantes"
                    icon={TrendingUp}
                    to="/docente/grades"
                    color="text-green-600"
                />
                <QuickAction
                    title="Ver Reportes"
                    description="Generar reportes de rendimiento"
                    icon={FileText}
                    to="/docente/reports"
                    color="text-blue-600"
                />
                <QuickAction
                    title="Ver Mis Cursos"
                    description="Mis asignados"
                    icon={BookOpen}
                    to="/docente/courses"
                    color="text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* My Courses */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-semibold text-secondary-900">Mis Cursos</h2>
                    </div>

                    {cursos_actuales.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {cursos_actuales.map((curso) => (
                                <CourseCard key={curso.id} curso={curso} />
                            ))}
                        </div>
                    ) : (
                        <div className="card p-8 text-center">
                            <BookOpen className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-secondary-900 mb-2">
                                No tienes cursos asignados
                            </h3>
                            <p className="text-secondary-600">
                                Contacta al administrador para que te asigne cursos
                            </p>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-semibold text-secondary-900">
                            Actividad Reciente
                        </h2>
                        <BarChart3 className="w-5 h-5 text-secondary-400" />
                    </div>

                    {actividad_reciente.length > 0 ? (
                        <div className="card p-1">
                            {actividad_reciente.slice(0, 8).map((actividad, index) => (
                                <ActivityItem key={index} actividad={actividad} />
                            ))}
                        </div>
                    ) : (
                        <div className="card p-8 text-center">
                            <Clock className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-secondary-900 mb-2">
                                Sin actividad reciente
                            </h3>
                            <p className="text-secondary-600">
                                La actividad aparecerá aquí cuando realices acciones
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;