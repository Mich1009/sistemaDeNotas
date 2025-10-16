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
  Clock,
  Printer,
  FileText,
  X,
  Download
} from 'lucide-react';
import { studentService, gradeUtils } from '../services/apiStudent';
import toast from 'react-hot-toast';

const MyGrades = () => {
  const [gradesData, setGradesData] = useState({
    grades: [],
    filters: { cursos: [], ciclos: [], docentes: [] },
    statistics: {}
  });
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    curso_id: '',
    ciclo_id: '',
    docente_id: '',
    search: ''
  });

  const loadGradesData = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await studentService.getGradesOverview(filters);
      console.log('📊 Grades overview:', response);
      setGradesData(response);
    } catch (error) {
      console.error('Error loading grades data:', error);
      toast.error('Error al cargar las calificaciones');
      setGradesData({ grades: [], filters: { cursos: [], ciclos: [], docentes: [] }, statistics: {} });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  // Aplicar filtros y buscar
  const filteredGrades = gradeUtils.filterGrades(gradesData.grades, activeFilters);

  // Agrupar notas por curso para mejor visualización
  const groupedGrades = gradeUtils.groupGradesByCourse(filteredGrades);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      curso_id: '',
      ciclo_id: '',
      docente_id: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '');

  // 🎯 FUNCIÓN DE IMPRESIÓN MEJORADA
  const handlePrintCourse = (curso) => {
    const printWindow = window.open('', '_blank');
    const cursoStats = gradeUtils.calculateGradesStatistics(curso.notas);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Boleta de Notas - ${curso.curso_nombre}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .course-info { margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
          .stat-card { background: white; padding: 15px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
          .grades-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .grades-table th, .grades-table td { border: 1px solid #ddd; padding: 10px; text-align: center; }
          .grades-table th { background-color: #f5f5f5; font-weight: bold; }
          .final-average { text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #2563eb; }
          .status { text-align: center; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold; }
          .approved { background-color: #d4edda; color: #155724; }
          .failed { background-color: #f8d7da; color: #721c24; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .section-title { background-color: #e9ecef; padding: 12px; margin: 15px 0; font-weight: bold; border-left: 4px solid #2563eb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BOLETA DE NOTAS ACADÉMICAS</h1>
          <p>Sistema de Gestión Académica</p>
        </div>
        
        <div class="course-info">
          <h2>${curso.curso_nombre}</h2>
          <p><strong>Docente:</strong> ${curso.docente_nombre}</p>
          <p><strong>Ciclo:</strong> ${curso.ciclo_nombre}</p>
          <p><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total de Evaluaciones</h3>
            <p style="font-size: 24px; font-weight: bold; color: #2563eb;">${cursoStats.total}</p>
          </div>
          <div class="stat-card">
            <h3>Aprobadas</h3>
            <p style="font-size: 24px; font-weight: bold; color: #16a34a;">${cursoStats.aprobados}</p>
          </div>
          <div class="stat-card">
            <h3>Promedio Curso</h3>
            <p style="font-size: 24px; font-weight: bold; color: #dc2626;">${curso.promedio_curso || '--'}</p>
          </div>
        </div>

        <div class="section-title">DETALLE DE EVALUACIONES</div>
        
        ${curso.notas.map(nota => {
          const average = gradeUtils.calculateAverage(nota);
          const status = average >= 11 ? 'approved' : 'failed';
          return `
            <div style="margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px;">
              <h3 style="color: #374151; margin-bottom: 10px;">${nota.tipo_evaluacion} - ${new Date(nota.fecha_evaluacion).toLocaleDateString()}</h3>
              
              <table class="grades-table">
                <thead>
                  <tr>
                    ${Array.from({length: 8}, (_, i) => `<th>Eval ${i+1}</th>`).join('')}
                    ${Array.from({length: 4}, (_, i) => `<th>Pract ${i+1}</th>`).join('')}
                    ${Array.from({length: 2}, (_, i) => `<th>Parc ${i+1}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    ${Array.from({length: 8}, (_, i) => `<td>${nota[`evaluacion${i+1}`] || '--'}</td>`).join('')}
                    ${Array.from({length: 4}, (_, i) => `<td>${nota[`practica${i+1}`] || '--'}</td>`).join('')}
                    ${Array.from({length: 2}, (_, i) => `<td>${nota[`parcial${i+1}`] || '--'}</td>`).join('')}
                  </tr>
                </tbody>
              </table>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <div>
                  <strong>Promedio:</strong> ${average || '--'}
                </div>
                <div class="status ${status}">
                  ${average >= 11 ? 'APROBADO' : 'DESAPROBADO'}
                </div>
              </div>
              
              ${nota.observaciones ? `
                <div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                  <strong>Observaciones:</strong> ${nota.observaciones}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
        
        <div class="final-average">
          <h3>PROMEDIO FINAL DEL CURSO: ${curso.promedio_curso || '--'}</h3>
        </div>
        
        <div class="footer">
          <p>Documento generado automáticamente el ${new Date().toLocaleString()}</p>
          <p>Este documento es una constancia oficial del sistema académico</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const GradeCard = ({ curso }) => {
    const cursoStats = gradeUtils.calculateGradesStatistics(curso.notas);
    
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
        {/* Header del Curso */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {curso.curso_nombre}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {curso.docente_nombre}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {curso.ciclo_nombre}
                </span>
                <span className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Promedio: {curso.promedio_curso || '--'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePrintCourse(curso)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas del Curso */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{cursoStats.total}</p>
              <p className="text-xs text-gray-600">Total Evaluaciones</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{cursoStats.aprobados}</p>
              <p className="text-xs text-gray-600">Aprobadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{cursoStats.desaprobados}</p>
              <p className="text-xs text-gray-600">Desaprobadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{cursoStats.pendientes}</p>
              <p className="text-xs text-gray-600">Pendientes</p>
            </div>
          </div>
        </div>

        {/* Evaluaciones del Curso */}
        <div className="p-6">
          <div className="space-y-4">
            {curso.notas.map((nota) => {
              const average = gradeUtils.calculateAverage(nota);
              const gradeStatus = gradeUtils.getGradeStatus(average);
              
              return (
                <div key={nota.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{nota.tipo_evaluacion}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(nota.fecha_evaluacion).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      gradeStatus === 'APROBADO' ? 'bg-green-100 text-green-800' :
                      gradeStatus === 'DESAPROBADO' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {gradeStatus === 'APROBADO' ? <CheckCircle className="w-4 h-4 mr-1" /> :
                       gradeStatus === 'DESAPROBADO' ? <AlertCircle className="w-4 h-4 mr-1" /> :
                       <Clock className="w-4 h-4 mr-1" />}
                      <span>{gradeStatus}</span>
                    </div>
                  </div>

                  {/* Grid de Notas */}
                  <div className="space-y-3">
                    {/* Evaluaciones Semanales */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Evaluaciones Semanales</h5>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-1">
                        {Array.from({length: 8}, (_, i) => (
                          <div key={i} className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-xs text-blue-600 mb-1">E{i+1}</p>
                            <p className="text-sm font-bold text-gray-900">
                              {nota[`evaluacion${i+1}`] || '--'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prácticas */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Prácticas</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                        {Array.from({length: 4}, (_, i) => (
                          <div key={i} className="text-center p-2 bg-green-50 rounded">
                            <p className="text-xs text-green-600 mb-1">P{i+1}</p>
                            <p className="text-sm font-bold text-gray-900">
                              {nota[`practica${i+1}`] || '--'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Parciales */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Parciales</h5>
                      <div className="grid grid-cols-2 gap-1">
                        {Array.from({length: 2}, (_, i) => (
                          <div key={i} className="text-center p-2 bg-purple-50 rounded">
                            <p className="text-xs text-purple-600 mb-1">Parc{i+1}</p>
                            <p className="text-sm font-bold text-gray-900">
                              {nota[`parcial${i+1}`] || '--'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Promedio y Observaciones */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Promedio</p>
                      <p className="text-xl font-bold text-blue-600">
                        {average || '--'}
                      </p>
                    </div>
                    {nota.observaciones && (
                      <div className="text-right max-w-md">
                        <p className="text-xs text-gray-500 mb-1">Observaciones</p>
                        <p className="text-sm text-gray-700 italic">
                          "{nota.observaciones}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs font-medium mt-1 ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Calificaciones</h1>
            <p className="text-gray-600 mt-2">Consulta tu rendimiento académico</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2].map(j => (
                  <div key={j} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Calificaciones</h1>
          <p className="text-gray-600 mt-2">Consulta y gestiona tu rendimiento académico</p>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Promedio General"
          value={gradesData.statistics.promedio_general || '--'}
          icon={TrendingUp}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
          subtitle="Todos los cursos"
        />
        <StatCard
          title="Cursos Aprobados"
          value={gradesData.statistics.cursos_aprobados || 0}
          icon={CheckCircle}
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
          subtitle="Nota ≥ 11"
        />
        <StatCard
          title="Cursos Desaprobados"
          value={gradesData.statistics.cursos_desaprobados || 0}
          icon={AlertCircle}
          color="bg-gradient-to-r from-red-500 to-rose-500"
          subtitle="Nota < 11"
        />
        <StatCard
          title="Total Cursos"
          value={gradesData.statistics.total_cursos || 0}
          icon={BookOpen}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
          subtitle="Matriculados"
        />
      </div>

      {/* Filtros Avanzados */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros Avanzados
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por curso, docente o ciclo..."
                value={activeFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por Curso */}
          <div>
            <select
              value={activeFilters.curso_id}
              onChange={(e) => handleFilterChange('curso_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los cursos</option>
              {gradesData.filters.cursos.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Ciclo */}
          <div>
            <select
              value={activeFilters.ciclo_id}
              onChange={(e) => handleFilterChange('ciclo_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los ciclos</option>
              {gradesData.filters.ciclos.map(ciclo => (
                <option key={ciclo.id} value={ciclo.id}>
                  {ciclo.nombre} ({ciclo.año})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtro por Docente */}
        <div className="mt-4">
          <select
            value={activeFilters.docente_id}
            onChange={(e) => handleFilterChange('docente_id', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los docentes</option>
            {gradesData.filters.docentes.map(docente => (
              <option key={docente.id} value={docente.id}>
                {docente.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Calificaciones Agrupadas por Curso */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Mis Cursos ({groupedGrades.length})
          </h2>
          <span className="text-sm text-gray-600">
            {filteredGrades.length} evaluaciones encontradas
          </span>
        </div>

        {groupedGrades.length > 0 ? (
          <div className="space-y-6">
            {groupedGrades.map((curso) => (
              <GradeCard key={curso.curso_id} curso={curso} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'No se encontraron cursos' : 'Aún no tienes calificaciones'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Intenta con otros filtros o términos de búsqueda'
                : 'Las calificaciones aparecerán aquí cuando los docentes las publiquen'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGrades;