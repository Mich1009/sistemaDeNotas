import api from "../../../shared/utils/axiosInstance";

const adminEnrollmentService = {
  // ==================== CRUD MATRÍCULAS ====================

  getEnrollments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.estudiante_id) params.append('estudiante_id', filters.estudiante_id);
      if (filters.curso_id) params.append('curso_id', filters.curso_id);
      if (filters.ciclo_id) params.append('ciclo_id', filters.ciclo_id);
      if (filters.carrera_id) params.append('carrera_id', filters.carrera_id);
      if (filters.estado) params.append('estado', filters.estado);
      
      const url = `/admin/matriculas${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  },

  getEnrollmentById: async (enrollmentId) => {
    try {
      const response = await api.get(`/admin/matriculas/${enrollmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      throw error;
    }
  },

  createEnrollment: async (enrollmentData) => {
    try {
      const errors = adminEnrollmentService.validateEnrollmentData(enrollmentData);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const payload = {
        estudiante_id: enrollmentData.estudiante_id,
        curso_id: enrollmentData.curso_id,
        carrera_id: enrollmentData.carrera_id,
        ciclo_id: enrollmentData.ciclo_id,
        fecha_matricula: enrollmentData.fecha_matricula,
        estado: enrollmentData.estado || 'activa'
      };

      const response = await api.post('/admin/matriculas', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  },

  updateEnrollment: async (enrollmentId, enrollmentData) => {
    try {
      const errors = adminEnrollmentService.validateEnrollmentData(enrollmentData, true);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const response = await api.put(`/admin/matriculas/${enrollmentId}`, enrollmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      throw error;
    }
  },

  deleteEnrollment: async (enrollmentId) => {
    try {
      const response = await api.delete(`/admin/matriculas/${enrollmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      throw error;
    }
  },

  // ==================== VALIDACIONES ====================

  validateEnrollmentData: (enrollmentData, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || enrollmentData.estudiante_id !== undefined) {
      if (!enrollmentData.estudiante_id) {
        errors.push('El estudiante es requerido');
      }
    }

    if (!isUpdate || enrollmentData.curso_id !== undefined) {
      if (!enrollmentData.curso_id) {
        errors.push('El curso es requerido');
      }
    }

    if (!isUpdate || enrollmentData.carrera_id !== undefined) {
      if (!enrollmentData.carrera_id) {
        errors.push('La carrera es requerida');
      }
    }

    if (!isUpdate || enrollmentData.ciclo_id !== undefined) {
      if (!enrollmentData.ciclo_id) {
        errors.push('El ciclo es requerido');
      }
    }

    if (!isUpdate || enrollmentData.fecha_matricula !== undefined) {
      if (!enrollmentData.fecha_matricula) {
        errors.push('La fecha de matrícula es requerida');
      }
    }

    return errors;
  },

  // ==================== UTILIDADES ====================

  formatEnrollmentForForm: (enrollment) => {
    return {
      estudiante_id: enrollment.estudiante_id || '',
      curso_id: enrollment.curso_id || '',
      carrera_id: enrollment.carrera_id || '',
      ciclo_id: enrollment.ciclo_id || '',
      fecha_matricula: enrollment.fecha_matricula || new Date().toISOString().split('T')[0],
      estado: enrollment.estado || 'activa'
    };
  },

  getEnrollmentsByStudent: async (studentId) => {
    return await adminEnrollmentService.getEnrollments({ estudiante_id: studentId });
  },

  getEnrollmentsByCourse: async (courseId) => {
    return await adminEnrollmentService.getEnrollments({ curso_id: courseId });
  },

  checkDuplicateEnrollment: async (studentId, courseId, cycleId) => {
    try {
      const enrollments = await adminEnrollmentService.getEnrollments({
        estudiante_id: studentId,
        curso_id: courseId,
        ciclo_id: cycleId
      });
      return enrollments.length > 0;
    } catch (error) {
      console.error('Error checking duplicate enrollment:', error);
      return false;
    }
  }
};

export default adminEnrollmentService;