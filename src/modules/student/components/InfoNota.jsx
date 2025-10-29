import React from 'react';
import { X, Calendar, FileText, Award, Clock } from 'lucide-react';

const InfoNota = ({
    isOpen,
    onClose,
    gradeInfo,
    gradeDetails,
    loading,
    error
}) => {
    if (!isOpen) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Fecha inválida';
        }
    };

    const getGradeColorClass = (grade) => {
        if (grade === null || grade === undefined) return 'text-gray-400';
        if (grade >= 17) return 'text-green-600';
        if (grade >= 13) return 'text-blue-600';
        if (grade >= 11) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getGradeStatus = (grade) => {
        if (grade === null || grade === undefined) return 'Sin calificar';
        if (grade >= 13) return 'Aprobado';
        return 'Desaprobado';
    };

    const getStatusColorClass = (grade) => {
        if (grade === null || grade === undefined) return 'bg-gray-100 text-gray-600';
        if (grade >= 13) return 'bg-green-100 text-green-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Award className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Detalles de Evaluación
                            </h2>
                            <p className="text-sm text-gray-500">
                                {gradeInfo?.cursoNombre}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Tipo de Evaluación y Nota */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900">
                                {gradeInfo?.tipoFormateado}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClass(gradeInfo?.valor)}`}>
                                {getGradeStatus(gradeInfo?.valor)}
                            </span>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <div className={`text-4xl font-bold ${getGradeColorClass(gradeInfo?.valor)}`}>
                                    {gradeInfo?.valor !== null && gradeInfo?.valor !== undefined
                                        ? gradeInfo.valor.toFixed(2)
                                        : '--'
                                    }
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    Calificación
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Cargando detalles...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="text-red-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grade Details */}
                    {!loading && !error && gradeDetails && (
                        <div className="space-y-4">
                            {/* Descripción */}
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <FileText className="w-4 h-4 text-gray-500" />
                                    <h4 className="font-medium text-gray-900">Descripción</h4>
                                </div>
                                <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">
                                    {gradeDetails.descripcion || 'Sin descripción disponible'}
                                </p>
                            </div>

                            {/* Fecha de Evaluación */}
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <h4 className="font-medium text-gray-900">Fecha de Evaluación</h4>
                                </div>
                                <p className="text-gray-700 text-sm">
                                    {formatDate(gradeDetails.fecha_evaluacion)}
                                </p>
                            </div>

                            {/* Información Adicional */}
                            {gradeDetails.created_at && (
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <h4 className="font-medium text-gray-900">Información del Sistema</h4>
                                    </div>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <p>Creado: {formatDate(gradeDetails.created_at)}</p>
                                        {gradeDetails.updated_at && gradeDetails.updated_at !== gradeDetails.created_at && (
                                            <p>Actualizado: {formatDate(gradeDetails.updated_at)}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* No Details Available */}
                    {!loading && !error && !gradeDetails && (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-2">
                                <FileText className="w-12 h-12 mx-auto" />
                            </div>
                            <p className="text-gray-500">
                                No hay detalles adicionales disponibles para esta evaluación.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoNota;