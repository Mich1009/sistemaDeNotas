import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, CreditCard, Eye, EyeOff, Calendar, MapPin, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const EstudianteModal = ({ isOpen, onClose, onSubmit, mode = 'create', initialData = null }) => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        dni: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        direccion: '',
        nombre_apoderado: '',
        telefono_apoderado: '',
        password: '',
        confirmPassword: ''
    });

    // Efecto para pre-llenar el formulario en modo edición
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                nombres: initialData.first_name || '',
                apellidos: initialData.last_name || '',
                dni: initialData.dni || '',
                email: initialData.email || '',
                telefono: initialData.phone || '',
                fecha_nacimiento: initialData.fecha_nacimiento || '',
                direccion: initialData.direccion || '',
                nombre_apoderado: initialData.nombre_apoderado || '',
                telefono_apoderado: initialData.telefono_apoderado || '',
                password: '',
                confirmPassword: ''
            });
        } else if (mode === 'create') {
            setFormData({
                nombres: '',
                apellidos: '',
                dni: '',
                email: '',
                telefono: '',
                fecha_nacimiento: '',
                direccion: '',
                nombre_apoderado: '',
                telefono_apoderado: '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [mode, initialData, isOpen]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validaciones
    const validateForm = () => {
        const newErrors = {};

        // Campos obligatorios
        if (!formData.nombres.trim()) {
            newErrors.nombres = 'Los nombres son obligatorios';
        }

        if (!formData.apellidos.trim()) {
            newErrors.apellidos = 'Los apellidos son obligatorios';
        }

        if (!formData.dni.trim()) {
            newErrors.dni = 'El DNI es obligatorio';
        } else if (!/^\d{8}$/.test(formData.dni)) {
            newErrors.dni = 'El DNI debe tener exactamente 8 dígitos';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no tiene un formato válido';
        }

        // Validación de fecha de nacimiento
        if (formData.fecha_nacimiento) {
            const birthDate = new Date(formData.fecha_nacimiento);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 16 || age > 100) {
                newErrors.fecha_nacimiento = 'La edad debe estar entre 16 y 100 años';
            }
        }

        // Validación de teléfono (opcional pero si se proporciona debe ser válido)
        if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono debe tener 9 dígitos';
        }

        // Validación de teléfono del apoderado (opcional pero si se proporciona debe ser válido)
        if (formData.telefono_apoderado && !/^\d{9}$/.test(formData.telefono_apoderado)) {
            newErrors.telefono_apoderado = 'El teléfono del apoderado debe tener 9 dígitos';
        }

        // Validaciones de contraseña solo en modo crear
        if (mode === 'create') {
            if (!formData.password) {
                newErrors.password = 'La contraseña es obligatoria';
            } else if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Confirma la contraseña';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Por favor, corrige los errores en el formulario');
            return;
        }

        setIsSubmitting(true);

        try {
            // Preparar datos para enviar
            const { confirmPassword, nombres, apellidos, telefono, password, ...estudianteData } = formData;
            
            let dataToSubmit;
            
            if (mode === 'create') {
                // Agregar el campo role requerido por el backend para crear
                dataToSubmit = {
                    ...estudianteData,
                    first_name: nombres,
                    last_name: apellidos,
                    phone: telefono,
                    password: password,
                    role: 'estudiante'
                };
            } else {
                // Para edición, no incluir password ni role
                dataToSubmit = {
                    ...estudianteData,
                    first_name: nombres,
                    last_name: apellidos,
                    phone: telefono
                };
            }
            
            // Llamar a la función onSubmit pasada como prop
            await onSubmit(dataToSubmit);
            
            // Resetear formulario solo si es modo crear
            if (mode === 'create') {
                setFormData({
                    nombres: '',
                    apellidos: '',
                    dni: '',
                    email: '',
                    telefono: '',
                    fecha_nacimiento: '',
                    direccion: '',
                    nombre_apoderado: '',
                    telefono_apoderado: '',
                    password: '',
                    confirmPassword: ''
                });
            }
            
            onClose();
        } catch (error) {
            console.error('Error al procesar estudiante:', error);
            toast.error(mode === 'create' ? 'Error al crear estudiante' : 'Error al actualizar estudiante');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Manejar cierre del modal
    const handleClose = () => {
        if (!isSubmitting) {
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{marginTop: 0}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-light">
                {/* Header */}
                <div className="flex items-center justify-between p-6 py-3 border-b border-secondary-200">
                    <h2 className="text-xl font-semibold text-secondary-900">
                        {mode === 'create' ? 'Registrar Nuevo Estudiante' : 'Editar Estudiante'}
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-secondary-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Información Personal */}
                    <div className="border-b border-secondary-200 pb-4">
                        <h3 className="text-lg font-medium text-secondary-900 mb-4">Información Personal</h3>
                        
                        {/* Nombres y Apellidos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="nombres" className="block text-sm font-medium text-secondary-700 mb-1">
                                    Nombres *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        id="nombres"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                             errors.nombres ? 'border-red-500' : 'border-gray-300'
                                         }`}
                                        placeholder="Nombres del estudiante"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.nombres && (
                                    <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="apellidos" className="block text-sm font-medium text-secondary-700 mb-1">
                                    Apellidos *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        id="apellidos"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                             errors.apellidos ? 'border-red-500' : 'border-gray-300'
                                         }`}
                                        placeholder="Apellidos del estudiante"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.apellidos && (
                                    <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
                                )}
                            </div>
                        </div>

                        {/* DNI y Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="dni" className="block text-sm font-medium text-secondary-700 mb-1">
                                    DNI *
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        id="dni"
                                        name="dni"
                                        value={formData.dni}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                             errors.dni ? 'border-red-500' : 'border-gray-300'
                                         }`}
                                        placeholder="12345678"
                                        maxLength="8"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.dni && (
                                    <p className="text-red-500 text-sm mt-1">{errors.dni}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                             errors.email ? 'border-red-500' : 'border-gray-300'
                                         }`}
                                        placeholder="estudiante@ejemplo.com"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Teléfono y Fecha de Nacimiento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="telefono" className="block text-sm font-medium text-secondary-700 mb-1">
                                    Teléfono
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                             errors.telefono ? 'border-red-500' : 'border-gray-300'
                                         }`}
                                        placeholder="987654321"
                                        maxLength="9"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.telefono && (
                                    <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-secondary-700 mb-1">
                                    Fecha de Nacimiento
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                    <input
                                        type="date"
                                        id="fecha_nacimiento"
                                        name="fecha_nacimiento"
                                        value={formData.fecha_nacimiento}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                             errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'
                                         }`}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.fecha_nacimiento && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fecha_nacimiento}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información de Contacto */}
                    <div className="border-b border-secondary-200 pb-4">
                        <h3 className="text-lg font-medium text-secondary-900 mb-4">Información de Contacto</h3>
                        
                        {/* Dirección */}
                        <div className="mb-4">
                            <label htmlFor="direccion" className="block text-sm font-medium text-secondary-700 mb-1">
                                Dirección
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-secondary-400 w-4 h-4" />
                                <textarea
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 resize-none ${
                                         errors.direccion ? 'border-red-500' : 'border-gray-300'
                                     }`}
                                    placeholder="Dirección completa del estudiante"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.direccion && (
                                <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
                            )}
                        </div>

                        {/* Información del Apoderado */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nombre_apoderado" className="block text-sm font-medium text-secondary-700 mb-1">
                                    Nombre del Apoderado
                                </label>
                                <div className="relative">
                                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        id="nombre_apoderado"
                                        name="nombre_apoderado"
                                        value={formData.nombre_apoderado}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                             errors.nombre_apoderado ? 'border-red-500' : 'border-gray-300'
                                         }`}
                                        placeholder="Nombre completo del apoderado"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.nombre_apoderado && (
                                    <p className="text-red-500 text-sm mt-1">{errors.nombre_apoderado}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="telefono_apoderado" className="block text-sm font-medium text-secondary-700 mb-1">
                                    Teléfono del Apoderado
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        id="telefono_apoderado"
                                        name="telefono_apoderado"
                                        value={formData.telefono_apoderado}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                             errors.telefono_apoderado ? 'border-red-500' : 'border-gray-300'
                                         }`}
                                        placeholder="987654321"
                                        maxLength="9"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {errors.telefono_apoderado && (
                                    <p className="text-red-500 text-sm mt-1">{errors.telefono_apoderado}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contraseñas - Solo mostrar en modo crear */}
                    {mode === 'create' && (
                        <div>
                            <h3 className="text-lg font-medium text-secondary-900 mb-4">Credenciales de Acceso</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
                                        Contraseña *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                                 errors.password ? 'border-red-500' : 'border-gray-300'
                                             }`}
                                            placeholder="Mínimo 6 caracteres"
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                            disabled={isSubmitting}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-1">
                                        Confirmar Contraseña *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                                                 errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                             }`}
                                            placeholder="Repite la contraseña"
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                            disabled={isSubmitting}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting 
                                ? (mode === 'create' ? 'Registrando...' : 'Actualizando...') 
                                : (mode === 'create' ? 'Registrar Estudiante' : 'Actualizar Estudiante')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EstudianteModal;