import api from "../../../shared/utils/axiosInstance";

// Servicios de Dashboard
export const dashboardService = {
    getDashboard: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    getEstadisticasGenerales: async () => {
        const response = await api.get('/admin/estadisticas-generales');
        return response.data;
    },

    getGradeDistribution: async () => {
        const response = await api.get('/admin/grade-distribution');
        return response.data;
    },

    getEstudiantesPorCiclo: async (year = null) => {
        const params = year ? { year } : {};
        const response = await api.get('/admin/estudiantes-por-ciclo', { params });
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

    assignCursoToDocente: async (docenteId, cursoId) => {
        const response = await api.post(`/admin/docentes/${docenteId}/assign-curso`, { curso_id: cursoId });
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
    getEstructuraJerarquica: async (año = null) => {
        const params = new URLSearchParams();
        if (año) params.append('año', año);
        // Agregar timestamp para evitar caché
        params.append('_t', Date.now().toString());
        const response = await api.get(`/admin/reportes/jerarquicos/carreras-ciclos?${params}`);
        return response.data;
    },

    getPromediosPorCiclo: async (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.año) params.append('año', filtros.año);
        if (filtros.carrera_id) params.append('carrera_id', filtros.carrera_id);

        const response = await api.get(`/admin/reportes/promedios/por-ciclo?${params}`);
        return response.data;
    },

    getAñosDisponibles: async () => {
        const response = await api.get('/admin/reportes/filtros/años-disponibles');
        return response.data;
    },

    getEstudiantesPorCurso: async (cursoId, estado = null) => {
        const params = estado ? `?estado=${estado}` : '';
        const response = await api.get(`/admin/reportes/curso/${cursoId}/estudiantes${params}`);
        return response.data;
    },

    getEstudiantesPorCiclo: async (cicloId, estado = null) => {
        const params = estado ? `?estado=${estado}` : '';
        const response = await api.get(`/admin/reportes/estudiantes-por-ciclo/${cicloId}${params}`);
        return response.data;
    }
};