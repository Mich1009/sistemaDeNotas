import axios from 'axios';
import useAuthStore from '../../modules/auth/store/authStore';
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
        } else if (response?.status === 422) {
            // Errores de validación
            if (Array.isArray(response.data)) {
                // Formato de errores de validación de FastAPI
                const errorMessages = response.data.map(err => {
                    // Asegurar que err es un objeto y tiene las propiedades esperadas
                    if (typeof err === 'object' && err !== null) {
                        const field = err.loc && Array.isArray(err.loc) && err.loc.length > 0 
                            ? err.loc[err.loc.length - 1] 
                            : 'Campo';
                        const message = err.msg || 'Error de validación';
                        return `${field}: ${message}`;
                    }
                    // Si err no es un objeto válido, convertirlo a string
                    return String(err);
                });
                const errorMessage = errorMessages.join(', ');
                toast.error(errorMessage);
            } else if (response.data?.detail) {
                toast.error(String(response.data.detail));
            } else {
                toast.error('Error de validación en los datos enviados.');
            }
        } else if (response?.status >= 500) {
            toast.error('Error del servidor. Por favor, intenta más tarde.');
        } else if (response?.data?.detail) {
            toast.error(String(response.data.detail));
        } else {
            toast.error('Ha ocurrido un error inesperado.');
        }

        return Promise.reject(error);
    }
);

export default api;