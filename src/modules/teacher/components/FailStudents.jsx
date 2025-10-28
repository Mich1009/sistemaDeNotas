import React from 'react'
import { FileText, Filter, Download, BarChart2, PieChart, Users, Search, RefreshCw, X, Eye, UserX } from 'lucide-react';


const FailStudents = ({ showFailedStudentsModal, failedStudents, selectedCourse, loadingFailedStudents, setShowFailedStudentsModal, formatPromedio }) => {
    if (!showFailedStudentsModal) return null;

    return (
        <div style={{ marginTop: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header del Modal */}
                <div className=" bg-red-50 px-6 py-4 border-b border-red-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <UserX className="w-6 h-6 text-red-600" />
                        <div>
                            <h2 className="text-base font-bold text-red-800">Estudiantes Desaprobados</h2>
                            <p className="text-red-600 text-sm">{selectedCourse && selectedCourse.nombre ? `${selectedCourse.nombre} - ${selectedCourse.ciclo?.nombre || 'Ciclo'}` : 'Curso'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowFailedStudentsModal(false)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-red-600" />
                    </button>
                </div>

                {/* Contenido del Modal */}
                <div className="p-3 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loadingFailedStudents ? (
                        <div className="py-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando estudiantes desaprobados...</p>
                        </div>
                    ) : failedStudents && failedStudents.length > 0 ? (
                        <div className="space-y-2">
                            <div className="bg-gray-50 p-2 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Total de estudiantes desaprobados: {failedStudents.length}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Los promedios se calculan con los pesos: Evaluaciones 10%, Prácticas 30%, Parciales 60%
                                </p>
                            </div>

                            <div className="grid gap-2">
                                {failedStudents.map((estudiante, index) => (
                                    <div key={estudiante.id} className="bg-white border border-red-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="bg-red-100 text-red-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-gray-800">
                                                        {estudiante.nombre} {estudiante.apellido}
                                                    </h4>
                                                    <p className="text-gray-600 text-xs">DNI: {estudiante.dni}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500">Promedio Final</div>
                                                <div className="text-lg font-bold text-red-600">
                                                    {formatPromedio(estudiante.promedio_final)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desglose de notas */}
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <div className="grid grid-cols-3 gap-4 text-xs">
                                                <div className="text-center">
                                                    <div className="text-gray-500">Evaluaciones (10%)</div>
                                                    <div className="font-semibold text-blue-600 text-sm">
                                                        {estudiante.promedio_evaluaciones ? formatPromedio(estudiante.promedio_evaluaciones) : 'N/A'}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-500">Prácticas (30%)</div>
                                                    <div className="font-semibold text-green-600 text-sm">
                                                        {estudiante.promedio_practicas ? formatPromedio(estudiante.promedio_practicas) : 'N/A'}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-500">Parciales (60%)</div>
                                                    <div className="font-semibold text-purple-600 text-sm">
                                                        {estudiante.promedio_parciales ? formatPromedio(estudiante.promedio_parciales) : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-800 mb-2">No hay estudiantes desaprobados</h3>
                            <p className="text-gray-600">
                                Todos los estudiantes de este curso han aprobado.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FailStudents