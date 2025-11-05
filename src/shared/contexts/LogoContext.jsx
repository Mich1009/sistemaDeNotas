import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const LogoContext = createContext();

export const useLogoContext = () => {
    const context = useContext(LogoContext);
    if (!context) {
        throw new Error('useLogoContext debe ser usado dentro de LogoProvider');
    }
    return context;
};

export const LogoProvider = ({ children }) => {
    const [logoUrl, setLogoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLogo = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener la configuración del logo desde el endpoint público
            const response = await axiosInstance.get('/admin/config/public/logo');
            const logoConfig = response.data;

            if (logoConfig && logoConfig.value) {
                // Si el valor es una URL completa (http/https), usarla directamente
                if (logoConfig.value.startsWith('http')) {
                    setLogoUrl(logoConfig.value);
                } else {
                    // Si es una ruta relativa, construir la URL usando la baseURL del axiosInstance
                    // pero removiendo /api/v1 para acceder a los archivos estáticos
                    const baseURL = axiosInstance.defaults.baseURL.replace('/api/v1', '');
                    setLogoUrl(`${baseURL}${logoConfig.value}`);
                }
            } else {
                // Si no hay logo configurado, usar el logo por defecto
                setLogoUrl('/src/assets/upnote.png');
            }
        } catch (err) {
            console.error('Error al cargar el logo:', err);
            setError(err.message);
            // En caso de error, usar el logo por defecto
            setLogoUrl('/src/assets/upnote.png');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogo();
    }, []);

    const refreshLogo = () => {
        fetchLogo();
    };

    const value = {
        logoUrl,
        loading,
        error,
        refreshLogo
    };

    return (
        <LogoContext.Provider value={value}>
            {children}
        </LogoContext.Provider>
    );
};