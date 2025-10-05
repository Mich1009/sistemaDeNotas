import React, { useState } from "react";
import { User } from "lucide-react";
import useAuthStore from "../../auth/store/authStore";
import { updatePerfil } from "../services/apiActPerfil";

const Profile = () => {
  const { user, updateUser } = useAuthStore();

  // Estado inicial con los datos del usuario
  const [form, setForm] = useState({
    id: user?.id || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    fecha_nacimiento: user?.fecha_nacimiento
      ? user.fecha_nacimiento.split("T")[0]
      : "",
    direccion: user?.direccion || "",
    nombre_apoderado: user?.nombre_apoderado || "",
    telefono_apoderado: user?.telefono_apoderado || "",
    password: "", // Solo mostrar, no editar
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Actualizar perfil
  const handleUpdate = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Crear un objeto solo con los campos no vacíos
      const dataToSend = Object.fromEntries(
        Object.entries({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          fecha_nacimiento: form.fecha_nacimiento,
          direccion: form.direccion,
          nombre_apoderado: form.nombre_apoderado,
          telefono_apoderado: form.telefono_apoderado,
          password: form.password, // opcional
        }).filter(([_, v]) => v !== "" && v !== null)
      );

      if (!form.id) {
        throw new Error("El ID del estudiante es requerido para actualizar.");
      }

      // Llamar a la API
      const updatedUser = await updatePerfil.updateEstudiante(form.id, dataToSend);

      // Actualizar usuario global
      updateUser(updatedUser);

      setMessage({
        type: "success",
        text: "Perfil actualizado correctamente ✅",
      });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.detail ||
          err.message ||
          "Error al actualizar el perfil ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <User size={64} className="mx-auto text-indigo-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {user?.first_name} {user?.last_name}
        </h2>
        <p className="text-gray-600 mb-4">
          Aqui puedes actualizar tu perfil de estudiante.
        </p>

        {message && (
          <div
            className={`mb-4 p-2 rounded text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Formulario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
          {/* ID del usuario (solo lectura) */}

          <input
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Nombres"
          />

          <input
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Apellidos"
          />

          <input
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo"
          />

          <input
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
          />

          <input
            type="date"
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
          />

          <input
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Dirección"
          />

          <input
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="nombre_apoderado"
            value={form.nombre_apoderado}
            onChange={handleChange}
            placeholder="Nombre del apoderado"
          />

          <input
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            name="telefono_apoderado"
            value={form.telefono_apoderado}
            onChange={handleChange}
            placeholder="Teléfono del apoderado"
          />

          {/* Contraseña (encriptada, solo lectura) */}
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full bg-White-100"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña (encriptada)"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`mt-6 px-6 py-2 rounded text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
