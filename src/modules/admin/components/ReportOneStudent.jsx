import React, { useState } from 'react'
import { estudiantesService, reportesService } from '../services/apiAdmin';
import { ScanEye } from 'lucide-react';
import DetailsNota from './DetailsNota';

const ReportOneStudent = ({ toggleViewTypeReport }) => {
    const [dni, setDni] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [studentData, setStudentData] = useState(null)
    const [academicData, setAcademicData] = useState(null)
    
    // Estado para el modal de detalles de evaluación
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [evaluationDetails, setEvaluationDetails] = useState(null)
    const [selectedEvaluationType, setSelectedEvaluationType] = useState('')
    const [selectedCourseName, setSelectedCourseName] = useState('')
    const [loadingEvaluation, setLoadingEvaluation] = useState(false)

    const handleSearch = async () => {
        if (!dni.trim()) {
            setError('Por favor ingrese un DNI')
            return
        }

        setLoading(true)
        setError('')
        setStudentData(null)
        setAcademicData(null)

        try {
            // Primero buscar información básica del estudiante
            const studentResponse = await estudiantesService.searchEstudianteByDni(dni)
            if (!studentResponse) {
                setError('Estudiante no encontrado')
                return
            }

            setStudentData(studentResponse)

            // Luego obtener el rendimiento académico
            const academicResponse = await reportesService.getAcademicPerformanceByDni(dni)
            setAcademicData(academicResponse)
        } catch (err) {
            setError('Error al buscar el estudiante: ' + (err.response?.data?.message || err.message))
        } finally {
            setLoading(false)
        }
    }

    const handleNoteClick = async (cursoId, evaluationType, courseName, evaluationIndex) => {
        const fullEvaluationType = `${evaluationType}${evaluationIndex}`
        
        setSelectedEvaluationType(fullEvaluationType)
        setSelectedCourseName(courseName)
        setLoadingEvaluation(true)
        setIsModalOpen(true)
        setEvaluationDetails(null)

        try {
            const descriptions = await reportesService.getEvaluationDescriptions(cursoId)
            const evaluationDetail = descriptions.find(desc => 
                desc.tipo_evaluacion === fullEvaluationType
            )
            
            setEvaluationDetails(evaluationDetail || null)
        } catch (err) {
            console.error('Error fetching evaluation details:', err)
            setEvaluationDetails(null)
        } finally {
            setLoadingEvaluation(false)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEvaluationDetails(null)
        setSelectedEvaluationType('')
        setSelectedCourseName('')
    }

    const renderCourseStatus = (status) => {
        const statusColors = {
            'Aprobado': 'bg-green-100 text-green-800',
            'Desaprobado': 'bg-red-100 text-red-800',
            'En Progreso': 'bg-blue-100 text-blue-800',
            'Pendiente': 'bg-yellow-100 text-yellow-800'
        }
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        )
    }

    const renderCycleAverage = (average) => {
        let colorClass = 'text-gray-700'
        if (average >= 13) colorClass = 'text-green-600'
        else if (average >= 11) colorClass = 'text-yellow-600'
        else if (average > 0) colorClass = 'text-red-600'
        
        return (
            <span className={`text-lg font-bold ${colorClass}`}>
                {average > 0 ? average.toFixed(2) : 'N/A'}
            </span>
        )
    }

    const renderClickableNotes = (notasObject, cursoId, evaluationType, courseName) => {
        if (!notasObject) return 'Sin notas'
        
        const notes = Object.entries(notasObject)
            .filter(([_, value]) => value !== null)
            .map(([key, value]) => {
                const evaluationIndex = key.replace(evaluationType, '')
                return (
                    <span
                        key={key}
                        onClick={() => handleNoteClick(cursoId, evaluationType, courseName, evaluationIndex)}
                        className="cursor-pointer hover:text-blue-600 hover:underline mx-1"
                        title="Click para ver detalles"
                    >
                        {value}
                    </span>
                )
            })
        
        if (notes.length === 0) return 'Sin notas'
        
        return (
            <div className="flex flex-wrap gap-1">
                {notes.reduce((acc, note, index) => [
                    ...acc,
                    note,
                    index < notes.length - 1 ? ', ' : null
                ], [])}
            </div>
        )
    }

    return (
        <div className="space-y-4 py-3">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Reporte por Estudiante</h3>
                <button
                    onClick={toggleViewTypeReport}
                    className="flex items-center space-x-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                >
                    <ScanEye className="w-4 h-4" />
                    <span>Ver Reporte por Ciclo</span>
                </button>
            </div>

            {/* Búsqueda por DNI */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-end space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar por DNI del Estudiante
                        </label>
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            placeholder="Ingrese DNI del estudiante"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            {/* Información del Estudiante */}
            {studentData && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold">Información del Estudiante</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <div>
                            <span className="text-sm text-gray-600">Nombre:</span>
                            <p className="font-medium">{studentData.last_name}, {studentData.first_name}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">DNI:</span>
                            <p className="font-medium">{studentData.dni}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Email:</span>
                            <p className="font-medium">{studentData.email}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Teléfono:</span>
                            <p className="font-medium">{studentData.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Carrera:</span>
                            <p className="font-medium">{studentData.carrera.nombre || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600">Ciclo Actual:</span>
                            <p className="font-medium">
                                {studentData.ciclo_actual ? `Ciclo ${studentData.ciclo_actual.numero} - ${studentData.ciclo_actual.nombre}` : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Rendimiento Académico */}
            {academicData && academicData.academic_performance && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-4">Rendimiento Académico</h4>
                    
                    {academicData.academic_performance.length > 0 ? (
                        academicData.academic_performance.map((ciclo) => (
                            <div key={ciclo.ciclo_id} className="mb-6 border-b border-gray-200 pb-4 last:border-b-0">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-md font-semibold text-blue-800">
                                        Ciclo {ciclo.ciclo_numero}
                                    </h5>
                                    <div className="text-right">
                                        <span className="text-sm text-gray-600">Promedio del Ciclo: </span>
                                        {renderCycleAverage(ciclo.promedio_ciclo)}
                                    </div>
                                </div>

                                {ciclo.cursos && ciclo.cursos.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Curso
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Evaluaciones (1-8)
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Prácticas (1-4)
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Parciales (1-2)
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Promedio Final
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {ciclo.cursos.map((curso) => (
                                                    <tr key={curso.curso_id}>
                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {curso.curso_nombre}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                            {renderClickableNotes(curso.evaluaciones, curso.curso_id, 'evaluacion', curso.curso_nombre)}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                            {renderClickableNotes(curso.practicas, curso.curso_id, 'practica', curso.curso_nombre)}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                            {renderClickableNotes(curso.parciales, curso.curso_id, 'parcial', curso.curso_nombre)}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                curso.promedio_final >= 13 ? 'bg-green-100 text-green-800' :
                                                                curso.promedio_final >= 11 ? 'bg-yellow-100 text-yellow-800' :
                                                                curso.promedio_final > 0 ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {curso.promedio_final > 0 ? curso.promedio_final.toFixed(2) : 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap">
                                                            {renderCourseStatus(curso.estado)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No hay cursos registrados para este ciclo.</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No se encontraron datos académicos para este estudiante.</p>
                    )}
                </div>
            )}

            {/* Modal de Detalles de Evaluación */}
            <DetailsNota
                isOpen={isModalOpen}
                onClose={closeModal}
                evaluationDetails={evaluationDetails}
                evaluationType={selectedEvaluationType}
                courseName={selectedCourseName}
            />
        </div>
    )
}

export default ReportOneStudent