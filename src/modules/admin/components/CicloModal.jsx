import React, { useState, useEffect } from 'react';
import { 
    X, 
    Calendar, 
    CalendarDays,
    FileText
} from 'lucide-react';

const CicloModal = ({ isOpen, onClose, onSubmit, mode = 'create', initialData = null }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    nombre: initialData.nombre || '',
                    descripcion: initialData.descripcion || '',
                    fecha_inicio: initialData.fecha_inicio ? 
                        new Date(initialData.fecha_inicio).toISOString().split('T')[0] : '',
                    fecha_fin: initialData.fecha_fin ? 
                        new Date(initialData.fecha_fin).toISOString().split('T')[0] : ''
                });
            } else {
                setFormData({
                    nombre: '',
                    descripcion: '',
                    fecha_inicio: '',
                    fecha_fin: ''
                });
            }
            setErrors({});
        }
    }, [isOpen, mode, initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del ciclo es requerido';
        } else if (formData.nombre.trim().length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else if (formData.nombre.trim().length > 100) {
            newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
        }

        // Validar fecha de inicio
        if (!formData.fecha_inicio) {
            newErrors.fecha_inicio = 'La fecha de inicio es requerida';
        }

        // Validar fecha de fin
        if (!formData.fecha_fin) {
            newErrors.fecha_fin = 'La fecha de fin es requerida';
        } else if (formData.fecha_inicio && formData.fecha_fin <= formData.fecha_inicio) {
            newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Convertir fechas a formato ISO para el backend
            const submitData = {
                ...formData,
                fecha_inicio: new Date(formData.fecha_inicio + 'T00:00:00').toISOString(),
                fecha_fin: new Date(formData.fecha_fin + 'T23:59:59').toISOString()
            };

            await onSubmit(submitData);
            onClose();
        } catch (error) {
            console.error('Error al enviar formulario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{marginTop: 0}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === 'create' ? 'Crear Nuevo Ciclo' : 'Editar Ciclo'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Nombre del Ciclo */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Ciclo *
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 bg-white text-gray-900 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.nombre ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ej: Ciclo I - 2024"
                        />
                        {errors.nombre && (
                            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                            <FileText size={16} className="inline mr-1" />
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Descripción opcional del ciclo académico..."
                        />
                    </div>

                    {/* Fechas en la misma fila */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Fecha de Inicio */}
                        <div>
                            <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar size={16} className="inline mr-1" />
                                Fecha de Inicio *
                            </label>
                            <input
                                type="date"
                                id="fecha_inicio"
                                name="fecha_inicio"
                                value={formData.fecha_inicio}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 bg-white text-gray-900 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.fecha_inicio ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.fecha_inicio && (
                                <p className="mt-1 text-sm text-red-600">{errors.fecha_inicio}</p>
                            )}
                        </div>

                        {/* Fecha de Fin */}
                        <div>
                            <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-1">
                                <CalendarDays size={16} className="inline mr-1" />
                                Fecha de Fin *
                            </label>
                            <input
                                type="date"
                                id="fecha_fin"
                                name="fecha_fin"
                                value={formData.fecha_fin}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 bg-white text-gray-900 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.fecha_fin ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.fecha_fin && (
                                <p className="mt-1 text-sm text-red-600">{errors.fecha_fin}</p>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Guardando...' : (mode === 'create' ? 'Crear Ciclo' : 'Actualizar Ciclo')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CicloModal;