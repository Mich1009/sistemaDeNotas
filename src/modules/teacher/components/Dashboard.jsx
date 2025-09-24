import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  FileText, 
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../auth/store/authStore';
import { academicService, gradesService } from '../services/apiTeacher';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    myCourses: [],
    totalStudents: 0,
    pendingGrades: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar cursos del docente
      const courses = await academicService.getCourses();
      const myCourses = courses.filter(course => course.docente_id === user.id);
      
      // Calcular estadísticas
      const totalStudents = myCourses.reduce((sum, course) => sum + (course.enrolled_count || 0), 0);
      
      setStats({
        myCourses,
        totalStudents,
        pendingGrades: 5, // Esto debería venir de la API
        recentActivity: [
          { id: 1, action: 'Notas actualizadas en Matemáticas I', time: '1 hora ago' },
          { id: 2, action: 'Nuevo estudiante matriculado', time: '3 horas ago' },
          { id: 3, action: 'Reporte generado', time: '1 día ago' }
        ]
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-3xl font-bold text-secondary-900">
            {loading ? '...' : value}
          </p>
          {subtitle && (
            <p className="text-xs text-secondary-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <Link to={`/docente/courses/${course.id}`} className="block">
      <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-secondary-900 mb-2">{course.nombre}</h3>
            <p className="text-sm text-secondary-600 mb-3">{course.descripcion}</p>
            
            <div className="flex items-center space-x-4 text-xs text-secondary-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course.enrolled_count || 0} estudiantes
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {course.ciclo?.nombre || 'Sin ciclo'}
              </div>
            </div>
          </div>
          
          <div className="ml-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
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
        <h1 className="text-3xl font-bold text-secondary-900">
          Bienvenido, {user?.first_name}
        </h1>
        <p className="text-secondary-600 mt-2">
          Gestiona tus cursos y calificaciones de estudiantes
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Mis Cursos"
          value={stats.myCourses.length}
          icon={BookOpen}
          color="bg-blue-500"
          subtitle="Cursos asignados"
        />
        <StatCard
          title="Estudiantes"
          value={stats.totalStudents}
          icon={Users}
          color="bg-green-500"
          subtitle="Total matriculados"
        />
        <StatCard
          title="Notas Pendientes"
          value={stats.pendingGrades}
          icon={Clock}
          color="bg-orange-500"
          subtitle="Por calificar"
        />
        <StatCard
          title="Promedio General"
          value="16.5"
          icon={Award}
          color="bg-purple-500"
          subtitle="Todos los cursos"
        />
      </div>

      {/* Acciones rápidas */}
      <div>
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction
            title="Cargar Notas"
            description="Subir calificaciones de estudiantes"
            icon={Upload}
            link="/docente/grades/upload"
            color="bg-primary-500"
          />
          <QuickAction
            title="Ver Reportes"
            description="Generar reportes de rendimiento"
            icon={FileText}
            link="/docente/reports"
            color="bg-secondary-500"
          />
          <QuickAction
            title="Estadísticas"
            description="Analizar rendimiento de cursos"
            icon={TrendingUp}
            link="/docente/analytics"
            color="bg-green-500"
          />
        </div>
      </div>

      {/* Mis cursos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">Mis Cursos</h2>
          <Link 
            to="/docente/courses" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Ver todos
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-secondary-200 rounded w-full mb-3"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : stats.myCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.myCourses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
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