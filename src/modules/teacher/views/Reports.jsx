import React from 'react';
import { FileText, Filter, Download, BarChart2, PieChart, Users, Search, RefreshCw, X, Eye, UserX } from 'lucide-react';
import useReports from '../hooks/useReports';
import FailStudents from '../components/FailStudents';


const Reports = () => {
    const {
        // Estados
        loading,
        reportData,
        resumen,

        // Filtros
        searchTerm,
        setSearchTerm,
        selectedYear,
        setSelectedYear,
        selectedCycle,
        setSelectedCycle,
        availableYears,
        availableCycles,

        // Modal de estudiantes desaprobados
        showFailedStudentsModal,
        setShowFailedStudentsModal,
        failedStudents,
        loadingFailedStudents,
        selectedCourse,

        // Funciones
        refreshData,
        clearFilters,
        exportReport,
        getFailedStudents,
        closeFailedStudentsModal,

        // Utilidades
        getStatusColor,
        getStatusBadge,
        formatPromedio,
        formatTasaAprobacion
    } = useReports();

    const handleViewFailedStudents = async (curso) => {
        await getFailedStudents(curso.id, curso.nombre, curso.ciclo);
    };

    const renderPerformanceReport = () => {
        if (!reportData || reportData.length === 0) {
            return (
                <div className="py-8 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No hay datos disponibles</h3>
                    <p className="text-gray-600">
                        No se encontraron cursos para los filtros seleccionados
                    </p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportData.map((curso) => (
                    <div key={curso.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{curso.nombre} - {curso.ciclo.nombre}</h3>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(curso.tasa_aprobacion)}`}>
                                {formatTasaAprobacion(curso.tasa_aprobacion)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div className="bg-blue-50 p-2 rounded-lg flex items-center justify-center gap-2">
                                <div className="text-sm text-gray-500">Estudiantes</div>
                                <div className="text-2xl font-bold text-blue-700">{curso.total_estudiantes}</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg flex items-center justify-center gap-2">
                                <div className="text-sm text-gray-500">Promedio</div>
                                <div className="text-2xl font-bold text-green-700">{formatPromedio(curso.promedio_curso)}</div>
                            </div>
                        </div>

                        <div className="mb-2">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Tasa de Aprobación</h4>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${curso.tasa_aprobacion}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">{formatTasaAprobacion(curso.tasa_aprobacion)}</span>
                                <span className="text-xs text-gray-500">{curso.estudiantes_aprobados} de {curso.total_estudiantes}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-2 rounded-lg flex items-center justify-center gap-2">
                                <div className="text-sm text-gray-500">Aprobados</div>
                                <div className="text-lg font-medium text-green-600">{curso.estudiantes_aprobados}</div>
                            </div>
                            <div
                                onClick={() => handleViewFailedStudents(curso)}
                                className="bg-red-50 p-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-red-100 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                <div className="text-sm text-gray-500">Reprobados</div>
                                <div className="text-lg font-medium text-red-600">{curso.estudiantes_reprobados}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderReportContent = () => {
        if (loading) {
            return (
                <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando datos del reporte...</p>
                </div>
            );
        }

        return renderPerformanceReport();
    };

    const renderFailedStudentsModal = () => {
        return (
            <FailStudents
                showFailedStudentsModal={showFailedStudentsModal}
                failedStudents={failedStudents}
                selectedCourse={selectedCourse}
                loadingFailedStudents={loadingFailedStudents}
                setShowFailedStudentsModal={setShowFailedStudentsModal}
                formatPromedio={formatPromedio}
            />
        );
    };

    return (
        <div className="p-3 space-y-5">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Reportes de Rendimiento</h1>
                            <p className="text-gray-600">Visualiza el desempeño académico por curso</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={refreshData}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Actualizar</span>
                        </button>
                        <button
                            onClick={() => exportReport('excel')}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={loading}
                        >
                            <Download className="w-4 h-4" />
                            <span>Exportar</span>
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex items-center gap-4">
                    {/* Buscador */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre de curso..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    {/* Filtro de Año */}
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    {/* Filtro de Ciclo */}
                    <div className="relative">
                        <select
                            value={selectedCycle}
                            onChange={(e) => setSelectedCycle(e.target.value)}
                            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            <option value="">Todos los ciclos</option>
                            {availableCycles.map(cycle => (
                                <option key={cycle.id} value={cycle.id}>
                                    {cycle.nombre}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    {/* Botón limpiar filtros */}
                    <div className="flex items-center">
                        <button
                            onClick={clearFilters}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors w-full justify-center"
                            disabled={loading}
                        >
                            <X className="w-4 h-4" />
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <BarChart2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Promedio General</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {resumen ? formatPromedio(resumen.promedio_general) : '0.00'}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <PieChart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Tasa de Aprobación</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {resumen ? formatTasaAprobacion(resumen.tasa_aprobacion) : '0.0%'}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Total Estudiantes</div>
                        <div className="text-2xl font-bold text-gray-800">
                            {resumen ? resumen.total_estudiantes : 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido del reporte */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-800">
                        Rendimiento por Curso
                    </h2>
                    {reportData && reportData.length > 0 && (
                        <span className="text-sm text-gray-500">
                            {reportData.length} curso{reportData.length !== 1 ? 's' : ''} encontrado{reportData.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {renderReportContent()}
            </div>

            {/* Modal de estudiantes desaprobados */}
            {renderFailedStudentsModal()}
        </div>
    );
};

export default Reports;