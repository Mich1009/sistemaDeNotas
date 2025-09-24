import { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    UserPlus,
    FileText,
    Settings,
    BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userService, academicService, gradesService } from '../services/apiAdmin';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalStudents: 0,
        totalTeachers: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Cargar estadísticas básicas
            const [users, courses] = await Promise.all([
                userService.getUsers(),
                academicService.getCourses()
            ]);

            const students = users.filter(user => user.role === 'estudiante');
            const teachers = users.filter(user => user.role === 'docente');

            setStats({
                totalUsers: users.length,
                totalCourses: courses.length,
                totalStudents: students.length,
                totalTeachers: teachers.length,
                recentActivity: [
                    { id: 1, action: 'Nuevo estudiante registrado', time: '2 horas ago' },
                    { id: 2, action: 'Curso actualizado', time: '4 horas ago' },
                    { id: 3, action: 'Notas cargadas', time: '1 día ago' }
                ]
            });

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            toast.error('Error al cargar los datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, link }) => (
        <Link to={link} className="block">
            <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
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
        <Link to={link} className="block">
            <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-secondary-900">{title}</h3>
                        <p className="text-sm text-secondary-600 mt-1">{description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-secondary-900">Dashboard Administrativo</h1>
                <p className="text-secondary-600 mt-2">
                    Gestiona usuarios, cursos y supervisa el sistema educativo
                </p>
            </div>

            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Usuarios"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-blue-500"
                    link="/admin/users"
                />
                <StatCard
                    title="Estudiantes"
                    value={stats.totalStudents}
                    icon={GraduationCap}
                    color="bg-green-500"
                    link="/admin/users?role=estudiante"
                />
                <StatCard
                    title="Docentes"
                    value={stats.totalTeachers}
                    icon={Users}
                    color="bg-purple-500"
                    link="/admin/users?role=docente"
                />
                <StatCard
                    title="Cursos"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    color="bg-orange-500"
                    link="/admin/courses"
                />
            </div>

            {/* Acciones rápidas */}
            <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuickAction
                        title="Crear Usuario"
                        description="Registrar nuevo estudiante, docente o administrador"
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
            </div>

            {/* Actividad reciente */}
            <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Actividad Reciente</h2>
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
                                {stats.recentActivity.map((activity) => (
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