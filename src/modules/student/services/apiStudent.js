import api from "../../../shared/utils/axiosInstance";

// ========================================
// 📊 SERVICIOS DEL DASHBOARD
// ========================================
export const dashboardService = {
    getDashboard: async () => {
        const response = await api.get('/student/dashboard');
        return response.data;
    },

    getStatistics: async () => {
        const response = await api.get('/student/statistics');
        return response.data;
    },

    // Obtener información combinada del dashboard
    getDashboardOverview: async () => {
        const [dashboard, statistics] = await Promise.all([
            dashboardService.getDashboard(),
            dashboardService.getStatistics()
        ]);
        return {
            dashboard,
            statistics
        };
    }
};

// ========================================
// 📚 SERVICIOS DE MIS CURSOS
// ========================================
export const coursesService = {
    getCourses: async (params = {}) => {
        const response = await api.get('/student/courses', { params });
        return response.data;
    },

    getCoursesFilters: async (params = {}) => {
        const response = await api.get('/student/courses/filters', { params });
        return response.data;
    },

    getCourseById: async (courseId) => {
        const response = await api.get(`/student/courses/${courseId}`);
        return response.data;
    },

    getEnrollments: async (params = {}) => {
        const response = await api.get('/student/enrollments', { params });
        return response.data;
    },

    getCoursesWithGrades: async () => {
        const response = await api.get('/student/courses-with-grades');
        return response.data;
    },

    // Obtener vista completa de un curso específico
    getCourseDetails: async (courseId) => {
        const [courseInfo, grades] = await Promise.all([
            coursesService.getCourseById(courseId),
            gradesService.getGrades({ curso_id: courseId })
        ]);
        return {
            courseInfo,
            grades
        };
    }
};

// ========================================
// 📝 SERVICIOS DE MIS CALIFICACIONES
// ========================================
export const gradesService = {
    getGrades: async (params = {}) => {
        // Limpiar parámetros vacíos antes de enviar
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
        );
        const response = await api.get('/student/grades', { params: cleanParams });
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
        // Limpiar parámetros vacíos antes de enviar
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
        );
        const response = await api.get('/student/grades/statistics', { params: cleanParams });
        return response.data;
    },

    // Obtener datos completos para la vista de calificaciones
    getGradesOverview: async (filters = {}) => {
        // Separar filtros de backend y cliente
        const backendFilters = { ...filters };
        delete backendFilters.año; // Remover año de los filtros del backend
        
        const [grades, filtersOptions, statistics] = await Promise.all([
            gradesService.getGrades(backendFilters),
            gradesService.getGradesFilters(),
            gradesService.getGradesStatistics(backendFilters)
        ]);
        
        // Solo aplicar filtros del cliente si hay filtro de año
        // Si no hay filtro de año, devolver los datos directamente del backend
        const finalGrades = filters.año ? gradeUtils.filterGrades(grades, filters) : grades;
        
        return {
            grades: finalGrades,
            filters: filtersOptions,
            statistics
        };
    },

    // Obtener descripción de evaluación
    getEvaluationDescription: async (courseId, tipoEvaluacion) => {
        const response = await api.get(`/student/courses/${courseId}/evaluation-descriptions/${tipoEvaluacion}`);
        return response.data;
    }
};

// ========================================
// 🕒 SERVICIOS DEL HORARIO
// ========================================
export const scheduleService = {
    getSchedule: async (params = {}) => {
        const response = await api.get('/student/schedule', { params });
        return response.data;
    }
};

// ========================================
// 📊 SERVICIOS DE RENDIMIENTO ACADÉMICO
// ========================================
export const academicPerformanceService = {
    getAcademicPerformance: async () => {
        try {
            const response = await api.get('/student/academic-performance');
            return response.data;
        } catch (error) {
            console.error('Error al obtener rendimiento académico:', error);
            throw error;
        }
    },

    getCicloCoursesPerformance: async (cicloId) => {
        const response = await api.get(`/student/grades/academic-performance/ciclo/${cicloId}`);
        return response.data;
    },

    // Obtener vista completa del rendimiento académico
    getAcademicPerformanceOverview: async () => {
        const academicPerformance = await academicPerformanceService.getAcademicPerformance();
        return {
            academicPerformance
        };
    }
};

