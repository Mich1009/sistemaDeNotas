import api from "../../../shared/utils/axiosInstance";

// Función principal para obtener cursos
export const getCourses = async (params = {}) => {
    const response = await api.get('/teacher/courses', { params });
    return response;
};

// Función para obtener estudiantes con notas
export const getStudentsWithGrades = async (courseId) => {
    const response = await api.get(`/teacher/courses/${courseId}/students-with-grades`);
    return response;
};

// Función para crear/actualizar notas masivamente
export const updateGradesBulk = async (courseId, gradesData) => {
    const response = await api.put(`/teacher/courses/${courseId}/grades/bulk`, gradesData);
    return response;
};

// Servicios académicos (para docente)
export const academicService = {
    getCourses: async (params = {}) => {
        const response = await api.get('/teacher/courses', { params });
        return response.data;
    },

    getCourseById: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}`);
        return response.data;
    },

    updateCourse: async (courseId, courseData) => {
        const response = await api.put(`/teacher/courses/${courseId}`, courseData);
        return response.data;
    },

    getStudentsByCourse: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}/students`);
        return response.data;
    },
};

// Servicios de perfil (para docente)
export const profileService = {
    getProfile: async () => {
        const response = await api.get('/teacher/profile');
        return response.data;
    },
    
    updateProfile: async (profileData) => {
        const response = await api.put('/teacher/profile', profileData);
        return response.data;
    },
    
    changePassword: async (passwordData) => {
        const response = await api.put('/teacher/profile/password', passwordData);
        return response.data;
    }
};

// Servicios de calificaciones (para docente)
export const gradesService = {
    getGradesByCourse: async (courseId, params = {}) => {
        const response = await api.get(`/teacher/courses/${courseId}/grades`, { params });
        return response.data;
    },

    createGrade: async (gradeData) => {
        const response = await api.post('/teacher/grades', gradeData);
        return response.data;
    },

    updateGrade: async (gradeId, gradeData) => {
        const response = await api.put(`/teacher/grades/${gradeId}`, gradeData);
        return response.data;
    },

    deleteGrade: async (gradeId) => {
        const response = await api.delete(`/teacher/grades/${gradeId}`);
        return response.data;
    },

    getStudentGrades: async (studentId, courseId) => {
        const response = await api.get(`/teacher/students/${studentId}/courses/${courseId}/grades`);
        return response.data;
    },
};

// Servicios de tareas/asignaciones (para docente)
export const assignmentService = {
    getAssignments: async (params = {}) => {
        const response = await api.get('/teacher/assignments', { params });
        return response.data;
    },

    createAssignment: async (assignmentData) => {
        const response = await api.post('/teacher/assignments', assignmentData);
        return response.data;
    },

    updateAssignment: async (assignmentId, assignmentData) => {
        const response = await api.put(`/teacher/assignments/${assignmentId}`, assignmentData);
        return response.data;
    },

    deleteAssignment: async (assignmentId) => {
        const response = await api.delete(`/teacher/assignments/${assignmentId}`);
        return response.data;
    },

    getAssignmentSubmissions: async (assignmentId) => {
        const response = await api.get(`/teacher/assignments/${assignmentId}/submissions`);
        return response.data;
    },
};