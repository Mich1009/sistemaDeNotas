import React, { useState, useEffect } from 'react';
import { BookOpen, Users, FileText, Edit, Save, Plus, Trash2, Search, Filter, AlertCircle } from 'lucide-react';
import { getCourses, getStudentsWithGrades, updateGradesBulk, academicService, gradesService } from '../services/apiTeacher';
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
    const [editableGrades, setEditableGrades] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    const user = useAuthStore(state => state.user);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await getCourses();
            setCourses(response.data || []);
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
            const response = await getStudentsWithGrades(courseId);
            console.log("📘 Estudiantes del curso:", response.data); 
            setStudents(response.data || []);
            setGrades(response.data || []);
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
        const student = students.find(s => s.id === studentId);
        if (!student) return '-';
        
        const editable = editableGrades[studentId];
        const nota1 = editable?.nota1 || student.nota1 || 0;
        const nota2 = editable?.nota2 || student.nota2 || 0;
        const nota3 = editable?.nota3 || student.nota3 || 0;
        const nota4 = editable?.nota4 || student.nota4 || 0;
        
        const notas = [nota1, nota2, nota3, nota4].filter(n => n > 0);
        if (notas.length === 0) return '-';
        
        const sum = notas.reduce((acc, nota) => acc + nota, 0);
        return (sum / notas.length).toFixed(2);
    };

    const handleGradeChange = (studentId, gradeType, value) => {
        setEditableGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [gradeType]: value
            }
        }));
        setHasChanges(true);
    };

    const handleSaveAllGrades = async () => {
        if (!selectedCourse) return;
        
        setLoading(true);
        try {
            const gradesToSave = Object.entries(editableGrades).map(([studentId, grades]) => ({
                estudiante_id: parseInt(studentId),
                nota1: grades.nota1 ? parseFloat(grades.nota1) : null,
                nota2: grades.nota2 ? parseFloat(grades.nota2) : null,
                nota3: grades.nota3 ? parseFloat(grades.nota3) : null,
                nota4: grades.nota4 ? parseFloat(grades.nota4) : null,
                nota_final: grades.nota_final ? parseFloat(grades.nota_final) : null
            }));

            await updateGradesBulk(selectedCourse, { notas: gradesToSave });
            toast.success('Notas guardadas correctamente');
            setHasChanges(false);
            setEditableGrades({});
            // Recargar datos
            handleCourseSelect(selectedCourse);
        } catch (error) {
            console.error('Error al guardar notas:', error);
            toast.error('Error al guardar las notas');
        } finally {
            setLoading(false);
        }
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
                            {hasChanges && (
                                <button
                                    onClick={handleSaveAllGrades}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                >
                                    <Save size={16} className="mr-1" /> Guardar Todas las Notas
                                </button>
                            )}
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
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nota 1</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nota 2</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nota 3</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nota 4</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nota Final</th>
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
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.01"
                                                    className="w-16 px-2 py-1 border rounded-md text-sm"
                                                    value={editableGrades[student.id]?.nota1 || student.nota1 || ''}
                                                    onChange={(e) => handleGradeChange(student.id, 'nota1', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.01"
                                                    className="w-16 px-2 py-1 border rounded-md text-sm"
                                                    value={editableGrades[student.id]?.nota2 || student.nota2 || ''}
                                                    onChange={(e) => handleGradeChange(student.id, 'nota2', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.01"
                                                    className="w-16 px-2 py-1 border rounded-md text-sm"
                                                    value={editableGrades[student.id]?.nota3 || student.nota3 || ''}
                                                    onChange={(e) => handleGradeChange(student.id, 'nota3', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.01"
                                                    className="w-16 px-2 py-1 border rounded-md text-sm"
                                                    value={editableGrades[student.id]?.nota4 || student.nota4 || ''}
                                                    onChange={(e) => handleGradeChange(student.id, 'nota4', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.01"
                                                    className="w-16 px-2 py-1 border rounded-md text-sm"
                                                    value={editableGrades[student.id]?.nota_final || student.nota_final || ''}
                                                    onChange={(e) => handleGradeChange(student.id, 'nota_final', e.target.value)}
                                                    placeholder="0.00"
                                                />
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