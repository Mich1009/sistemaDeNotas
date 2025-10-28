import { useState, useEffect } from 'react';
import { reportesService, dashboardService } from '../services/apiAdmin';

export const useReportes = () => {
    const [loading, setLoading] = useState(false);
    

    return {
        loading,
    };
};