import api from "../../../shared/utils/axiosInstance";
import upnoteLogo from '../../../assets/upnote.png'; // Logo por defecto local

// Servicio para obtener configuraciones públicas
export const configService = {
    // Obtener configuración del logo de login
    getLoginLogo: async () => {
        try {
            const response = await api.get('/admin/config/public/logo');
            
            if (!response.data || !response.data.value) {
                return { value: upnoteLogo };
            }

            // Asegurarse de que la ruta sea absoluta
            let logoUrl = response.data.value;
            if (!logoUrl.startsWith('http')) {
                const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                // Eliminar /api/v1 de la URL base si existe
                const baseUrl = backendUrl.replace(/\/api\/v1$/, '');
                logoUrl = `${baseUrl}${logoUrl}`;
            }

            // Verificar si la URL es accesible
            try {
                const imgResponse = await fetch(logoUrl, { method: 'HEAD' });
                if (!imgResponse.ok) {
                    return { value: upnoteLogo };
                }
            } catch (imgError) {
                return { value: upnoteLogo };
            }

            return { ...response.data, value: logoUrl };
        } catch (error) {
            return { value: upnoteLogo };
        }
    },

    // Obtener configuración completa del logo (para admin)
    getLogoConfig: async () => {
        try {
            const response = await api.get('/admin/config/logo');
            if (!response.data || !response.data.value) {
                throw new Error('Configuración de logo no válida');
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Actualizar configuración del logo
    updateLogoConfig: async (logoData) => {
        try {
            const response = await api.put('/admin/config/logo', logoData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default configService;