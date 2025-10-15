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
    Calendar,
    CheckCircle,
    AlertCircle,
    Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentGradesNew = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingGrade, setEditingGrade] = useState(null);
    const [showAddGradeModal, setShowAddGradeModal] = useState(false);
    const [showFinalGradeModal, setShowFinalGradeModal] = useState(false);
    const [newGrade, setNewGrade] = useState({
        studentId: '',
        tipoEvaluacion: '',
        valorNota: '',
        fechaEvaluacion: '',
        observaciones: ''
    });

    // Datos ficticios actualizados
    const courses = [
        { id: 1, name: 'Matemáticas I', code: 'MAT101', students: 25 },
        { id: 2, name: 'Programación Web', code: 'PRG201', students: 30 },
        { id: 3, name: 'Base de Datos', code: 'BDD301', students: 28 }
    ];

    // Tipos de evaluación según el nuevo sistema
    const evaluationTypes = [
        { 
            id: 'SEMANAL', 
            name: 'Nota Semanal', 
            weight: 0.1, 
            description: '2 notas por semana, 32 en total (peso: 10%)',
            color: 'bg-blue-100 text-blue-800'
        },
        { 
            id: 'PRACTICA', 
            name: 'Práctica Calificada', 
            weight: 0.3, 
            description: '1 por mes, 4 en total (peso: 30%)',
            color: 'bg-green-100 text-green-800'
        },
        { 
            id: 'PARCIAL', 
            name: 'Parcial', 
            weight: 0.3, 
            description: '1 cada 2 meses, 2 en total (peso: 30%)',
            color: 'bg-purple-100 text-purple-800'
        }
    ];

    const [students, setStudents] = useState([
        {
            id: 1,
            dni: '12345678',
            firstName: 'Juan',
            lastName: 'Pérez García',
            email: 'juan.perez@email.com',
            grades: {
                SEMANAL: [
                    { id: 1, valorNota: 16, fechaEvaluacion: '2024-01-15', observaciones: 'Semana 1' },
                    { id: 2, valorNota: 18, fechaEvaluacion: '2024-01-22', observaciones: 'Semana 2' },
                    { id: 3, valorNota: 15, fechaEvaluacion: '2024-01-29', observaciones: 'Semana 3' },
                    { id: 4, valorNota: 17, fechaEvaluacion: '2024-02-05', observaciones: 'Semana 4' }
                ],
                PRACTICA: [
                    { id: 5, valorNota: 18, fechaEvaluacion: '2024-01-30', observaciones: 'Práctica 1' },
                    { id: 6, valorNota: 16, fechaEvaluacion: '2024-02-28', observaciones: 'Práctica 2' }
                ],
                PARCIAL: [
                    { id: 7, valorNota: 17, fechaEvaluacion: '2024-02-15', observaciones: 'Primer Parcial' }
                ]
            }
        },
        {
            id: 2,
            dni: '87654321',
            firstName: 'María',
            lastName: 'González López',
            email: 'maria.gonzalez@email.com',
            grades: {
                SEMANAL: [
                    { id: 8, valorNota: 14, fechaEvaluacion: '2024-01-15', observaciones: 'Semana 1' },
                    { id: 9, valorNota: 17, fechaEvaluacion: '2024-01-22', observaciones: 'Semana 2' },
                    { id: 10, valorNota: 19, fechaEvaluacion: '2024-01-29', observaciones: 'Semana 3' }
                ],
                PRACTICA: [
                    { id: 11, valorNota: 17, fechaEvaluacion: '2024-01-30', observaciones: 'Práctica 1' }
                ],
                PARCIAL: []
            }
        }
    ]);

    // Calcular promedio por tipo de evaluación
    const calculateAverageByType = (grades, tipo) => {
        if (!grades[tipo] || grades[tipo].length === 0) return 0;
        const sum = grades[tipo].reduce((acc, grade) => acc + grade.valorNota, 0);
        return (sum / grades[tipo].length).toFixed(2);
    };

    // Calcular promedio final según la fórmula del sistema
    const calculateFinalGrade = (grades) => {
        const promedioSemanales = parseFloat(calculateAverageByType(grades, 'SEMANAL'));
        const promedioPracticas = parseFloat(calculateAverageByType(grades, 'PRACTICA'));
        const promedioParciales = parseFloat(calculateAverageByType(grades, 'PARCIAL'));

        const promedioFinal = (
            promedioSemanales * 0.1 +
            promedioPracticas * 0.3 +
            promedioParciales * 0.3
        );

        return promedioFinal.toFixed(2);
    };

    // Determinar estado del estudiante
    const getStudentStatus = (grades) => {
        const finalGrade = parseFloat(calculateFinalGrade(grades));
        if (finalGrade >= 10.5) return { status: 'APROBADO', color: 'text-green-600', icon: CheckCircle };
        if (finalGrade > 0) return { status: 'DESAPROBADO', color: 'text-red-600', icon: AlertCircle };
        return { status: 'SIN_NOTAS', color: 'text-gray-600', icon: Clock };
    };

    // Validar estructura de notas
    const validateGradeStructure = (grades) => {
        const semanales = grades.SEMANAL ? grades.SEMANAL.length : 0;
        const practicas = grades.PRACTICA ? grades.PRACTICA.length : 0;
        const parciales = grades.PARCIAL ? grades.PARCIAL.length : 0;

        return {
            semanales: { actual: semanales, esperadas: 32, completas: semanales === 32 },
            practicas: { actual: practicas, esperadas: 4, completas: practicas === 4 },
            parciales: { actual: parciales, esperadas: 2, completas: parciales === 2 },
            estructuraCompleta: semanales === 32 && practicas === 4 && parciales === 2
        };
    };

    const handleAddGrade = () => {
        if (!newGrade.studentId || !newGrade.tipoEvaluacion || !newGrade.valorNota || !newGrade.fechaEvaluacion) {
            toast.error('Por favor completa todos los campos obligatorios');
            return;
        }

        const student = students.find(s => s.id === parseInt(newGrade.studentId));
        if (student) {
            const newGradeObj = {
                id: Date.now(),
                valorNota: parseFloat(newGrade.valorNota),
                fechaEvaluacion: newGrade.fechaEvaluacion,
                observaciones: newGrade.observaciones
            };

            if (!student.grades[newGrade.tipoEvaluacion]) {
                student.grades[newGrade.tipoEvaluacion] = [];
            }

            student.grades[newGrade.tipoEvaluacion].push(newGradeObj);
            setStudents([...students]);
            toast.success('Nota agregada exitosamente');
            setShowAddGradeModal(false);
            setNewGrade({
                studentId: '',
                tipoEvaluacion: '',
                valorNota: '',
                fechaEvaluacion: '',
                observaciones: ''
            });
        }
    };

    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.dni.includes(searchTerm)
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Award className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Sistema de Calificaciones</h1>
                                <p className="text-gray-600">Gestión de notas por tipo de evaluación</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowAddGradeModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Agregar Nota</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Información del sistema */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Estructura del Sistema de Calificaciones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {evaluationTypes.map(type => (
                            <div key={type.id} className={`p-3 rounded-lg ${type.color}`}>
                                <h4 className="font-medium">{type.name}</h4>
                                <p className="text-sm">{type.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Estudiante</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar por nombre, apellido o DNI..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="md:w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar curso</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.name} ({course.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Lista de estudiantes */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Estudiantes</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {filteredStudents.map(student => {
                            const finalGrade = calculateFinalGrade(student.grades);
                            const status = getStudentStatus(student.grades);
                            const structure = validateGradeStructure(student.grades);
                            const StatusIcon = status.icon;

                            return (
                                <div key={student.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Users className="h-6 w-6 text-blue-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {student.firstName} {student.lastName}
                                                </h3>
                                                <p className="text-sm text-gray-600">DNI: {student.dni}</p>
                                                <p className="text-sm text-gray-500">{student.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <div className={`flex items-center space-x-2 ${status.color}`}>
                                                    <StatusIcon className="h-4 w-4" />
                                                    <span className="font-medium">{status.status}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Promedio Final: <span className="font-semibold">{finalGrade}</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                            >
                                                Ver Detalles
                                            </button>
                                        </div>
                                    </div>

                                    {/* Estructura de notas */}
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {evaluationTypes.map(type => {
                                            const average = calculateAverageByType(student.grades, type.id);
                                            const count = student.grades[type.id] ? student.grades[type.id].length : 0;
                                            const expected = type.id === 'SEMANAL' ? 32 : type.id === 'PRACTICA' ? 4 : 2;
                                            const isComplete = count === expected;

                                            return (
                                                <div key={type.id} className={`p-3 rounded-lg ${type.color}`}>
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium">{type.name}</h4>
                                                        <div className={`text-xs px-2 py-1 rounded-full ${
                                                            isComplete ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                                        }`}>
                                                            {count}/{expected}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm mt-1">
                                                        Promedio: <span className="font-semibold">{average}</span>
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modal para agregar nota */}
                {showAddGradeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Agregar Nueva Nota</h3>
                                <button
                                    onClick={() => setShowAddGradeModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
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
                                        value={newGrade.tipoEvaluacion}
                                        onChange={(e) => setNewGrade({...newGrade, tipoEvaluacion: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        {evaluationTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name} (Peso: {type.weight * 100}%)
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
                                        value={newGrade.valorNota}
                                        onChange={(e) => setNewGrade({...newGrade, valorNota: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ingrese la nota"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Evaluación</label>
                                    <input
                                        type="date"
                                        value={newGrade.fechaEvaluacion}
                                        onChange={(e) => setNewGrade({...newGrade, fechaEvaluacion: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                                    <textarea
                                        value={newGrade.observaciones}
                                        onChange={(e) => setNewGrade({...newGrade, observaciones: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Observaciones opcionales"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAddGradeModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddGrade}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Agregar Nota
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentGradesNew;
