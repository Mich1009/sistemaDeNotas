import React, { useState, useEffect, useCallback } from 'react';
import { 
  Award, 
  BookOpen, 
  TrendingUp, 
  Filter,
  Search,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { gradesService } from '../services/apiStudent';
import toast from 'react-hot-toast';

const MyGrades = () => {
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const loadGrades = async () => {
    try {
      setLoading(true);
      const response = await gradesService.getGrades();
      console.log('Grades response:', response); // Debug log
      setGrades(response || []);
    } catch (error) {
      console.error('Error loading grades:', error);
      toast.error('Error al cargar las calificaciones');
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const filterGrades = useCallback(() => {
    let filtered = grades;

    if (searchTerm) {
      filtered = filtered.filter(grade => 
        grade.curso_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.curso_codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.docente_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCourse) {
      filtered = filtered.filter(grade => grade.curso_nombre === selectedCourse);
    }

    setFilteredGrades(filtered);
  }, [grades, searchTerm, selectedCourse]);

  useEffect(() => {
    loadGrades();
  }, []);

  useEffect(() => {
    filterGrades();
  }, [filterGrades]);

  const getGradeStatus = (average) => {
    if (!average) return { status: 'pending', color: 'gray', text: 'Sin calificar' };
    if (average >= 16) return { status: 'excellent', color: 'green', text: 'Excelente' };
    if (average >= 13) return { status: 'good', color: 'blue', text: 'Bueno' };
    if (average >= 11) return { status: 'pass', color: 'yellow', text: 'Aprobado' };
    return { status: 'fail', color: 'red', text: 'Desaprobado' };
  };

  const getGradeIcon = (status) => {
    switch (status) {
      case 'excellent':
      case 'good':
      case 'pass':
        return <CheckCircle className="w-5 h-5" />;
      case 'fail':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const calculateOverallAverage = () => {
    const validGrades = grades.filter(grade => grade.promedio !== null);
    if (validGrades.length === 0) return 0;
    
    const sum = validGrades.reduce((acc, grade) => acc + parseFloat(grade.promedio), 0);
    return (sum / validGrades.length).toFixed(2);
  };

  const getUniqueCourses = () => {
    return [...new Set(grades.map(grade => grade.curso_nombre))];
  };

  const GradeCard = ({ grade }) => {
    const gradeStatus = getGradeStatus(grade.promedio);
    
    return (
      <div className="card p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-1">
              {grade.curso_nombre}
            </h3>
            <p className="text-sm text-secondary-600 mb-2">
              {grade.curso_codigo} • {grade.docente_nombre}
            </p>
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            gradeStatus.color === 'green' ? 'bg-green-100 text-green-800' :
            gradeStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
            gradeStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            gradeStatus.color === 'red' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {getGradeIcon(gradeStatus.status)}
            <span className="ml-1">{gradeStatus.text}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-secondary-500 mb-1">Nota 1</p>
            <p className="text-lg font-semibold text-secondary-900">
              {grade.nota_1 || '--'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondary-500 mb-1">Nota 2</p>
            <p className="text-lg font-semibold text-secondary-900">
              {grade.nota_2 || '--'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondary-500 mb-1">Nota 3</p>
            <p className="text-lg font-semibold text-secondary-900">
              {grade.nota_3 || '--'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-secondary-500 mb-1">Nota 4</p>
            <p className="text-lg font-semibold text-secondary-900">
              {grade.nota_4 || '--'}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600">Promedio Final</p>
              <p className="text-2xl font-bold text-primary-600">
                {grade.promedio || '--'}
              </p>
            </div>
            {grade.observaciones && (
              <div className="text-right">
                <p className="text-xs text-secondary-500 mb-1">Observaciones</p>
                <p className="text-sm text-secondary-700 max-w-xs">
                  {grade.observaciones}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-3xl font-bold text-secondary-900">{value}</p>
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Mis Calificaciones</h1>
            <p className="text-secondary-600 mt-2">Consulta tu rendimiento académico</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-secondary-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-secondary-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="h-12 bg-secondary-200 rounded"></div>
                ))}
                </div>
              <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const overallAverage = calculateOverallAverage();
  const approvedCourses = grades.filter(grade => grade.promedio && grade.promedio >= 11).length;
  const failedCourses = grades.filter(grade => grade.promedio && grade.promedio < 11).length;
  const pendingCourses = grades.filter(grade => !grade.promedio).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Mis Calificaciones</h1>
          <p className="text-secondary-600 mt-2">Consulta tu rendimiento académico</p>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="w-8 h-8 text-primary-600" />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Promedio General"
          value={overallAverage || '--'}
          icon={TrendingUp}
          color="bg-green-500"
          subtitle="Todos los cursos"
        />
        <StatCard
          title="Cursos Aprobados"
          value={approvedCourses}
          icon={CheckCircle}
          color="bg-blue-500"
          subtitle="Nota ≥ 11"
        />
        <StatCard
          title="Cursos Desaprobados"
          value={failedCourses}
          icon={AlertCircle}
          color="bg-red-500"
          subtitle="Nota < 11"
        />
        <StatCard
          title="Pendientes"
          value={pendingCourses}
          icon={Clock}
          color="bg-yellow-500"
          subtitle="Sin calificar"
        />
      </div>

      {/* Filtros */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por curso, código o docente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los cursos</option>
              {getUniqueCourses().map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de calificaciones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">
            Calificaciones ({filteredGrades.length})
          </h2>
        </div>

        {filteredGrades.length > 0 ? (
          <div className="space-y-6">
            {filteredGrades.map((grade) => (
              <GradeCard key={grade.id} grade={grade} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <Award className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              {searchTerm || selectedCourse ? 'No se encontraron calificaciones' : 'Aún no tienes calificaciones'}
            </h3>
            <p className="text-secondary-600">
              {searchTerm || selectedCourse 
                ? 'Intenta con otros términos de búsqueda o filtros'
                : 'Las notas aparecerán aquí cuando los docentes las publiquen'
              }
            </p>
          </div>
        )}
            </div>
        </div>
    );
};

export default MyGrades;