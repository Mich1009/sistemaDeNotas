import api from "../../../shared/utils/axiosInstance";

// Servicios de Dashboard
export const dashboardService = {
    getDashboard: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    getEstadisticasGenerales: async () => {
        const response = await api.get('/admin/reportes/estadisticas-generales');
        return response.data;
    }
};

// Servicios de Estudiantes
export const estudiantesService = {
    getEstudiantes: async (params = {}) => {
        const response = await api.get('/admin/estudiantes', { params });
        return response.data;
    },

    createEstudiante: async (estudianteData) => {
        const response = await api.post('/admin/estudiantes', estudianteData);
        return response.data;
    },

    updateEstudiante: async (estudianteId, estudianteData) => {
        const response = await api.put(`/admin/estudiantes/${estudianteId}`, estudianteData);
        return response.data;
    },

    deleteEstudiante: async (estudianteId) => {
        const response = await api.delete(`/admin/estudiantes/${estudianteId}`);
        return response.data;
    },

    searchEstudianteByDni: async (dni) => {
        const response = await api.get(`/admin/estudiantes/search/dni/${dni}`);
        return response.data;
    }
};

// Servicios de Docentes
export const docentesService = {
    getDocentes: async (params = {}) => {
        const response = await api.get('/admin/docentes', { params });
        return response.data;
    },

    getDocente: async (docenteId) => {
        const response = await api.get(`/admin/docentes/${docenteId}`);
        return response.data;
    },

    createDocente: async (docenteData) => {
        const response = await api.post('/admin/docentes', docenteData);
        return response.data;
    },

    updateDocente: async (docenteId, docenteData) => {
        const response = await api.put(`/admin/docentes/${docenteId}`, docenteData);
        return response.data;
    },

    deleteDocente: async (docenteId) => {
        const response = await api.delete(`/admin/docentes/${docenteId}`);
        return response.data;
    },

    getDocenteCursos: async (docenteId) => {
        const response = await api.get(`/admin/docentes/${docenteId}/cursos`);
        return response.data;
    },

    assignCursoToDocente: async (docenteId, cursoId) => {
        const response = await api.post(`/admin/docentes/${docenteId}/cursos/${cursoId}`);
        return response.data;
    }
};

// Servicios de Cursos y Ciclos
export const cursosService = {
    // Ciclos
    getCiclos: async () => {
        const response = await api.get('/admin/cursos-ciclos/ciclos');
        return response.data;
    },

    createCiclo: async (cicloData) => {
        const response = await api.post('/admin/cursos-ciclos/ciclos', cicloData);
        return response.data;
    },

    updateCiclo: async (cicloId, cicloData) => {
        const response = await api.put(`/admin/cursos-ciclos/ciclos/${cicloId}`, cicloData);
        return response.data;
    },

    deleteCiclo: async (cicloId) => {
        const response = await api.delete(`/admin/cursos-ciclos/ciclos/${cicloId}`);
        return response.data;
    },

    // Cursos
    getCursos: async (params = {}) => {
        const response = await api.get('/admin/cursos-ciclos/cursos', { params });
        return response.data;
    },

    createCurso: async (cursoData) => {
        const response = await api.post('/admin/cursos-ciclos/cursos', cursoData);
        return response.data;
    },

    updateCurso: async (cursoId, cursoData) => {
        const response = await api.put(`/admin/cursos-ciclos/cursos/${cursoId}`, cursoData);
        return response.data;
    },

    deleteCurso: async (cursoId) => {
        const response = await api.delete(`/admin/cursos-ciclos/cursos/${cursoId}`);
        return response.data;
    },
};

