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

    getStatistics: async () => {
        const response = await api.get('/student/statistics');
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
        getCoursesWithGrades: async () => {
        const response = await api.get('/student/courses-with-grades');
        return response.data;
    }
};

// Servicios de calificaciones (para estudiante)
export const gradesService = {
    getGrades: async (params = {}) => {
        const response = await api.get('/student/grades', { params });
        return response.data;
    },

    getGradesByCourse: async (courseId) => {
        const response = await api.get(`/student/grades/${courseId}`);
        return response.data;
    },

    getGradesFilters: async () => {
    const response = await api.get('/student/grades/filters');
    return response.data;
    },

    getGradesStatistics: async (params = {}) => {
        const response = await api.get('/student/grades/statistics', { params });
        return response.data;
    },

};

// Servicios adicionales útiles para el estudiante - ACTUALIZADOS
export const studentService = {
    // Obtener información combinada del perfil académico
    getAcademicProfile: async () => {
        const [dashboard, statistics, grades] = await Promise.all([
            academicService.getDashboard(),
            academicService.getStatistics(),
            gradesService.getGrades()
        ]);
        return {
            dashboard,
            statistics,
            grades
        };
    },

    // Obtener vista completa de un curso específico
    getCourseDetails: async (courseId) => {
        const [courseInfo, grades] = await Promise.all([
            academicService.getCourseById(courseId),
            gradesService.getGrades({ curso_id: courseId })
        ]);
        return {
            courseInfo,
            grades
        };
    },

    // Obtener datos completos para la vista de calificaciones
    getGradesOverview: async (filters = {}) => {
        const [grades, filtersOptions, statistics] = await Promise.all([
            gradesService.getGrades(filters),
            gradesService.getGradesFilters(),
            gradesService.getGradesStatistics(filters)
        ]);
        return {
            grades,
            filters: filtersOptions,
            statistics
        };
    }
};

