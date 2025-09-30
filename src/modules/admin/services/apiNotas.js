import api from "../../../shared/utils/axiosInstance";

const adminGradeService = {
  // ==================== CRUD NOTAS ====================

  getGrades: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.estudiante_id) params.append('estudiante_id', filters.estudiante_id);
      if (filters.curso_id) params.append('curso_id', filters.curso_id);
      if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde);
      if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta);
      if (filters.tipo_evaluacion) params.append('tipo_evaluacion', filters.tipo_evaluacion);
      
      const url = `/admin/notas${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching grades:', error);
      throw error;
    }
  },

  getGradeById: async (gradeId) => {
    try {
      const response = await api.get(`/admin/notas/${gradeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching grade:', error);
      throw error;
    }
  },

  createGrade: async (gradeData) => {
    try {
      const errors = adminGradeService.validateGradeData(gradeData);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const payload = {
        estudiante_id: gradeData.estudiante_id,
        curso_id: gradeData.curso_id,
        tipo_evaluacion: gradeData.tipo_evaluacion,
        nota: parseFloat(gradeData.nota),
        peso: parseFloat(gradeData.peso),
        fecha_evaluacion: gradeData.fecha_evaluacion,
        observaciones: gradeData.observaciones || ''
      };

      const response = await api.post('/admin/notas', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating grade:', error);
      throw error;
    }
  },

  updateGrade: async (gradeId, gradeData) => {
    try {
      const errors = adminGradeService.validateGradeData(gradeData, true);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const updateData = {
        tipo_evaluacion: gradeData.tipo_evaluacion,
        nota: parseFloat(gradeData.nota),
        peso: parseFloat(gradeData.peso),
        fecha_evaluacion: gradeData.fecha_evaluacion,
        observaciones: gradeData.observaciones
      };

      if (gradeData.motivo_cambio) {
        updateData.motivo_cambio = gradeData.motivo_cambio;
      }

      const response = await api.put(`/admin/notas/${gradeId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating grade:', error);
      throw error;
    }
  },

  deleteGrade: async (gradeId) => {
    try {
      const response = await api.delete(`/admin/notas/${gradeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting grade:', error);
      throw error;
    }
  },

  // ==================== HISTORIAL DE NOTAS ====================

  getGradeHistory: async (gradeId) => {
    try {
      const response = await api.get(`/admin/notas/${gradeId}/historial`);
      return response.data;
    } catch (error) {
      console.error('Error fetching grade history:', error);
      throw error;
    }
  },

  // ==================== ESTADÍSTICAS ====================

  getGradeStatistics: async (filters = {}) => {
    try {
      const grades = await adminGradeService.getGrades(filters);
      
      if (grades.length === 0) {
        return {
          total: 0,
          promedio: 0,
          nota_maxima: 0,
          nota_minima: 0,
          aprobados: 0,
          desaprobados: 0
        };
      }

      const notas = grades.map(grade => parseFloat(grade.nota));
      const promedio = notas.reduce((sum, nota) => sum + nota, 0) / notas.length;
      const aprobados = grades.filter(grade => parseFloat(grade.nota) >= 11).length;

      return {
        total: grades.length,
        promedio: parseFloat(promedio.toFixed(2)),
        nota_maxima: Math.max(...notas),
        nota_minima: Math.min(...notas),
        aprobados: aprobados,
        desaprobados: grades.length - aprobados,
        porcentaje_aprobados: parseFloat(((aprobados / grades.length) * 100).toFixed(1))
      };
    } catch (error) {
      console.error('Error calculating grade statistics:', error);
      throw error;
    }
  },

  // ==================== VALIDACIONES ====================

  validateGradeData: (gradeData, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || gradeData.estudiante_id !== undefined) {
      if (!gradeData.estudiante_id) {
        errors.push('El estudiante es requerido');
      }
    }

    if (!isUpdate || gradeData.curso_id !== undefined) {
      if (!gradeData.curso_id) {
        errors.push('El curso es requerido');
      }
    }

    if (!isUpdate || gradeData.tipo_evaluacion !== undefined) {
      if (!gradeData.tipo_evaluacion) {
        errors.push('El tipo de evaluación es requerido');
      }
    }

    if (!isUpdate || gradeData.nota !== undefined) {
      const nota = parseFloat(gradeData.nota);
      if (isNaN(nota) || nota < 0 || nota > 20) {
        errors.push('La nota debe ser un número entre 0 y 20');
      }
    }

    if (!isUpdate || gradeData.peso !== undefined) {
      const peso = parseFloat(gradeData.peso);
      if (isNaN(peso) || peso <= 0 || peso > 1) {
        errors.push('El peso debe ser un número mayor a 0 y menor o igual a 1');
      }
    }

    if (!isUpdate || gradeData.fecha_evaluacion !== undefined) {
      if (!gradeData.fecha_evaluacion) {
        errors.push('La fecha de evaluación es requerida');
      }
    }

    return errors;
  },

  // ==================== UTILIDADES ====================

  formatGradeForForm: (grade) => {
    return {
      estudiante_id: grade.estudiante_id || '',
      curso_id: grade.curso_id || '',
      tipo_evaluacion: grade.tipo_evaluacion || '',
      nota: grade.nota || 0,
      peso: grade.peso || 0.3,
      fecha_evaluacion: grade.fecha_evaluacion || new Date().toISOString().split('T')[0],
      observaciones: grade.observaciones || ''
    };
  },

  calculateFinalGrade: (grades) => {
    if (!grades || grades.length === 0) return 0;
    
    let totalPonderado = 0;
    let totalPeso = 0;
    
    grades.forEach(grade => {
      const nota = parseFloat(grade.nota);
      const peso = parseFloat(grade.peso);
      totalPonderado += nota * peso;
      totalPeso += peso;
    });
    
    return totalPeso > 0 ? parseFloat((totalPonderado / totalPeso).toFixed(2)) : 0;
  },

  getGradesByStudent: async (studentId) => {
    return await adminGradeService.getGrades({ estudiante_id: studentId });
  },

  getGradesByCourse: async (courseId) => {
    return await adminGradeService.getGrades({ curso_id: courseId });
  }
};

export default adminGradeService;