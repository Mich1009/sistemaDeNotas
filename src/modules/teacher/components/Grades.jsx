import React, { useState, useEffect } from 'react';
import { BookOpen, Users, FileText, Edit, Save, Plus, Trash2, Search, Filter, AlertCircle } from 'lucide-react';
import { academicService, gradesService } from '../services/apiTeacher';
import useAuthStore from '../../../modules/auth/store/authStore';
import toast from 'react-hot-toast';

const Grades = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingGradeId, setEditingGradeId] = useState(null);
    const [newGradeData, setNewGradeData] = useState({
        estudiante_id: '',
        valor: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0]
    });
    const [showAddGradeForm, setShowAddGradeForm] = useState(false);
    const [editGradeData, setEditGradeData] = useState({
        valor: '',
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

    const handleCourseSelect = async (courseId) => {
        setSelectedCourse(courseId);
        setLoading(true);
        try {
            const studentsData = await academicService.getStudentsByCourse(courseId);
            console.log("📘 Estudiantes del curso:", studentsData); 
            setStudents(studentsData);
            
            const gradesData = await gradesService.getGradesByCourse(courseId);
            setGrades(gradesData);
        } catch (error) {
            console.error('Error al cargar datos del curso:', error);
            toast.error('No se pudieron cargar los datos del curso');
        } finally {
            setLoading(false);
        }
    };

    const handleAddGrade = async () => {
        if (!selectedCourse || !newGradeData.estudiante_id || !newGradeData.valor) {
            toast.error('Por favor complete todos los campos requeridos');
            return;
        }

        setLoading(true);
        try {
            const gradeToAdd = {
                ...newGradeData,
                curso_id: selectedCourse,
                valor: parseFloat(newGradeData.valor)
            };
            
            const addedGrade = await gradesService.createGrade(gradeToAdd);
            setGrades([...grades, addedGrade]);
            
            setNewGradeData({
                estudiante_id: '',
                valor: '',
                descripcion: '',
                fecha: new Date().toISOString().split('T')[0]
            });
            
            setShowAddGradeForm(false);
            toast.success('Calificación agregada correctamente');
        } catch (error) {
            console.error('Error al agregar calificación:', error);
            toast.error('No se pudo agregar la calificación');
        } finally {
            setLoading(false);
        }
    };

    const handleEditGrade = (grade) => {
        setEditingGradeId(grade.id);
        setEditGradeData({
            valor: grade.valor.toString(),
            descripcion: grade.descripcion || ''
        });
    };

    const handleUpdateGrade = async (gradeId) => {
        if (!editGradeData.valor) {
            toast.error('El valor de la calificación es requerido');
            return;
        }

        setLoading(true);
        try {
            const updatedGrade = await gradesService.updateGrade(gradeId, {
                valor: parseFloat(editGradeData.valor),
                descripcion: editGradeData.descripcion
            });
            
            setGrades(grades.map(grade => 
                grade.id === gradeId ? {...grade, ...updatedGrade} : grade
            ));
            
            setEditingGradeId(null);
            toast.success('Calificación actualizada correctamente');
        } catch (error) {
            console.error('Error al actualizar calificación:', error);
            toast.error('No se pudo actualizar la calificación');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGrade = async (gradeId) => {
        if (!window.confirm('¿Está seguro de eliminar esta calificación?')) {
            return;
        }

        setLoading(true);
        try {
            await gradesService.deleteGrade(gradeId);
            setGrades(grades.filter(grade => grade.id !== gradeId));
            toast.success('Calificación eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar calificación:', error);
            toast.error('No se pudo eliminar la calificación');
        } finally {
            setLoading(false);
        }
    };

    const getStudentById = (studentId) => {
        return students.find(student => student.id === studentId);
    };

    const getStudentGrades = (studentId) => {
        return grades.filter(grade => grade.estudiante_id === studentId);
    };

    const calculateAverage = (studentId) => {
        const studentGrades = getStudentGrades(studentId);
        if (studentGrades.length === 0) return '-';
        
        const sum = studentGrades.reduce((acc, grade) => acc + grade.valor, 0);
        return (sum / studentGrades.length).toFixed(2);
    };

    const filteredStudents = students.filter(student => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || 
               student.dni.includes(searchTerm);
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-2" /> Calificaciones
            </h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Seleccione un curso</h2>
                
                {loading && !selectedCourse ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando cursos...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.map((course) => (
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
                                <p className="text-sm text-gray-500">Código: {course.codigo}</p>
                                <div className="flex items-center mt-2">
                                    <Users size={14} className="text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-500">{course.total_estudiantes || 0} estudiantes</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {selectedCourse && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 md:mb-0">
                            Calificaciones - {courses.find(c => c.id === selectedCourse)?.nombre}
                        </h2>
                        
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                            <button
                                onClick={() => setShowAddGradeForm(!showAddGradeForm)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                            >
                                <Plus size={16} className="mr-1" /> {showAddGradeForm ? 'Cancelar' : 'Agregar Calificación'}
                            </button>
                        </div>
                    </div>
                    
                    {showAddGradeForm && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-gray-700 mb-3">Nueva Calificación</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estudiante *
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newGradeData.estudiante_id}
                                        onChange={(e) => setNewGradeData({...newGradeData, estudiante_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Seleccione un estudiante</option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {student.first_name} {student.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Calificación (0-20) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        step="0.01"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newGradeData.valor}
                                        onChange={(e) => setNewGradeData({...newGradeData, valor: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newGradeData.fecha}
                                        onChange={(e) => setNewGradeData({...newGradeData, fecha: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newGradeData.descripcion}
                                        onChange={(e) => setNewGradeData({...newGradeData, descripcion: e.target.value})}
                                        placeholder="Ej: Examen parcial"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleAddGrade}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar Calificación'}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar estudiante por nombre o DNI..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                    </div>
                    
                    {loading && selectedCourse ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando datos...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-10">
                            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">No se encontraron estudiantes</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Estudiante</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">DNI</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Calificaciones</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Promedio</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-800">{student.first_name} {student.last_name}</p>
                                                    <p className="text-xs text-gray-500">{student.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{student.dni}</td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-2">
                                                    {getStudentGrades(student.id).length === 0 ? (
                                                        <p className="text-sm text-gray-500 italic">Sin calificaciones</p>
                                                    ) : (
                                                        getStudentGrades(student.id).map((grade) => (
                                                            <div key={grade.id} className="flex items-center space-x-2">
                                                                {editingGradeId === grade.id ? (
                                                                    <div className="flex items-center space-x-2">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            max="20"
                                                                            step="0.01"
                                                                            className="w-16 px-2 py-1 border rounded-md text-sm"
                                                                            value={editGradeData.valor}
                                                                            onChange={(e) => setEditGradeData({...editGradeData, valor: e.target.value})}
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            className="w-32 px-2 py-1 border rounded-md text-sm"
                                                                            value={editGradeData.descripcion}
                                                                            onChange={(e) => setEditGradeData({...editGradeData, descripcion: e.target.value})}
                                                                            placeholder="Descripción"
                                                                        />
                                                                        <button
                                                                            onClick={() => handleUpdateGrade(grade.id)}
                                                                            className="p-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                                                        >
                                                                            <Save size={14} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <span className={`inline-block w-10 text-center py-0.5 px-2 rounded-md text-sm font-medium ${
                                                                            grade.valor >= 10.5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                            {grade.valor.toFixed(2)}
                                                                        </span>
                                                                        <span className="text-sm text-gray-600">
                                                                            {grade.descripcion || 'Sin descripción'}
                                                                        </span>
                                                                        <span className="text-xs text-gray-400">
                                                                            {new Date(grade.fecha).toLocaleDateString()}
                                                                        </span>
                                                                        <div className="flex space-x-1">
                                                                            <button
                                                                                onClick={() => handleEditGrade(grade)}
                                                                                className="p-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                                                            >
                                                                                <Edit size={14} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteGrade(grade.id)}
                                                                                className="p-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block py-1 px-3 rounded-full text-sm font-medium ${
                                                    calculateAverage(student.id) >= 10.5 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : calculateAverage(student.id) === '-'
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {calculateAverage(student.id)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => {
                                                        setNewGradeData({
                                                            ...newGradeData,
                                                            estudiante_id: student.id
                                                        });
                                                        setShowAddGradeForm(true);
                                                    }}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm flex items-center"
                                                >
                                                    <Plus size={14} className="mr-1" /> Agregar nota
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Grades;