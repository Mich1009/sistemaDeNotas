import { useState, useEffect } from 'react';
import { estudiantesService } from '../services/apiAdmin';

export const useEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEstudiantes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await estudiantesService.getEstudiantes();
            setEstudiantes(data);
        } catch (err) {
            setError(err.message || 'Error al cargar estudiantes');
            console.error('Error fetching estudiantes:', err);
        } finally {
            setLoading(false);
        }
    };

    const getEstudianteById = async (id) => {
        try {
            setError(null);
            return await estudiantesService.getEstudiante(id);
        } catch (err) {
            setError(err.message || 'Error al obtener estudiante');
            throw err;
        }
    };

    const createEstudiante = async (estudianteData) => {
        try {
            setError(null);
            const newEstudiante = await estudiantesService.createEstudiante(estudianteData);
            setEstudiantes(prev => [...prev, newEstudiante]);
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
            setEstudiantes(prev =>
                prev.map(est => est.id === id ? updatedEstudiante : est)
            );
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
            setEstudiantes(prev => prev.filter(est => est.id !== id));
        } catch (err) {
            setError(err.message || 'Error al eliminar estudiante');
            throw err;
        }
    };

    const activateEstudiante = async (id) => {
        try {
            setError(null);
            const activatedEstudiante = await estudiantesService.activateEstudiante(id);
            setEstudiantes(prev =>
                prev.map(est => est.id === id ? activatedEstudiante : est)
            );
            return activatedEstudiante;
        } catch (err) {
            setError(err.message || 'Error al activar estudiante');
            throw err;
        }
    };

    const searchEstudianteByDni = async (dni) => {
        try {
            setError(null);
            return await estudiantesService.searchEstudianteByDni(dni);
        } catch (err) {
            setError(err.message || 'Error al buscar estudiante por DNI');
            throw err;
        }
    };

    const getEstudianteNotas = async (id) => {
        try {
            setError(null);
            return await estudiantesService.getEstudianteNotas(id);
        } catch (err) {
            setError(err.message || 'Error al obtener notas del estudiante');
            throw err;
        }
    };

    const getEstudianteMatriculas = async (id) => {
        try {
            setError(null);
            return await estudiantesService.getEstudianteMatriculas(id);
        } catch (err) {
            setError(err.message || 'Error al obtener matrículas del estudiante');
            throw err;
        }
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const refreshEstudiantes = () => {
        fetchEstudiantes();
    };

    return {
        estudiantes,
        loading,
        error,
        fetchEstudiantes,
        getEstudianteById,
        createEstudiante,
        updateEstudiante,
        deleteEstudiante,
        activateEstudiante,
        searchEstudianteByDni,
        getEstudianteNotas,
        getEstudianteMatriculas,
        refreshEstudiantes
    };
};