import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Calendar,
  Target,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../auth/store/authStore';
import { academicService } from '../services/apiStudent';

const EstudianteDashboard = () => {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState({
    estudiante_info: {},
    cursos_actuales: [],
    notas_recientes: [],
    estadisticas: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await academicService.getDashboard();
      setDashboardData(response);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, status }) => (
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
          {status && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
              status === 'good' ? 'bg-green-100 text-green-800' :
              status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {status === 'good' ? 'Excelente' : status === 'warning' ? 'Regular' : 'Necesita mejorar'}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => {
    // Buscar la nota por nombre del curso
    const grade = dashboardData.notas_recientes.find(g => g.curso_nombre === course.nombre);
    
    // Verificar si tiene notas usando los campos reales
    const hasGrades = grade && (
      grade.evaluacion1 || grade.evaluacion2 || grade.evaluacion3 || grade.evaluacion4 ||
      grade.practica1 || grade.practica2 || grade.practica3 || grade.practica4 ||
      grade.parcial1 || grade.parcial2 || grade.promedio_final
    );
    
    return (
      <Link to={`/estudiante/courses/${course.id}`} className="block">
        <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-secondary-900 mb-2">
                {course.nombre}
              </h3>
              <p className="text-sm text-secondary-600 mb-3">
                {course.codigo} • {course.docente_nombre}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-secondary-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {course.ciclo_nombre}
                  </div>
                  {grade?.promedio_final && (
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Promedio: {grade.promedio_final}
                    </div>
                  )}
                </div>
                
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  hasGrades ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {hasGrades ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Con notas
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Pendiente
                    </>
                  )}
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
  };

  const RecentGrade = ({ grade }) => (
    <div className="flex items-center justify-between p-4 border-l-4 border-primary-500 bg-primary-50 rounded-r-lg">
      <div>
        <h4 className="font-medium text-secondary-900">
          {grade.curso_nombre}
        </h4>
        <p className="text-sm text-secondary-600">
          {grade.curso_codigo} • {grade.docente_nombre}
        </p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-primary-600">
          {grade.promedio_final || '--'}
        </div>
        <div className="text-xs text-secondary-500">
          Promedio Final
        </div>
      </div>
    </div>
  );
  const getGradeStatus = (average) => {
    if (average >= 16) return 'good';
    if (average >= 13) return 'warning';
    return 'poor';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">
          Bienvenido, {dashboardData.estudiante_info?.first_name || user?.first_name}
        </h1>
        <p className="text-secondary-600 mt-2">
          Revisa tu progreso académico y calificaciones
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Cursos Matriculados"
          value={dashboardData.estadisticas?.total_cursos || 0}
          icon={BookOpen}
          color="bg-blue-500"
          subtitle="Este ciclo"
        />
        <StatCard
          title="Promedio General"
          value={dashboardData.estadisticas?.promedio_general || '--'}
          icon={TrendingUp}
          color="bg-green-500"
          subtitle="Todos los cursos"
          status={dashboardData.estadisticas?.promedio_general ? getGradeStatus(dashboardData.estadisticas.promedio_general) : null}
        />
        <StatCard
          title="Cursos Aprobados"
          value={dashboardData.estadisticas?.cursos_aprobados || 0}
          icon={Award}
          color="bg-purple-500"
          subtitle="Nota ≥ 11"
        />
        <StatCard
          title="Créditos Completados"
          value={dashboardData.estadisticas?.creditos_completados || 0}
          icon={Target}
          color="bg-orange-500"
          subtitle="Créditos"
        />
      </div>

      {/* Cursos matriculados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">Mis Cursos</h2>
          <Link 
            to="/estudiante/courses" 
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
        ) : dashboardData.cursos_actuales.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.cursos_actuales.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <BookOpen className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No estás matriculado en ningún curso
            </h3>
            <p className="text-secondary-600">
              Contacta al administrador para matricularte en cursos
            </p>
          </div>
        )}
      </div>

      {/* Notas recientes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">Notas Recientes</h2>
          <Link 
            to="/estudiante/grades" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Ver todas
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-4 bg-secondary-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : dashboardData.notas_recientes.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.notas_recientes.slice(0, 5).map((grade) => (
              <RecentGrade key={grade.id} grade={grade} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <Target className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Aún no tienes calificaciones
            </h3>
            <p className="text-secondary-600">
              Las notas aparecerán aquí cuando los docentes las publiquen
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstudianteDashboard;