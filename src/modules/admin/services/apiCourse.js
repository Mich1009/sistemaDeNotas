import api from "../../../shared/utils/axiosInstance";

const adminCourseService = {
  // ==================== CRUD CURSOS ====================

  getCourses: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.ciclo_id) params.append('ciclo_id', filters.ciclo_id);
      if (filters.docente_id) params.append('docente_id', filters.docente_id);
      if (filters.carrera_id) params.append('carrera_id', filters.carrera_id);
      if (filters.include_inactive !== undefined) {
        params.append('include_inactive', filters.include_inactive.toString());
      }
      if (filters.search) params.append('search', filters.search);
      
      const url = `/admin/cursos${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/admin/cursos/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  createCourse: async (courseData) => {
    try {
      const errors = adminCourseService.validateCourseData(courseData);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const payload = {
        nombre: courseData.nombre,
        codigo: courseData.codigo,
        descripcion: courseData.descripcion || '',
        creditos: courseData.creditos,
        horas_teoricas: courseData.horas_teoricas,
        horas_practicas: courseData.horas_practicas,
        ciclo_id: courseData.ciclo_id,
        docente_id: courseData.docente_id || null,
        is_active: courseData.is_active !== undefined ? courseData.is_active : true
      };

      const response = await api.post('/admin/cursos', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  updateCourse: async (courseId, courseData) => {
    try {
      const errors = adminCourseService.validateCourseData(courseData, true);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const response = await api.put(`/admin/cursos/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/admin/cursos/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // ==================== GESTIÓN DE DOCENTES ====================

  assignTeacher: async (courseId, teacherId) => {
    try {
      const response = await api.put(`/admin/cursos/${courseId}`, {
        docente_id: teacherId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning teacher:', error);
      throw error;
    }
  },

  removeTeacher: async (courseId) => {
    try {
      const response = await api.put(`/admin/cursos/${courseId}`, {
        docente_id: null
      });
      return response.data;
    } catch (error) {
      console.error('Error removing teacher:', error);
      throw error;
    }
  },

  // ==================== VALIDACIONES ====================

  validateCourseData: (courseData, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || courseData.nombre !== undefined) {
      if (!courseData.nombre || courseData.nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      }
    }

    if (!isUpdate || courseData.codigo !== undefined) {
      if (!courseData.codigo) {
        errors.push('El código es requerido');
      } else if (!/^[A-Z0-9]{2,10}$/.test(courseData.codigo)) {
        errors.push('El código debe contener solo letras mayúsculas y números (2-10 caracteres)');
      }
    }

    if (!isUpdate || courseData.creditos !== undefined) {
      if (!courseData.creditos || courseData.creditos < 1) {
        errors.push('Los créditos deben ser mayor a 0');
      }
    }

    if (!isUpdate || courseData.horas_teoricas !== undefined) {
      if (courseData.horas_teoricas < 0) {
        errors.push('Las horas teóricas no pueden ser negativas');
      }
    }

    if (!isUpdate || courseData.horas_practicas !== undefined) {
      if (courseData.horas_practicas < 0) {
        errors.push('Las horas prácticas no pueden ser negativas');
      }
    }

    if (!isUpdate || courseData.ciclo_id !== undefined) {
      if (!courseData.ciclo_id) {
        errors.push('El ciclo es requerido');
      }
    }

    return errors;
  },

  // ==================== UTILIDADES ====================

  formatCourseForForm: (course) => {
    return {
      nombre: course.nombre || '',
      codigo: course.codigo || '',
      descripcion: course.descripcion || '',
      creditos: course.creditos || 1,
      horas_teoricas: course.horas_teoricas || 0,
      horas_practicas: course.horas_practicas || 0,
      ciclo_id: course.ciclo_id || '',
      docente_id: course.docente_id || '',
      is_active: course.is_active !== undefined ? course.is_active : true
    };
  },

  getCoursesByCycle: async (cycleId) => {
    return await adminCourseService.getCourses({ ciclo_id: cycleId });
  },

  getCoursesByTeacher: async (teacherId) => {
    return await adminCourseService.getCourses({ docente_id: teacherId });
  }
};

export default adminCourseService;