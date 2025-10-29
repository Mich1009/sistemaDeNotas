import { useState, useCallback } from 'react';
import { gradesService } from '../services/apiStudent';

export const useGrades = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [gradeDetails, setGradeDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para abrir el modal con los detalles de una nota específica
    const openGradeModal = useCallback(async (gradeInfo) => {
        try {
            setSelectedGrade(gradeInfo);
            setIsModalOpen(true);
            setLoading(true);
            setError(null);

            const { cursoId, tipoEvaluacion } = gradeInfo;

            // Llamar al servicio para obtener descripciones de evaluaciones
            const data = await gradesService.getEvaluationDescription(cursoId, tipoEvaluacion);
            setGradeDetails(data);
        } catch (error) {
            console.error('Error fetching grade details:', error);
            setError('Error al cargar los detalles de la nota');
            setGradeDetails(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para cerrar el modal
    const closeGradeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedGrade(null);
        setGradeDetails(null);
        setError(null);
    }, []);

    // Función para obtener detalles de la nota desde el backend
    const fetchGradeDetails = useCallback(async (courseId, tipoEvaluacion) => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await gradesService.getEvaluationDescription(courseId, tipoEvaluacion);
            setGradeDetails(data);
        } catch (err) {
            console.error('Error fetching grade details:', err);
            setError('Error al cargar los detalles de la nota');
            setGradeDetails(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para formatear el tipo de evaluación
    const formatEvaluationType = useCallback((tipo) => {
        const typeMap = {
            'evaluacion1': 'Evaluación 1',
            'evaluacion2': 'Evaluación 2',
            'evaluacion3': 'Evaluación 3',
            'evaluacion4': 'Evaluación 4',
            'practica1': 'Práctica 1',
            'practica2': 'Práctica 2',
            'practica3': 'Práctica 3',
            'practica4': 'Práctica 4',
            'parcial1': 'Parcial 1',
            'parcial2': 'Parcial 2'
        };
        return typeMap[tipo] || tipo;
    }, []);

    // Función para determinar el color de la nota
    const getGradeColor = useCallback((nota) => {
        if (nota >= 14) return 'text-green-600';
        if (nota >= 11) return 'text-yellow-600';
        return 'text-red-600';
    }, []);

    // Función para determinar si está aprobado
    const isApproved = useCallback((nota) => {
        return nota >= 11;
    }, []);

    // Función para crear la información de la nota para el modal
    const createGradeInfo = useCallback((cursoId, tipoEvaluacion, nota, cursoNombre) => {
        return {
            cursoId,
            tipoEvaluacion,
            valor: nota, // Cambiar 'nota' por 'valor' para que coincida con el componente InfoNota
            cursoNombre,
            tipoFormateado: formatEvaluationType(tipoEvaluacion),
            color: getGradeColor(nota),
            aprobado: isApproved(nota)
        };
    }, [formatEvaluationType, getGradeColor, isApproved]);

    // Función simplificada para manejar el click en una nota
    const handleGradeClick = useCallback((cursoId, tipoEvaluacion, nota, cursoNombre) => {
        if (nota) {
            const gradeInfo = createGradeInfo(cursoId, tipoEvaluacion, nota, cursoNombre);
            openGradeModal(gradeInfo);
        }
    }, [createGradeInfo, openGradeModal]);

    return {
        // Estados
        isModalOpen,
        selectedGrade,
        gradeDetails,
        loading,
        error,
        
        // Funciones
        openGradeModal,
        closeGradeModal,
        fetchGradeDetails,
        formatEvaluationType,
        getGradeColor,
        isApproved,
        createGradeInfo,
        handleGradeClick
    };
};