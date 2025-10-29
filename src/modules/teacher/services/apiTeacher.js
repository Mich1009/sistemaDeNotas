import api from "../../../shared/utils/axiosInstance";

// ============================================================================
// SERVICIOS DE DASHBOARD (Dashboard)
// ============================================================================
export const dashboardService = {
    // Obtener datos del dashboard del docente
    getDashboard: async () => {
        const response = await api.get('/teacher/dashboard');
        return response.data;
    }
};

// ============================================================================
// SERVICIOS DE CURSOS (Mis Cursos)
// ============================================================================
export const cursosService = {
    // Obtener todos los cursos del docente
    getCourses: async (params = {}) => {
        const response = await api.get('/teacher/courses', { params });
        return response.data;
    },

    // Obtener ciclos donde el docente tiene cursos asignados
    getCiclos: async () => {
        const response = await api.get('/teacher/ciclos');
        return response.data;
    },

    // Obtener un curso específico por ID
    getCourseById: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}`);
        return response.data;
    },

    // Obtener estudiantes de un curso
    getStudentsByCourse: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}/students`);
        return response.data;
    },

    // Obtener estudiantes con sus notas
    getStudentsWithGrades: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}/students-with-grades`);
        return response.data;
    }
};

// ============================================================================
// SERVICIOS DE CALIFICACIONES (Calificaciones)
// ============================================================================
export const calificacionesService = {
    // Actualización masiva de notas
    updateGradesBulk: async (courseId, gradesData) => {
        const response = await api.post(`/teacher/courses/${courseId}/grades/bulk`, gradesData);
        return response.data;
    },

    // Cargar notas desde Excel
    uploadGradesFromExcel: async (courseId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post(`/teacher/courses/${courseId}/grades/upload-excel`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    // Descargar plantilla de Excel
    downloadExcelTemplate: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}/grades/excel-template`, {
            responseType: 'blob'
        });
        return response.data;
    },

    // Obtener todas las descripciones de evaluaciones de un curso
    getEvaluationDescriptions: async (courseId) => {
        const response = await api.get(`/teacher/courses/${courseId}/evaluation-descriptions`);
        return response.data;
    },

    // Crear o actualizar una descripción de evaluación
    saveEvaluationDescription: async (courseId, descriptionData) => {
        const response = await api.post(`/teacher/courses/${courseId}/evaluation-descriptions`, descriptionData);
        return response.data;
    },

    // Eliminar una descripción de evaluación
    deleteEvaluationDescription: async (courseId, tipoEvaluacion) => {
        const response = await api.delete(`/teacher/courses/${courseId}/evaluation-descriptions/${tipoEvaluacion}`);
        return response.data;
    }
};

// ============================================================================
// SERVICIOS DE REPORTES (Reportes)
// ============================================================================
export const reportesService = {
    // Obtener reporte de rendimiento
    getPerformanceReport: async (params = {}) => {
        const response = await api.get('/teacher/reports/performance', { params });
        return response.data;
    },

    // Obtener años disponibles
    getAvailableYears: async () => {
        const response = await api.get('/teacher/reports/years');
        return response.data;
    },

    // Obtener ciclos disponibles
    getAvailableCycles: async (año = null) => {
        const params = año ? { año } : {};
        const response = await api.get('/teacher/reports/cycles', { params });
        return response.data;
    },

    // Obtener cursos disponibles
    getAvailableCourses: async (año = null, ciclo_id = null) => {
        const params = {};
        if (año) params.año = año;
        if (ciclo_id) params.ciclo_id = ciclo_id;
        const response = await api.get('/teacher/reports/courses', { params });
        return response.data;
    },

    // Exportar reportes a Excel
    exportReports: async (params = {}) => {
        const response = await api.get('/teacher/reports/export', { 
            params,
            responseType: 'blob'
        });
        return response.data;
    },

    // Obtener estudiantes desaprobados de un curso
    getFailedStudents: async (cursoId) => {
        const response = await api.get(`/teacher/reports/failed-students/${cursoId}`);
        return response.data;
    }
};

// ============================================================================
// SERVICIOS DE PERFIL (Mi Perfil)
// ============================================================================
export const perfilService = {
    // Obtener perfil del docente
    getProfile: async () => {
        const response = await api.get('/teacher/profile');
        return response.data;
    },
    
    // Actualizar perfil del docente
    updateProfile: async (profileData) => {
        const response = await api.put('/teacher/profile', profileData);
        return response.data;
    }
};

// ============================================================================
// UTILIDADES PARA CALIFICACIONES
// ============================================================================
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

