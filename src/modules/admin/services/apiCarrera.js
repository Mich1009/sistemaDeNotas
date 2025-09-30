import api from "../../../shared/utils/axiosInstance";

const adminCareerService = {
  // ==================== CRUD CARRERAS ====================

  getCareers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.include_inactive !== undefined) {
        params.append('include_inactive', filters.include_inactive.toString());
      }
      if (filters.search) params.append('search', filters.search);
      if (filters.codigo) params.append('codigo', filters.codigo);
      
      const url = `/admin/carreras${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching careers:', error);
      throw error;
    }
  },

  getCareerById: async (careerId) => {
    try {
      const response = await api.get(`/admin/carreras/${careerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching career:', error);
      throw error;
    }
  },

  createCareer: async (careerData) => {
    try {
      const errors = adminCareerService.validateCareerData(careerData);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const payload = {
        nombre: careerData.nombre,
        codigo: careerData.codigo,
        descripcion: careerData.descripcion || '',
        duracion_ciclos: careerData.duracion_ciclos,
        is_active: careerData.is_active !== undefined ? careerData.is_active : true
      };

      const response = await api.post('/admin/carreras', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating career:', error);
      throw error;
    }
  },

  updateCareer: async (careerId, careerData) => {
    try {
      const errors = adminCareerService.validateCareerData(careerData, true);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const response = await api.put(`/admin/carreras/${careerId}`, careerData);
      return response.data;
    } catch (error) {
      console.error('Error updating career:', error);
      throw error;
    }
  },

  deleteCareer: async (careerId) => {
    try {
      const response = await api.delete(`/admin/carreras/${careerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting career:', error);
      throw error;
    }
  },

  // ==================== VALIDACIONES ====================

  validateCareerData: (careerData, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || careerData.nombre !== undefined) {
      if (!careerData.nombre || careerData.nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      }
    }

    if (!isUpdate || careerData.codigo !== undefined) {
      if (!careerData.codigo) {
        errors.push('El código es requerido');
      } else if (!/^[A-Z0-9]{2,10}$/.test(careerData.codigo)) {
        errors.push('El código debe contener solo letras mayúsculas y números (2-10 caracteres)');
      }
    }

    if (!isUpdate || careerData.duracion_ciclos !== undefined) {
      if (!careerData.duracion_ciclos || careerData.duracion_ciclos < 1) {
        errors.push('La duración en ciclos debe ser mayor a 0');
      }
    }

    return errors;
  },

  // ==================== UTILIDADES ====================

  formatCareerForForm: (career) => {
    return {
      nombre: career.nombre || '',
      codigo: career.codigo || '',
      descripcion: career.descripcion || '',
      duracion_ciclos: career.duracion_ciclos || 10,
      is_active: career.is_active !== undefined ? career.is_active : true
    };
  }
};

export default adminCareerService;