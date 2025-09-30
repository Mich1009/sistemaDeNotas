import React, { useState, useEffect } from 'react';
import { 
    Award, 
    Users, 
    Plus, 
    Edit3, 
    Save, 
    X, 
    Search, 
    Filter,
    Download,
    Upload,
    BookOpen,
    TrendingUp,
    Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentGrades = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedEvaluation, setSelectedEvaluation] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingGrade, setEditingGrade] = useState(null);
    const [showAddGradeModal, setShowAddGradeModal] = useState(false);
    const [newGrade, setNewGrade] = useState({
        studentId: '',
        evaluationType: '',
        grade: '',
        weight: '',
        date: '',
        observations: ''
    });

    // Datos ficticios
    const courses = [
        { id: 1, name: 'Matemáticas I', code: 'MAT101', students: 25 },
        { id: 2, name: 'Programación Web', code: 'PRG201', students: 30 },
        { id: 3, name: 'Base de Datos', code: 'BDD301', students: 28 }
    ];

    const evaluationTypes = [
        { id: 'examen', name: 'Examen', weight: 40 },
        { id: 'practica', name: 'Práctica', weight: 30 },
        { id: 'tarea', name: 'Tarea', weight: 20 },
        { id: 'participacion', name: 'Participación', weight: 10 }
    ];

    const [students, setStudents] = useState([
        {
            id: 1,
            dni: '12345678',
            firstName: 'Juan',
            lastName: 'Pérez García',
            email: 'juan.perez@email.com',
            grades: [
                { id: 1, type: 'examen', grade: 16, weight: 40, date: '2024-01-15', observations: 'Buen desempeño' },
                { id: 2, type: 'practica', grade: 18, weight: 30, date: '2024-01-20', observations: '' },
                { id: 3, type: 'tarea', grade: 15, weight: 20, date: '2024-01-25', observations: 'Entrega tardía' }
            ]
        },
        {
            id: 2,
            dni: '87654321',
            firstName: 'María',
            lastName: 'González López',
            email: 'maria.gonzalez@email.com',
            grades: [
                { id: 4, type: 'examen', grade: 14, weight: 40, date: '2024-01-15', observations: '' },
                { id: 5, type: 'practica', grade: 17, weight: 30, date: '2024-01-20', observations: 'Excelente trabajo' },
                { id: 6, type: 'tarea', grade: 19, weight: 20, date: '2024-01-25', observations: 'Muy creativo' }
            ]
        },
        {
            id: 3,
            dni: '11223344',
            firstName: 'Carlos',
            lastName: 'Rodríguez Silva',
            email: 'carlos.rodriguez@email.com',
            grades: [
                { id: 7, type: 'examen', grade: 12, weight: 40, date: '2024-01-15', observations: 'Necesita mejorar' },
                { id: 8, type: 'practica', grade: 16, weight: 30, date: '2024-01-20', observations: '' }
            ]
        },
        {
            id: 4,
            dni: '55667788',
            firstName: 'Ana',
            lastName: 'Martínez Torres',
            email: 'ana.martinez@email.com',
            grades: [
                { id: 9, type: 'examen', grade: 18, weight: 40, date: '2024-01-15', observations: 'Destacado' },
                { id: 10, type: 'practica', grade: 19, weight: 30, date: '2024-01-20', observations: 'Perfecto' },
                { id: 11, type: 'tarea', grade: 20, weight: 20, date: '2024-01-25', observations: 'Excelente' }
            ]
        }
    ]);

    // Calcular promedio ponderado
    const calculateWeightedAverage = (grades) => {
        if (!grades || grades.length === 0) return 0;
        
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        grades.forEach(grade => {
            totalWeightedScore += (grade.grade * grade.weight) / 100;
            totalWeight += grade.weight;
        });
        
        return totalWeight > 0 ? (totalWeightedScore / totalWeight * 100).toFixed(1) : 0;
    };

    // Filtrar estudiantes
    const filteredStudents = students.filter(student => {
        const matchesSearch = searchTerm === '' || 
            student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.dni.includes(searchTerm);
        
        return matchesSearch;
    });

    // Manejar edición de nota
    const handleEditGrade = (studentId, gradeId) => {
        const student = students.find(s => s.id === studentId);
        const grade = student.grades.find(g => g.id === gradeId);
        setEditingGrade({ studentId, gradeId, ...grade });
    };

    // Guardar nota editada
    const handleSaveGrade = () => {
        setStudents(prev => prev.map(student => {
            if (student.id === editingGrade.studentId) {
                return {
                    ...student,
                    grades: student.grades.map(grade => 
                        grade.id === editingGrade.gradeId 
                            ? { ...grade, grade: parseFloat(editingGrade.grade), observations: editingGrade.observations }
                            : grade
                    )
                };
            }
            return student;
        }));
        
        setEditingGrade(null);
        toast.success('Nota actualizada correctamente');
    };

    // Agregar nueva nota
    const handleAddGrade = () => {
        if (!newGrade.studentId || !newGrade.evaluationType || !newGrade.grade) {
            toast.error('Por favor complete todos los campos obligatorios');
            return;
        }

        const evalType = evaluationTypes.find(e => e.id === newGrade.evaluationType);
        const newGradeObj = {
            id: Date.now(),
            type: newGrade.evaluationType,
            grade: parseFloat(newGrade.grade),
            weight: evalType.weight,
            date: newGrade.date || new Date().toISOString().split('T')[0],
            observations: newGrade.observations
        };

        setStudents(prev => prev.map(student => {
            if (student.id === parseInt(newGrade.studentId)) {
                return {
                    ...student,
                    grades: [...student.grades, newGradeObj]
                };
            }
            return student;
        }));

        setNewGrade({
            studentId: '',
            evaluationType: '',
            grade: '',
            weight: '',
            date: '',
            observations: ''
        });
        setShowAddGradeModal(false);
        toast.success('Nota agregada correctamente');
    };

    // Obtener color según la nota
    const getGradeColor = (grade) => {
        if (grade >= 17) return 'text-green-600 bg-green-50';
        if (grade >= 14) return 'text-blue-600 bg-blue-50';
        if (grade >= 11) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="p-3 space-y-5">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Award className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Gestión de Calificaciones</h1>
                            <p className="text-gray-600">Administra las notas de tus estudiantes</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowAddGradeModal(true)}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Agregar Nota</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Exportar</span>
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                            <option value="">Todos los cursos</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name} ({course.code})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evaluación</label>
                        <select
                            value={selectedEvaluation}
                            onChange={(e) => setSelectedEvaluation(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                            <option value="">Todas las evaluaciones</option>
                            {evaluationTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name} ({type.weight}%)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Estudiante</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Nombre o DNI..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Estudiantes</p>
                            <p className="text-2xl font-bold text-gray-800">{filteredStudents.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Promedio General</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {(filteredStudents.reduce((acc, student) => acc + parseFloat(calculateWeightedAverage(student.grades)), 0) / filteredStudents.length || 0).toFixed(1)}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Aprobados</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {filteredStudents.filter(student => parseFloat(calculateWeightedAverage(student.grades)) >= 11).length}
                            </p>
                        </div>
                        <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Desaprobados</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {filteredStudents.filter(student => parseFloat(calculateWeightedAverage(student.grades)) < 11).length}
                            </p>
                        </div>
                        <X className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Tabla de estudiantes y notas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estudiante
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    DNI
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Examen (40%)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Práctica (30%)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tarea (20%)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Participación (10%)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Promedio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student) => {
                                const average = calculateWeightedAverage(student.grades);
                                return (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.firstName} {student.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{student.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.dni}
                                        </td>
                                        {evaluationTypes.map((evalType) => {
                                            const grade = student.grades.find(g => g.type === evalType.id);
                                            return (
                                                <td key={evalType.id} className="px-6 py-4 whitespace-nowrap">
                                                    {grade ? (
                                                        <div className="flex items-center space-x-2">
                                                            {editingGrade && editingGrade.studentId === student.id && editingGrade.gradeId === grade.id ? (
                                                                <div className="flex items-center space-x-1">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="20"
                                                                        step="0.1"
                                                                        value={editingGrade.grade}
                                                                        onChange={(e) => setEditingGrade({...editingGrade, grade: e.target.value})}
                                                                        className="w-16 px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900"
                                                                    />
                                                                    <button
                                                                        onClick={handleSaveGrade}
                                                                        className="text-green-600 hover:text-green-800"
                                                                    >
                                                                        <Save className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingGrade(null)}
                                                                        className="text-red-600 hover:text-red-800"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.grade)}`}>
                                                                        {grade.grade}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleEditGrade(student.id, grade.id)}
                                                                        className="text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        <Edit3 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Sin nota</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(parseFloat(average))}`}>
                                                {average}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => setNewGrade({...newGrade, studentId: student.id.toString()})}
                                                className="text-blue-600 hover:text-blue-800 mr-2"
                                                title="Agregar nota"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para agregar nota */}
            {showAddGradeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Agregar Nueva Nota</h3>
                            <button
                                onClick={() => setShowAddGradeModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
                                <select
                                    value={newGrade.studentId}
                                    onChange={(e) => setNewGrade({...newGrade, studentId: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar estudiante</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.firstName} {student.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evaluación</label>
                                <select
                                    value={newGrade.evaluationType}
                                    onChange={(e) => setNewGrade({...newGrade, evaluationType: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar tipo</option>
                                    {evaluationTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name} ({type.weight}%)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nota (0-20)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.1"
                                    value={newGrade.grade}
                                    onChange={(e) => setNewGrade({...newGrade, grade: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ingrese la nota"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                <input
                                    type="date"
                                    value={newGrade.date}
                                    onChange={(e) => setNewGrade({...newGrade, date: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                <textarea
                                    value={newGrade.observations}
                                    onChange={(e) => setNewGrade({...newGrade, observations: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Observaciones opcionales..."
                                />
                            </div>
                        </div>
                        
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={handleAddGrade}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Guardar Nota
                            </button>
                            <button
                                onClick={() => setShowAddGradeModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentGrades;