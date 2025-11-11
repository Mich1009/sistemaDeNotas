import { useState, useEffect } from 'react';
import { reportesService, dashboardService } from '../services/apiAdmin';

export const useReportes = () => {
    const [loading, setLoading] = useState(false);
    const [viewTypeReport, setViewTypeReport] = useState(false);

    // Función para alternar la visibilidad del reporte
    const toggleViewTypeReport = () => {
        setViewTypeReport(!viewTypeReport);
    };

    return {
        loading,
        viewTypeReport,
        toggleViewTypeReport,
    };
};