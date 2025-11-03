import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Wifi,
  Calendar,
  Filter
} from 'lucide-react';
import { getCourses, getStudentsWithGrades, debugService } from '../services/apiTeacher';
import toast from 'react-hot-toast';

const GradesSimple = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedParity, setSelectedParity] = useState(getDefaultParity());

  // Función para obtener la paridad por defecto basada en la fecha
  function getDefaultParity() {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth <= 6 ? 'impar' : 'par';
  }

  // Obtener años disponibles
  const availableYears = [...new Set(courses.map(c => c.ciclo_año).filter(Boolean))].sort((a, b) => Number(b) - Number(a));

  // Función para obtener el número de ciclo desde el nombre
  const getCycleNumber = (course) => {
    const name = course?.ciclo_nombre || '';
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  // Filtrar cursos por año y paridad
  const filteredCourses = courses.filter(course => {
    const hasYear = course?.ciclo_año !== undefined && course?.ciclo_año !== null;
    const matchesYear = !selectedYear || (hasYear && course.ciclo_año?.toString() === selectedYear);
    const cycleNumber = getCycleNumber(course);
    const matchesParity = !selectedParity || (cycleNumber !== null && cycleNumber % 2 === (selectedParity === 'par' ? 0 : 1));
    const matchesActive = course.is_active !== false;
    return matchesYear && matchesParity && matchesActive;
  });

  useEffect(() => {
    testConnectionAndLoadData();
  }, []);

  const testConnectionAndLoadData = async () => {
    setLoading(true);
    setConnectionStatus('testing');

    try {
      // Test 1: Health Check
      console.log('🔍 Probando conexión...');
      const healthResponse = await fetch('http://localhost:8000/health');
      if (!healthResponse.ok) throw new Error('Health check failed');

      // Test 2: Auth Check
      console.log('🔍 Verificando autenticación...');
      const authTest = await debugService.testAuthConnection();
      console.log('✅ Usuario autenticado:', authTest);

      // Test 3: Debug Info
      console.log('🔍 Obteniendo debug info...');
      const debugResponse = await debugService.debugCourses();
      setDebugInfo(debugResponse);
      console.log('✅ Debug info:', debugResponse);

      // Test 4: Load Courses
      console.log('🔍 Cargando cursos...');
      await fetchCourses();

      setConnectionStatus('connected');
      toast.success('Sistema conectado correctamente');

    } catch (error) {
      console.error('❌ Error en tests:', error);
      setConnectionStatus('error');
      toast.error('Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      console.log('📚 Cursos recibidos:', response);
      setCourses(response.data || []);
    } catch (error) {
      console.error('❌ Error cargando cursos:', error);
      throw error;
    }
  };

  const handleCourseSelect = async (courseId) => {
    if (!courseId) return;

    setSelectedCourse(courseId);
    setLoading(true);

    try {
      console.log('📖 Cargando estudiantes para curso:', courseId);
      const response = await getStudentsWithGrades(courseId);
      console.log('👥 Estudiantes recibidos:', response.data);

      setStudents(response.data || []);

      if (!response.data || response.data.length === 0) {
        toast.info('Este curso no tiene estudiantes matriculados');
      } else {
        toast.success(`${response.data.length} estudiantes cargados`);
      }

    } catch (error) {
      console.error('❌ Error cargando estudiantes:', error);
      toast.error('Error al cargar estudiantes: ' + error.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const createSampleCourse = async () => {
    try {
      setLoading(true);
      const result = await debugService.createSampleCourse();
      console.log('✅ Curso de ejemplo creado:', result);
      toast.success(`Curso creado: ${result.course_name}`);

      // Recargar cursos
      await fetchCourses();

    } catch (error) {
      console.error('❌ Error creando curso:', error);
      toast.error('Error creando curso: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderConnectionStatus = () => {
    const statusConfig = {
      idle: { color: 'gray', icon: Wifi, text: 'Sin probar' },
      testing: { color: 'blue', icon: RefreshCw, text: 'Probando...', animate: true },
      connected: { color: 'green', icon: CheckCircle, text: 'Conectado' },
      error: { color: 'red', icon: AlertCircle, text: 'Error de conexión' }
    };

    const config = statusConfig[connectionStatus];
    const Icon = config.icon;

    return (
      <div className="flex items-center space-x-2">
        <Icon
          size={20}
          className={`text-${config.color}-500 ${config.animate ? 'animate-spin' : ''}`}
        />
        <span className={`text-sm font-medium text-${config.color}-600`}>
          {config.text}
        </span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FileText className="mr-2" /> Sistema de Calificaciones
        </h1>

        {/* Panel de Estado del Sistema */}
        <div className="bg-white rounded-lg border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {renderConnectionStatus()}
              <div className="text-sm text-gray-500">
                Cursos disponibles: {courses.length}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={testConnectionAndLoadData}
                disabled={loading}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw size={14} className={`inline mr-1 ${loading ? 'animate-spin' : ''}`} />
                Probar Conexión
              </button>
              {courses.length === 0 && connectionStatus === 'connected' && (
                <button
                  onClick={createSampleCourse}
                  disabled={loading}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  Crear Curso Ejemplo
                </button>
              )}
            </div>
          </div>

          {/* Debug Info */}
          {debugInfo && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
              <strong>Debug:</strong> {debugInfo.user_name} - Rol: {debugInfo.user_role} -
              Cursos asignados: {debugInfo.teacher_courses_count} -
              Cursos activos: {debugInfo.active_courses_count}
            </div>
          )}
        </div>
      </div>

      {/* Selección de Curso */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Seleccionar Curso
        </h2>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">Todos los años</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedParity}
              onChange={(e) => setSelectedParity(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">Todos</option>
              <option value="impar">Impar (1, 3, 5)</option>
              <option value="par">Par (2, 4, 6)</option>
            </select>
          </div>
        </div>

        {/* Lista de Cursos */}
        {loading && !selectedCourse ? (
          <div className="text-center py-10">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-600">Cargando cursos...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-10">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No hay cursos disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              {courses.length === 0
                ? 'No tienes cursos asignados'
                : 'No hay cursos que coincidan con los filtros'
              }
            </p>
            {courses.length === 0 && (
              <button
                onClick={createSampleCourse}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Crear Curso de Ejemplo
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map(course => (
              <button
                key={course.id}
                onClick={() => handleCourseSelect(course.id)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  selectedCourse === course.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <h3 className="font-medium text-gray-800">{course.nombre}</h3>
                <p className="text-sm text-gray-500">
                  Ciclo: {course.ciclo_nombre} ({course.ciclo_año})
                </p>
                <div className="flex items-center mt-2">
                  <Users size={14} className="text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">
                    {course.total_estudiantes || 0} estudiantes
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vista de Estudiantes */}
      {selectedCourse && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Estudiantes - {courses.find(c => c.id === selectedCourse)?.nombre}
          </h2>

          {loading ? (
            <div className="text-center py-10">
              <RefreshCw className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">Cargando estudiantes...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-10">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Sin estudiantes
              </h3>
              <p className="text-gray-600">
                Este curso no tiene estudiantes matriculados
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Total de estudiantes: {students.length}
              </p>

              <div className="grid gap-3">
                {students.map(student => (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {student.first_name} {student.last_name}
                        </h4>
                        <p className="text-sm text-gray-500">DNI: {student.dni}</p>
                        <p className="text-sm text-gray-500">Email: {student.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Notas: {student.notas?.length || 0}
                        </p>
                        {student.notas?.[0]?.promedio_final && (
                          <p className="font-semibold text-lg">
                            {student.notas[0].promedio_final}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GradesSimple;
