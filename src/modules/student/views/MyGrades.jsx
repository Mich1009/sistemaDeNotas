import React, { useState, useEffect, useCallback } from 'react';
import { Award, BookOpen, TrendingUp, Search, CheckCircle, AlertCircle, FileText, } from 'lucide-react';
import { studentService, gradeUtils } from '../services/apiStudent';
import toast from 'react-hot-toast';
import GradeCard from '../components/GradeCard';
import { usePrintCourse } from '../components/PrintCourse';

const MyGrades = () => {
    const [gradesData, setGradesData] = useState({
        grades: [],
        filters: { cursos: [], ciclos: [], docentes: [] },
        statistics: {}
    });
    const [loading, setLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState({
        ciclo_id: '',
        docente_id: '',
        año: new Date().getFullYear().toString(),
        search: ''
    });

    // Hook para la funcionalidad de impresión
    const { handlePrintCourse } = usePrintCourse();

    const loadGradesData = async () => {
        try {
            setLoading(true);
            // Cargar todos los datos sin filtros para hacer filtrado en el cliente
            const response = await studentService.getGradesOverview({});
            console.log('📊 Grades overview (all data):', response);
            setGradesData(response);
        } catch (error) {
            console.error('Error loading grades data:', error);
            const errorMessage = error.response?.data?.detail || error.message || 'Error al cargar las calificaciones';
            toast.error(errorMessage);
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

    // Filtrar ciclos dinámicamente según el año seleccionado
    const availableCycles = activeFilters.año 
        ? gradesData.filters.ciclos.filter(ciclo => ciclo.año.toString() === activeFilters.año)
        : gradesData.filters.ciclos;

    const handleFilterChange = (filterType, value) => {
        const newFilters = {
            ...activeFilters,
            [filterType]: value
        };

        // Si se cambia el año, resetear el ciclo seleccionado
        if (filterType === 'año') {
            newFilters.ciclo_id = '';
        }

        setActiveFilters(newFilters);
        // Ya no necesitamos recargar datos del servidor, todo se filtra en el cliente
    };

    const clearFilters = () => {
        const clearedFilters = {
            ciclo_id: '',
            docente_id: '',
            año: new Date().getFullYear().toString(),
            search: ''
        };
        setActiveFilters(clearedFilters);
        // Ya no necesitamos recargar datos del servidor, todo se filtra en el cliente
    };

    const hasActiveFilters = Object.values(activeFilters).some(value => value !== '');

    const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium"><span className='text-gray-600'>{title}</span> - <span className='text-gray-400'>{subtitle}</span> </p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {trend && (
                    <p className={`text-xs font-medium mt-1 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
                    </p>
                )}
            </div>
            <div className={`p-3 rounded-full ${color} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis Calificaciones</h1>
                        <p className="text-gray-600">Consulta tu rendimiento académico</p>
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
        <div className="space-y-3 p-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Calificaciones</h1>
                    <p className="text-gray-600">Consulta y gestiona tu rendimiento académico</p>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
            </div>

            {/* Filtros Avanzados */}
            <div className="flex items-center gap-3 rounded-lg shadow-md p-4 border border-gray-200 bg-white">
                {/* Búsqueda */}
                <div className="relative w-1/5">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por curso, docente o ciclo..."
                        value={activeFilters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>

                {/* Filtro por Año */}
                <select
                    value={activeFilters.año}
                    onChange={(e) => handleFilterChange('año', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                    <option value="">Todos los años</option>
                    {gradesData.filters.años && gradesData.filters.años.map((año, index) => (
                        <option key={index} value={año.año}>
                            {año.año}
                        </option>
                    ))}
                </select>

                {/* Filtro por Ciclo - Dinámico según el año */}
                <select
                    value={activeFilters.ciclo_id}
                    onChange={(e) => handleFilterChange('ciclo_id', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={!activeFilters.año}
                >
                    <option value="">
                        {activeFilters.año ? 'Todos los ciclos' : 'Selecciona un año primero'}
                    </option>
                    {availableCycles.map(ciclo => (
                        <option key={ciclo.id} value={ciclo.id}>
                            {ciclo.nombre} ({ciclo.año})
                        </option>
                    ))}
                </select>

                {/* Filtro por Docente */}
                <select
                    value={activeFilters.docente_id}
                    onChange={(e) => handleFilterChange('docente_id', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                    <option value="">Todos los docentes</option>
                    {gradesData.filters.docentes.map(docente => (
                        <option key={docente.id} value={docente.id}>
                            {docente.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    subtitle="Nota ≥ 13"
                />
                <StatCard
                    title="Cursos Desaprobados"
                    value={gradesData.statistics.cursos_desaprobados || 0}
                    icon={AlertCircle}
                    color="bg-gradient-to-r from-red-500 to-rose-500"
                    subtitle="Nota < 13"
                />
                <StatCard
                    title="Total Cursos"
                    value={gradesData.statistics.total_cursos || 0}
                    icon={BookOpen}
                    color="bg-gradient-to-r from-purple-500 to-pink-500"
                    subtitle="Matriculados"
                />
            </div>

            {/* Lista de Calificaciones Agrupadas por Curso */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900">Mis Cursos ({groupedGrades.length})</h2>
                <span className="text-sm text-gray-600">{filteredGrades.length} evaluaciones encontradas</span>
            </div>

            {groupedGrades.length > 0 ? (
                <div className="space-y-4">
                    {groupedGrades.map((curso) => (
                        <GradeCard 
                            key={curso.curso_id}
                            curso={curso}
                            gradeUtils={gradeUtils}
                            handlePrintCourse={handlePrintCourse}
                        />
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
    );
};

export default MyGrades;