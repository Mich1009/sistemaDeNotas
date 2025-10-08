import React, { useState, useEffect } from 'react';
import { BookOpen, Users, FileText, Edit, Eye, Search, Filter } from 'lucide-react';
import { academicService } from '../services/apiTeacher';
import useAuthStore from '../../../modules/auth/store/authStore';
import toast from 'react-hot-toast';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [showStudents, setShowStudents] = useState(false);
    const [showCourseDetails, setShowCourseDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [courseData, setCourseData] = useState({
        nombre: '',
        descripcion: ''
    });

    const user = useAuthStore(state => state.user);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await academicService.getCourses();
            setCourses(data);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
            toast.error('No se pudieron cargar los cursos');
        } finally {
            setLoading(false);
        }
    };

    const handleViewStudents = async (courseId) => {
        setLoading(true);
        try {
            const data = await academicService.getStudentsByCourse(courseId);
            setStudents(data);
            setSelectedCourse(courses.find(course => course.id === courseId));
            setShowStudents(true);
            setShowCourseDetails(false);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
            toast.error('No se pudieron cargar los estudiantes');
        } finally {
            setLoading(false);
        }
    };

    const handleViewCourseDetails = async (courseId) => {
        setLoading(true);
        try {
            const data = await academicService.getCourseById(courseId);
            setSelectedCourse(data);
            setCourseData({
                nombre: data.nombre,
                descripcion: data.descripcion || ''
            });
            setShowCourseDetails(true);
            setShowStudents(false);
            setEditMode(false);
        } catch (error) {
            console.error('Error al cargar detalles del curso:', error);
            toast.error('No se pudieron cargar los detalles del curso');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCourse = async () => {
        if (!selectedCourse) return;
        
        setLoading(true);
        try {
            await academicService.updateCourse(selectedCourse.id, courseData);
            toast.success('Curso actualizado correctamente');
            setEditMode(false);
            fetchCourses();
        } catch (error) {
            console.error('Error al actualizar curso:', error);
            toast.error('No se pudo actualizar el curso');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setShowStudents(false);
        setShowCourseDetails(false);
        setSelectedCourse(null);
    };

    const filteredCourses = courses.filter(course => 
        course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Renderizado condicional para la lista de cursos
    if (!showStudents && !showCourseDetails) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <BookOpen className="mr-2" /> Mis Cursos
                </h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between mb-6">
                        <div className="relative mb-4 md:mb-0 md:w-1/2">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o código..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                        <div className="flex items-center">
                            <Filter className="mr-2 text-gray-500" size={18} />
                            <span className="text-gray-700">Total: {courses.length} cursos</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando cursos...</p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600">No se encontraron cursos</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <div key={course.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-5 border-b">
                                        <h3 className="text-lg font-semibold text-gray-800">{course.nombre}</h3>
                                        <p className="text-sm text-gray-500">Código: {course.codigo}</p>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center mb-3">
                                            <BookOpen size={16} className="text-blue-500 mr-2" />
                                            <span className="text-sm">Créditos: {course.creditos}</span>
                                        </div>
                                        <div className="flex items-center mb-3">
                                            <Users size={16} className="text-green-500 mr-2" />
                                            <span className="text-sm">Estudiantes: {course.total_estudiantes || 0}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FileText size={16} className="text-purple-500 mr-2" />
                                            <span className="text-sm">Ciclo: {course.ciclo_nombre}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 border-t flex justify-between">
                                        <button
                                            onClick={() => handleViewStudents(course.id)}
                                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center text-sm"
                                        >
                                            <Users size={14} className="mr-1" /> Estudiantes
                                        </button>
                                        <button
                                            onClick={() => handleViewCourseDetails(course.id)}
                                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center text-sm"
                                        >
                                            <Eye size={14} className="mr-1" /> Detalles
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Renderizado para la lista de estudiantes
    if (showStudents && selectedCourse) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Users className="mr-2" /> Estudiantes de {selectedCourse.nombre}
                    </h1>
                    <button
                        onClick={handleBackToList}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Volver a mis cursos
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800">Información del curso</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            <div>
                                <span className="text-sm text-gray-500">Código:</span>
                                <p className="font-medium">{selectedCourse.codigo}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Créditos:</span>
                                <p className="font-medium">{selectedCourse.creditos}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Ciclo:</span>
                                <p className="font-medium">{selectedCourse.ciclo_nombre}</p>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando estudiantes...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600">No hay estudiantes matriculados en este curso</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">DNI</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Apellido</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-700">{student.dni}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{student.first_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{student.last_name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{student.email}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{student.phone || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Renderizado para los detalles del curso
    if (showCourseDetails && selectedCourse) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <BookOpen className="mr-2" /> Detalles del Curso
                    </h1>
                    <button
                        onClick={handleBackToList}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Volver a mis cursos
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando detalles...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {selectedCourse.nombre} ({selectedCourse.codigo})
                                </h2>
                                <button
                                    onClick={() => setEditMode(!editMode)}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center"
                                >
                                    <Edit size={16} className="mr-1" /> {editMode ? 'Cancelar' : 'Editar'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Información General</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-gray-500">Código:</span>
                                            <p className="font-medium">{selectedCourse.codigo}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Créditos:</span>
                                            <p className="font-medium">{selectedCourse.creditos}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Horas Semanales:</span>
                                            <p className="font-medium">{selectedCourse.horas_semanales}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Información Académica</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-gray-500">Ciclo:</span>
                                            <p className="font-medium">{selectedCourse.ciclo_nombre}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Estudiantes Matriculados:</span>
                                            <p className="font-medium">{selectedCourse.total_estudiantes || 0}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">Estado:</span>
                                            <p className="font-medium">
                                                {selectedCourse.is_active ? (
                                                    <span className="text-green-600">Activo</span>
                                                ) : (
                                                    <span className="text-red-600">Inactivo</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {editMode ? (
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-700 mb-4">Editar Información</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre del Curso
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={courseData.nombre}
                                                onChange={(e) => setCourseData({...courseData, nombre: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Descripción
                                            </label>
                                            <textarea
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows="4"
                                                value={courseData.descripcion}
                                                onChange={(e) => setCourseData({...courseData, descripcion: e.target.value})}
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleUpdateCourse}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                disabled={loading}
                                            >
                                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-700 mb-2">Descripción</h3>
                                    <p className="text-gray-600">
                                        {selectedCourse.descripcion || 'No hay descripción disponible para este curso.'}
                                    </p>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-700">Acciones Rápidas</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => handleViewStudents(selectedCourse.id)}
                                        className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-center"
                                    >
                                        <Users size={18} className="mr-2" /> Ver Estudiantes
                                    </button>
                                    <button
                                        className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-center"
                                        onClick={() => {
                                            // Redirigir a la sección de calificaciones con este curso preseleccionado
                                            // Esta funcionalidad se implementaría con React Router
                                            toast.success('Redirigiendo a calificaciones...');
                                        }}
                                    >
                                        <BookOpen size={18} className="mr-2" /> Gestionar Calificaciones
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default MyCourses;