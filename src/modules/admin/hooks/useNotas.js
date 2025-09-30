import { useState, useEffect } from 'react';
import { notasService } from '../services/apiAdmin';

export const useNotas = () => {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getNotasEstudiante = async (estudianteId) => {
        try {
            setLoading(true);
            setError(null);
            const data = await notasService.getNotasEstudiante(estudianteId);
            return data;
        } catch (err) {
            setError(err.message || 'Error al cargar notas del estudiante');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getNotasCurso = async (cursoId) => {
        try {
            setLoading(true);
            setError(null);
            const data = await notasService.getNotasCurso(cursoId);
            return data;
        } catch (err) {
            setError(err.message || 'Error al cargar notas del curso');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registrarNota = async (notaData) => {
        try {
            setError(null);
            const newNota = await notasService.registrarNota(notaData);
            setNotas(prev => [...prev, newNota]);
            return newNota;
        } catch (err) {
            setError(err.message || 'Error al registrar nota');
            throw err;
        }
    };

    const actualizarNota = async (id, notaData) => {
        try {
            setError(null);
            const updatedNota = await notasService.actualizarNota(id, notaData);
            setNotas(prev =>
                prev.map(nota => nota.id === id ? updatedNota : nota)
            );
            return updatedNota;
        } catch (err) {
            setError(err.message || 'Error al actualizar nota');
            throw err;
        }
    };

    const eliminarNota = async (id) => {
        try {
            setError(null);
            await notasService.eliminarNota(id);
            setNotas(prev => prev.filter(nota => nota.id !== id));
        } catch (err) {
            setError(err.message || 'Error al eliminar nota');
            throw err;
        }
    };

    const getHistorialNota = async (id) => {
        try {
            setError(null);
            return await notasService.getHistorialNota(id);
        } catch (err) {
            setError(err.message || 'Error al obtener historial de nota');
            throw err;
        }
    };

    const getPromediosEstudiante = async (estudianteId) => {
        try {
            setError(null);
            return await notasService.getPromediosEstudiante(estudianteId);
        } catch (err) {
            setError(err.message || 'Error al obtener promedios del estudiante');
            throw err;
        }
    };

    const fetchNotas = async () => {
        try {
            setLoading(true);
            setError(null);
            // This would need to be implemented if there's a general get all notes endpoint
            // For now, we'll keep it empty as the API seems to be focused on specific queries
            setNotas([]);
        } catch (err) {
            setError(err.message || 'Error al cargar notas');
            console.error('Error fetching notas:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshNotas = () => {
        fetchNotas();
    };

    return {
        notas,
        loading,
        error,
        getNotasEstudiante,
        getNotasCurso,
        registrarNota,
        actualizarNota,
        eliminarNota,
        getHistorialNota,
        getPromediosEstudiante,
        refreshNotas
    };
};