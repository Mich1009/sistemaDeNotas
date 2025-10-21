import { useState, useEffect } from 'react';
import { getStudentsWithGrades, gradesService } from '../services/apiTeacher';
import toast from 'react-hot-toast';

const useGrades = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editableGrades, setEditableGrades] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [savingRows, setSavingRows] = useState({});

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

    const handleSaveStudentGrades = async (studentId) => {
        if (!selectedCourse) return;
        
        setSavingRows(prev => ({ ...prev, [studentId]: true }));
        
        try {
            const studentGrades = editableGrades[studentId];
            if (!studentGrades) {
                toast.error('No hay notas para guardar');
                return;
            }

            // Estructura simple - campos directos
            const gradeToSave = {
                estudiante_id: parseInt(studentId),
                curso_id: selectedCourse,
                tipo_evaluacion: "EVALUACION",
                fecha_evaluacion: new Date().toISOString().split('T')[0],
                observaciones: "Notas actualizadas",
                peso: 1.0
            };

            // Copiar todos los campos de notas directamente
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
            
            await gradesService.updateGradesBulk(selectedCourse, { notas: [gradeToSave] });
            
            toast.success(`✅ Notas guardadas para ${getStudentName(studentId)}`);
            
        } catch (error) {
            console.error('Error:', error);
            toast.error('❌ Error al guardar las notas');
        } finally {
            setSavingRows(prev => ({ ...prev, [studentId]: false }));
        }
    };

    // Función para detectar cambios
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

    // Función para obtener nombre del estudiante
    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? `${student.first_name} ${student.last_name}` : 'Estudiante';
    };

    const calculateStudentAverage = (studentId, gradeType = 'all') => {
        const studentGrades = editableGrades[studentId];
        if (!studentGrades) return null;

        // PESOS CORRECTOS
        const pesoEvaluaciones = 0.1; // 10%
        const pesoPracticas = 0.3;    // 30%
        const pesoParciales = 0.6;     // 60%

        if (gradeType === 'all') {
            // Calcular promedio ponderado para promedio general
            let promedioEvaluaciones = 0;
            let promedioPracticas = 0;
            let promedioParciales = 0;
            
            let sumaPesos = 0;
            let tieneEvaluaciones = false;
            let tienePracticas = false;
            let tieneParciales = false;

            // Calcular promedio de evaluaciones
            const evaluaciones = [];
            for (let i = 1; i <= 8; i++) {
                if (studentGrades[`evaluacion${i}`] > 0) {
                    evaluaciones.push(studentGrades[`evaluacion${i}`]);
                }
            }
            if (evaluaciones.length > 0) {
                promedioEvaluaciones = evaluaciones.reduce((acc, grade) => acc + grade, 0) / evaluaciones.length;
                sumaPesos += pesoEvaluaciones;
                tieneEvaluaciones = true;
            }

            // Calcular promedio de prácticas
            const practicas = [];
            for (let i = 1; i <= 4; i++) {
                if (studentGrades[`practica${i}`] > 0) {
                    practicas.push(studentGrades[`practica${i}`]);
                }
            }
            if (practicas.length > 0) {
                promedioPracticas = practicas.reduce((acc, grade) => acc + grade, 0) / practicas.length;
                sumaPesos += pesoPracticas;
                tienePracticas = true;
            }

            // Calcular promedio de parciales
            const parciales = [];
            for (let i = 1; i <= 2; i++) {
                if (studentGrades[`parcial${i}`] > 0) {
                    parciales.push(studentGrades[`parcial${i}`]);
                }
            }
            if (parciales.length > 0) {
                promedioParciales = parciales.reduce((acc, grade) => acc + grade, 0) / parciales.length;
                sumaPesos += pesoParciales;
                tieneParciales = true;
            }

            // Si no hay notas válidas
            if (sumaPesos === 0) return null;

            // Calcular promedio ponderado
            const promedioPonderado = (
                promedioEvaluaciones * pesoEvaluaciones +
                promedioPracticas * pesoPracticas +
                promedioParciales * pesoParciales
            ) / sumaPesos;

            return promedioPonderado.toFixed(2);
        } else {
            // Calcular promedio simple para tipos específicos
            const allGrades = [];
            
            if (gradeType === 'evaluaciones') {
                for (let i = 1; i <= 8; i++) {
                    if (studentGrades[`evaluacion${i}`] > 0) {
                        allGrades.push(studentGrades[`evaluacion${i}`]);
                    }
                }
            }
            
            if (gradeType === 'practicas') {
                for (let i = 1; i <= 4; i++) {
                    if (studentGrades[`practica${i}`] > 0) {
                        allGrades.push(studentGrades[`practica${i}`]);
                    }
                }
            }
            
            if (gradeType === 'parciales') {
                for (let i = 1; i <= 2; i++) {
                    if (studentGrades[`parcial${i}`] > 0) {
                        allGrades.push(studentGrades[`parcial${i}`]);
                    }
                }
            }

            if (allGrades.length === 0) return null;
            
            const sum = allGrades.reduce((acc, grade) => acc + grade, 0);
            return (sum / allGrades.length).toFixed(2);
        }
    };

    const calculateCourseAverage = (gradeType = 'all') => {
        const averages = students.map(student => calculateStudentAverage(student.id, gradeType))
            .filter(avg => avg !== null)
            .map(avg => parseFloat(avg));
        
        if (averages.length === 0) return null;
        
        const sum = averages.reduce((acc, avg) => acc + avg, 0);
        return (sum / averages.length).toFixed(2);
    };

    // Funciones auxiliares para verificar tipos de evaluaciones
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

    return {
        // Estados
        selectedCourse,
        students,
        loading,
        editableGrades,
        hasChanges,
        savingRows,
        
        // Funciones principales
        handleCourseSelect,
        handleGradeChange,
        handleSaveStudentGrades,
        handleSaveAllGrades,
        hasUnsavedChanges,
        getStudentName,
        calculateStudentAverage,
        calculateCourseAverage,
        
        // Funciones auxiliares
        hasEvaluations,
        hasPracticas,
        hasParciales,
        extractEvaluations,
        extractPracticas,
        extractParciales,
        
        // Setters
        setSelectedCourse,
        setStudents,
        setLoading,
        setEditableGrades,
        setHasChanges,
        setSavingRows
    };
};

export default useGrades;