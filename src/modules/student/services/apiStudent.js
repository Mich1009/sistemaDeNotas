import api from "../../../shared/utils/axiosInstance";

// Servicios de autenticación y perfil
export const profileService = {
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/auth/me', profileData);
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.post('/auth/change-password', passwordData);
        return response.data;
    },
};

export const academicService = {
    getDashboard: async () => {
        const response = await api.get('/student/dashboard');
        return response.data;
    },

    getCourses: async (params = {}) => {
        const response = await api.get('/student/courses', { params });
        return response.data;
    },

    getEnrollments: async (params = {}) => {
        const response = await api.get('/student/enrollments', { params });
        return response.data;
    },

    getCareers: async () => {
        const response = await api.get('/careers');
        return response.data;
    },

    getCycles: async () => {
        const response = await api.get('/cycles');
        return response.data;
    },

    getCourseById: async (courseId) => {
        const response = await api.get(`/student/courses/${courseId}`);
        return response.data;
    },
};

// Servicios de calificaciones (para estudiante)
export const gradesService = {
    getGrades: async (params = {}) => {
        const response = await api.get('/student/grades', { params });
        return response.data;
    },

    getGradesByCourse: async (courseId) => {
        const response = await api.get(`/student/courses/${courseId}/grades`);
        return response.data;
    },

    getGradeHistory: async (params = {}) => {
        const response = await api.get('/student/grades/history', { params });
        return response.data;
    },
};

// Servicios de tareas/asignaciones eliminados - los estudiantes solo tienen permisos de lectura