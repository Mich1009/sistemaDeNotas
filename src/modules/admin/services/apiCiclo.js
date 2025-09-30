import api from "../../../shared/utils/axiosInstance";

const adminCycleService = {
  // ==================== CRUD CICLOS ====================

  getCycles: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.carrera_id) params.append('carrera_id', filters.carrera_id);
      if (filters.include_inactive !== undefined) {
        params.append('include_inactive', filters.include_inactive.toString());
      }
      if (filters.search) params.append('search', filters.search);
      
      const url = `/admin/ciclos${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching cycles:', error);
      throw error;
    }
  },

  getCycleById: async (cycleId) => {
    try {
      const response = await api.get(`/admin/ciclos/${cycleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cycle:', error);
      throw error;
    }
  },

  createCycle: async (cycleData) => {
    try {
      const errors = adminCycleService.validateCycleData(cycleData);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const payload = {
        numero: cycleData.numero,
        carrera_id: cycleData.carrera_id,
        nombre: cycleData.nombre,
        descripcion: cycleData.descripcion || '',
        is_active: cycleData.is_active !== undefined ? cycleData.is_active : true
      };

      const response = await api.post('/admin/ciclos', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating cycle:', error);
      throw error;
    }
  },

  updateCycle: async (cycleId, cycleData) => {
    try {
      const errors = adminCycleService.validateCycleData(cycleData, true);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const response = await api.put(`/admin/ciclos/${cycleId}`, cycleData);
      return response.data;
    } catch (error) {
      console.error('Error updating cycle:', error);
      throw error;
    }
  },

  deleteCycle: async (cycleId) => {
    try {
      const response = await api.delete(`/admin/ciclos/${cycleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting cycle:', error);
      throw error;
    }
  },

  // ==================== VALIDACIONES ====================

  validateCycleData: (cycleData, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || cycleData.numero !== undefined) {
      if (!cycleData.numero || cycleData.numero < 1) {
        errors.push('El número de ciclo debe ser mayor a 0');
      }
    }

    if (!isUpdate || cycleData.carrera_id !== undefined) {
      if (!cycleData.carrera_id) {
        errors.push('La carrera es requerida');
      }
    }

    if (!isUpdate || cycleData.nombre !== undefined) {
      if (!cycleData.nombre || cycleData.nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      }
    }

    return errors;
  },

  // ==================== UTILIDADES ====================

  formatCycleForForm: (cycle) => {
    return {
      numero: cycle.numero || 1,
      carrera_id: cycle.carrera_id || '',
      nombre: cycle.nombre || '',
      descripcion: cycle.descripcion || '',
      is_active: cycle.is_active !== undefined ? cycle.is_active : true
    };
  },

  getCyclesByCareer: async (careerId) => {
    return await adminCycleService.getCycles({ carrera_id: careerId });
  }
};

export default adminCycleService;