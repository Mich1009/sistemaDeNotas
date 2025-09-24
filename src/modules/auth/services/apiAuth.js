import api from "../../../shared/utils/axiosInstance";

// Servicios de autenticación
export const authService = {
    login: async (dni, password) => {
        const response = await api.post('/auth/login', { dni, password });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    changePassword: async (currentPassword, newPassword) => {
        const response = await api.post('/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
        });
        return response.data;
    },

    requestPasswordReset: async (email) => {
        const response = await api.post('/auth/password-reset', { email });
        return response.data;
    },

    confirmPasswordReset: async (token, newPassword) => {
        const response = await api.post('/auth/password-reset/confirm', {
            token,
            new_password: newPassword,
        });
        return response.data;
    },
};