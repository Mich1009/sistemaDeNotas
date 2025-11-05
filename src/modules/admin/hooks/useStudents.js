import { useState, useEffect, useCallback } from 'react';
import { useEstudiantes } from './useEstudiantes';
import { useCiclos } from './useCiclos';
import toast from 'react-hot-toast';

export const useStudents = () => {
    const {
        estudiantes,
        loading,
        error,
        createEstudiante: createEstudianteBase,
        updateEstudiante: updateEstudianteBase,
        deleteEstudiante: deleteEstudianteBase,
        fetchEstudiantes,
        debouncedFetchEstudiantes,
        pagination
    } = useEstudiantes();

    const {
        ciclos,
        loading: ciclosLoading,
        getCiclosActivos
    } = useCiclos();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCiclo, setSelectedCiclo] = useState('');
    const [enrollmentStatus, setEnrollmentStatus] = useState('matriculados');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [page, setPage] = useState(1);
    const perPage = 20;

    // Determinar si se debe usar paginación (solo cuando no hay filtro de ciclo específico)
    const shouldUsePagination = !selectedCiclo;

    // Manejo de búsqueda con debounce
    const onSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setPage(1);
        
        const cicloNombre = selectedCiclo || null;
        const estadoMatricula = enrollmentStatus === 'todos' ? null : enrollmentStatus;
        
        // Siempre usar debounce para búsquedas, excepto cuando se limpia el campo
        if (value.trim() === '') {
            // Si el campo está vacío, cargar inmediatamente sin debounce
            if (shouldUsePagination) {
                fetchEstudiantes(cicloNombre, estadoMatricula, 1, perPage, '');
            } else {
                fetchEstudiantes(cicloNombre, estadoMatricula, 1, 1000, '');
            }
        } else {
            // Para cualquier búsqueda con contenido, usar debounce
            if (shouldUsePagination) {
                debouncedFetchEstudiantes(cicloNombre, estadoMatricula, 1, perPage, value);
            } else {
                debouncedFetchEstudiantes(cicloNombre, estadoMatricula, 1, 1000, value);
            }
        }
    }, [selectedCiclo, enrollmentStatus, shouldUsePagination, fetchEstudiantes, debouncedFetchEstudiantes]);

    // Paginación: anterior/siguiente (solo cuando se usa paginación)
    const goPrevPage = useCallback(() => {
        if (shouldUsePagination && pagination.page > 1) {
            const newPage = pagination.page - 1;
            setPage(newPage);
        }
    }, [shouldUsePagination, pagination.page]);

    const goNextPage = useCallback(() => {
        if (shouldUsePagination && pagination.page < pagination.totalPages) {
            const newPage = pagination.page + 1;
            setPage(newPage);
        }
    }, [shouldUsePagination, pagination.page, pagination.totalPages]);

    const handleCreateEstudiante = async (estudianteData) => {
        try {
            await createEstudianteBase(estudianteData);
            toast.success('Estudiante creado exitosamente');
            setShowCreateModal(false);
        } catch (error) {
            toast.error('Error al crear estudiante');
        }
    };

    const handleUpdateEstudiante = async (estudianteData) => {
        try {
            await updateEstudianteBase(selectedEstudiante.id, estudianteData);
            toast.success('Estudiante actualizado exitosamente');
            setShowEditModal(false);
            setSelectedEstudiante(null);
        } catch (error) {
            toast.error('Error al actualizar estudiante');
        }
    };

    const handleDeleteEstudiante = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas inactivar este estudiante?')) {
            try {
                await deleteEstudianteBase(id);
                toast.success('Estudiante inactivado exitosamente');
            } catch (error) {
                toast.error('Error al inactivar estudiante');
            }
        }
    };

    const handleCicloChange = useCallback((ciclo) => {
        setSelectedCiclo(ciclo);
        setPage(1);
    }, []);

    const handleEnrollmentStatusChange = useCallback((status) => {
        setEnrollmentStatus(status);
        setPage(1);
    }, []);

    const handleRefresh = useCallback(() => {
        const cicloNombre = selectedCiclo || null;
        const estadoMatricula = enrollmentStatus === 'todos' ? null : enrollmentStatus;
        
        if (shouldUsePagination) {
            fetchEstudiantes(cicloNombre, estadoMatricula, page, perPage, searchTerm);
        } else {
            fetchEstudiantes(cicloNombre, estadoMatricula, 1, 1000, searchTerm);
        }
    }, [selectedCiclo, enrollmentStatus, shouldUsePagination, page, searchTerm, fetchEstudiantes]);

    // Función para exportar estudiantes a Excel
    const exportStudentsToExcel = useCallback(async () => {
        try {
            // Crear datos para exportar
            const exportData = estudiantes.map((estudiante, index) => ({
                'N°': shouldUsePagination 
                    ? ((pagination.page - 1) * perPage) + index + 1
                    : index + 1,
                'Nombres y Apellidos': `${estudiante.last_name} ${estudiante.first_name}`,
                'DNI': estudiante.dni,
                'Email': estudiante.email,
                'Teléfono': estudiante.phone || '-',
                'Fecha Nacimiento': estudiante.fecha_nacimiento
                    ? new Date(estudiante.fecha_nacimiento).toLocaleDateString('es-ES')
                    : '-',
                'Ciclo Actual': estudiante.ciclo_actual || 'Sin Matricular',
            }));

            // Crear nombre del archivo basado en el filtro
            let fileName = 'estudiantes';
            if (selectedCiclo) {
                fileName += `_ciclo_${selectedCiclo}`;
            }
            if (enrollmentStatus !== 'todos') {
                fileName += `_${enrollmentStatus}`;
            }
            fileName += '.xlsx';

            // Importar dinámicamente la librería para exportar
            const XLSX = await import('xlsx');
            
            // Crear workbook y worksheet
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
            
            // Descargar el archivo
            XLSX.writeFile(wb, fileName);
            
            toast.success(`Exportados ${exportData.length} estudiantes a ${fileName}`);
        } catch (error) {
            console.error('Error al exportar estudiantes:', error);
            toast.error('Error al exportar estudiantes');
        }
    }, [estudiantes, selectedCiclo, enrollmentStatus, shouldUsePagination, pagination.page]);

    // Cargar estudiantes cuando cambien ciclo/página
    useEffect(() => {
        const cicloNombre = selectedCiclo || null;
        const estadoMatricula = enrollmentStatus === 'todos' ? null : enrollmentStatus;
        
        if (shouldUsePagination) {
            fetchEstudiantes(cicloNombre, estadoMatricula, page, perPage, searchTerm);
        } else {
            fetchEstudiantes(cicloNombre, estadoMatricula, 1, 1000, searchTerm);
        }
    }, [selectedCiclo, page, shouldUsePagination, enrollmentStatus]);

    // Cargar estudiantes inicialmente
    useEffect(() => {
        const cicloNombre = selectedCiclo || null;
        const estadoMatricula = enrollmentStatus === 'todos' ? null : enrollmentStatus;
        
        if (shouldUsePagination) {
            fetchEstudiantes(cicloNombre, estadoMatricula, page, perPage, searchTerm);
        } else {
            fetchEstudiantes(cicloNombre, estadoMatricula, 1, 1000, searchTerm);
        }
    }, []);

    return {
        // Estados
        estudiantes,
        loading,
        error,
        searchTerm,
        selectedCiclo,
        enrollmentStatus,
        showCreateModal,
        selectedEstudiante,
        showEditModal,
        page,
        perPage,
        pagination,
        shouldUsePagination,
        ciclos,
        ciclosLoading,
        
        // Funciones
        setSearchTerm,
        setSelectedCiclo: handleCicloChange,
        setEnrollmentStatus: handleEnrollmentStatusChange,
        setShowCreateModal,
        setSelectedEstudiante,
        setShowEditModal,
        setPage,
        
        onSearchChange,
        goPrevPage,
        goNextPage,
        handleCreateEstudiante,
        handleUpdateEstudiante,
        handleDeleteEstudiante,
        handleRefresh,
        exportStudentsToExcel
    };
};