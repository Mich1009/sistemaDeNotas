import { useState, useEffect } from 'react';
import { reportesService, dashboardService } from '../services/apiAdmin';

export const useReportes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Estados para los datos
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [rendimientoEstudiantes, setRendimientoEstudiantes] = useState([]);
    const [rendimientoCursos, setRendimientoCursos] = useState([]);

    const getEstadisticasGenerales = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardService.getEstadisticasGenerales();
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
            setRendimientoEstudiantes(data.datos_estudiantes || []);
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
            setRendimientoCursos(data.cursos || []);
            return data;
        } catch (err) {
            setError(err.message || 'Error al obtener rendimiento por curso');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const exportarEstudiantes = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const blob = await reportesService.exportarEstudiantesExcel(params);

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

    const exportarDocentes = async () => {
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

    const exportarNotas = async (params = {}) => {
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

    const refreshReportes = async () => {
        try {
            await Promise.all([
                getEstadisticasGenerales(),
                getRendimientoEstudiantes(),
                getRendimientoCursos()
            ]);
        } catch (err) {
            setError('Error al actualizar reportes');
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        refreshReportes();
    }, []);

    return {
        loading,
        error,
        estadisticasGenerales,
        rendimientoEstudiantes,
        rendimientoCursos,
        getEstadisticasGenerales,
        getRendimientoEstudiantes,
        getRendimientoCursos,
        exportarEstudiantes,
        exportarDocentes,
        exportarNotas,
        refreshReportes
    };
};