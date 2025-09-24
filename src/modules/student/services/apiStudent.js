import api from "../../../shared/utils/axiosInstance";

export const academicService = {
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

// Servicios de tareas/asignaciones (para estudiante)
export const assignmentService = {
    getAssignments: async (params = {}) => {
        const response = await api.get('/student/assignments', { params });
        return response.data;
    },

    getAssignmentById: async (assignmentId) => {
        const response = await api.get(`/student/assignments/${assignmentId}`);
        return response.data;
    },

    submitAssignment: async (assignmentId, submissionData) => {
        const response = await api.post(`/student/assignments/${assignmentId}/submit`, submissionData);
        return response.data;
    },

    uploadAssignmentFile: async (assignmentId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/student/assignments/${assignmentId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};