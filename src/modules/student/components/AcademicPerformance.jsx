import React, { useState, useEffect } from 'react';
import { 
    ChevronDown, 
    ChevronUp, 
    BookOpen, 
    TrendingUp, 
    Award,
    Calendar,
    Users,
    Target
} from 'lucide-react';
import { academicPerformanceService } from '../services/apiStudent';
import toast from 'react-hot-toast';

const AcademicPerformance = () => {
    const [academicData, setAcademicData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCycle, setExpandedCycle] = useState(null);
    const [cycleCoursesData, setCycleCoursesData] = useState({});

    useEffect(() => {
        loadAcademicPerformance();
    }, []);

    const loadAcademicPerformance = async () => {
        try {
            setLoading(true);
            const response = await academicPerformanceService.getAcademicPerformance();
            setAcademicData(response || []);
            
            // Inicializar cycleCoursesData con los cursos que ya vienen en la respuesta
            const coursesData = {};
            if (response && Array.isArray(response)) {
                response.forEach(cycle => {
                    coursesData[cycle.ciclo_id] = cycle.cursos || [];
                });
            }
            setCycleCoursesData(coursesData);
        } catch (error) {
            console.error('Error loading academic performance:', error);
            toast.error('Error al cargar el rendimiento académico');
        } finally {
            setLoading(false);
        }
    };

    const toggleCycleExpansion = (cicloId) => {
        if (expandedCycle === cicloId) {
            setExpandedCycle(null);
        } else {
            setExpandedCycle(cicloId);
        }
    };

    const getGradeColor = (promedio) => {
        if (promedio === null || promedio === undefined) return 'text-gray-500';
        if (promedio >= 16) return 'text-green-600 font-semibold';
        if (promedio >= 14) return 'text-blue-600 font-semibold';
        if (promedio >= 11) return 'text-yellow-600 font-semibold';
        return 'text-red-600 font-semibold';
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'aprobado':
                return 'bg-green-100 text-green-800';
            case 'desaprobado':
                return 'bg-red-100 text-red-800';
            case 'en curso':
                return 'bg-blue-100 text-blue-800';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'sin calificar':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatGrade = (grade) => {
        if (grade === null || grade === undefined) return '-';
        return typeof grade === 'number' ? grade.toFixed(1) : grade;
    };

    if (loading) {
        return (
            <div className="card p-6 animate-pulse">
                <div className="h-6 bg-secondary-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-secondary-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <TrendingUp className="w-6 h-6 text-primary-600 mr-3" />
                    <h2 className="text-xl font-semibold text-secondary-900">
                        Rendimiento Académico
                    </h2>
                </div>
                <div className="flex items-center text-sm text-secondary-600">
                    <Award className="w-4 h-4 mr-1" />
                    {academicData.length} ciclo{academicData.length !== 1 ? 's' : ''} cursado{academicData.length !== 1 ? 's' : ''}
                </div>
            </div>

            {academicData.length === 0 ? (
                <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600">No hay información de rendimiento académico disponible</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {academicData.map((cycle) => (
                        <div key={cycle.ciclo_id} className="border border-secondary-200 rounded-lg overflow-hidden">
                            {/* Fila del ciclo */}
                            <div 
                                className="bg-secondary-50 p-4 cursor-pointer hover:bg-secondary-100 transition-colors"
                                onClick={() => toggleCycleExpansion(cycle.ciclo_id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-5 h-5 text-secondary-500 mr-2" />
                                            <div>
                                                <h3 className="font-semibold text-secondary-900">
                                                    {cycle.ciclo_nombre}
                                                </h3>
                                                <p className="text-sm text-secondary-600">
                                                    Ciclo {cycle.ciclo_numero}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 text-secondary-500 mr-1" />
                                                <span className="text-sm text-secondary-600">
                                                    {cycle.numero_cursos} curso{cycle.numero_cursos !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center">
                                                <Target className="w-4 h-4 text-secondary-500 mr-1" />
                                                <span className={`text-lg font-bold ${getGradeColor(cycle.promedio_ciclo)}`}>
                                                    {formatGrade(cycle.promedio_ciclo)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        {cycle.fecha_matricula && (
                                            <span className="text-xs text-secondary-500 mr-3">
                                                Matriculado: {new Date(cycle.fecha_matricula).toLocaleDateString()}
                                            </span>
                                        )}
                                        {expandedCycle === cycle.ciclo_id ? (
                                            <ChevronUp className="w-5 h-5 text-secondary-500" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-secondary-500" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Cursos expandidos */}
                            {expandedCycle === cycle.ciclo_id && (
                                <div className="border-t border-secondary-200">
                                    {cycleCoursesData[cycle.ciclo_id]?.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-secondary-100">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                                                            Curso
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-secondary-700 uppercase tracking-wider">
                                                            Promedio Final
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-secondary-700 uppercase tracking-wider">
                                                            Estado
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-secondary-200">
                                                    {cycleCoursesData[cycle.ciclo_id].map((course) => (
                                                        <tr key={course.curso_id} className="hover:bg-secondary-50">
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center">
                                                                    <BookOpen className="w-4 h-4 text-secondary-500 mr-2" />
                                                                    <span className="font-medium text-secondary-900">
                                                                        {course.curso_nombre}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className={`text-lg font-bold ${getGradeColor(course.promedio_final)}`}>
                                                                    {formatGrade(course.promedio_final)}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.estado)}`}>
                                                                    {course.estado || 'Sin calificar'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-secondary-600">
                                            No hay cursos disponibles para este ciclo
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AcademicPerformance;