import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText } from 'lucide-react';

const EvaluationDescriptionModal = ({ 
    isOpen, 
    onClose, 
    evaluationType, 
    currentDescription = '', 
    currentDate = '',
    onSave 
}) => {
    const [description, setDescription] = useState('');
    const [evaluationDate, setEvaluationDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setDescription(currentDescription);
            setEvaluationDate(currentDate || new Date().toISOString().split('T')[0]);
        }
    }, [isOpen, currentDescription, currentDate]);

    const handleSave = async () => {
        if (!description.trim()) {
            alert('Por favor, ingresa una descripción');
            return;
        }

        setIsLoading(true);
        try {
            await onSave({
                tipo_evaluacion: evaluationType,
                descripcion: description.trim(),
                fecha_evaluacion: evaluationDate
            });
            onClose();
        } catch (error) {
            console.error('Error al guardar descripción:', error);
            alert('Error al guardar la descripción');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setDescription('');
            setEvaluationDate('');
            onClose();
        }
    };

    const getEvaluationDisplayName = (type) => {
        const typeMap = {
            'evaluacion1': 'Evaluación 1',
            'evaluacion2': 'Evaluación 2',
            'evaluacion3': 'Evaluación 3',
            'evaluacion4': 'Evaluación 4',
            'evaluacion5': 'Evaluación 5',
            'evaluacion6': 'Evaluación 6',
            'evaluacion7': 'Evaluación 7',
            'evaluacion8': 'Evaluación 8',
            'practica1': 'Práctica 1',
            'practica2': 'Práctica 2',
            'practica3': 'Práctica 3',
            'practica4': 'Práctica 4',
            'parcial1': 'Parcial 1',
            'parcial2': 'Parcial 2'
        };
        return typeMap[type] || type;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Descripción de {getEvaluationDisplayName(evaluationType)}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Agrega una descripción para todos los estudiantes
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Fecha de evaluación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Fecha de evaluación
                        </label>
                        <input
                            type="date"
                            value={evaluationDate}
                            onChange={(e) => setEvaluationDate(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:opacity-50 outline-none"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 inline mr-2" />
                            Descripción de la evaluación
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                            placeholder={`Escribe una descripción para ${getEvaluationDisplayName(evaluationType).toLowerCase()}...`}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:opacity-50 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Esta descripción se aplicará a todos los estudiantes en esta columna
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading || !description.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span>{isLoading ? 'Guardando...' : 'Guardar'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvaluationDescriptionModal;