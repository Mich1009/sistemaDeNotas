import { useState, useEffect, useCallback, useMemo } from 'react';
import { cursosService } from '../services/apiAdmin';

export const useCiclos = () => {
    const [ciclos, setCiclos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCiclos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await cursosService.getCiclos();
            setCiclos(data || []);
        } catch (err) {
            setError(err.message || 'Error al cargar ciclos');
            setCiclos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const getUltimoCiclo = useMemo(() => {
        if (ciclos.length === 0) return null;
        // Ordenar por ID descendente para obtener el último creado
        const ciclosOrdenados = [...ciclos].sort((a, b) => b.id - a.id);
        return ciclosOrdenados[0];
    }, [ciclos]);

    const getCiclosActivos = useMemo(() => {
        return ciclos.filter(ciclo => ciclo.is_active);
    }, [ciclos]);

    useEffect(() => {
        fetchCiclos();
    }, []);

    return {
        ciclos,
        loading,
        error,
        fetchCiclos,
        getUltimoCiclo,
        getCiclosActivos
    };
};