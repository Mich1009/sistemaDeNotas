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
            verification_token: token,
            new_password: newPassword,
        });
        return response.data;
    },

    // Verificar token antes de cambiar contraseña
    verifyResetToken: async (identificatorToken) => {
      try {
        console.log('🔐 [FRONTEND] === INICIANDO VERIFICACIÓN ===');
        console.log('🔐 [FRONTEND] Token a enviar:', identificatorToken);
        console.log('🔐 [FRONTEND] Tipo de token:', typeof identificatorToken);
        
        const requestData = { token: identificatorToken };
        console.log('🔐 [FRONTEND] JSON a enviar:', JSON.stringify(requestData));
        
        const response = await api.post('/auth/password-reset/verify', requestData);
        console.log('✅ [FRONTEND] Respuesta exitosa:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ [FRONTEND] Error completo:', error);
        console.error('❌ [FRONTEND] Data del error:', error.response?.data);
        console.error('❌ [FRONTEND] Status:', error.response?.status);
        console.error('❌ [FRONTEND] Headers:', error.response?.headers);
        throw error;
      }
    },

    // Obtener estado de recuperación
    getResetStatus: async (email) => {
        const response = await api.get(`/auth/password-reset/status/${email}`);
        return response.data;
    }
};