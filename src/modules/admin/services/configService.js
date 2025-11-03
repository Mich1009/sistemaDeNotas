import api from "../../../shared/utils/axiosInstance";

// Servicios de Configuración
export const configService = {
    // Obtener configuración del logo
    getLogoConfig: async () => {
        const response = await api.get('/admin/config/logo');
        return response.data;
    },

    // Actualizar configuración del logo
    updateLogoConfig: async (logoData) => {
        const response = await api.put('/admin/config/logo', logoData);
        return response.data;
    },

    // Obtener todas las configuraciones
    getAllConfigs: async () => {
        const response = await api.get('/admin/config');
        return response.data;
    }
};

export default configService;