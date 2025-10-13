import { useState, useEffect } from 'react';
import { cursosService } from '../services/apiAdmin';

export const useCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [ciclos, setCiclos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ciclos
    const fetchCiclos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await cursosService.getCiclos();
            setCiclos(data);
        } catch (err) {
            setError(err.message || 'Error al cargar ciclos');
            console.error('Error fetching ciclos:', err);
        } finally {
            setLoading(false);
        }
    };

    const createCiclo = async (cicloData) => {
        try {
            setError(null);
            const newCiclo = await cursosService.createCiclo(cicloData);
            setCiclos(prev => [...prev, newCiclo]);
            return newCiclo;
        } catch (err) {
            setError(err.message || 'Error al crear ciclo');
            throw err;
        }
    };

    const updateCiclo = async (id, cicloData) => {
        try {
            setError(null);
            const updatedCiclo = await cursosService.updateCiclo(id, cicloData);
            setCiclos(prev =>
                prev.map(ciclo => ciclo.id === id ? updatedCiclo : ciclo)
            );
            return updatedCiclo;
        } catch (err) {
            setError(err.message || 'Error al actualizar ciclo');
            throw err;
        }
    };

    const deleteCiclo = async (id) => {
        try {
            setError(null);
            await cursosService.deleteCiclo(id);
            setCiclos(prev => prev.filter(ciclo => ciclo.id !== id));
        } catch (err) {
            setError(err.message || 'Error al eliminar ciclo');
            throw err;
        }
    };

    // Cursos
    const fetchCursos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await cursosService.getCursos();
            // Extraer el array items de la respuesta paginada
            setCursos(data.items || []);
        } catch (err) {
            setError(err.message || 'Error al cargar cursos');
            console.error('Error fetching cursos:', err);
        } finally {
            setLoading(false);
        }
    };

    const createCurso = async (cursoData) => {
        try {
            setError(null);
            const newCurso = await cursosService.createCurso(cursoData);
            setCursos(prev => [...prev, newCurso]);
            return newCurso;
        } catch (err) {
            setError(err.message || 'Error al crear curso');
            throw err;
        }
    };

    const updateCurso = async (id, cursoData) => {
        try {
            setError(null);
            const updatedCurso = await cursosService.updateCurso(id, cursoData);
            setCursos(prev =>
                prev.map(curso => curso.id === id ? updatedCurso : curso)
            );
            return updatedCurso;
        } catch (err) {
            setError(err.message || 'Error al actualizar curso');
            throw err;
        }
    };

    const deleteCurso = async (id) => {
        try {
            setError(null);
            await cursosService.deleteCurso(id);
            setCursos(prev => prev.filter(curso => curso.id !== id));
        } catch (err) {
            setError(err.message || 'Error al eliminar curso');
            throw err;
        }
    };

    const assignDocenteToCurso = async (cursoId, docenteId) => {
        try {
            setError(null);
            const result = await cursosService.assignDocenteToCurso(cursoId, docenteId);
            // Refresh cursos to get updated data
            await fetchCursos();
            return result;
        } catch (err) {
            setError(err.message || 'Error al asignar docente al curso');
            throw err;
        }
    };

    const unassignDocenteFromCurso = async (cursoId) => {
        try {
            setError(null);
            const result = await cursosService.unassignDocenteFromCurso(cursoId);
            // Refresh cursos to get updated data
            await fetchCursos();
            return result;
        } catch (err) {
            setError(err.message || 'Error al desasignar docente del curso');
            throw err;
        }
    };

    useEffect(() => {
        fetchCiclos();
        fetchCursos();
    }, []);

    const refreshCiclos = () => {
        fetchCiclos();
    };

    const refreshCursos = () => {
        fetchCursos();
    };

    const refreshAll = () => {
        fetchCiclos();
        fetchCursos();
    };

    return {
        // Data
        cursos,
        ciclos,
        loading,
        error,

        // Ciclos
        fetchCiclos,
        createCiclo,
        updateCiclo,
        deleteCiclo,
        refreshCiclos,

        // Cursos
        fetchCursos,
        createCurso,
        updateCurso,
        deleteCurso,
        assignDocenteToCurso,
        unassignDocenteFromCurso,
        refreshCursos,

        // Utils
        refreshAll
    };
};