// Funciones de utilidad para el frontend
export const gradeUtils = {
    // Calcular promedio basado en las notas del nuevo sistema
    calculateAverage: (nota = {}) => {
        const allGrades = [];
        
        // Recolectar todas las evaluaciones válidas
        for (let i = 1; i <= 8; i++) {
            const evalGrade = nota[`evaluacion${i}`];
            if (evalGrade !== null && evalGrade !== undefined && evalGrade > 0) {
                allGrades.push(Number(evalGrade));
            }
        }
        
        // Recolectar todas las prácticas válidas
        for (let i = 1; i <= 4; i++) {
            const pracGrade = nota[`practica${i}`];
            if (pracGrade !== null && pracGrade !== undefined && pracGrade > 0) {
                allGrades.push(Number(pracGrade));
            }
        }
        
        // Recolectar todos los parciales válidos
        for (let i = 1; i <= 2; i++) {
            const parGrade = nota[`parcial${i}`];
            if (parGrade !== null && parGrade !== undefined && parGrade > 0) {
                allGrades.push(Number(parGrade));
            }
        }

        if (allGrades.length === 0) return null;
        
        const sum = allGrades.reduce((acc, grade) => acc + grade, 0);
        return (sum / allGrades.length).toFixed(2);
    },

    // Determinar estado basado en la nota
    getGradeStatus: (nota, notaAprobacion = 11) => {
        if (nota === null || nota === undefined) return 'SIN_NOTA';
        return nota >= notaAprobacion ? 'APROBADO' : 'DESAPROBADO';
    },

    // Formatear nota para display
    formatGrade: (nota) => {
        if (nota === null || nota === undefined) return '-';
        return parseFloat(nota).toFixed(2);
    },

    // Validar rango de nota
    isValidGrade: (nota) => {
        return nota >= 0 && nota <= 20;
    },

    // Obtener todas las notas de un objeto nota en formato plano
    getAllGrades: (nota) => {
        const grades = [];
        
        for (let i = 1; i <= 8; i++) {
            const grade = nota[`evaluacion${i}`];
            if (grade !== null && grade !== undefined) {
                grades.push({
                    tipo: `Evaluación ${i}`,
                    valor: grade
                });
            }
        }
        
        for (let i = 1; i <= 4; i++) {
            const grade = nota[`practica${i}`];
            if (grade !== null && grade !== undefined) {
                grades.push({
                    tipo: `Práctica ${i}`,
                    valor: grade
                });
            }
        }
        
        for (let i = 1; i <= 2; i++) {
            const grade = nota[`parcial${i}`];
            if (grade !== null && grade !== undefined) {
                grades.push({
                    tipo: `Parcial ${i}`,
                    valor: grade
                });
            }
        }
        
        return grades;
    },

    // 🎯 NUEVA: Calcular estadísticas de un conjunto de notas
    calculateGradesStatistics: (grades = []) => {
        if (!grades.length) {
            return {
                total: 0,
                aprobados: 0,
                desaprobados: 0,
                pendientes: 0,
                promedioGeneral: null
            };
        }

        let aprobados = 0;
        let desaprobados = 0;
        let pendientes = 0;
        const promedios = [];

        grades.forEach(nota => {
            const promedio = gradeUtils.calculateAverage(nota);
            
            if (promedio === null) {
                pendientes++;
            } else {
                promedios.push(parseFloat(promedio));
                if (parseFloat(promedio) >= 11) {
                    aprobados++;
                } else {
                    desaprobados++;
                }
            }
        });

        const promedioGeneral = promedios.length > 0 
            ? (promedios.reduce((sum, avg) => sum + avg, 0) / promedios.length).toFixed(2)
            : null;

        return {
            total: grades.length,
            aprobados,
            desaprobados,
            pendientes,
            promedioGeneral
        };
    },

    // 🎯 NUEVA: Agrupar notas por curso
    groupGradesByCourse: (grades = []) => {
        const grouped = {};
        
        grades.forEach(nota => {
            const cursoId = nota.curso_id;
            if (!grouped[cursoId]) {
                grouped[cursoId] = {
                    curso_id: cursoId,
                    curso_nombre: nota.curso_nombre,
                    docente_nombre: nota.docente_nombre,
                    ciclo_nombre: nota.ciclo_nombre,
                    notas: [],
                    promedio_curso: null
                };
            }
            grouped[cursoId].notas.push(nota);
        });

        // Calcular promedio por curso
        Object.values(grouped).forEach(curso => {
            const promedios = curso.notas
                .map(nota => gradeUtils.calculateAverage(nota))
                .filter(avg => avg !== null)
                .map(avg => parseFloat(avg));
            
            if (promedios.length > 0) {
                curso.promedio_curso = (promedios.reduce((sum, avg) => sum + avg, 0) / promedios.length).toFixed(2);
            }
        });

        return Object.values(grouped);
    },

    // 🎯 NUEVA: Filtrar notas por diferentes criterios
    filterGrades: (grades = [], filters = {}) => {
        let filtered = [...grades];

        // Filtrar por curso
        if (filters.curso_id) {
            filtered = filtered.filter(nota => nota.curso_id === parseInt(filters.curso_id));
        }

        // Filtrar por ciclo (si existe el campo ciclo_nombre)
        if (filters.ciclo_nombre) {
            filtered = filtered.filter(nota => 
                nota.ciclo_nombre && nota.ciclo_nombre.toLowerCase().includes(filters.ciclo_nombre.toLowerCase())
            );
        }

        // Filtrar por docente
        if (filters.docente_nombre) {
            filtered = filtered.filter(nota => 
                nota.docente_nombre && nota.docente_nombre.toLowerCase().includes(filters.docente_nombre.toLowerCase())
            );
        }

        // Filtrar por estado
        if (filters.estado) {
            filtered = filtered.filter(nota => {
                const promedio = gradeUtils.calculateAverage(nota);
                if (filters.estado === 'APROBADO') {
                    return promedio !== null && parseFloat(promedio) >= 11;
                } else if (filters.estado === 'DESAPROBADO') {
                    return promedio !== null && parseFloat(promedio) < 11;
                } else if (filters.estado === 'PENDIENTE') {
                    return promedio === null;
                }
                return true;
            });
        }

        return filtered;
    }
};