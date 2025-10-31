import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const DocenteModal = ({ isOpen, onClose, onSubmit, mode = 'create', initialData = null }) => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        dni: '',
        email: '',
        telefono: '',
        especialidad: '',
        grado_academico: '',
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
                especialidad: initialData.especialidad || '',
                grado_academico: initialData.grado_academico || '',
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
                especialidad: '',
                grado_academico: '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [mode, initialData, isOpen]);

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Función para validar el formulario
    const validateForm = () => {
        const newErrors = {};

        // Validar nombres
        if (!formData.nombres.trim()) {
            newErrors.nombres = 'Los nombres son obligatorios';
        } else if (formData.nombres.trim().length < 2) {
            newErrors.nombres = 'Los nombres deben tener al menos 2 caracteres';
        }

        // Validar apellidos
        if (!formData.apellidos.trim()) {
            newErrors.apellidos = 'Los apellidos son obligatorios';
        } else if (formData.apellidos.trim().length < 2) {
            newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
        }

        // Validar DNI
        if (!formData.dni.trim()) {
            newErrors.dni = 'El DNI es obligatorio';
        } else if (!/^\d{8}$/.test(formData.dni.trim())) {
            newErrors.dni = 'El DNI debe tener exactamente 8 dígitos';
        }

        // Validar email
        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'El email no tiene un formato válido';
        }

        // Validar teléfono (opcional pero si se proporciona debe ser válido)
        if (formData.telefono.trim() && !/^\d{9}$/.test(formData.telefono.trim())) {
            newErrors.telefono = 'El teléfono debe tener exactamente 9 dígitos';
        }

        // Validar contraseña solo en modo crear
        if (mode === 'create') {
            if (!formData.password.trim()) {
                newErrors.password = 'La contraseña es obligatoria';
            } else if (formData.password.trim().length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }

            // Validar confirmación de contraseña
            if (!formData.confirmPassword.trim()) {
                newErrors.confirmPassword = 'Debes confirmar la contraseña';
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
            const { confirmPassword, nombres, apellidos, telefono, password, ...docenteData } = formData;
            
            let dataToSubmit;
            
            if (mode === 'create') {
                // Agregar el campo role requerido por el backend para crear
                dataToSubmit = {
                    ...docenteData,
                    first_name: nombres,
                    last_name: apellidos,
                    phone: telefono,
                    password: password,
                    role: 'docente'
                };
            } else {
                // Para edición, no incluir password ni role
                dataToSubmit = {
                    ...docenteData,
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
                    especialidad: '',
                    grado_academico: '',
                    password: '',
                    confirmPassword: ''
                });
            }
            setErrors({});
            
        } catch (error) {
            // El error ya se maneja en el componente padre
            console.error(`Error al ${mode === 'create' ? 'crear' : 'actualizar'} docente:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Manejar cierre del modal
    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                nombres: '',
                apellidos: '',
                dni: '',
                email: '',
                telefono: '',
                especialidad: '',
                grado_academico: '',
                password: '',
                confirmPassword: ''
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{marginTop: 0}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 py-3 border-b border-secondary-200">
                    <h2 className="text-xl font-semibold text-secondary-900">
                        {mode === 'create' ? 'Registrar Nuevo Docente' : 'Editar Docente'}
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
                    {/* Nombres y Apellidos en la misma fila */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombres */}
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
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none bg-white text-black text-lg font-medium ${
                                         errors.nombres ? 'border-red-500' : 'border-secondary-300'
                                     }`}
                                    placeholder="Ingresa los nombres"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.nombres && (
                                <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
                            )}
                        </div>

                        {/* Apellidos */}
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
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none bg-white text-black text-lg font-medium ${
                                         errors.apellidos ? 'border-red-500' : 'border-secondary-300'
                                     }`}
                                    placeholder="Ingresa los apellidos"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.apellidos && (
                                <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
                            )}
                        </div>
                    </div>

                    {/* DNI y Email en la misma fila */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* DNI */}
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
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none bg-white text-black text-lg font-medium ${
                                         errors.dni ? 'border-red-500' : 'border-secondary-300'
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

                        {/* Email */}
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
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none bg-white text-black text-lg font-medium ${
                                         errors.email ? 'border-red-500' : 'border-secondary-300'
                                     }`}
                                    placeholder="docente@ejemplo.com"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Teléfono, Especialidad y Grado Académico */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Teléfono */}
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
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none bg-white text-black text-lg font-medium ${
                                         errors.telefono ? 'border-red-500' : 'border-secondary-300'
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

                        {/* Especialidad */}
                        <div>
                            <label htmlFor="especialidad" className="block text-sm font-medium text-secondary-700 mb-1">
                                Especialidad
                            </label>
                            <input
                                type="text"
                                id="especialidad"
                                name="especialidad"
                                value={formData.especialidad}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none bg-white text-black text-lg font-medium ${
                                     errors.especialidad ? 'border-red-500' : 'border-secondary-300'
                                 }`}
                                placeholder="Ej: Matemáticas, Física, etc."
                                disabled={isSubmitting}
                            />
                            {errors.especialidad && (
                                <p className="text-red-500 text-sm mt-1">{errors.especialidad}</p>
                            )}
                        </div>

                        {/* Grado Académico */}
                        <div>
                            <label htmlFor="grado_academico" className="block text-sm font-medium text-secondary-700 mb-1">
                                Grado Académico
                            </label>
                            <select
                                id="grado_academico"
                                name="grado_academico"
                                value={formData.grado_academico}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none bg-white text-black text-lg font-medium ${
                                     errors.grado_academico ? 'border-red-500' : 'border-secondary-300'
                                 }`}
                                disabled={isSubmitting}
                            >
                                <option value="">Seleccionar</option>
                                <option value="Bachiller">Bachiller</option>
                                <option value="Licenciado">Licenciado</option>
                                <option value="Magister">Magíster</option>
                                <option value="Doctor">Doctor</option>
                            </select>
                            {errors.grado_academico && (
                                <p className="text-red-500 text-sm mt-1">{errors.grado_academico}</p>
                            )}
                        </div>
                    </div>

                    {/* Contraseñas en la misma fila - Solo mostrar en modo crear */}
                    {mode === 'create' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password */}
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
                                        className={`w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none bg-white text-black text-lg font-medium ${
                                             errors.password ? 'border-red-500' : 'border-secondary-300'
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

                            {/* Confirm Password */}
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
                                        className={`w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none bg-white text-black text-lg font-medium ${
                                             errors.confirmPassword ? 'border-red-500' : 'border-secondary-300'
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
                    )}

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting 
                                ? (mode === 'create' ? 'Registrando...' : 'Actualizando...') 
                                : (mode === 'create' ? 'Registrar Docente' : 'Actualizar Docente')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocenteModal;
