import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { reportesService } from '../services/apiTeacher';

const useReports = () => {
    // Estados principales
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [resumen, setResumen] = useState(null);
    
    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedCycle, setSelectedCycle] = useState('');
    const [availableYears, setAvailableYears] = useState([]);
    const [availableCycles, setAvailableCycles] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);

    // Estados para el modal de estudiantes desaprobados
    const [showFailedStudentsModal, setShowFailedStudentsModal] = useState(false);
    const [failedStudents, setFailedStudents] = useState([]);
    const [loadingFailedStudents, setLoadingFailedStudents] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Cargar años disponibles al inicializar
    useEffect(() => {
        loadAvailableYears();
    }, []);

    // Cargar ciclos cuando cambia el año
    useEffect(() => {
        if (selectedYear) {
            loadAvailableCycles(selectedYear);
        }
    }, [selectedYear]);

    // Cargar cursos cuando cambia el año o ciclo
    useEffect(() => {
        loadAvailableCourses(selectedYear, selectedCycle);
    }, [selectedYear, selectedCycle]);

    // Cargar reporte cuando cambian los filtros
    useEffect(() => {
        loadReportData();
    }, [selectedYear, selectedCycle, searchTerm]);

    // Funciones para cargar datos
    const loadAvailableYears = async () => {
        try {
            const years = await reportesService.getAvailableYears();
            setAvailableYears(years);
            
            // Si no hay año seleccionado y hay años disponibles, seleccionar el más reciente
            if (!selectedYear && years.length > 0) {
                setSelectedYear(years[0]);
            }
        } catch (error) {
            console.error('Error al cargar años:', error);
            toast.error('Error al cargar años disponibles');
        }
    };

    const loadAvailableCycles = async (año) => {
        try {
            const cycles = await reportesService.getAvailableCycles(año);
            setAvailableCycles(cycles);
            
            // Limpiar ciclo seleccionado si no está en la nueva lista
            if (selectedCycle && !cycles.find(c => c.id === selectedCycle)) {
                setSelectedCycle('');
            }
        } catch (error) {
            console.error('Error al cargar ciclos:', error);
            toast.error('Error al cargar ciclos disponibles');
        }
    };

    const loadAvailableCourses = async (año, ciclo_id) => {
        try {
            const courses = await reportesService.getAvailableCourses(año, ciclo_id);
            setAvailableCourses(courses);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
            toast.error('Error al cargar cursos disponibles');
        }
    };

    const loadReportData = async () => {
        try {
            setLoading(true);
            
            const params = {};
            if (selectedYear) params.año = selectedYear;
            if (selectedCycle) params.ciclo_id = selectedCycle;
            if (searchTerm.trim()) params.curso_nombre = searchTerm.trim();

            const data = await reportesService.getPerformanceReport(params);
            
            setReportData(data.cursos || []);
            setResumen(data.resumen || null);
            
        } catch (error) {
            console.error('Error al cargar reporte:', error);
            toast.error('Error al cargar datos del reporte');
            setReportData([]);
            setResumen(null);
        } finally {
            setLoading(false);
        }
    };

    // Funciones de utilidad
    const filteredCourses = reportData ? reportData.filter(curso => {
        if (!searchTerm.trim()) return true;
        return curso.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    }) : [];

    const getStatusColor = (tasa_aprobacion) => {
        if (tasa_aprobacion >= 80) return 'text-green-600';
        if (tasa_aprobacion >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getStatusBadge = (tasa_aprobacion) => {
        if (tasa_aprobacion >= 80) return 'bg-green-100 text-green-800';
        if (tasa_aprobacion >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const formatPromedio = (promedio) => {
        return typeof promedio === 'number' ? promedio.toFixed(2) : '0.00';
    };

    const formatTasaAprobacion = (tasa) => {
        return typeof tasa === 'number' ? `${tasa.toFixed(1)}%` : '0.0%';
    };

    // Función para refrescar datos
    const refreshData = () => {
        loadReportData();
    };

    // Función para limpiar filtros
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedYear(new Date().getFullYear());
        setSelectedCycle('');
    };

    // Función para exportar datos (placeholder para futura implementación)
    const exportReport = async (format = 'excel') => {
        try {
            toast.success(`Exportando reporte en formato ${format}...`);
            // TODO: Implementar exportación
        } catch (error) {
            console.error('Error al exportar:', error);
            toast.error('Error al exportar el reporte');
        }
    };

    // Función para obtener estudiantes desaprobados
    const getFailedStudents = async (cursoId, cursoNombre, ciclo) => {
        try {
            setLoadingFailedStudents(true);
            setSelectedCourse({ 
                id: cursoId, 
                nombre: cursoNombre,
                ciclo: ciclo 
            });
            
            const data = await reportesService.getFailedStudents(cursoId);
            setFailedStudents(data.estudiantes || []);
            setShowFailedStudentsModal(true);
            
        } catch (error) {
            console.error('Error al cargar estudiantes desaprobados:', error);
            toast.error('Error al cargar estudiantes desaprobados');
            setFailedStudents([]);
        } finally {
            setLoadingFailedStudents(false);
        }
    };

    // Función para cerrar el modal de estudiantes desaprobados
    const closeFailedStudentsModal = () => {
        setShowFailedStudentsModal(false);
        setFailedStudents([]);
        setSelectedCourse(null);
    };

    return {
        // Estados
        loading,
        reportData: filteredCourses,
        resumen,
        
        // Filtros
        searchTerm,
        setSearchTerm,
        selectedYear,
        setSelectedYear,
        selectedCycle,
        setSelectedCycle,
        availableYears,
        availableCycles,
        availableCourses,
        
        // Estados del modal de estudiantes desaprobados
        showFailedStudentsModal,
        setShowFailedStudentsModal,
        failedStudents,
        loadingFailedStudents,
        selectedCourse,
        
        // Funciones
        refreshData,
        clearFilters,
        exportReport,
        getFailedStudents,
        closeFailedStudentsModal,
        
        // Utilidades
        getStatusColor,
        getStatusBadge,
        formatPromedio,
        formatTasaAprobacion
    };
};

export default useReports;