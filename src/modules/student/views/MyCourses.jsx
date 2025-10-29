import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    User,
    Calendar,
    MapPin,
    Clock,
    Award,
    Search,
    Filter,
    ChevronDown
} from 'lucide-react';
import { coursesService } from '../services/apiStudent';
import toast from 'react-hot-toast';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    
    // Estados para filtros
    const [selectedCycle, setSelectedCycle] = useState('');
    const [availableCycles, setAvailableCycles] = useState([]);

    useEffect(() => {
        loadCourses();
    }, [selectedCycle]);

    useEffect(() => {
        filterCourses();
    }, [courses, searchTerm]);

    const loadCoursesFilters = async () => {
        try {
            const filtersData = await coursesService.getCoursesFilters();
            console.log('Filters data:', filtersData); // Debug log
            
            if (filtersData) {
                setAvailableCycles(filtersData.ciclos || []);
            }
        } catch (error) {
            console.error('Error loading filters:', error);
            toast.error('Error al cargar los filtros');
        }
    };

    const loadCourses = async () => {
        try {
            setLoading(true);
            
            // Cargar filtros iniciales si no se han cargado
            if (availableCycles.length === 0) {
                await loadCoursesFilters();
            }
            
            const params = {};
            
            if (selectedCycle) {
                params.numero_ciclo = selectedCycle;
            }
            
            const response = await coursesService.getCourses(params);
            console.log('Courses response:', response); // Debug log
            setCourses(response || []);
            
        } catch (error) {
            console.error('Error loading courses:', error);
            toast.error('Error al cargar los cursos');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        let filtered = courses;

        if (searchTerm) {
            filtered = filtered.filter(course =>
                course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (course.docente_nombre && course.docente_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (course.carrera_nombre && course.carrera_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (course.ciclo_nombre && course.ciclo_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredCourses(filtered);
    };

    const CourseCard = ({ course }) => (
        <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        {course.nombre}
                    </h3>
                    <p className="text-sm text-secondary-600 mb-3">
                        {course.carrera_nombre && `${course.carrera_nombre} • `}
                        {course.ciclo_nombre}
                        {course.ciclo_año && ` (${course.ciclo_año})`}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-secondary-600">
                            <User className="w-4 h-4 mr-2" />
                            <span>{course.docente_nombre || 'Sin asignar'}</span>
                        </div>
                        <div className="flex items-center text-sm text-secondary-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                                {course.ciclo_nombre}
                                {course.ciclo_numero && ` - Ciclo ${course.ciclo_numero}`}
                            </span>
                        </div>
                        {course.aula && (
                            <div className="flex items-center text-sm text-secondary-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>Aula {course.aula}</span>
                            </div>
                        )}
                        {course.fecha_inicio && course.fecha_fin && (
                            <div className="flex items-center text-sm text-secondary-600">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>
                                    {new Date(course.fecha_inicio).toLocaleDateString()} - {new Date(course.fecha_fin).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {course.horario && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-secondary-700 mb-2">Horario:</h4>
                            <p className="text-sm text-secondary-600 bg-secondary-50 p-2 rounded">
                                {course.horario}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-secondary-600">
                            <Award className="w-4 h-4 mr-2" />
                            <span>Año {course.ciclo_año}</span>
                        </div>
                        <div className="text-sm text-primary-600 font-medium">
                            Curso Activo
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
    );

    if (loading) {
        return (
            <div className="space-y-4 p-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900">Mis Cursos</h1>
                        <p className="text-secondary-600 mt-2">Consulta tus cursos matriculados</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card p-6 animate-pulse">
                            <div className="h-6 bg-secondary-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-secondary-200 rounded w-full mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
                                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Mis Cursos</h1>
                    <p className="text-secondary-600 mt-2">Consulta tus cursos matriculados</p>
                </div>
                <div className="flex items-center space-x-2">
                    <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
            </div>

            {/* Filtros */}
            <div className="card p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Búsqueda */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por curso, docente o carrera..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    
                    {/* Filtro por Ciclo */}
                    <div className="min-w-[150px]">
                        <div className="relative">
                            <select
                                value={selectedCycle}
                                onChange={(e) => setSelectedCycle(e.target.value)}
                                className="w-full appearance-none bg-white border border-secondary-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="">Todos los ciclos</option>
                                {availableCycles.map(cycle => (
                                    <option key={cycle} value={cycle}>
                                        Ciclo {cycle}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de cursos */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-secondary-900">
                        Cursos Matriculados ({filteredCourses.length})
                        {selectedCycle && (
                            <span className="text-sm font-normal text-secondary-600 ml-2">
                                - Ciclo {selectedCycle}
                            </span>
                        )}
                    </h2>
                </div>

                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="card p-8 text-center">
                        <BookOpen className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">
                            {searchTerm ? 'No se encontraron cursos' : 'No estás matriculado en ningún curso'}
                        </h3>
                        <p className="text-secondary-600">
                            {searchTerm
                                ? 'Intenta con otros términos de búsqueda o cambia los filtros'
                                : `No tienes cursos matriculados${selectedCycle ? ` en el ciclo ${selectedCycle}` : ''}`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;