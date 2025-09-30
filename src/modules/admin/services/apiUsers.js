import api from "../../../shared/utils/axiosInstance";

// Mapeo de roles: frontend (mayúsculas) -> backend (minúsculas)
const ROLE_MAPPING = {
  'ADMIN': 'admin',
  'DOCENTE': 'docente', 
  'ESTUDIANTE': 'estudiante'
};

const adminUserService = {
  // ==================== CRUD COMPLETO DE USUARIOS ====================

  // GET - Obtener todos los usuarios con filtros avanzados
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Filtros básicos (convertir rol a minúsculas para el backend)
      if (filters.role) {
        params.append('role', ROLE_MAPPING[filters.role] || filters.role);
      }
      
      if (filters.include_inactive !== undefined) {
        params.append('include_inactive', filters.include_inactive.toString());
      }
      
      // Filtros de búsqueda
      if (filters.search) params.append('search', filters.search);
      if (filters.dni) params.append('dni', filters.dni);
      if (filters.email) params.append('email', filters.email);
      
      // Filtros de fecha
      if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde);
      if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta);
      
      // Paginación
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const url = `/admin/usuarios${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // GET - Obtener usuarios por rol específico
  getUsersByRole: async (role, filters = {}) => {
    return await adminUserService.getUsers({ ...filters, role });
  },

  // GET - Obtener solo docentes
  getTeachers: async (filters = {}) => {
    return await adminUserService.getUsersByRole('DOCENTE', filters);
  },

  // GET - Obtener solo estudiantes
  getStudents: async (filters = {}) => {
    return await adminUserService.getUsersByRole('ESTUDIANTE', filters);
  },

  // GET - Obtener solo administradores
  getAdmins: async (filters = {}) => {
    return await adminUserService.getUsersByRole('ADMIN', filters);
  },

  // GET - Obtener usuario por ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/admin/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // POST - Crear nuevo usuario (CORREGIDO - convertir rol a minúsculas)
  createUser: async (userData) => {
    try {
      // Validar datos requeridos
      const errors = adminUserService.validateUserData(userData, false);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }

      const userPayload = {
        dni: userData.dni,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone || '',
        password: userData.password,
        role: ROLE_MAPPING[userData.role] || userData.role, // Convertir a minúsculas
        is_active: userData.is_active !== undefined ? userData.is_active : true
      };

      console.log('Creating user with payload:', userPayload);
      const response = await api.post('/admin/usuarios', userPayload);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // POST - Crear nuevo docente (convenience method)
  createTeacher: async (teacherData) => {
    return await adminUserService.createUser({
      ...teacherData,
      role: 'DOCENTE' // Se convertirá automáticamente a 'docente'
    });
  },

  // POST - Crear nuevo estudiante (convenience method)
  createStudent: async (studentData) => {
    return await adminUserService.createUser({
      ...studentData,
      role: 'ESTUDIANTE' // Se convertirá automáticamente a 'estudiante'
    });
  },

  // POST - Crear nuevo administrador (convenience method)
  createAdmin: async (adminData) => {
    return await adminUserService.createUser({
      ...adminData,
      role: 'ADMIN' // Se convertirá automáticamente a 'admin'
    });
  },

  // PUT - Actualizar usuario (CORREGIDO - convertir rol a minúsculas)
  updateUser: async (userId, userData) => {
    try {
      // Validar solo los campos que se están enviando para actualizar
      const errors = adminUserService.validateUserDataForUpdate(userData);
      if (errors.length > 0) {
        throw new Error(`Errores de validación: ${errors.join(', ')}`);
      }
  
      const updatePayload = {};
  
      // Solo incluir campos que están presentes en userData
      if (userData.dni !== undefined) updatePayload.dni = userData.dni;
      if (userData.email !== undefined) updatePayload.email = userData.email;
      if (userData.first_name !== undefined) updatePayload.first_name = userData.first_name;
      if (userData.last_name !== undefined) updatePayload.last_name = userData.last_name;
      if (userData.phone !== undefined) updatePayload.phone = userData.phone;
      if (userData.is_active !== undefined) updatePayload.is_active = userData.is_active;
  
      // Solo incluir password si se proporciona
      if (userData.password) {
        updatePayload.password = userData.password;
      }
  
      // Solo incluir role si se proporciona (convertir a minúsculas)
      if (userData.role) {
        updatePayload.role = ROLE_MAPPING[userData.role] || userData.role;
      }
  
      console.log('Updating user with payload:', updatePayload);
      const response = await api.put(`/admin/usuarios/${userId}`, updatePayload);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // DELETE - Eliminar usuario (soft delete)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // PUT - Activar usuario
  activateUser: async (userId) => {
    try {
      const response = await api.put(`/admin/usuarios/${userId}`, {
        is_active: true
      });
      return response.data;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  },

  // PUT - Desactivar usuario
  deactivateUser: async (userId) => {
    try {
      const response = await api.put(`/admin/usuarios/${userId}`, {
        is_active: false
      });
      return response.data;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  },

  // ==================== OPERACIONES MASIVAS ====================

  // POST - Operación masiva general (CORREGIDO - convertir roles)
  bulkOperation: async (userIds, action, additionalData = {}) => {
    try {
      const payload = {
        usuario_ids: userIds,
        accion: action,
        ...additionalData
      };
      
      // Convertir rol si es una operación de cambio de rol
      if (action === 'change_role' && additionalData.nuevo_rol) {
        payload.nuevo_rol = ROLE_MAPPING[additionalData.nuevo_rol] || additionalData.nuevo_rol;
      }

      const response = await api.post('/admin/usuarios/bulk-operation', payload);
      return response.data;
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      throw error;
    }
  },

  // Métodos específicos para operaciones masivas comunes
  activateUsers: async (userIds) => {
    return await adminUserService.bulkOperation(userIds, 'activate');
  },

  deactivateUsers: async (userIds) => {
    return await adminUserService.bulkOperation(userIds, 'deactivate');
  },

  deleteUsers: async (userIds) => {
    return await adminUserService.bulkOperation(userIds, 'delete');
  },

  changeRoleUsers: async (userIds, newRole) => {
    return await adminUserService.bulkOperation(userIds, 'change_role', { 
      nuevo_rol: newRole // Se convertirá automáticamente a minúsculas
    });
  },

  // ==================== ESTADÍSTICAS Y REPORTES ====================

  // GET - Obtener estadísticas de usuarios
  getUserStatistics: async () => {
    try {
      const [allUsers, activeUsers, teachers, students, admins] = await Promise.all([
        adminUserService.getUsers({ include_inactive: true }),
        adminUserService.getUsers({ include_inactive: false }),
        adminUserService.getTeachers(),
        adminUserService.getStudents(),
        adminUserService.getAdmins()
      ]);

      return {
        total_usuarios: allUsers.length,
        usuarios_activos: activeUsers.length,
        usuarios_inactivos: allUsers.length - activeUsers.length,
        total_docentes: teachers.length,
        total_estudiantes: students.length,
        total_administradores: admins.length,
        porcentaje_activos: allUsers.length > 0 ? ((activeUsers.length / allUsers.length) * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  },

  // GET - Obtener actividad reciente de usuarios
  getRecentActivity: async (limit = 10) => {
    try {
      const users = await adminUserService.getUsers({ 
        include_inactive: true,
        limit: limit,
        sort: 'created_at_desc'
      });
      
      return users.map(user => ({
        id: user.id,
        nombre: `${user.first_name} ${user.last_name}`,
        email: user.email,
        rol: user.role,
        estado: user.is_active ? 'Activo' : 'Inactivo',
        ultimo_login: user.last_login,
        fecha_creacion: user.created_at
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  },

  // ==================== VALIDACIONES Y UTILIDADES ====================

  // Validar datos para actualización (solo valida campos presentes)
  validateUserDataForUpdate: (userData) => {
    const errors = [];
  
    // Validar DNI solo si se está actualizando
    if (userData.dni !== undefined) {
      if (!userData.dni) {
        errors.push('El DNI es requerido');
      } else if (!/^\d{8}$/.test(userData.dni)) {
        errors.push('El DNI debe tener exactamente 8 dígitos');
      }
    }
  
    // Validar email solo si se está actualizando
    if (userData.email !== undefined) {
      if (!userData.email) {
        errors.push('El email es requerido');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        errors.push('El formato del email no es válido');
      }
    }
  
    // Validar nombres solo si se están actualizando
    if (userData.first_name !== undefined && (!userData.first_name || userData.first_name.trim().length < 2)) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
    if (userData.last_name !== undefined && (!userData.last_name || userData.last_name.trim().length < 2)) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }
  
    // Validar rol solo si se está actualizando
    if (userData.role && !['ADMIN', 'DOCENTE', 'ESTUDIANTE'].includes(userData.role)) {
      errors.push('Rol no válido');
    }
  
    // Validar contraseña solo si se está actualizando
    if (userData.password && userData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
  
    // Validar teléfono solo si se está actualizando
    if (userData.phone !== undefined && userData.phone && !/^[\d\s\-\+\(\)]{0,15}$/.test(userData.phone)) {
      errors.push('El formato del teléfono no es válido');
    }
  
    return errors;
  },

  // Validar datos del usuario
  validateUserData: (userData, isUpdate = false) => {
    if (isUpdate) {
      return adminUserService.validateUserDataForUpdate(userData);
    }
    
    // Validación estricta para creación
    const errors = [];

    // Validar DNI
    if (!userData.dni) {
      errors.push('El DNI es requerido');
    } else if (!/^\d{8}$/.test(userData.dni)) {
      errors.push('El DNI debe tener exactamente 8 dígitos');
    }

    // Validar email
    if (!userData.email) {
      errors.push('El email es requerido');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('El formato del email no es válido');
    }

    // Validar nombres
    if (!userData.first_name || userData.first_name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
    if (!userData.last_name || userData.last_name.trim().length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }

    // Validar rol
    if (!userData.role) {
      errors.push('El rol es requerido');
    } else if (!['ADMIN', 'DOCENTE', 'ESTUDIANTE'].includes(userData.role)) {
      errors.push('Rol no válido');
    }

    // Validar contraseña
    if (!userData.password) {
      errors.push('La contraseña es requerida');
    } else if (userData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    // Validar teléfono
    if (userData.phone && !/^[\d\s\-\+\(\)]{0,15}$/.test(userData.phone)) {
      errors.push('El formato del teléfono no es válido');
    }

    return errors;
  },

  // Formatear usuario para formulario
  formatUserForForm: (user) => {
    return {
      dni: user.dni || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      role: user.role || '',
      is_active: user.is_active !== undefined ? user.is_active : true,
      password: '' // No incluir contraseña actual
    };
  },

  // Preparar datos para API
  formatUserForAPI: (formData, isUpdate = false) => {
    const apiData = {
      dni: formData.dni,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      is_active: formData.is_active
    };

    if (!isUpdate) {
      apiData.role = ROLE_MAPPING[formData.role] || formData.role; // Convertir a minúsculas
      apiData.password = formData.password;
    } else if (formData.role) {
      apiData.role = ROLE_MAPPING[formData.role] || formData.role; // Convertir a minúsculas
    }

    if (isUpdate && formData.password) {
      apiData.password = formData.password;
    }

    return apiData;
  },

  // Buscar usuarios por diferentes criterios
  searchUsers: async (searchTerm, filters = {}) => {
    return await adminUserService.getUsers({
      ...filters,
      search: searchTerm
    });
  },

  // Verificar si email existe
  checkEmailExists: async (email, excludeUserId = null) => {
    try {
      const users = await adminUserService.getUsers({ email: email });
      if (excludeUserId) {
        return users.some(user => user.email === email && user.id !== excludeUserId);
      }
      return users.length > 0;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  },

  // Verificar si DNI existe
  checkDniExists: async (dni, excludeUserId = null) => {
    try {
      const users = await adminUserService.getUsers({ dni: dni });
      if (excludeUserId) {
        return users.some(user => user.dni === dni && user.id !== excludeUserId);
      }
      return users.length > 0;
    } catch (error) {
      console.error('Error checking DNI existence:', error);
      return false;
    }
  }
};

export default adminUserService;