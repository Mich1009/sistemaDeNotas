import React, { useState, useEffect } from 'react';
import { BookOpen, Users, FileText, Edit, Save, Plus, Trash2, Search, Filter, AlertCircle, Calculator, Check } from 'lucide-react';
import { getCourses, getStudentsWithGrades, academicService, gradesService } from '../services/apiTeacher';
import useAuthStore from '../../../modules/auth/store/authStore';
import toast from 'react-hot-toast';

const Grades = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editableGrades, setEditableGrades] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState('evaluaciones');
    const [savingRows, setSavingRows] = useState({}); // Track which rows are being saved

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
            console.log("📘 Estudiantes con notas:", response.data);
            setStudents(response.data || []);
            
            const initialEditable = {};
            response.data.forEach(student => {
                if (student.notas && student.notas.length > 0) {
                    student.notas.forEach(nota => {
                        if (!initialEditable[student.id]) {
                            initialEditable[student.id] = {};
                        }
                        initialEditable[student.id] = {
                            ...initialEditable[student.id],
                            ...nota
                        };
                    });
                }
            });
            setEditableGrades(initialEditable);
        } catch (error) {
            console.error('Error al cargar datos del curso:', error);
            toast.error('No se pudieron cargar los datos del curso');
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (studentId, field, value) => {
        setEditableGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value === '' ? null : parseFloat(value)
            }
        }));
        setHasChanges(true);
    };
    // 🔥 CORRECCIÓN - Envía campos DIRECTOS:

    const handleSaveStudentGrades = async (studentId) => {
        if (!selectedCourse) return;
        
        setSavingRows(prev => ({ ...prev, [studentId]: true }));
        
        try {
            const studentGrades = editableGrades[studentId];
            if (!studentGrades) {
                toast.error('No hay notas para guardar');
                return;
            }
    
            // 👇 ESTRUCTURA SIMPLE - campos directos
            const gradeToSave = {
                estudiante_id: parseInt(studentId),
                curso_id: selectedCourse,
                tipo_evaluacion: "EVALUACION",
                fecha_evaluacion: new Date().toISOString().split('T')[0],
                observaciones: "Notas actualizadas",
                peso: 1.0
            };
    
            // 👇 COPIAR TODOS los campos de notas DIRECTAMENTE
            for (let i = 1; i <= 8; i++) {
                const key = `evaluacion${i}`;
                if (studentGrades[key] !== undefined) {
                    gradeToSave[key] = studentGrades[key];
                }
            }
    
            for (let i = 1; i <= 4; i++) {
                const key = `practica${i}`;
                if (studentGrades[key] !== undefined) {
                    gradeToSave[key] = studentGrades[key];
                }
            }
    
            for (let i = 1; i <= 2; i++) {
                const key = `parcial${i}`;
                if (studentGrades[key] !== undefined) {
                    gradeToSave[key] = studentGrades[key];
                }
            }
    
            // Verificar que hay datos para guardar
            const hasGrades = Object.keys(gradeToSave).some(key => 
                key.startsWith('evaluacion') || key.startsWith('practica') || key.startsWith('parcial')
            );
    
            if (!hasGrades) {
                toast.error('No hay notas válidas para guardar');
                return;
            }
    
            console.log("📤 ENVIANDO NOTA INDIVIDUAL:", { notas: [gradeToSave] });
            
            // ✅ RUTA CORRECTA para guardado masivo (funciona para 1 estudiante también)
            await gradesService.updateGradesBulk(selectedCourse, { notas: [gradeToSave] });
            
            toast.success(`✅ Notas guardadas para ${getStudentName(studentId)}`);
            
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Error al guardar las notas');
        } finally {
            setSavingRows(prev => ({ ...prev, [studentId]: false }));
        }
    };
    // Función corregida para detectar cambios
    const hasUnsavedChanges = (studentId) => {
        const student = students.find(s => s.id === parseInt(studentId));
        if (!student) return false;
    
        const currentGrades = editableGrades[studentId] || {};
        
        // Si el estudiante no tenía notas antes pero ahora tiene, hay cambios
        if (!student.notas || student.notas.length === 0) {
            return Object.values(currentGrades).some(val => 
                val !== null && val !== undefined && val !== ''
            );
        }
    
        // Combinar todas las notas originales del estudiante en un solo objeto
        const originalGrades = {};
        student.notas.forEach(nota => {
            Object.entries(nota).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    originalGrades[key] = value;
                }
            });
        });
    
        // Comparar cada campo
        for (const [key, currentValue] of Object.entries(currentGrades)) {
            const originalValue = originalGrades[key];
            
            // Si el valor actual es diferente al original, hay cambios
            if (currentValue !== originalValue) {
                // Manejar casos de null/undefined/string vacío
                if (currentValue !== null && currentValue !== undefined && currentValue !== '') {
                    if (originalValue === null || originalValue === undefined) {
                        return true; // Se agregó una nueva nota
                    }
                    if (parseFloat(currentValue) !== parseFloat(originalValue)) {
                        return true; // La nota cambió
                    }
                }
            }
        }
    
        return false;
    };

    const handleSaveAllGrades = async () => {
        if (!selectedCourse) return;
        
        setLoading(true);
        try {
            const gradesToSave = [];
            
            // Recorrer todos los estudiantes que tienen cambios
            Object.entries(editableGrades).forEach(([studentId, studentGrades]) => {
                if (hasUnsavedChanges(studentId)) {
                    const gradeToSave = {
                        estudiante_id: parseInt(studentId),
                        curso_id: selectedCourse,
                        tipo_evaluacion: "EVALUACION",
                        fecha_evaluacion: new Date().toISOString().split('T')[0],
                        observaciones: "Actualización masiva",
                        peso: 1.0
                    };
    
                    // Copiar todos los campos de notas
                    for (let i = 1; i <= 8; i++) {
                        const key = `evaluacion${i}`;
                        if (studentGrades[key] !== undefined) {
                            gradeToSave[key] = studentGrades[key];
                        }
                    }
    
                    for (let i = 1; i <= 4; i++) {
                        const key = `practica${i}`;
                        if (studentGrades[key] !== undefined) {
                            gradeToSave[key] = studentGrades[key];
                        }
                    }
    
                    for (let i = 1; i <= 2; i++) {
                        const key = `parcial${i}`;
                        if (studentGrades[key] !== undefined) {
                            gradeToSave[key] = studentGrades[key];
                        }
                    }
    
                    gradesToSave.push(gradeToSave);
                }
            });
    
            if (gradesToSave.length === 0) {
                toast.error('No hay cambios para guardar');
                return;
            }
    
            console.log("📤 ENVIANDO TODAS LAS NOTAS:", { notas: gradesToSave });
            
            // ✅ RUTA CORRECTA para guardado masivo
            await gradesService.updateGradesBulk(selectedCourse, { notas: gradesToSave });
            
            toast.success(`✅ ${gradesToSave.length} estudiantes actualizados correctamente`);
            setHasChanges(false);
            
            // Recargar datos para ver cambios
            handleCourseSelect(selectedCourse);
            
        } catch (error) {
            console.error('Error al guardar todas las notas:', error);
            toast.error('❌ Error al guardar las notas');
        } finally {
            setLoading(false);
        }
    };
    // Funciones auxiliares (se mantienen igual)
    const hasEvaluations = (grades) => {
        return Array.from({length: 8}, (_, i) => grades[`evaluacion${i+1}`])
            .some(val => val !== null && val !== undefined);
    };

    const hasPracticas = (grades) => {
        return Array.from({length: 4}, (_, i) => grades[`practica${i+1}`])
            .some(val => val !== null && val !== undefined);
    };

    const hasParciales = (grades) => {
        return Array.from({length: 2}, (_, i) => grades[`parcial${i+1}`])
            .some(val => val !== null && val !== undefined);
    };

    const extractEvaluations = (grades) => {
        const result = {};
        for (let i = 1; i <= 8; i++) {
            result[`evaluacion${i}`] = grades[`evaluacion${i}`] || null;
        }
        return result;
    };

    const extractPracticas = (grades) => {
        const result = {};
        for (let i = 1; i <= 4; i++) {
            result[`practica${i}`] = grades[`practica${i}`] || null;
        }
        return result;
    };

    const extractParciales = (grades) => {
        const result = {};
        for (let i = 1; i <= 2; i++) {
            result[`parcial${i}`] = grades[`parcial${i}`] || null;
        }
        return result;
    };

    // 🔥 NUEVA FUNCIÓN: Obtener nombre del estudiante
    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? `${student.first_name} ${student.last_name}` : 'Estudiante';
    };

    const calculateStudentAverage = (studentId) => {
        const studentGrades = editableGrades[studentId];
        if (!studentGrades) return null;

        const allGrades = [];
        
        for (let i = 1; i <= 8; i++) {
            if (studentGrades[`evaluacion${i}`] > 0) {
                allGrades.push(studentGrades[`evaluacion${i}`]);
            }
        }
        
        for (let i = 1; i <= 4; i++) {
            if (studentGrades[`practica${i}`] > 0) {
                allGrades.push(studentGrades[`practica${i}`]);
            }
        }
        
        for (let i = 1; i <= 2; i++) {
            if (studentGrades[`parcial${i}`] > 0) {
                allGrades.push(studentGrades[`parcial${i}`]);
            }
        }

        if (allGrades.length === 0) return null;
        
        const sum = allGrades.reduce((acc, grade) => acc + grade, 0);
        return (sum / allGrades.length).toFixed(2);
    };

    const getStudentStatus = (studentId) => {
        const average = calculateStudentAverage(studentId);
        if (!average) return 'SIN_NOTA';
        return average >= 11 ? 'APROBADO' : 'DESAPROBADO';
    };

    const calculateCourseAverage = () => {
        const averages = students.map(student => calculateStudentAverage(student.id))
            .filter(avg => avg !== null)
            .map(avg => parseFloat(avg));
        
        if (averages.length === 0) return null;
        
        const sum = averages.reduce((acc, avg) => acc + avg, 0);
        return (sum / averages.length).toFixed(2);
    };

    const filteredStudents = students.filter(student => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || 
               student.dni.includes(searchTerm);
    });

    const renderGradeInput = (studentId, field, placeholder = "0.00") => {
        return (
            <input
                type="number"
                min="0"
                max="20"
                step="0.01"
                className="w-16 px-2 py-1 border rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={editableGrades[studentId]?.[field] || ''}
                onChange={(e) => handleGradeChange(studentId, field, e.target.value)}
                placeholder={placeholder}
            />
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-2" /> Sistema de Calificaciones
            </h1>
            
            {/* Selección de Curso */}
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
                                <p className="text-sm text-gray-500">Ciclo: {course.ciclo_nombre}</p>
                                <div className="flex items-center mt-2">
                                    <Users size={14} className="text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-500">{course.total_estudiantes || 0} estudiantes</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Gestión de Notas */}
            {selectedCourse && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">
                                Calificaciones - {courses.find(c => c.id === selectedCourse)?.nombre}
                            </h2>
                            {calculateCourseAverage() && (
                                <p className="text-sm text-gray-500">
                                    Promedio del curso: <span className="font-semibold">{calculateCourseAverage()}</span>
                                </p>
                            )}
                        </div>
                        
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
                            {hasChanges && (
                                <button
                                    onClick={handleSaveAllGrades}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                                >
                                    <Save size={16} className="mr-1" /> 
                                    {loading ? 'Guardando...' : 'Guardar Todas las Notas'}
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Pestañas de tipos de evaluación */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                {['evaluaciones', 'practicas', 'parciales'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === tab
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {tab === 'evaluaciones' && 'Evaluaciones (1-8)'}
                                        {tab === 'practicas' && 'Prácticas (1-4)'}
                                        {tab === 'parciales' && 'Parciales (1-2)'}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                    
                    {/* Búsqueda */}
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
                                        
                                        {/* Campos dinámicos según la pestaña activa */}
                                        {activeTab === 'evaluaciones' && (
                                            <>
                                                {Array.from({length: 8}, (_, i) => (
                                                    <th key={i} className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                                                        Eval {i+1}
                                                    </th>
                                                ))}
                                            </>
                                        )}
                                        
                                        {activeTab === 'practicas' && (
                                            <>
                                                {Array.from({length: 4}, (_, i) => (
                                                    <th key={i} className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                                                        Pract {i+1}
                                                    </th>
                                                ))}
                                            </>
                                        )}
                                        
                                        {activeTab === 'parciales' && (
                                            <>
                                                {Array.from({length: 2}, (_, i) => (
                                                    <th key={i} className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                                                        Parc {i+1}
                                                    </th>
                                                ))}
                                            </>
                                        )}
                                        
                                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Promedio</th>
                                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Estado</th>
                                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredStudents.map((student) => {
                                        const average = calculateStudentAverage(student.id);
                                        const status = getStudentStatus(student.id);
                                        const hasStudentChanges = hasUnsavedChanges(student.id);
                                        const isSaving = savingRows[student.id];
                                        
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{student.first_name} {student.last_name}</p>
                                                        <p className="text-xs text-gray-500">{student.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-700">{student.dni}</td>
                                                
                                                {/* Campos de nota según pestaña activa */}
                                                {activeTab === 'evaluaciones' && (
                                                    <>
                                                        {Array.from({length: 8}, (_, i) => (
                                                            <td key={i} className="py-3 px-4 text-center">
                                                                {renderGradeInput(student.id, `evaluacion${i+1}`)}
                                                            </td>
                                                        ))}
                                                    </>
                                                )}
                                                
                                                {activeTab === 'practicas' && (
                                                    <>
                                                        {Array.from({length: 4}, (_, i) => (
                                                            <td key={i} className="py-3 px-4 text-center">
                                                                {renderGradeInput(student.id, `practica${i+1}`)}
                                                            </td>
                                                        ))}
                                                    </>
                                                )}
                                                
                                                {activeTab === 'parciales' && (
                                                    <>
                                                        {Array.from({length: 2}, (_, i) => (
                                                            <td key={i} className="py-3 px-4 text-center">
                                                                {renderGradeInput(student.id, `parcial${i+1}`)}
                                                            </td>
                                                        ))}
                                                    </>
                                                )}
                                                
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`inline-block py-1 px-3 rounded-full text-sm font-medium ${
                                                        !average ? 'bg-gray-100 text-gray-800' :
                                                        average >= 11 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {average || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`inline-block py-1 px-3 rounded-full text-xs font-medium ${
                                                        status === 'SIN_NOTA' ? 'bg-gray-100 text-gray-800' :
                                                        status === 'APROBADO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => handleSaveStudentGrades(student.id)}
                                                        disabled={!hasStudentChanges || isSaving}
                                                        className={`px-3 py-1 rounded-md text-sm flex items-center ${
                                                            hasStudentChanges 
                                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {isSaving ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-500 mr-1"></div>
                                                                Guardando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Check size={14} className="mr-1" />
                                                                Guardar
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
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