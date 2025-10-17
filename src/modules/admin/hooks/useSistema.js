import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { sistemaService } from '../services/apiAdmin';

/**
 * Hook personalizado para manejar las métricas del sistema
 */
export const useSistema = () => {
    // Estados para las métricas del sistema
    const [systemHealth, setSystemHealth] = useState(null);
    const [performanceMetrics, setPerformanceMetrics] = useState(null);
    const [activityTimeline, setActivityTimeline] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Función para obtener métricas de salud del sistema
     */
    const fetchSystemHealth = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await sistemaService.getSystemHealth();
            setSystemHealth(data);
        } catch (error) {
            console.error('Error fetching system health:', error);
            setError(error.message);
            toast.error('Error al obtener métricas del sistema');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Función para obtener métricas de rendimiento
     */
    const fetchPerformanceMetrics = useCallback(async () => {
        try {
            setError(null);
            const data = await sistemaService.getPerformanceMetrics();
            setPerformanceMetrics(data);
        } catch (error) {
            console.error('Error fetching performance metrics:', error);
            setError(error.message);
            toast.error('Error al obtener métricas de rendimiento');
        }
    }, []);

    /**
     * Función para obtener timeline de actividad
     */
    const fetchActivityTimeline = useCallback(async (days = 7) => {
        try {
            setError(null);
            const data = await sistemaService.getActivityTimeline(days);
            setActivityTimeline(data);
        } catch (error) {
            console.error('Error fetching activity timeline:', error);
            setError(error.message);
            toast.error('Error al obtener timeline de actividad');
        }
    }, []);

    /**
     * Función para obtener todas las métricas de una vez
     */
    const fetchAllMetrics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await sistemaService.getAllMetrics();
            setSystemHealth(data.systemHealth);
            setPerformanceMetrics(data.performanceMetrics);
            setActivityTimeline(data.activityTimeline);
        } catch (error) {
            console.error('Error fetching all metrics:', error);
            setError(error.message);
            toast.error('Error al obtener métricas del sistema');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Función para refrescar todas las métricas
     */
    const refreshMetrics = useCallback(async () => {
        await fetchAllMetrics();
    }, [fetchAllMetrics]);

    /**
     * Función para obtener el estado del sistema con mensajes descriptivos
     */
    const getSystemStatus = useCallback((health) => {
        if (!health) return { text: 'Verificando...', status: 'normal' };
        
        if (health.status === 'healthy') {
            return { text: 'Óptimo', status: 'normal' };
        }
        
        return { text: 'Requiere atención', status: 'high' };
    }, []);

    /**
     * Función para formatear valores con mensajes informativos
     */
    const formatValue = useCallback((value, type = 'number', unit = '', emptyMessage = 'Sin datos') => {
        if (value === null || value === undefined || value === 0) {
            return emptyMessage;
        }
        
        if (type === 'percentage') {
            return `${value.toFixed(1)}${unit}`;
        }
        
        if (type === 'memory') {
            return `${(value / (1024**3)).toFixed(2)} GB`;
        }
        
        return `${value}${unit}`;
    }, []);

    /**
     * Efecto para cargar métricas iniciales
     */
    useEffect(() => {
        fetchAllMetrics();
    }, [fetchAllMetrics]);


    return {
        // Estados
        systemHealth,
        performanceMetrics,
        activityTimeline,
        loading,
        error,

        // Funciones
        fetchSystemHealth,
        fetchPerformanceMetrics,
        fetchActivityTimeline,
        fetchAllMetrics,
        refreshMetrics,
        getSystemStatus,
        formatValue
    };
};

export default useSistema;