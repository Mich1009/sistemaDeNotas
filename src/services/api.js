import axios from 'axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

// Configuración base de Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9001/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response?.status === 401) {
            // Token expirado o inválido
            useAuthStore.getState().logout();
            toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            window.location.href = '/login';
        } else if (response?.status === 403) {
            toast.error('No tienes permisos para realizar esta acción.');
        } else if (response?.status >= 500) {
            toast.error('Error del servidor. Por favor, intenta más tarde.');
        } else if (response?.data?.detail) {
            toast.error(response.data.detail);
        } else {
            toast.error('Ha ocurrido un error inesperado.');
        }

        return Promise.reject(error);
    }
);

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

// Servicios de usuarios (para admin)
export const userService = {
    getUsers: async (params = {}) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    updateUser: async (userId, userData) => {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },
};

// Servicios académicos
export const academicService = {
    getCursos: async (params = {}) => {
        const response = await api.get('/cursos', { params });
        return response.data;
    },

    getCarreras: async () => {
        const response = await api.get('/carreras');
        return response.data;
    },

    getCiclos: async () => {
        const response = await api.get('/ciclos');
        return response.data;
    },

    getMatriculas: async (params = {}) => {
        const response = await api.get('/matriculas', { params });
        return response.data;
    },
};

// Servicios de notas
export const gradesService = {
    getNotas: async (params = {}) => {
        const response = await api.get('/notas', { params });
        return response.data;
    },

    updateNota: async (notaId, notaData) => {
        const response = await api.put(`/notas/${notaId}`, notaData);
        return response.data;
    },

    uploadNotasExcel: async (cursoId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/notas/upload/${cursoId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    exportNotasPDF: async (cursoId) => {
        const response = await api.get(`/notas/export/pdf/${cursoId}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    exportNotasExcel: async (cursoId) => {
        const response = await api.get(`/notas/export/excel/${cursoId}`, {
            responseType: 'blob',
        });
        return response.data;
    },
};

export default api;