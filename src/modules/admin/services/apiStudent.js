import api from "../../../shared/utils/axiosInstance";

const adminStudentService = {
  // ==================== CRUD COMPLETO ====================

  // GET - Obtener todos los estudiantes
  getStudents: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Filtros
      if (filters.carrera_id) params.append('carrera_id', filters.carrera_id.toString());
      if (filters.ciclo_actual) params.append('ciclo_actual', filters.ciclo_actual);
      if (filters.include_inactive !== undefined) {
        params.append('include_inactive', filters.include_inactive.toString());
      }
      if (filters.search) params.append('search', filters.search);
      if (filters.dni) params.append('dni', filters.dni);
      if (filters.codigo_estudiante) params.append('codigo_estudiante', filters.codigo_estudiante);
      
      const url = `/admin/estudiantes${params.toString() ? `?${params.toString()}` : ''}`;
      
      // DEBUG: Ver qué se está enviando
      console.log(`🌐 GET ${url}`);
      console.log(`🔍 Filtros:`, filters);
      
      const response = await api.get(url);
      
      // DEBUG: Ver qué devuelve el backend
      console.log(`📨 Respuesta GET:`, response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      
      // Manejo seguro del error - convertir a string
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          // Si es un objeto, convertirlo a string seguro
          const errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
          throw new Error(errorMessage);
        }
      }
      
      throw error;
    }
  },

  // GET - Obtener estudiante por ID
  getStudentById: async (studentId) => {
    try {
      const response = await api.get(`/admin/estudiantes/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  // POST - Crear nuevo estudiante - CORREGIDO
  createStudent: async (studentData) => {
    try {
      // Validación del frontend
      const validationErrors = adminStudentService.validateStudentData(studentData, false);
      if (validationErrors.length > 0) {
        // ✅ Convertir a string seguro
        const errorMessage = validationErrors.join(', ');
        throw new Error(`Errores de validación: ${errorMessage}`);
      }

      const payload = {
        dni: studentData.dni,
        codigo_estudiante: studentData.codigo_estudiante,
        email: studentData.email,
        email_institucional: studentData.email_institucional || '',
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        phone: studentData.phone || '',
        ciclo_actual: studentData.ciclo_actual || '',
        carrera_id: studentData.carrera_id || null,
        password: studentData.password,
        is_active: studentData.is_active !== undefined ? studentData.is_active : true
      };

      console.log(`📤 Enviando POST a /admin/estudiantes:`, payload);

      const response = await api.post('/admin/estudiantes', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      
      // ✅ MANEJO SEGURO DE ERRORES DEL BACKEND
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Si el backend devuelve un objeto de error, convertirlo a string seguro
        if (typeof errorData === 'object') {
          let errorMessage = 'Error del servidor';
          
          // Manejar diferentes formatos de error del backend
          if (errorData.detail) {
            // Formato FastAPI común
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map(err => err.msg || JSON.stringify(err)).join(', ');
            } else {
              errorMessage = errorData.detail;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else {
            errorMessage = JSON.stringify(errorData);
          }
          
          throw new Error(errorMessage);
        }
      }
      
      throw error;
    }
  },

  // PUT - Actualizar estudiante - CORREGIDO (solo campos modificados)
  updateStudent: async (studentId, studentData) => {
    try {
      // ✅ Validación más flexible para update
      const validationErrors = adminStudentService.validateStudentData(studentData, true);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        throw new Error(`Errores de validación: ${errorMessage}`);
      }
  
      // ✅ SOLO incluir campos que tienen valores (no vacíos/undefined)
      const payload = {};
      
      // Solo agregar campos que tienen valores
      if (studentData.dni && studentData.dni.trim() !== '') 
        payload.dni = studentData.dni;
      
      if (studentData.codigo_estudiante && studentData.codigo_estudiante.trim() !== '') 
        payload.codigo_estudiante = studentData.codigo_estudiante;
      
      if (studentData.email && studentData.email.trim() !== '') 
        payload.email = studentData.email;
      
      if (studentData.email_institucional && studentData.email_institucional.trim() !== '') 
        payload.email_institucional = studentData.email_institucional;
      
      if (studentData.first_name && studentData.first_name.trim() !== '') 
        payload.first_name = studentData.first_name;
      
      if (studentData.last_name && studentData.last_name.trim() !== '') 
        payload.last_name = studentData.last_name;
      
      if (studentData.phone && studentData.phone.trim() !== '') 
        payload.phone = studentData.phone;
      
      if (studentData.ciclo_actual && studentData.ciclo_actual.trim() !== '') 
        payload.ciclo_actual = studentData.ciclo_actual;
      
      if (studentData.carrera_id !== undefined && studentData.carrera_id !== null && studentData.carrera_id !== '') 
        payload.carrera_id = studentData.carrera_id;
      
      if (studentData.is_active !== undefined) 
        payload.is_active = studentData.is_active;
      
      // Solo incluir password si se proporciona y no está vacío
      if (studentData.password && studentData.password.trim() !== '') {
        payload.password = studentData.password;
      }
  
      // ✅ DEBUG: Ver qué se está enviando
      console.log(`🔄 PUT /admin/estudiantes/${studentId}:`, payload);
  
      const response = await api.put(`/admin/estudiantes/${studentId}`, payload);
      
      // ✅ DEBUG: Ver respuesta
      console.log(`✅ Respuesta UPDATE:`, response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error updating student:', error);
      
      // ✅ DEBUG más detallado del error
      if (error.response) {
        console.error('📊 Error response status:', error.response.status);
        console.error('📊 Error response data:', error.response.data);
        console.error('📊 Error response headers:', error.response.headers);
      }
      
      // ✅ MANEJO SEGURO DE ERRORES DEL BACKEND
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
          throw new Error(errorMessage);
        } else if (typeof errorData === 'string') {
          throw new Error(errorData);
        }
      }
      
      throw error;
    }
  },

  // DELETE - Eliminar estudiante
  deleteStudent: async (studentId) => {
    try {
      const response = await api.delete(`/admin/estudiantes/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  // ==================== OPERACIONES MASIVAS ====================

  bulkOperation: async (studentIds, action) => {
    try {
      const response = await api.post('/admin/estudiantes/bulk-operation', {
        estudiante_ids: studentIds,
        accion: action
      });
      return response.data;
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      throw error;
    }
  },

  activateStudents: async (studentIds) => {
    return await adminStudentService.bulkOperation(studentIds, 'activate');
  },

  deactivateStudents: async (studentIds) => {
    return await adminStudentService.bulkOperation(studentIds, 'deactivate');
  },

  deleteStudents: async (studentIds) => {
    return await adminStudentService.bulkOperation(studentIds, 'delete');
  },

  // ==================== VALIDACIONES ====================

  validateStudentData: (studentData, isUpdate = false) => {
    const errors = [];

    // Validar DNI
    if (!isUpdate || studentData.dni !== undefined) {
      if (!studentData.dni) {
        errors.push('El DNI es requerido');
      } else if (!/^\d{8}$/.test(studentData.dni)) {
        errors.push('El DNI debe tener exactamente 8 dígitos');
      }
    }

    // Validar código de estudiante
    if (!isUpdate || studentData.codigo_estudiante !== undefined) {
      if (!studentData.codigo_estudiante) {
        errors.push('El código de estudiante es requerido');
      } else if (studentData.codigo_estudiante.length < 3) {
        errors.push('El código de estudiante debe tener al menos 3 caracteres');
      }
    }

    // Validar email
    if (!isUpdate || studentData.email !== undefined) {
      if (!studentData.email) {
        errors.push('El email es requerido');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
        errors.push('El formato del email no es válido');
      }
    }

    // Validar nombres
    if (!studentData.first_name || studentData.first_name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!studentData.last_name || studentData.last_name.trim().length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }

    // Validar contraseña (solo para creación)
    if (!isUpdate && !studentData.password) {
      errors.push('La contraseña es requerida');
    } else if (!isUpdate && studentData.password && studentData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    // Validar teléfono (opcional)
    if (studentData.phone && !/^[\d\s\-\+\(\)]{0,15}$/.test(studentData.phone)) {
      errors.push('El formato del teléfono no es válido');
    }

    return errors;
  },

  // ==================== UTILIDADES ====================

  formatStudentForForm: (student) => {
    return {
      dni: student.dni || '',
      codigo_estudiante: student.codigo_estudiante || '',
      email: student.email || '',
      email_institucional: student.email_institucional || '',
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      phone: student.phone || '',
      ciclo_actual: student.ciclo_actual || '',
      carrera_id: student.carrera_id || '',
      is_active: student.is_active !== undefined ? student.is_active : true,
      password: ''
    };
  },

  canDeleteStudent: async (studentId) => {
    try {
      const response = await api.get(`/admin/matriculas?estudiante_id=${studentId}`);
      const enrollments = response.data;
      
      const activeEnrollments = enrollments.filter(e => e.estado === 'activa');
      return {
        canDelete: activeEnrollments.length === 0,
        activeEnrollments: activeEnrollments.length,
        message: activeEnrollments.length > 0 
          ? `No se puede eliminar el estudiante. Tiene ${activeEnrollments.length} matrícula(s) activa(s).`
          : 'El estudiante puede ser eliminado.'
      };
    } catch (error) {
      console.error('Error checking if student can be deleted:', error);
      return {
        canDelete: false,
        activeEnrollments: 0,
        message: 'Error al verificar las matrículas del estudiante'
      };
    }
  },

  searchStudents: async (searchTerm, filters = {}) => {
    return await adminStudentService.getStudents({
      ...filters,
      search: searchTerm
    });
  },

  // Verificar si DNI existe - VERSIÓN MEJORADA
  // Verificar si DNI existe - VERSIÓN CON FILTRADO MANUAL
  checkDniExists: async (dni, excludeStudentId = null) => {
      try {
        console.log(`🔍 Verificando DNI: ${dni}, excluyendo: ${excludeStudentId}`);
        
        const students = await adminStudentService.getStudents({ dni: dni });
        console.log(`📊 Estudiantes encontrados con filtro DNI ${dni}:`, students);
        
        // ✅ FILTRADO MANUAL - porque el backend no está filtrando
        const filteredStudents = students.filter(student => student.dni === dni);
        console.log(`🎯 Estudiantes con DNI exacto ${dni}:`, filteredStudents);
        
        if (!filteredStudents || filteredStudents.length === 0) {
          console.log(`✅ DNI ${dni} NO existe`);
          return false;
        }
    
        if (excludeStudentId) {
          const otherStudentWithSameDni = filteredStudents.find(student => 
            student.id !== excludeStudentId
          );
          console.log(`🔄 Otro estudiante con mismo DNI:`, !!otherStudentWithSameDni);
          return !!otherStudentWithSameDni;
        }
    
        console.log(`❌ DNI ${dni} existe: true`);
        return true;
        
      } catch (error) {
        console.error('Error checking DNI existence:', error);
        return false;
      }
    },
  checkStudentCodeExists: async (code, excludeStudentId = null) => {
    try {
      console.log(`🔍 Verificando código: ${code}, excluyendo: ${excludeStudentId}`);
      
      const students = await adminStudentService.getStudents({ codigo_estudiante: code });
      
      if (!Array.isArray(students)) {
        console.log(`✅ Código ${code} NO existe (respuesta no es array)`);
        return false;
      }
      
      console.log(`📊 Estudiantes encontrados con código ${code}:`, students);
      
      if (students.length === 0) {
        console.log(`✅ Código ${code} NO existe`);
        return false;
      }

      if (excludeStudentId) {
        const otherStudentWithSameCode = students.find(student => 
          student.codigo_estudiante === code && student.id !== excludeStudentId
        );
        console.log(`🔄 Otro estudiante con mismo código:`, !!otherStudentWithSameCode);
        return !!otherStudentWithSameCode;
      }

      const exactMatch = students.find(student => student.codigo_estudiante === code);
      console.log(`❌ Código ${code} existe:`, !!exactMatch);
      return !!exactMatch;
      
    } catch (error) {
      console.error('Error checking student code existence:', error);
      return false;
    }
  },

 checkEmailExists: async (email, excludeStudentId = null) => {
  try {
    console.log(`🔍 Verificando email: ${email}, excluyendo: ${excludeStudentId}`);
    
    // ✅ CORREGIDO: Pasar el filtro email correctamente
    const students = await adminStudentService.getStudents({ search: email });
    // O si el backend tiene un filtro específico para email:
    // const students = await adminStudentService.getStudents({ email: email });
    
    if (!Array.isArray(students)) {
      console.log(`✅ Email ${email} NO existe (respuesta no es array)`);
      return false;
    }
    
    console.log(`📊 Estudiantes encontrados con email ${email}:`, students);
    
    // ✅ FILTRADO MANUAL MEJORADO - buscar email exacto
    const studentsWithEmail = students.filter(student => 
      student.email && student.email.toLowerCase() === email.toLowerCase()
    );
    
    console.log(`🎯 Estudiantes con email exacto ${email}:`, studentsWithEmail);
    
    if (studentsWithEmail.length === 0) {
      console.log(`✅ Email ${email} NO existe`);
      return false;
    }

    if (excludeStudentId) {
      // ✅ Para actualización: buscar otros estudiantes con el mismo email
      const otherStudentWithSameEmail = studentsWithEmail.find(student => 
        student.id !== excludeStudentId
      );
      console.log(`🔄 Otro estudiante con mismo email:`, !!otherStudentWithSameEmail);
      return !!otherStudentWithSameEmail;
    }

    // ✅ Para creación: si existe cualquier estudiante con ese email
    console.log(`❌ Email ${email} existe: true`);
    return true;
    
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
}
}

export default adminStudentService;