import React from 'react'
import { X, Calendar, BookOpen } from 'lucide-react'

const DetailsNota = ({ isOpen, onClose, evaluationDetails, evaluationType, courseName, loading }) => {
    if (!isOpen) return null

    const getEvaluationTypeLabel = (type) => {
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
        }
        return typeMap[type] || type
    }

    return (
        <div style={{marginTop: 0}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Detalles de Nota
                            </h3>
                            <p className="text-sm text-gray-500">
                                {courseName} - {getEvaluationTypeLabel(evaluationType)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {evaluationDetails ? (
                        <>
                            {/* Descripción */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Descripción</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
                                    {evaluationDetails.descripcion || 'No hay descripción disponible'}
                                </p>
                            </div>

                            {/* Fecha de Evaluación */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Fecha de Evaluación</h4>
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {evaluationDetails.fecha_evaluacion 
                                            ? new Date(evaluationDetails.fecha_evaluacion).toLocaleDateString('es-ES')
                                            : 'Fecha no especificada'
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Tipo de Evaluación */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Tipo de Nota</h4>
                                <p className="text-sm text-gray-700">
                                    {getEvaluationTypeLabel(evaluationDetails.tipo_evaluacion)}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-sm">
                                No se encontraron detalles para esta evaluación
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DetailsNota