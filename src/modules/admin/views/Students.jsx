import React from 'react';
import {
    GraduationCap,
    Plus,
    Search,
    Edit,
    Trash2,
    Download
} from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import EstudianteModal from '../components/EstudianteModal';

const Students = () => {
    const {
        // Estados
        estudiantes,
        loading,
        error,
        searchTerm,
        selectedCiclo,
        enrollmentStatus,
        showCreateModal,
        selectedEstudiante,
        showEditModal,
        page,
        perPage,
        pagination,
        shouldUsePagination,
        ciclos,
        ciclosLoading,
        
        // Funciones
        setSearchTerm,
        setSelectedCiclo,
        setEnrollmentStatus,
        setShowCreateModal,
        setSelectedEstudiante,
        setShowEditModal,
        setPage,
        
        onSearchChange,
        goPrevPage,
        goNextPage,
        handleCreateEstudiante,
        handleUpdateEstudiante,
        handleDeleteEstudiante,
        handleRefresh,
        exportStudentsToExcel
    } = useStudents();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-3 mb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Gestión de Estudiantes</h1>
                    <p className="text-secondary-600 mt-2">
                        Administra los estudiantes del sistema educativo
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Estudiante</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar estudiantes..."
                                value={searchTerm}
                                onChange={onSearchChange}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={selectedCiclo}
                                onChange={(e) => {
                                    setSelectedCiclo(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-3 pr-8 py-2 border border-secondary-300 bg-white text-gray-900 rounded-lg 
                                            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">Todos los ciclos</option>
                                <option value="I">Ciclo I</option>
                                <option value="II">Ciclo II</option>
                                <option value="III">Ciclo III</option>
                                <option value="IV">Ciclo IV</option>
                                <option value="V">Ciclo V</option>
                                <option value="VI">Ciclo VI</option>
                            </select>
                        </div>
                        <select
                            value={enrollmentStatus}
                            onChange={(e) => { setEnrollmentStatus(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                        >
                            <option value="matriculados">Matriculados</option>
                            <option value="sin_matricular">Sin Matricular</option>
                            <option value="todos">Todos</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-secondary-600">
                            Total: {pagination.total} estudiantes
                        </span>
                        <button
                            onClick={handleRefresh}
                            className="btn-secondary"
                        >
                            Actualizar
                        </button>
                        {selectedCiclo && (
                            <button
                                onClick={exportStudentsToExcel}
                                className="btn-primary flex items-center gap-2"
                                title="Exportar estudiantes del ciclo seleccionado"
                            >
                                <Download className="w-4 h-4" />
                                <span>Exportar</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Students Table */}
            {estudiantes.length === 0 ? (
                <div className="card p-8 text-center">
                    <GraduationCap className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        No se encontraron estudiantes
                    </h3>
                    <p className="text-secondary-600">
                        {searchTerm
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Comienza agregando tu primer estudiante'
                        }
                    </p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead className="bg-secondary-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        N°
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Estudiante
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        DNI
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        F Nacimiento
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Carrera
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Ciclo Actual
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                                {estudiantes.map((estudiante, index) => (
                                    <tr key={estudiante.id} className="hover:bg-secondary-50">
                                        <td className='text-center size-1'>
                                            {shouldUsePagination 
                                                ? ((pagination.page - 1) * perPage) + index + 1
                                                : index + 1
                                            }
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <GraduationCap className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div className='ml-4'>
                                                    <div className="text-sm font-medium text-secondary-900">
                                                        {estudiante.last_name} {estudiante.first_name}
                                                    </div>
                                                    <div className="text-sm text-secondary-400">
                                                        {estudiante.phone || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {estudiante.dni}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {estudiante.email}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {estudiante.fecha_nacimiento
                                                ? new Date(estudiante.fecha_nacimiento).toLocaleDateString('es-ES')
                                                : '-'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {estudiante.carrera?.nombre || 'Sin asignar'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {estudiante.ciclo_actual && estudiante.ciclo_actual !== 'Sin Matricular' ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {estudiante.ciclo_actual}
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                    Sin Matricular
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedEstudiante(estudiante);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEstudiante(estudiante.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Paginación - Solo mostrar cuando se usa paginación */}
                    {shouldUsePagination && (
                        <div className="flex items-center justify-between p-4 border-t bg-secondary-50">
                            <div className="text-sm text-secondary-700">
                                Página {pagination.page} de {pagination.totalPages} • Total: {pagination.total}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={goPrevPage}
                                    disabled={pagination.page <= 1}
                                    className="px-4 py-2 border rounded disabled:opacity-50 text-secondary-700 bg-secondary-100"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={goNextPage}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="px-4 py-2 border rounded disabled:opacity-50 text-secondary-700 bg-secondary-100"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* EstudianteModal para crear */}
            <EstudianteModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateEstudiante}
                mode="create"
            />

            {/* EstudianteModal para editar */}
            <EstudianteModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedEstudiante(null);
                }}
                onSubmit={handleUpdateEstudiante}
                mode="edit"
                initialData={selectedEstudiante}
            />
        </div>
    );
};

export default Students;