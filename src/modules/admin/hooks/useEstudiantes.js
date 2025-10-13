import { useState, useEffect, useCallback, useRef } from 'react';
import { estudiantesService } from '../services/apiAdmin';

export const useEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, perPage: 20, totalPages: 1, total: 0 });
    
    // Ref para el timeout del debounce
    const debounceTimeoutRef = useRef(null);

    const fetchEstudiantes = useCallback(async (cicloNombre = null, estadoMatricula = null, page = 1, perPage = 20, search = null) => {
        try {
            setLoading(true);
            setError(null);
            
            const params = { page, per_page: perPage };
            if (search && search.trim()) params.search = search.trim();
            if (cicloNombre && cicloNombre !== '') params.ciclo_nombre = cicloNombre;
            if (estadoMatricula && estadoMatricula !== 'todos') params.estado_matricula = estadoMatricula;

            const response = await estudiantesService.getEstudiantes(params);
            
            setEstudiantes(response.estudiantes || []);
            setPagination({
                page: response.page || 1,
                perPage: response.per_page || 20,
                totalPages: response.total_pages || 1,
                total: response.total || 0
            });
        } catch (err) {
            setError(err.message || 'Error al obtener estudiantes');
        } finally {
            setLoading(false);
        }
    }, []);

    // Función con debounce para búsqueda
    const debouncedFetchEstudiantes = useCallback((cicloNombre, estadoMatricula, page, perPage, search, delay = 500) => {
        // Limpiar el timeout anterior si existe
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Configurar nuevo timeout
        debounceTimeoutRef.current = setTimeout(() => {
            fetchEstudiantes(cicloNombre, estadoMatricula, page, perPage, search);
        }, delay);
    }, [fetchEstudiantes]);

    const createEstudiante = async (estudianteData) => {
        try {
            setError(null);
            const newEstudiante = await estudiantesService.createEstudiante(estudianteData);
            return newEstudiante;
        } catch (err) {
            setError(err.message || 'Error al crear estudiante');
            throw err;
        }
    };

    const updateEstudiante = async (id, estudianteData) => {
        try {
            setError(null);
            const updatedEstudiante = await estudiantesService.updateEstudiante(id, estudianteData);
            return updatedEstudiante;
        } catch (err) {
            setError(err.message || 'Error al actualizar estudiante');
            throw err;
        }
    };

    const deleteEstudiante = async (id) => {
        try {
            setError(null);
            await estudiantesService.deleteEstudiante(id);
        } catch (err) {
            setError(err.message || 'Error al eliminar estudiante');
            throw err;
        }
    };

    return {
        estudiantes,
        loading,
        error,
        pagination,
        fetchEstudiantes,
        debouncedFetchEstudiantes,
        createEstudiante,
        updateEstudiante,
        deleteEstudiante
    };
};