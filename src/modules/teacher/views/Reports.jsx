import React, { useState, useEffect } from 'react';
import { FileText, Filter, Download, BarChart2, PieChart, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../auth/store/authStore';

const Reports = () => {
    const { user } = useAuthStore();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedReport, setSelectedReport] = useState('grades');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        fetchReportData();
    }, [selectedCourse, selectedReport, dateRange]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            // Simulación de carga de cursos
            setTimeout(() => {
                const mockCourses = [
                    { id: 1, name: 'Matemáticas Avanzadas', code: 'MAT101' },
                    { id: 2, name: 'Programación', code: 'PRG202' },
                    { id: 3, name: 'Física Cuántica', code: 'FIS303' },
                    { id: 4, name: 'Estadística', code: 'EST104' },
                    { id: 5, name: 'Algoritmos', code: 'ALG205' }
                ];
                setCourses(mockCourses);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error al cargar los cursos:', error);
            toast.error('Error al cargar los cursos');
            setLoading(false);
        }
    };

    const fetchReportData = async () => {
        try {
            setLoading(true);
            // Simulación de carga de datos de reporte
            setTimeout(() => {
                let data = [];
                
                switch (selectedReport) {
                    case 'grades':
                        data = getMockGradesData();
                        break;
                    case 'attendance':
                        data = getMockAttendanceData();
                        break;
                    case 'performance':
                        data = getMockPerformanceData();
                        break;
                    default:
                        data = [];
                }
                
                // Filtrar por curso si es necesario
                if (selectedCourse !== 'all') {
                    data = data.filter(item => item.course_id === parseInt(selectedCourse));
                }
                
                setReportData(data);
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error('Error al cargar los datos del reporte:', error);
            toast.error('Error al cargar los datos del reporte');
            setLoading(false);
        }
    };

    // Funciones para generar datos de ejemplo
    const getMockGradesData = () => {
        const students = [
            { id: 1, name: 'Ana García', email: 'ana.garcia@example.com' },
            { id: 2, name: 'Carlos López', email: 'carlos.lopez@example.com' },
            { id: 3, name: 'María Rodríguez', email: 'maria.rodriguez@example.com' },
            { id: 4, name: 'Juan Pérez', email: 'juan.perez@example.com' },
            { id: 5, name: 'Laura Martínez', email: 'laura.martinez@example.com' },
            { id: 6, name: 'Pedro Sánchez', email: 'pedro.sanchez@example.com' },
            { id: 7, name: 'Sofía Torres', email: 'sofia.torres@example.com' },
            { id: 8, name: 'Diego Ramírez', email: 'diego.ramirez@example.com' }
        ];
        
        const mockData = [];
        
        courses.forEach(course => {
            students.forEach(student => {
                // Generar calificaciones aleatorias para cada estudiante en cada curso
                const midterm = (Math.random() * 4 + 1).toFixed(1);
                const final = (Math.random() * 4 + 1).toFixed(1);
                const assignments = (Math.random() * 4 + 1).toFixed(1);
                const participation = (Math.random() * 4 + 1).toFixed(1);
                
                // Calcular promedio ponderado
                const average = (
                    parseFloat(midterm) * 0.3 + 
                    parseFloat(final) * 0.4 + 
                    parseFloat(assignments) * 0.2 + 
                    parseFloat(participation) * 0.1
                ).toFixed(1);
                
                mockData.push({
                    id: `${course.id}-${student.id}`,
                    course_id: course.id,
                    course_name: course.name,
                    course_code: course.code,
                    student_id: student.id,
                    student_name: student.name,
                    student_email: student.email,
                    midterm: midterm,
                    final: final,
                    assignments: assignments,
                    participation: participation,
                    average: average,
                    status: parseFloat(average) >= 3.0 ? 'Aprobado' : 'Reprobado'
                });
            });
        });
        
        return mockData;
    };
    
    const getMockAttendanceData = () => {
        const students = [
            { id: 1, name: 'Ana García', email: 'ana.garcia@example.com' },
            { id: 2, name: 'Carlos López', email: 'carlos.lopez@example.com' },
            { id: 3, name: 'María Rodríguez', email: 'maria.rodriguez@example.com' },
            { id: 4, name: 'Juan Pérez', email: 'juan.perez@example.com' },
            { id: 5, name: 'Laura Martínez', email: 'laura.martinez@example.com' },
            { id: 6, name: 'Pedro Sánchez', email: 'pedro.sanchez@example.com' },
            { id: 7, name: 'Sofía Torres', email: 'sofia.torres@example.com' },
            { id: 8, name: 'Diego Ramírez', email: 'diego.ramirez@example.com' }
        ];
        
        const mockData = [];
        
        courses.forEach(course => {
            students.forEach(student => {
                // Generar datos de asistencia aleatorios
                const totalClasses = 20;
                const attended = Math.floor(Math.random() * (totalClasses + 1));
                const percentage = ((attended / totalClasses) * 100).toFixed(1);
                
                mockData.push({
                    id: `${course.id}-${student.id}`,
                    course_id: course.id,
                    course_name: course.name,
                    course_code: course.code,
                    student_id: student.id,
                    student_name: student.name,
                    student_email: student.email,
                    total_classes: totalClasses,
                    attended: attended,
                    absences: totalClasses - attended,
                    percentage: percentage,
                    status: parseFloat(percentage) >= 80 ? 'Regular' : 'Irregular'
                });
            });
        });
        
        return mockData;
    };
    
    const getMockPerformanceData = () => {
        const mockData = [];
        
        courses.forEach(course => {
            // Datos de rendimiento general del curso
            const totalStudents = 25;
            const approved = Math.floor(Math.random() * (totalStudents - 5) + 5);
            const failed = totalStudents - approved;
            const averageGrade = (Math.random() * 2 + 3).toFixed(1);
            
            mockData.push({
                id: course.id,
                course_id: course.id,
                course_name: course.name,
                course_code: course.code,
                total_students: totalStudents,
                approved_students: approved,
                failed_students: failed,
                approval_rate: ((approved / totalStudents) * 100).toFixed(1),
                average_grade: averageGrade,
                highest_grade: (Math.random() * 1 + 4).toFixed(1),
                lowest_grade: (Math.random() * 2 + 1).toFixed(1)
            });
        });
        
        return mockData;
    };

    const downloadReport = () => {
        toast.success('Reporte descargado correctamente');
    };

    const renderGradesReport = () => {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcial</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tareas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participación</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promedio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.student_name}</div>
                                    <div className="text-xs text-gray-500">{item.student_email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.course_name}</div>
                                    <div className="text-xs text-gray-500">{item.course_code}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.midterm}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.final}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.assignments}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.participation}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.average}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        item.status === 'Aprobado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderAttendanceReport = () => {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Clases</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asistencias</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ausencias</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.student_name}</div>
                                    <div className="text-xs text-gray-500">{item.student_email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.course_name}</div>
                                    <div className="text-xs text-gray-500">{item.course_code}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_classes}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.attended}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.absences}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.percentage}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        item.status === 'Regular' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderPerformanceReport = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportData.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">{item.course_name}</h3>
                            <span className="text-sm text-gray-500">{item.course_code}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-500 mb-1">Estudiantes</div>
                                <div className="text-2xl font-bold text-blue-700">{item.total_students}</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-500 mb-1">Promedio</div>
                                <div className="text-2xl font-bold text-green-700">{item.average_grade}</div>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Tasa de Aprobación</h4>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${item.approval_rate}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">{item.approval_rate}%</span>
                                <span className="text-xs text-gray-500">{item.approved_students} de {item.total_students}</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Nota más alta</div>
                                <div className="text-lg font-medium text-gray-900">{item.highest_grade}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Nota más baja</div>
                                <div className="text-lg font-medium text-gray-900">{item.lowest_grade}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderReportContent = () => {
        if (loading) {
            return (
                <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando datos del reporte...</p>
                </div>
            );
        }
        
        if (reportData.length === 0) {
            return (
                <div className="py-8 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No hay datos disponibles</h3>
                    <p className="text-gray-600">
                        No se encontraron datos para el reporte seleccionado
                    </p>
                </div>
            );
        }
        
        switch (selectedReport) {
            case 'grades':
                return renderGradesReport();
            case 'attendance':
                return renderAttendanceReport();
            case 'performance':
                return renderPerformanceReport();
            default:
                return null;
        }
    };

    return (
        <div className="p-3 space-y-5">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
                            <p className="text-gray-600">Genera y visualiza reportes académicos</p>
                        </div>
                    </div>
                    <button
                        onClick={downloadReport}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>Descargar</span>
                    </button>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <select
                            value={selectedReport}
                            onChange={(e) => setSelectedReport(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="grades">Reporte de Calificaciones</option>
                            <option value="attendance">Reporte de Asistencia</option>
                            <option value="performance">Rendimiento del Curso</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="relative">
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="all">Todos los cursos</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="flex space-x-2">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Desde</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <BarChart2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Promedio General</div>
                        <div className="text-2xl font-bold text-gray-800">3.8</div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <PieChart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Tasa de Aprobación</div>
                        <div className="text-2xl font-bold text-gray-800">85%</div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Total Estudiantes</div>
                        <div className="text-2xl font-bold text-gray-800">125</div>
                    </div>
                </div>
            </div>

            {/* Contenido del reporte */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                    {selectedReport === 'grades' && 'Reporte de Calificaciones'}
                    {selectedReport === 'attendance' && 'Reporte de Asistencia'}
                    {selectedReport === 'performance' && 'Rendimiento del Curso'}
                </h2>
                
                {renderReportContent()}
            </div>
        </div>
    );
};

export default Reports;