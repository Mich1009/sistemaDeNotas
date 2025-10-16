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

    getStudentGrades: async (studentId, courseId) => {
        const response = await api.get(`/teacher/students/${studentId}/courses/${courseId}/grades`);
        return response.data;
    },
    // Actualización masiva de notas
    updateGradesBulk: async (courseId, gradesData) => {
        const response = await api.post(`/teacher/courses/${courseId}/grades/bulk`, gradesData);
        return response.data;
    },

    // Obtener estructura de notas de un estudiante
    getStudentGradeStructure: async (courseId, studentId) => {
        const response = await api.get(`/teacher/courses/${courseId}/students/${studentId}/grade-structure`);
        return response.data;
    },

    // Obtener promedio final de un estudiante
    getStudentFinalGrade: async (courseId, studentId) => {
        const response = await api.get(`/teacher/courses/${courseId}/students/${studentId}/final-grade`);
        return response.data;
    },

    // Obtener todos los promedios finales del curso
    getAllFinalGrades: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}/all-final-grades`);
        return response.data;
    },

    // Calcular promedios automáticamente para todo el curso
    calculateCourseAverages: async (courseId) => {
        const response = await api.post(`/teacher/courses/${courseId}/calcular-promedios`);
        return response.data;
    },

    // Obtener historial de una nota
    getGradeHistory: async (gradeId) => {
        const response = await api.get(`/teacher/notas/${gradeId}/historial`);
        return response.data;
    }
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

// Servicios de reportes y estadísticas
export const reportsService = {
    getCourseReport: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}/report`);
        return response.data;
    },

    getTeacherStatistics: async () => {
        const response = await api.get('/teacher/statistics');
        return response.data;
    }
};

// Servicios de configuración
export const configService = {
    getGradeCalculationConfig: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}/grade-config`);
        return response.data;
    },

    updateGradeCalculationConfig: async (courseId, configData) => {
        const response = await api.put(`/teacher/courses/${courseId}/grade-config`, configData);
        return response.data;
    }
};

// Funciones de utilidad para el frontend
export const gradeUtils = {
    // Calcular promedio basado en las notas
    calculateAverage: (notas = []) => {
        if (!notas.length) return null;
        
        const notasValidas = notas.filter(nota => 
            nota !== null && nota !== undefined && nota > 0
        );
        
        if (!notasValidas.length) return null;
        
        const suma = notasValidas.reduce((acc, nota) => acc + nota, 0);
        return Math.round((suma / notasValidas.length) * 100) / 100;
    },

    // Determinar estado basado en la nota
    getGradeStatus: (nota, notaAprobacion = 11) => {
        if (nota === null || nota === undefined) return 'SIN_NOTA';
        return nota >= notaAprobacion ? 'APROBADO' : 'DESAPROBADO';
    },

    // Formatear nota para display
    formatGrade: (nota) => {
        if (nota === null || nota === undefined) return '-';
        return nota.toFixed(2);
    },

    // Validar rango de nota
    isValidGrade: (nota) => {
        return nota >= 0 && nota <= 20;
    }
};
