import React from 'react'
import { Award, Calendar, User, CheckCircle, AlertCircle, Clock, Download } from 'lucide-react';

const GradeCard = ({ curso, gradeUtils, handlePrintCourse }) => {
    
    const cursoStats = gradeUtils.calculateGradesStatistics(curso.notas);

    return (
        <div className="bg-white rounded-lg shadow-md transition-shadow border border-gray-200">
            {/* Header del Curso */}
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{curso.curso_nombre}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {curso.docente_nombre}
                        </span>
                        <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {curso.ciclo_nombre} - {curso.ciclo_año}
                        </span>
                        <span className="flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            Promedio: {curso.promedio_curso || '--'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePrintCourse(curso)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar PDF
                    </button>
                </div>
            </div>

            {/* Estadísticas del Curso */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-4 gap-4 text-center">
                <div className='flex items-center justify-center gap-1'>
                    <p className="text-2xl font-bold text-blue-600">{cursoStats.total}</p>
                    <p className="text-xs text-gray-600">Total Evaluaciones</p>
                </div>
                <div className='flex items-center justify-center gap-1'>
                    <p className="text-2xl font-bold text-green-600">{cursoStats.aprobados}</p>
                    <p className="text-xs text-gray-600">Aprobadas</p>
                </div>
                <div className='flex items-center justify-center gap-1'>
                    <p className="text-2xl font-bold text-red-600">{cursoStats.desaprobados}</p>
                    <p className="text-xs text-gray-600">Desaprobadas</p>
                </div>
                <div className='flex items-center justify-center gap-1'>
                    <p className="text-2xl font-bold text-yellow-600">{cursoStats.pendientes}</p>
                    <p className="text-xs text-gray-600">Pendientes</p>
                </div>
            </div>

            {/* Evaluaciones del Curso */}
            {curso.notas.map((nota) => {
                const average = gradeUtils.calculateAverage(nota);
                const gradeStatus = gradeUtils.getGradeStatus(average);

                return (
                    <div key={nota.id} className="p-5">
                        {/* Grid de Notas */}
                        <div className="space-y-4">
                            {/* Evaluaciones Semanales */}
                            <div>
                                <h5 className="text-sm font-medium text-gray-700">Evaluaciones</h5>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                    {Array.from({ length: 8 }, (_, i) => (
                                        <div key={i} className="text-center p-2 bg-blue-50 rounded border border-blue-100">
                                            <p className="text-xs text-blue-700 mb-1">E{i + 1}</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {nota[`evaluacion${i + 1}`] || '--'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Prácticas */}
                            <div>
                                <h5 className="text-sm font-medium text-gray-700">Prácticas</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {Array.from({ length: 4 }, (_, i) => (
                                        <div key={i} className="text-center p-2 bg-green-50 rounded border border-green-200">
                                            <p className="text-xs text-green-700 mb-1">P{i + 1}</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {nota[`practica${i + 1}`] || '--'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Parciales */}
                            <div>
                                <h5 className="text-sm font-medium text-gray-700">Parciales</h5>
                                <div className="grid grid-cols-2 gap-2">
                                    {Array.from({ length: 2 }, (_, i) => (
                                        <div key={i} className="text-center p-2 bg-purple-50 rounded border border-purple-100">
                                            <p className="text-xs text-purple-700 mb-1">Parc{i + 1}</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {nota[`parcial${i + 1}`] || '--'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Promedio y Observaciones */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                            <div>
                                <p className="text-sm text-gray-600">Promedio</p>
                                <p className="text-xl font-bold text-blue-600">{average || '--'}</p>
                            </div>
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${gradeStatus === 'APROBADO' ? 'bg-green-100 text-green-800' :
                                gradeStatus === 'DESAPROBADO' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {gradeStatus === 'APROBADO' ? <CheckCircle className="w-4 h-4 mr-1" /> :
                                    gradeStatus === 'DESAPROBADO' ? <AlertCircle className="w-4 h-4 mr-1" /> :
                                        <Clock className="w-4 h-4 mr-1" />}
                                <span>{gradeStatus}</span>
                            </div>
                            {!nota.observaciones && (
                                <div className="text-right max-w-md">
                                    <p className="text-xs text-gray-500">Observaciones</p>
                                    <p className="text-sm text-gray-800 italic">{nota.observaciones || 'Filicitaciones Hijo.'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default GradeCard