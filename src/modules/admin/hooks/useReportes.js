import { useState, useEffect } from 'react';
import { reportesService } from '../services/apiAdmin';

export const useReportes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Estados para los datos de reportes
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [rendimientoEstudiantes, setRendimientoEstudiantes] = useState([]);
    const [rendimientoCursos, setRendimientoCursos] = useState([]);

    const getEstadisticasGenerales = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await reportesService.getEstadisticasGenerales();
            setEstadisticasGenerales(data);
            return data;
        } catch (err) {
            setError(err.message || 'Error al obtener estadísticas generales');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getRendimientoEstudiantes = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await reportesService.getRendimientoEstudiantes(params);
            setRendimientoEstudiantes(data);
            return data;
        } catch (err) {
            setError(err.message || 'Error al obtener rendimiento de estudiantes');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getRendimientoCursos = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await reportesService.getRendimientoPorCurso(params);
            setRendimientoCursos(data);
            return data;
        } catch (err) {
            setError(err.message || 'Error al obtener rendimiento por curso');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const exportarEstudiantes = async () => {
        try {
            setLoading(true);
            setError(null);
            const blob = await reportesService.exportarEstudiantesExcel();
            return blob;
        } catch (err) {
            setError(err.message || 'Error al exportar estudiantes a Excel');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const exportarDocentes = async () => {
        try {
            setLoading(true);
            setError(null);
            const blob = await reportesService.exportarDocentesExcel();
            return blob;
        } catch (err) {
            setError(err.message || 'Error al exportar docentes a Excel');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const exportarNotas = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const blob = await reportesService.exportarNotasExcel(params);
            return blob;
        } catch (err) {
            setError(err.message || 'Error al exportar notas a Excel');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función para refrescar todos los reportes
    const refreshReportes = async () => {
        try {
            await getEstadisticasGenerales();
        } catch (err) {
            console.error('Error al refrescar reportes:', err);
        }
    };

    // Cargar estadísticas generales al montar el componente
    useEffect(() => {
        getEstadisticasGenerales();
    }, []);

    return {
        // Estados
        estadisticasGenerales,
        rendimientoEstudiantes,
        rendimientoCursos,
        loading,
        error,
        // Funciones
        getEstadisticasGenerales,
        getRendimientoEstudiantes,
        getRendimientoCursos,
        exportarEstudiantes,
        exportarDocentes,
        exportarNotas,
        refreshReportes
    };
};