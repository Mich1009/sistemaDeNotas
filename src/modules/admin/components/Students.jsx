import React, { useState, useEffect } from "react";
import adminStudentService from "../services/apiStudent"; 

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    dni: "",
    codigo_estudiante: "",
    email: "",
    email_institucional: "",
    first_name: "",
    last_name: "",
    ciclo_actual: "",
    carrera_id: "",
    phone: "",
    password: "",
    is_active: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Cargar estudiantes al inicio
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await adminStudentService.getStudents();
      console.log("estudiantes:", data);
      setStudents(data);
    } catch (error) {
      console.error("Error al cargar estudiantes", error);
      alert("Error al cargar estudiantes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    try {
      // Validar que todos los campos requeridos estén completos
      if (!newStudent.dni || !newStudent.codigo_estudiante || !newStudent.email || 
          !newStudent.first_name || !newStudent.last_name || !newStudent.password) {
        alert("Por favor complete todos los campos requeridos");
        return;
      }

      // Validar que la contraseña tenga al menos 6 caracteres
      if (newStudent.password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      // Usar la validación del servicio
      const validationErrors = adminStudentService.validateStudentData(newStudent, false);
      if (validationErrors.length > 0) {
        alert(`Errores de validación:\n${validationErrors.join('\n')}`);
        return;
      }

      // DEBUG: Ver qué devuelve la búsqueda
      console.log("🔍 Verificando DNI:", newStudent.dni);
      const testStudents = await adminStudentService.getStudents({ dni: newStudent.dni });
      console.log("📊 Resultados de búsqueda:", testStudents);

      // Verificar si el DNI ya existe
      const dniExists = await adminStudentService.checkDniExists(newStudent.dni);
      console.log("❓ DNI existe:", dniExists);
      
      if (dniExists) {
        alert("El DNI ya está registrado");
        return;
      }

      // Verificar si el código de estudiante ya existe
      const codeExists = await adminStudentService.checkStudentCodeExists(newStudent.codigo_estudiante);
      if (codeExists) {
        alert("El código de estudiante ya está registrado");
        return;
      }

      // Verificar si el email ya existe
      const emailExists = await adminStudentService.checkEmailExists(newStudent.email);
      if (emailExists) {
        alert("El email ya está registrado");
        return;
      }

      const payload = {
        ...newStudent,
        phone: newStudent.phone || "",
        ciclo_actual: newStudent.ciclo_actual || "",
        carrera_id: newStudent.carrera_id || null,
        email_institucional: newStudent.email_institucional || "",
      };

      await adminStudentService.createStudent(payload);
      
      alert("Estudiante agregado exitosamente");

      // Resetear formulario
      setNewStudent({
        dni: "",
        codigo_estudiante: "",
        email: "",
        email_institucional: "",
        first_name: "",
        last_name: "",
        ciclo_actual: "",
        carrera_id: "",
        phone: "",
        password: "",
        is_active: true,
      });

      fetchStudents();
    } catch (error) {
      console.error("Error al agregar estudiante", error);
      alert("Error al agregar estudiante: " + error.message);
    }
  };

  const handleEditStudent = async () => {
    if (!editingStudent) return;
  
    try {
      console.log("🔄 Iniciando actualización del estudiante:", editingStudent);
      
      // ✅ VERIFICAR QUE EL ID EXISTA
      if (!editingStudent.id) {
        console.error("❌ Error: editingStudent.id es undefined", editingStudent);
        alert("Error: No se puede actualizar el estudiante (ID no encontrado)");
        return;
      }
  
      console.log("✅ ID del estudiante a actualizar:", editingStudent.id);
  
      const validationErrors = adminStudentService.validateStudentData(editingStudent, true);
      if (validationErrors.length > 0) {
        alert(`Errores de validación:\n${validationErrors.join('\n')}`);
        return;
      }
  
      // ✅ SOLO enviar campos que realmente cambiaron
      const payload = {};
      
      // Solo agregar campos que tienen valores
      if (editingStudent.dni && editingStudent.dni.trim() !== '') 
        payload.dni = editingStudent.dni;
      
      if (editingStudent.codigo_estudiante && editingStudent.codigo_estudiante.trim() !== '') 
        payload.codigo_estudiante = editingStudent.codigo_estudiante;
      
      if (editingStudent.email && editingStudent.email.trim() !== '') 
        payload.email = editingStudent.email;
      
      if (editingStudent.email_institucional && editingStudent.email_institucional.trim() !== '') 
        payload.email_institucional = editingStudent.email_institucional;
      
      if (editingStudent.first_name && editingStudent.first_name.trim() !== '') 
        payload.first_name = editingStudent.first_name;
      
      if (editingStudent.last_name && editingStudent.last_name.trim() !== '') 
        payload.last_name = editingStudent.last_name;
      
      if (editingStudent.phone && editingStudent.phone.trim() !== '') 
        payload.phone = editingStudent.phone;
      
      if (editingStudent.ciclo_actual && editingStudent.ciclo_actual.trim() !== '') 
        payload.ciclo_actual = editingStudent.ciclo_actual;
      
      if (editingStudent.carrera_id !== undefined && editingStudent.carrera_id !== null && editingStudent.carrera_id !== '') 
        payload.carrera_id = editingStudent.carrera_id;
      
      if (editingStudent.is_active !== undefined) 
        payload.is_active = editingStudent.is_active;
      
      // Solo incluir contraseña si se proporcionó una nueva
      if (editingStudent.password && editingStudent.password.trim() !== '') {
        payload.password = editingStudent.password;
      }
  
      console.log('📤 Enviando actualización con ID:', editingStudent.id, 'Payload:', payload);
  
      // ✅ PASAR editingStudent.id EXPLÍCITAMENTE
      await adminStudentService.updateStudent(editingStudent.id, payload);
      
      alert("Estudiante actualizado exitosamente");
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("❌ Error al actualizar estudiante", error);
      alert("Error al actualizar estudiante: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este estudiante?")) return;
    
    try {
      // Verificar si el estudiante puede ser eliminado
      const canDelete = await adminStudentService.canDeleteStudent(id);
      if (!canDelete.canDelete) {
        alert(canDelete.message);
        return;
      }

      await adminStudentService.deleteStudent(id);
      alert("Estudiante eliminado exitosamente");
      fetchStudents();
    } catch (error) {
      console.error("Error al eliminar estudiante", error);
      alert("Error al eliminar estudiante: " + error.message);
    }
  };

  const handleToggleStatus = async (id, student) => {
    try {
      await adminStudentService.updateStudent(id, {
        ...student,
        is_active: !student.is_active,
      });
      alert(`Estudiante ${!student.is_active ? 'activado' : 'desactivado'} exitosamente`);
      fetchStudents();
    } catch (error) {
      console.error("Error al cambiar estado del estudiante", error);
      alert("Error al cambiar estado: " + error.message);
    }
  };

  const startEditing = (student) => {
    console.log("📝 Iniciando edición del estudiante:", student);
    
    // ✅ VERIFICAR QUE EL ID EXISTA
    if (!student.id) {
      console.error("❌ Error: El estudiante no tiene ID", student);
      alert("Error: No se puede editar este estudiante (falta ID)");
      return;
    }
    
    // ✅ CREAR OBJETO DIRECTAMENTE (sin usar formatStudentForForm)
    const studentForEditing = {
      id: student.id, // ✅ MANTENER EL ID
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
      password: '' // Contraseña vacía para edición
    };
    
    console.log("🎯 Estudiante listo para edición:", studentForEditing);
    setEditingStudent(studentForEditing);
  };
    
  const cancelEditing = () => {
    setEditingStudent(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Gestión de Estudiantes
      </h2>

      {/* Formulario para agregar/editar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {editingStudent ? "Editar Estudiante" : "Agregar Estudiante"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="DNI * (8 dígitos)"
            value={editingStudent ? editingStudent.dni : newStudent.dni}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, dni: e.target.value })
                : setNewStudent({ ...newStudent, dni: e.target.value })
            }
            className="border rounded p-2 text-white-800"
            maxLength="8"
          />
          <input
            type="text"
            placeholder="Código Estudiante *"
            value={editingStudent ? editingStudent.codigo_estudiante : newStudent.codigo_estudiante}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, codigo_estudiante: e.target.value })
                : setNewStudent({ ...newStudent, codigo_estudiante: e.target.value })
            }
            className="border rounded p-2 text-white-800"
          />
          <input
            type="email"
            placeholder="Email *"
            value={editingStudent ? editingStudent.email : newStudent.email}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, email: e.target.value })
                : setNewStudent({ ...newStudent, email: e.target.value })
            }
            className="border rounded p-2 text-white-800"
          />
          <input
            type="email"
            placeholder="Email Institucional"
            value={editingStudent ? editingStudent.email_institucional : newStudent.email_institucional}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, email_institucional: e.target.value })
                : setNewStudent({ ...newStudent, email_institucional: e.target.value })
            }
            className="border rounded p-2 text-white-800"
          />
          <input
            type="text"
            placeholder="Nombre *"
            value={editingStudent ? editingStudent.first_name : newStudent.first_name}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, first_name: e.target.value })
                : setNewStudent({ ...newStudent, first_name: e.target.value })
            }
            className="border rounded p-2 text-white-800"
          />
          <input
            type="text"
            placeholder="Apellido *"
            value={editingStudent ? editingStudent.last_name : newStudent.last_name}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, last_name: e.target.value })
                : setNewStudent({ ...newStudent, last_name: e.target.value })
            }
            className="border rounded p-2 text-white-800"
          />
          <input
            type="text"
            placeholder="Ciclo Actual"
            value={editingStudent ? editingStudent.ciclo_actual : newStudent.ciclo_actual}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, ciclo_actual: e.target.value })
                : setNewStudent({ ...newStudent, ciclo_actual: e.target.value })
            }
            className="border rounded p-2 text-white-800"
          />
          <input
            type="text"
            placeholder="Carrera ID"
            value={editingStudent ? editingStudent.carrera_id : newStudent.carrera_id}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, carrera_id: e.target.value })
                : setNewStudent({ ...newStudent, carrera_id: e.target.value })
            }
            className="border rounded p-2 text-white-800"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={editingStudent ? editingStudent.phone : newStudent.phone}
            onChange={(e) =>
              editingStudent
                ? setEditingStudent({ ...editingStudent, phone: e.target.value })
                : setNewStudent({ ...newStudent, phone: e.target.value })
            }
            className="border rounded p-2 text-white-800"
          />
          {!editingStudent && (
            <div className="col-span-2">

              <div className="flex gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese la contraseña (mín. 6 caracteres)"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="border rounded p-2 flex-1 text-white-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                La contraseña debe tener al menos 6 caracteres
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 space-x-2">
          {editingStudent ? (
            <>
              <button
                onClick={handleEditStudent}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Guardar Cambios
              </button>
              <button
                onClick={cancelEditing}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleAddStudent}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Agregar Estudiante
            </button>
          )}
        </div>
      </div>

      {/* Tabla de estudiantes - CORREGIDA CON COLORES VISIBLES */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 text-gray-800 font-semibold">ID</th>
              <th className="p-2 text-gray-800 font-semibold">DNI</th>
              <th className="p-2 text-gray-800 font-semibold">Código</th>
              <th className="p-2 text-gray-800 font-semibold">Nombre</th>
              <th className="p-2 text-gray-800 font-semibold">Email</th>
              <th className="p-2 text-gray-800 font-semibold">Ciclo</th>
              <th className="p-2 text-gray-800 font-semibold">Carrera</th>
              <th className="p-2 text-gray-800 font-semibold">Activo</th>
              <th className="p-2 text-gray-800 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-800">
                  Cargando...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-800">
                  No hay estudiantes registrados
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-gray-800">{student.id}</td>
                  <td className="p-2 text-gray-800">{student.dni}</td>
                  <td className="p-2 text-gray-800">{student.codigo_estudiante}</td>
                  <td className="p-2 text-gray-800">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="p-2 text-gray-800">{student.email}</td>
                  <td className="p-2 text-gray-800">{student.ciclo_actual || "-"}</td>
                  <td className="p-2 text-gray-800">{student.carrera_id || "-"}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      student.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {student.is_active ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => startEditing(student)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleStatus(student.id, student)}
                      className={`px-3 py-1 rounded text-sm ${
                        student.is_active
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {student.is_active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;