// Servicios de Notas
export const notasService = {
    getNotasEstudiante: async (estudianteId, params = {}) => {
        const response = await api.get(`/admin/notas/estudiante/${estudianteId}`, { params });
        return response.data;
    },

    getNotasCurso: async (cursoId, params = {}) => {
        const response = await api.get(`/admin/notas/curso/${cursoId}`, { params });
        return response.data;
    },

    registrarNota: async (notaData) => {
        const response = await api.post('/admin/notas', notaData);
        return response.data;
    },

    actualizarNota: async (notaId, notaData) => {
        const response = await api.put(`/admin/notas/${notaId}`, notaData);
        return response.data;
    },

    eliminarNota: async (notaId) => {
        const response = await api.delete(`/admin/notas/${notaId}`);
        return response.data;
    },

    getHistorialNota: async (notaId) => {
        const response = await api.get(`/admin/notas/${notaId}/historial`);
        return response.data;
    },

    getPromediosEstudiante: async (estudianteId) => {
        const response = await api.get(`/admin/notas/estudiante/${estudianteId}/promedios`);
        return response.data;
    }
};

// Servicios de Matrículas
export const matriculasService = {
    getMatriculas: async (params = {}) => {
        const response = await api.get('/admin/matriculas', { params });
        return response.data;
    },

    deleteMatricula: async (matriculaId) => {
        const response = await api.delete(`/admin/matriculas/${matriculaId}`);
        return response.data;
    },

    // Obtener ciclos disponibles para un estudiante específico
    getCiclosDisponiblesParaEstudiante: async (estudianteId) => {
        const response = await api.get(`/admin/matriculas/ciclos-disponibles/${estudianteId}`);
        return response.data;
    },

    matricularEstudianteCiclo: async (estudianteId, cicloId, codigoMatricula) => {
        const response = await api.post(`/admin/matriculas/estudiante/${estudianteId}/ciclo/${cicloId}`, {
            codigo_matricula: codigoMatricula
        });
        return response.data;
    }
};

// Servicios de Reportes
export const reportesService = {
    getRendimientoEstudiantes: async (params = {}) => {
        const response = await api.get('/admin/reportes/rendimiento-estudiantes', { params });
        return response.data;
    },

    getRendimientoPorCurso: async (params = {}) => {
        const response = await api.get('/admin/reportes/rendimiento-por-curso', { params });
        return response.data;
    },

    getEstudiantesPorCiclo: async (año = null) => {
        const params = año ? { año } : {};
        const response = await api.get('/admin/reportes/estudiantes-por-ciclo', { params });
        return response.data;
    },

    exportarEstudiantesExcel: async (params = {}) => {
        const response = await api.get('/admin/reportes/exportar/estudiantes', { 
            params,
            responseType: 'blob'
        });
        return response.data;
    },

    exportarDocentesExcel: async () => {
        const response = await api.get('/admin/reportes/exportar/docentes', {
            responseType: 'blob'
        });
        return response.data;
    },

    exportarCursosExcel: async () => {
        const response = await api.get('/admin/reportes/exportar/cursos', {
            responseType: 'blob'
        });
        return response.data;
    },

    exportarNotasExcel: async (params = {}) => {
        const response = await api.get('/admin/reportes/exportar/notas', { 
            params,
            responseType: 'blob'
        });
        return response.data;
    }
};

// Servicios de rendmiento de sistema
export const sistemaService = {
    getSystemHealth: async () => {
        const response = await api.get('/admin/performance/system-health');
        return response.data;
    },

    getPerformanceMetrics: async () => {
        const response = await api.get('/admin/performance/performance-metrics');
        return response.data;
    },

    getActivityTimeline: async (days = 7) => {
        const response = await api.get(`/admin/performance/activity-timeline?days=${days}`);
        return response.data;
    },

    getAllMetrics: async () => {
        const [systemHealth, performanceMetrics, activityTimeline] = await Promise.all([
            sistemaService.getSystemHealth(),
            sistemaService.getPerformanceMetrics(),
            sistemaService.getActivityTimeline()
        ]);

        return {
            systemHealth,
            performanceMetrics,
            activityTimeline
        };
    }
};

// Exportar todos los servicios