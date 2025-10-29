import React, { useState, useEffect } from 'react';
import { Save, Search, AlertCircle, Check, UploadCloud, DownloadCloud, Info, FileSpreadsheet } from 'lucide-react';
import useTableNota from '../hooks/useTableNota';
import useExcelGrades from '../hooks/useExcelGrades';
import EvaluationDescriptionModal from './EvaluationDescriptionModal';
import ExcelUploadModal from './ExcelUploadModal';
import { calificacionesService } from '../services/apiTeacher';
import toast from 'react-hot-toast';

const TableNota = ({ courses, students, selectedCourse, calculateCourseAverage, calculateStudentAverage, handleSaveAllGrades, handleSaveStudentGrades, hasChanges, loading, handleGradeChange, hasUnsavedChanges, savingRows, editableGrades }) => {

    const {
        activeTab,
        searchTerm,
        setActiveTab,
        setSearchTerm,
        filterStudents,
        getStudentStatus,
        formatGradeInput,
        validateGradeInput,
        handleExportAverages
    } = useTableNota();

    // Estados para el modal de descripción
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvaluationType, setSelectedEvaluationType] = useState('');
    const [evaluationDescriptions, setEvaluationDescriptions] = useState({});

    // Estados para Excel
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
    const { isDownloading, downloadExcelTemplate } = useExcelGrades();

    const filteredStudents = filterStudents(students);

    // Funciones para manejar el modal de descripción
    // Cargar descripciones de evaluaciones al montar el componente
    useEffect(() => {
        const loadEvaluationDescriptions = async () => {
            if (selectedCourse) {
                try {
                    const descriptions = await calificacionesService.getEvaluationDescriptions(selectedCourse);
                    // Convertir array a objeto para fácil acceso
                    const descriptionsMap = {};
                    descriptions.forEach(desc => {
                        descriptionsMap[desc.tipo_evaluacion] = desc;
                    });
                    setEvaluationDescriptions(descriptionsMap);
                } catch (error) {
                    console.error('Error al cargar descripciones:', error);
                }
            }
        };

        loadEvaluationDescriptions();
    }, [selectedCourse]);

    const handleHeaderClick = (evaluationType) => {
        setSelectedEvaluationType(evaluationType);
        setIsModalOpen(true);
    };

    const handleSaveDescription = async (descriptionData) => {
        try {
            // Llamada al backend para guardar la descripción
            await calificacionesService.saveEvaluationDescription(selectedCourse, descriptionData);

            // Actualizar el estado local
            setEvaluationDescriptions(prev => ({
                ...prev,
                [descriptionData.tipo_evaluacion]: descriptionData
            }));

            setIsModalOpen(false);
            toast.success('Descripción guardada exitosamente');
        } catch (error) {
            console.error('Error al guardar descripción:', error);
            toast.error('Error al guardar la descripción');
            throw error;
        }
    };

    // Funciones para manejar Excel
    const handleDownloadTemplate = async () => {
        try {
            await downloadExcelTemplate(selectedCourse);
        } catch (error) {
            console.error('Error al descargar plantilla:', error);
        }
    };

    const handleExcelUploadSuccess = (result) => {
        // Recargar datos después de subir Excel
        window.location.reload(); // Simple reload por ahora
        toast.success(`✅ ${result.notas_procesadas} notas cargadas exitosamente`);
    };

    const renderGradeInput = (studentId, field, placeholder = "00") => {
        // Verificar si existe descripción para este campo
        const hasDescription = evaluationDescriptions[field] && evaluationDescriptions[field].descripcion;

        const handleInputChange = (e) => {
            const rawValue = e.target.value;
            const formattedValue = formatGradeInput(rawValue);

            if (validateGradeInput(formattedValue)) {
                handleGradeChange(studentId, field, formattedValue);
            }
        };

        return (
            <input
                type="text"
                className={`w-16 px-2 py-1 border rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${!hasDescription ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                value={editableGrades[studentId]?.[field] || ''}
                onChange={handleInputChange}
                placeholder={placeholder}
                maxLength="5"
                disabled={!hasDescription}
                title={!hasDescription ? 'Debe agregar una descripción para esta evaluación antes de ingresar notas' : ''}
            />
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                        Calificaciones - {courses.find(c => c.id === selectedCourse)?.nombre}
                    </h2>
                    {calculateCourseAverage(activeTab) && (
                        <p className="text-sm text-gray-500">
                            Promedio del curso ({activeTab}): <span className="font-semibold">{calculateCourseAverage(activeTab)}</span>
                        </p>
                    )}
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:mt-0">
                    {hasChanges && (
                        <button
                            onClick={handleSaveAllGrades}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                        >
                            <Save size={16} className="mr-1" />
                            {loading ? 'Guardando...' : 'Guardar Todas las Notas'}
                        </button>
                    )}
                </div>
            </div>

            {/* Pestañas de tipos de evaluación */}
            <nav className="mb-4 border-b border-gray-200 flex justify-between">
                <div className='flex space-x-8'>
                    {['evaluaciones', 'practicas', 'parciales', 'promedios'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-1 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab === 'evaluaciones' && 'Evaluaciones (1-8)'}
                            {tab === 'practicas' && 'Prácticas (1-4)'}
                            {tab === 'parciales' && 'Parciales (1-2)'}
                            {tab === 'promedios' && 'Promedios'}
                        </button>
                    ))}
                </div>
                <div className='flex items-center space-x-5'>
                    <button 
                        onClick={() => setIsExcelModalOpen(true)}
                        className='px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center'
                    >
                        <UploadCloud size={16} className="mr-1" />
                        Cargar Excel
                    </button>
                    <button 
                        onClick={handleDownloadTemplate}
                        disabled={isDownloading}
                        className='px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50'
                    >
                        <DownloadCloud size={16} className="mr-1" />
                        {isDownloading ? 'Descargando...' : 'Descargar Plantilla'}
                    </button>
                    <button 
                        onClick={() => handleExportAverages(courses, selectedCourse, filteredStudents, calculateStudentAverage)}
                        className='px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center'
                        title="Exportar promedios de estudiantes"
                    >
                        <FileSpreadsheet size={16} className="mr-1" />
                        Exportar Promedios
                    </button>   
                </div>
            </nav>

            {/* Búsqueda */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar estudiante por nombre o DNI..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            {loading && selectedCourse ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando datos...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="text-center py-10">
                    <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No se encontraron estudiantes</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white z-10">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className='w-1 text-center px-2'>N°</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Estudiante</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">DNI</th>

                                {/* Campos dinámicos según la pestaña activa */}
                                {activeTab === 'evaluaciones' && (
                                    <>
                                        {Array.from({ length: 8 }, (_, i) => (
                                            <th
                                                key={i}
                                                className="py-3 px-4 text-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-blue-50 transition-colors"
                                                onClick={() => handleHeaderClick(`evaluacion${i + 1}`)}
                                                title="Click para agregar descripción"
                                            >
                                                Eval {i + 1}
                                                {evaluationDescriptions[`evaluacion${i + 1}`] && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                                                )}
                                            </th>
                                        ))}
                                    </>
                                )}

                                {activeTab === 'practicas' && (
                                    <>
                                        {Array.from({ length: 4 }, (_, i) => (
                                            <th
                                                key={i}
                                                className="py-3 px-4 text-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-blue-50 transition-colors"
                                                onClick={() => handleHeaderClick(`practica${i + 1}`)}
                                                title="Click para agregar descripción"
                                            >
                                                Pract {i + 1}
                                                {evaluationDescriptions[`practica${i + 1}`] && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                                                )}
                                            </th>
                                        ))}
                                    </>
                                )}

                                {activeTab === 'parciales' && (
                                    <>
                                        {Array.from({ length: 2 }, (_, i) => (
                                            <th
                                                key={i}
                                                className="py-3 px-4 text-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-blue-50 transition-colors"
                                                onClick={() => handleHeaderClick(`parcial${i + 1}`)}
                                                title="Click para agregar descripción"
                                            >
                                                Parc {i + 1}
                                                {evaluationDescriptions[`parcial${i + 1}`] && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                                                )}
                                            </th>
                                        ))}
                                    </>
                                )}

                                {activeTab === 'promedios' && (
                                    <>
                                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Prom. Evaluaciones</th>
                                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Prom. Prácticas</th>
                                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Prom. Parciales</th>
                                    </>
                                )}

                                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                                    <div className="flex items-center justify-center space-x-1">
                                        <span>{activeTab === 'promedios' ? 'Promedio General' : 'Promedio'}</span>
                                        {activeTab === 'promedios' && (
                                            <div className="relative group">
                                                <Info size={14} className="text-blue-500 cursor-help" />
                                                <div className="absolute left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap cursor-default">
                                                    Se aplican pesos: Evaluaciones (10%), Prácticas (30%), Parciales (60%)
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Estado</th>
                                {activeTab !== 'promedios' && (
                                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.map((student, index) => {
                                const average = calculateStudentAverage(student.id, activeTab === 'promedios' ? 'all' : activeTab);
                                const status = getStudentStatus(student.id, (id) => calculateStudentAverage(id, activeTab === 'promedios' ? 'all' : activeTab));
                                const hasStudentChanges = hasUnsavedChanges(student.id);
                                const isSaving = savingRows[student.id];

                                return (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-0 text-center">{index + 1}</td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-gray-800">{student.first_name} {student.last_name}</p>
                                                <p className="text-xs text-gray-500">{student.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{student.dni}</td>

                                        {/* Campos de nota según pestaña activa */}
                                        {activeTab === 'evaluaciones' && (
                                            <>
                                                {Array.from({ length: 8 }, (_, i) => (
                                                    <td key={i} className="py-3 px-4 text-center">
                                                        {renderGradeInput(student.id, `evaluacion${i + 1}`)}
                                                    </td>
                                                ))}
                                            </>
                                        )}

                                        {activeTab === 'practicas' && (
                                            <>
                                                {Array.from({ length: 4 }, (_, i) => (
                                                    <td key={i} className="py-3 px-4 text-center">
                                                        {renderGradeInput(student.id, `practica${i + 1}`)}
                                                    </td>
                                                ))}
                                            </>
                                        )}

                                        {activeTab === 'parciales' && (
                                            <>
                                                {Array.from({ length: 2 }, (_, i) => (
                                                    <td key={i} className="py-3 px-4 text-center">
                                                        {renderGradeInput(student.id, `parcial${i + 1}`)}
                                                    </td>
                                                ))}
                                            </>
                                        )}

                                        {activeTab === 'promedios' && (
                                            <>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`inline-block py-1 px-3 rounded-full text-sm font-medium ${!calculateStudentAverage(student.id, 'evaluaciones') ? 'bg-gray-100 text-gray-800' :
                                                        calculateStudentAverage(student.id, 'evaluaciones') >= 13 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {calculateStudentAverage(student.id, 'evaluaciones') || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`inline-block py-1 px-3 rounded-full text-sm font-medium ${!calculateStudentAverage(student.id, 'practicas') ? 'bg-gray-100 text-gray-800' :
                                                        calculateStudentAverage(student.id, 'practicas') >= 13 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {calculateStudentAverage(student.id, 'practicas') || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`inline-block py-1 px-3 rounded-full text-sm font-medium ${!calculateStudentAverage(student.id, 'parciales') ? 'bg-gray-100 text-gray-800' :
                                                        calculateStudentAverage(student.id, 'parciales') >= 13 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {calculateStudentAverage(student.id, 'parciales') || '-'}
                                                    </span>
                                                </td>
                                            </>
                                        )}

                                        <td className={`py-3 px-4 text-center ${activeTab === 'promedios' ? 'ring-2 ring-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50' : ''}`}>
                                            <span className={`inline-block py-1 px-3 rounded-full text-sm font-medium ${
                                                !average ? 'bg-gray-100 text-gray-800' :
                                                average >= 13 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {average || '-'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block py-1 px-3 rounded-full text-xs font-medium ${status === 'SIN_NOTA' ? 'bg-gray-100 text-gray-800' :
                                                status === 'APROBADO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleSaveStudentGrades(student.id)}
                                                disabled={!hasStudentChanges || isSaving}
                                                className={`px-3 py-1 rounded-md text-sm flex items-center ${hasStudentChanges
                                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-500 mr-1"></div>
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={14} className="mr-1" />
                                                        Guardar
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de descripción de evaluación */}
            <EvaluationDescriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                evaluationType={selectedEvaluationType}
                currentDescription={evaluationDescriptions[selectedEvaluationType]?.descripcion || ''}
                currentDate={evaluationDescriptions[selectedEvaluationType]?.fecha_evaluacion || ''}
                onSave={handleSaveDescription}
            />

            {/* Modal de carga de Excel */}
            <ExcelUploadModal
                isOpen={isExcelModalOpen}
                onClose={() => setIsExcelModalOpen(false)}
                courseId={selectedCourse}
                onUploadSuccess={handleExcelUploadSuccess}
            />
        </div>
    )
}

export default TableNota