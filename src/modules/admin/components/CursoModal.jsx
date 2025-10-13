import React, { useState, useEffect } from 'react';
import { X, BookOpen, Hash, Award, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocentes } from '../hooks';

const CursoModal = ({ isOpen, onClose, onSubmit, mode = 'create', initialData = null, ciclos = [] }) => {
    const { docentes } = useDocentes();
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        ciclo_id: '',
        docente_id: ''
    });

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efecto para pre-llenar el formulario en modo edición
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                descripcion: initialData.descripcion || '',
                ciclo_id: initialData.ciclo_id?.toString() || '',
                docente_id: initialData.docente_id?.toString() || ''
            });
            // Set the year based on the ciclo's year
            const ciclo = ciclos.find(c => c.id === initialData.ciclo_id);
            if (ciclo) {
                setSelectedYear(ciclo.año.toString());
            }
        } else if (mode === 'create') {
            setFormData({
                nombre: '',
                descripcion: '',
                ciclo_id: '',
                docente_id: ''
            });
            setSelectedYear(new Date().getFullYear().toString());
        }
    }, [mode, initialData, isOpen, ciclos]);

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};

        // Validaciones requeridas
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del curso es obligatorio';
        }

        if (!formData.ciclo_id) {
            newErrors.ciclo_id = 'Debe seleccionar un ciclo';
        }

        if (!formData.docente_id) {
            newErrors.docente_id = 'Debe seleccionar un docente';
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
            const dataToSubmit = {
                ...formData,
                ciclo_id: parseInt(formData.ciclo_id),
                docente_id: parseInt(formData.docente_id)
            };
            
            // Llamar a la función onSubmit pasada como prop
            await onSubmit(dataToSubmit);
            
            // Resetear formulario solo si es modo crear
            if (mode === 'create') {
                setFormData({
                    nombre: '',
                    descripcion: '',
                    ciclo_id: '',
                    docente_id: ''
                });
            }
            
            setErrors({});
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            toast.error(mode === 'create' ? 'Error al crear curso' : 'Error al actualizar curso');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Manejar cierre del modal
    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                nombre: '',
                descripcion: '',
                ciclo_id: '',
                docente_id: ''
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div  style={{marginTop: 0}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {mode === 'create' ? 'Crear Nuevo Curso' : 'Editar Curso'}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {mode === 'create' 
                                    ? 'Completa la información del nuevo curso' 
                                    : 'Modifica la información del curso'
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información básica */}
                    <div>
                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del Curso *
                            </label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white text-gray-900 ${
                                         errors.nombre ? 'border-red-500' : 'border-gray-300'
                                     }`}
                                    placeholder="Ej: Programación Web"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.nombre && (
                                <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                            )}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            rows={3}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white text-gray-900 ${
                                 errors.descripcion ? 'border-red-500' : 'border-gray-300'
                             }`}
                            placeholder="Descripción del curso (opcional)"
                            disabled={isSubmitting}
                        />
                        {errors.descripcion && (
                            <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
                        )}
                    </div>

                    {/* Selección de Año y Ciclo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Año */}
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                                Año *
                            </label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                    // Reset ciclo selection when year changes
                                    setFormData(prev => ({ ...prev, ciclo_id: '' }));
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white text-gray-900"
                                disabled={isSubmitting}
                            >
                                <option value="">Seleccionar año</option>
                                {[...new Set(ciclos.map(ciclo => ciclo.año))].sort((a, b) => b - a).map(año => (
                                    <option key={año} value={año}>
                                        {año}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ciclo */}
                        <div>
                            <label htmlFor="ciclo_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Ciclo *
                            </label>
                            <select
                                id="ciclo_id"
                                name="ciclo_id"
                                value={formData.ciclo_id}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white text-gray-900 ${
                                     errors.ciclo_id ? 'border-red-500' : 'border-gray-300'
                                 }`}
                                disabled={isSubmitting || !selectedYear}
                            >
                                <option value="">Seleccionar ciclo</option>
                                {ciclos
                                    .filter(ciclo => selectedYear && ciclo.año.toString() === selectedYear)
                                    .map(ciclo => (
                                        <option key={ciclo.id} value={ciclo.id}>
                                            {ciclo.nombre}
                                        </option>
                                    ))}
                            </select>
                            {errors.ciclo_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.ciclo_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Docente */}
                    <div>
                        <label htmlFor="docente_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Docente *
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                id="docente_id"
                                name="docente_id"
                                value={formData.docente_id}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white text-gray-900 ${
                                     errors.docente_id ? 'border-red-500' : 'border-gray-300'
                                 }`}
                                disabled={isSubmitting}
                            >
                                <option value="">Seleccionar docente</option>
                                {docentes.filter(docente => docente.is_active).map(docente => (
                                    <option key={docente.id} value={docente.id}>
                                        {docente.first_name} {docente.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.docente_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.docente_id}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Guardando...' : (mode === 'create' ? 'Crear Curso' : 'Actualizar Curso')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CursoModal;