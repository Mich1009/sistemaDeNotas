import { useState, useEffect } from 'react';
import { dashboardService, reportesService } from '../services/apiAdmin';

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalEstudiantes: 0,
        totalDocentes: 0,
        totalCursos: 0,
        totalCarreras: 0,
        estudiantesActivos: 0,
        docentesActivos: 0
    });
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [estudiantesPorCiclo, setEstudiantesPorCiclo] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardService.getDashboard();
            setDashboardData(data);
        } catch (err) {
            setError(err.message || 'Error al cargar datos del dashboard');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEstadisticasGenerales = async () => {
        try {
            const data = await dashboardService.getEstadisticasGenerales();
            setEstadisticasGenerales(data);
        } catch (err) {
            console.error('Error fetching general statistics:', err);
        }
    };

    const loadAvailableYears = async () => {
        try {
            // Los años se cargarán desde el backend junto con los datos de estudiantes
            // Mantener años por defecto como fallback
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let i = currentYear - 5; i <= currentYear + 1; i++) {
                years.push(i);
            }
            setAvailableYears(years);
        } catch (error) {
            console.error('Error loading years:', error);
        }
    };

    const loadEstudiantesPorCiclo = async (year = selectedYear) => {
        try {
            const data = await reportesService.getEstudiantesPorCiclo(year);
            setEstudiantesPorCiclo(data.estadisticas || []);

            // Actualizar años disponibles si vienen del backend
            if (data.años_disponibles && data.años_disponibles.length > 0) {
                setAvailableYears(data.años_disponibles);
            }
        } catch (error) {
            console.error('Error loading students by cycle:', error);
            // Mantener datos de ejemplo en caso de error
            const mockData = [
                { ciclo: 'I', numero_estudiantes: 25 },
                { ciclo: 'II', numero_estudiantes: 22 },
                { ciclo: 'III', numero_estudiantes: 18 },
                { ciclo: 'IV', numero_estudiantes: 20 },
                { ciclo: 'V', numero_estudiantes: 15 },
                { ciclo: 'VI', numero_estudiantes: 12 }
            ];
            setEstudiantesPorCiclo(mockData);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchEstadisticasGenerales();
        loadAvailableYears();
        loadEstudiantesPorCiclo();
    }, []);

    useEffect(() => {
        loadEstudiantesPorCiclo(selectedYear);
    }, [selectedYear]);

    const refreshDashboard = () => {
        fetchDashboardData();
        fetchEstadisticasGenerales();
        loadEstudiantesPorCiclo();
    };

    const changeYear = (year) => {
        setSelectedYear(year);
    };

    return {
        dashboardData,
        estadisticasGenerales,
        estudiantesPorCiclo,
        selectedYear,
        availableYears,
        loading,
        error,
        refreshDashboard,
        changeYear
    };
};