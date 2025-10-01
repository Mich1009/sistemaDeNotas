import { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    Plus,
    Search,
    Filter,
    Trash2,
    GraduationCap,
    CheckCircle,
    XCircle,
    Hash
} from 'lucide-react';
import toast from 'react-hot-toast';
import useMatriculas from '../hooks/useMatriculas';

const Matriculas = () => {
    const {
        matriculas,
        estudiantes,
        ciclos,
        loading,
        fetchMatriculas,
        matricularEstudianteCiclo,
        deleteMatricula,
        searchEstudianteByDni
    } = useMatriculas();

    // Estados locales
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCiclo, setFilterCiclo] = useState('');
    const [filterEstado, setFilterEstado] = useState('activo');
    const [showMatriculaModal, setShowMatriculaModal] = useState(false);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const [selectedCiclo, setSelectedCiclo] = useState('');
    const [codigoMatricula, setCodigoMatricula] = useState('');
    const [dniSearch, setDniSearch] = useState('');
    const [searchingStudent, setSearchingStudent] = useState(false);

    // Filtrar matrículas
    const filteredMatriculas = matriculas.filter(matricula => {
        const matchesSearch =
            matricula.estudiante?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matricula.estudiante?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matricula.estudiante?.dni?.includes(searchTerm) ||
            matricula.codigo_matricula?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCiclo = !filterCiclo || matricula.ciclo_id?.toString() === filterCiclo;
        const matchesEstado = !filterEstado ||
            (filterEstado === 'activo' && matricula.is_active) ||
            (filterEstado === 'inactivo' && !matricula.is_active);

        return matchesSearch && matchesCiclo && matchesEstado;
    });

    // Buscar estudiante por DNI
    const handleSearchByDni = async () => {
        if (!dniSearch || dniSearch.length < 8) {
            toast.error('Por favor ingrese un DNI válido (mínimo 8 dígitos)');
            return;
        }

        try {
            setSearchingStudent(true);
            const estudiante = await searchEstudianteByDni(dniSearch);
            
            if (estudiante) {
                setSelectedEstudiante(estudiante);
                toast.success('Estudiante encontrado');
            } else {
                setSelectedEstudiante(null);
                toast.error('No se encontró ningún estudiante con ese DNI');
            }
        } catch (error) {
            console.error('Error al buscar estudiante:', error);
            toast.error('Error al buscar el estudiante');
            setSelectedEstudiante(null);
        } finally {
            setSearchingStudent(false);
        }
    };

    // Limpiar búsqueda de estudiante
    const clearStudentSearch = () => {
        setDniSearch('');
        setSelectedEstudiante(null);
    };

    // Matricular estudiante
    const handleMatricular = async () => {
        if (!selectedEstudiante || !selectedCiclo || !codigoMatricula.trim()) {
            toast.error('Por favor complete todos los campos');
            return;
        }

        try {
            await matricularEstudianteCiclo(selectedEstudiante.id, selectedCiclo, codigoMatricula);
            setShowMatriculaModal(false);
            resetForm();
        } catch (error) {
            console.error('Error al matricular:', error);
        }
    };

    // Resetear formulario
    const resetForm = () => {
        setDniSearch('');
        setSelectedEstudiante(null);
        setSelectedCiclo('');
        setCodigoMatricula('');
    };

    // Manejar eliminación de matrícula
    const handleDeleteMatricula = async (matriculaId) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta matrícula?')) {
            try {
                await deleteMatricula(matriculaId);
            } catch (error) {
                console.error('Error al eliminar matrícula:', error);
            }
        }
    };

    // Obtener el nombre del estado
    const getEstadoLabel = (estado) => {
        const estados = {
            'activa': 'Activa',
            'inactiva': 'Inactiva',
            'retirada': 'Retirada'
        };
        return estados[estado] || estado;
    };

    // Obtener el color del estado
    const getEstadoColor = (estado) => {
        const colores = {
            'activa': 'bg-green-100 text-green-800',
            'inactiva': 'bg-gray-100 text-gray-800',
            'retirada': 'bg-red-100 text-red-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                        Gestión de Matrículas
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Administra las matrículas de estudiantes en ciclos
                    </p>
                </div>
                <button
                    onClick={() => setShowMatriculaModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Matrícula
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Buscar estudiante o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filtro por Ciclo */}
                    <select
                        value={filterCiclo}
                        onChange={(e) => setFilterCiclo(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos los ciclos</option>
                        {ciclos.map(ciclo => (
                            <option key={ciclo.id} value={ciclo.id}>
                                {ciclo.nombre}
                            </option>
                        ))}
                    </select>

                    {/* Filtro por Estado */}
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos los estados</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>

                    {/* Botón de actualizar */}
                    <button
                        onClick={() => fetchMatriculas()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Filter className="h-4 w-4" />
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Tabla de Matrículas */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estudiante
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    DNI
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ciclo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Carrera
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Código Matrícula
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Matrícula
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="ml-2">Cargando matrículas...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMatriculas.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                        No se encontraron matrículas
                                    </td>
                                </tr>
                            ) : (
                                filteredMatriculas.map((matricula) => (
                                    <tr key={matricula.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <Users className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {matricula.estudiante?.nombres} {matricula.estudiante?.apellidos}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {matricula.estudiante?.dni}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">
                                                    {matricula.ciclo?.nombre}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {matricula.estudiante?.carrera?.nombre || 'Sin asignar'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Hash className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm font-mono text-gray-900">
                                                    {matricula.codigo_matricula}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(matricula.fecha_matricula).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(matricula.estado)}`}>
                                                {matricula.is_active ? (
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                )}
                                                {getEstadoLabel(matricula.estado)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDeleteMatricula(matricula.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded"
                                                    title="Eliminar matrícula"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Nueva Matrícula */}
            {showMatriculaModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Nueva Matrícula</h2>
                            <button
                                onClick={() => {
                                    setShowMatriculaModal(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Buscar Estudiante por DNI */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar Estudiante por DNI
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ingrese el DNI del estudiante"
                                        value={dniSearch}
                                        onChange={(e) => setDniSearch(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        maxLength="8"
                                    />
                                    <button
                                        onClick={handleSearchByDni}
                                        disabled={searchingStudent || !dniSearch}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        {searchingStudent ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            <Search className="h-4 w-4" />
                                        )}
                                        Buscar
                                    </button>
                                    {selectedEstudiante && (
                                        <button
                                            onClick={clearStudentSearch}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Mostrar datos del estudiante encontrado */}
                            {selectedEstudiante && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-green-800 mb-2">Estudiante Encontrado:</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Nombre:</span>
                                            <span className="ml-2 text-gray-900">
                                                {selectedEstudiante.first_name} {selectedEstudiante.last_name}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">DNI:</span>
                                            <span className="ml-2 text-gray-900">{selectedEstudiante.dni}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Email:</span>
                                            <span className="ml-2 text-gray-900">{selectedEstudiante.email}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Carrera:</span>
                                            <span className="ml-2 text-gray-900">{selectedEstudiante.carrera?.nombre || 'No asignada'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Seleccionar Ciclo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ciclo
                                </label>
                                <select
                                    value={selectedCiclo}
                                    onChange={(e) => setSelectedCiclo(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar ciclo</option>
                                    {ciclos.map(ciclo => (
                                        <option key={ciclo.id} value={ciclo.id}>
                                            {ciclo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Código de Matrícula */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Código de Matrícula
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Ingrese el código de matrícula"
                                        value={codigoMatricula}
                                        onChange={(e) => setCodigoMatricula(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        maxLength="20"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Código único para identificar esta matrícula
                                </p>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowMatriculaModal(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleMatricular}
                                disabled={!selectedEstudiante || !selectedCiclo || !codigoMatricula.trim() || loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Matriculando...' : 'Matricular'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Matriculas;