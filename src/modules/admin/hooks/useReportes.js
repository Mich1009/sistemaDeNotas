import { useState } from 'react';
import { reportesService } from '../services/apiAdmin';

export const useReportes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getEstadisticasGenerales = async () => {
        try {
            setLoading(true);
            setError(null);
            return await reportesService.getEstadisticasGenerales();
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
            return await reportesService.getRendimientoEstudiantes(params);
        } catch (err) {
            setError(err.message || 'Error al obtener rendimiento de estudiantes');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getRendimientoPorCurso = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            return await reportesService.getRendimientoPorCurso(params);
        } catch (err) {
            setError(err.message || 'Error al obtener rendimiento por curso');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const exportarEstudiantesExcel = async () => {
        try {
            setLoading(true);
            setError(null);
            const blob = await reportesService.exportarEstudiantesExcel();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `estudiantes_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return true;
        } catch (err) {
            setError(err.message || 'Error al exportar estudiantes a Excel');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const exportarDocentesExcel = async () => {
        try {
            setLoading(true);
            setError(null);
            const blob = await reportesService.exportarDocentesExcel();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `docentes_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return true;
        } catch (err) {
            setError(err.message || 'Error al exportar docentes a Excel');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const exportarNotasExcel = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const blob = await reportesService.exportarNotasExcel(params);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `notas_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return true;
        } catch (err) {
            setError(err.message || 'Error al exportar notas a Excel');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getEstadisticasGenerales,
        getRendimientoEstudiantes,
        getRendimientoPorCurso,
        exportarEstudiantesExcel,
        exportarDocentesExcel,
        exportarNotasExcel
    };
};