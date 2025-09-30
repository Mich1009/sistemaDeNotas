import { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiAdmin';

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalEstudiantes: 0,
        totalDocentes: 0,
        totalCursos: 0,
        totalCarreras: 0,
        estudiantesActivos: 0,
        docentesActivos: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardService.getEstadisticasGenerales();
            setDashboardData(data);
        } catch (err) {
            setError(err.message || 'Error al cargar datos del dashboard');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const refreshDashboard = () => {
        fetchDashboardData();
    };

    return {
        dashboardData,
        loading,
        error,
        refreshDashboard
    };
};