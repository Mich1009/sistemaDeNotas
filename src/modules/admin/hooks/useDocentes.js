import { useState, useEffect } from 'react';
import { docentesService } from '../services/apiAdmin';

export const useDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDocentes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await docentesService.getDocentes();
            setDocentes(data);
        } catch (err) {
            setError(err.message || 'Error al cargar docentes');
            console.error('Error fetching docentes:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDocenteById = async (id) => {
        try {
            setError(null);
            return await docentesService.getDocente(id);
        } catch (err) {
            setError(err.message || 'Error al obtener docente');
            throw err;
        }
    };

    const createDocente = async (docenteData) => {
        try {
            setError(null);
            const newDocente = await docentesService.createDocente(docenteData);
            setDocentes(prev => [...prev, newDocente]);
            return newDocente;
        } catch (err) {
            setError(err.message || 'Error al crear docente');
            throw err;
        }
    };

    const updateDocente = async (id, docenteData) => {
        try {
            setError(null);
            const updatedDocente = await docentesService.updateDocente(id, docenteData);
            setDocentes(prev =>
                prev.map(doc => doc.id === id ? updatedDocente : doc)
            );
            return updatedDocente;
        } catch (err) {
            setError(err.message || 'Error al actualizar docente');
            throw err;
        }
    };

    const deleteDocente = async (id) => {
        try {
            setError(null);
            await docentesService.deleteDocente(id);
            setDocentes(prev => prev.filter(doc => doc.id !== id));
        } catch (err) {
            setError(err.message || 'Error al eliminar docente');
            throw err;
        }
    };

    const searchDocenteByDni = async (dni) => {
        try {
            setError(null);
            return await docentesService.searchDocenteByDni(dni);
        } catch (err) {
            setError(err.message || 'Error al buscar docente por DNI');
            throw err;
        }
    };

    const getDocenteCursos = async (id) => {
        try {
            setError(null);
            const response = await docentesService.getDocenteCursos(id);
            // Extraer solo el array de cursos de la respuesta
            return response.cursos || [];
        } catch (err) {
            setError(err.message || 'Error al obtener cursos del docente');
            throw err;
        }
    };

    useEffect(() => {
        fetchDocentes();
    }, []);

    const refreshDocentes = () => {
        fetchDocentes();
    };

    return {
        docentes,
        loading,
        error,
        fetchDocentes,
        getDocenteById,
        createDocente,
        updateDocente,
        deleteDocente,
        searchDocenteByDni,
        getDocenteCursos,
        refreshDocentes
    };
};