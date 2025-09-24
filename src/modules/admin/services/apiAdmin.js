import api from "../../../shared/utils/axiosInstance";

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

// Servicios académicos (para admin)
export const academicService = {
    getCourses: async (params = {}) => {
        const response = await api.get('/courses', { params });
        return response.data;
    },

    createCourse: async (courseData) => {
        const response = await api.post('/courses', courseData);
        return response.data;
    },

    updateCourse: async (courseId, courseData) => {
        const response = await api.put(`/courses/${courseId}`, courseData);
        return response.data;
    },

    deleteCourse: async (courseId) => {
        const response = await api.delete(`/courses/${courseId}`);
        return response.data;
    },

    getEnrollments: async (params = {}) => {
        const response = await api.get('/enrollments', { params });
        return response.data;
    },

    createEnrollment: async (enrollmentData) => {
        const response = await api.post('/enrollments', enrollmentData);
        return response.data;
    },

    deleteEnrollment: async (enrollmentId) => {
        const response = await api.delete(`/enrollments/${enrollmentId}`);
        return response.data;
    },
};

// Servicios de calificaciones (para admin)
export const gradesService = {
    getGrades: async (params = {}) => {
        const response = await api.get('/grades', { params });
        return response.data;
    },

    createGrade: async (gradeData) => {
        const response = await api.post('/grades', gradeData);
        return response.data;
    },

    updateGrade: async (gradeId, gradeData) => {
        const response = await api.put(`/grades/${gradeId}`, gradeData);
        return response.data;
    },

    deleteGrade: async (gradeId) => {
        const response = await api.delete(`/grades/${gradeId}`);
        return response.data;
    },
};