// ========================================
// 👤 SERVICIOS DE MI PERFIL
// ========================================
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
    }
};

// ========================================
// 🔧 SERVICIOS AUXILIARES
// ========================================
export const auxiliaryService = {
    getCareers: async () => {
        const response = await api.get('/careers');
        return response.data;
    },

    getCycles: async () => {
        const response = await api.get('/cycles');
        return response.data;
    }
};

// ========================================
// 🧮 UTILIDADES DE CALIFICACIONES
// ========================================
export const gradeUtils = {
    // Calcular promedio basado en las notas del nuevo sistema con pesos
    calculateAverage: (nota = {}) => {
        // Pesos según el sistema: Evaluaciones 10%, Prácticas 30%, Parciales 60%
        const PESO_EVALUACIONES = 0.1;
        const PESO_PRACTICAS = 0.3;
        const PESO_PARCIALES = 0.6;
        
        const evaluaciones = [];
        const practicas = [];
        const parciales = [];
        
        // Recolectar todas las evaluaciones válidas
        for (let i = 1; i <= 8; i++) {
            const evalGrade = nota[`evaluacion${i}`];
            if (evalGrade !== null && evalGrade !== undefined && evalGrade > 0) {
                evaluaciones.push(Number(evalGrade));
            }
        }
        
        // Recolectar todas las prácticas válidas
        for (let i = 1; i <= 4; i++) {
            const pracGrade = nota[`practica${i}`];
            if (pracGrade !== null && pracGrade !== undefined && pracGrade > 0) {
                practicas.push(Number(pracGrade));
            }
        }
        
        // Recolectar todos los parciales válidos
        for (let i = 1; i <= 2; i++) {
            const parGrade = nota[`parcial${i}`];
            if (parGrade !== null && parGrade !== undefined && parGrade > 0) {
                parciales.push(Number(parGrade));
            }
        }

        // Calcular promedios por categoría
        const promedioEvaluaciones = evaluaciones.length > 0 
            ? evaluaciones.reduce((acc, grade) => acc + grade, 0) / evaluaciones.length 
            : 0;
            
        const promedioPracticas = practicas.length > 0 
            ? practicas.reduce((acc, grade) => acc + grade, 0) / practicas.length 
            : 0;
            
        const promedioParciales = parciales.length > 0 
            ? parciales.reduce((acc, grade) => acc + grade, 0) / parciales.length 
            : 0;
        
        // Solo calcular promedio final si hay al menos una nota en cada categoría
        if (promedioEvaluaciones > 0 && promedioPracticas > 0 && promedioParciales > 0) {
            const promedioFinal = (
                promedioEvaluaciones * PESO_EVALUACIONES +
                promedioPracticas * PESO_PRACTICAS +
                promedioParciales * PESO_PARCIALES
            );
            return promedioFinal.toFixed(2);
        }
        
        // Si no hay notas en todas las categorías, devolver null
        return null;
    },

    // Determinar estado basado en la nota
    getGradeStatus: (nota, notaAprobacion = 13) => {
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
                if (parseFloat(promedio) >= 13) {
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

    // 🎯 NUEVA: Calcular estadísticas por evaluaciones individuales de un curso
    calculateCourseStatistics: (grades = []) => {
        if (!grades.length) {
            return {
                total: 0,
                aprobados: 0,
                desaprobados: 0,
                pendientes: 0,
                promedioGeneral: null
            };
        }

        let totalEvaluaciones = 0;
        let aprobadas = 0;
        let desaprobadas = 0;
        let pendientes = 0;
        const todasLasNotas = [];

        grades.forEach(nota => {
            // Contar evaluaciones (1-8)
            for (let i = 1; i <= 8; i++) {
                const evalGrade = nota[`evaluacion${i}`];
                if (evalGrade !== null && evalGrade !== undefined) {
                    totalEvaluaciones++;
                    const grade = Number(evalGrade);
                    if (grade > 0) {
                        todasLasNotas.push(grade);
                        if (grade >= 13) {
                            aprobadas++;
                        } else {
                            desaprobadas++;
                        }
                    } else {
                        pendientes++;
                    }
                } else {
                    totalEvaluaciones++;
                    pendientes++;
                }
            }

            // Contar prácticas (1-4)
            for (let i = 1; i <= 4; i++) {
                const pracGrade = nota[`practica${i}`];
                if (pracGrade !== null && pracGrade !== undefined) {
                    totalEvaluaciones++;
                    const grade = Number(pracGrade);
                    if (grade > 0) {
                        todasLasNotas.push(grade);
                        if (grade >= 13) {
                            aprobadas++;
                        } else {
                            desaprobadas++;
                        }
                    } else {
                        pendientes++;
                    }
                } else {
                    totalEvaluaciones++;
                    pendientes++;
                }
            }

            // Contar parciales (1-2)
            for (let i = 1; i <= 2; i++) {
                const parGrade = nota[`parcial${i}`];
                if (parGrade !== null && parGrade !== undefined) {
                    totalEvaluaciones++;
                    const grade = Number(parGrade);
                    if (grade > 0) {
                        todasLasNotas.push(grade);
                        if (grade >= 13) {
                            aprobadas++;
                        } else {
                            desaprobadas++;
                        }
                    } else {
                        pendientes++;
                    }
                } else {
                    totalEvaluaciones++;
                    pendientes++;
                }
            }
        });

        const promedioGeneral = todasLasNotas.length > 0 
            ? (todasLasNotas.reduce((sum, grade) => sum + grade, 0) / todasLasNotas.length).toFixed(2)
            : null;

        return {
            total: totalEvaluaciones,
            aprobados: aprobadas,
            desaprobados: desaprobadas,
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
                    ciclo_año: nota.ciclo_año, // ✅ Agregar el campo ciclo_año
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

        // Filtrar por ciclo ID
        if (filters.ciclo_id) {
            filtered = filtered.filter(nota => nota.ciclo_id === parseInt(filters.ciclo_id));
        }

        // Filtrar por docente ID
        if (filters.docente_id) {
            filtered = filtered.filter(nota => nota.docente_id === parseInt(filters.docente_id));
        }

        // Filtrar por año
        if (filters.año) {
            filtered = filtered.filter(nota => 
                nota.ciclo_año && nota.ciclo_año.toString() === filters.año.toString()
            );
        }

        // Filtrar por búsqueda de texto (curso, docente o ciclo)
        if (filters.search && filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase().trim();
            filtered = filtered.filter(nota => {
                const cursoNombre = (nota.curso_nombre || '').toLowerCase();
                const docenteNombre = (nota.docente_nombre || '').toLowerCase();
                const cicloNombre = (nota.ciclo_nombre || '').toLowerCase();
                
                return cursoNombre.includes(searchTerm) || 
                       docenteNombre.includes(searchTerm) || 
                       cicloNombre.includes(searchTerm);
            });
        }

        // Filtrar por estado
        if (filters.estado) {
            filtered = filtered.filter(nota => {
                const promedio = gradeUtils.calculateAverage(nota);
                if (filters.estado === 'APROBADO') {
                    return promedio !== null && parseFloat(promedio) >= 13;
                } else if (filters.estado === 'DESAPROBADO') {
                    return promedio !== null && parseFloat(promedio) < 13;
                } else if (filters.estado === 'PENDIENTE') {
                    return promedio === null;
                }
                return true;
            });
        }

        return filtered;
    }
};