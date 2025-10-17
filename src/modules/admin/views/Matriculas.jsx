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
import MatriculaModal from '../components/MatriculaModal';

const Matriculas = () => {
    const {
        matriculas,
        estudiantes,
        ciclos,
        loading,
        fetchMatriculas,
        matricularEstudianteCiclo,
        deleteMatricula,
        searchEstudianteByDni,
        fetchCiclosDisponiblesParaEstudiante
    } = useMatriculas();

    // Estados locales
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCiclo, setFilterCiclo] = useState('');
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
    const [showMatriculaModal, setShowMatriculaModal] = useState(false);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const [selectedCiclo, setSelectedCiclo] = useState('');
    const [codigoMatricula, setCodigoMatricula] = useState('');
    const [dniSearch, setDniSearch] = useState('');
    const [searchingStudent, setSearchingStudent] = useState(false);
    const [ciclosDisponibles, setCiclosDisponibles] = useState([]);

    // Filtrar matrículas
    const filteredMatriculas = matriculas.filter(matricula => {
        const matchesSearch =
            matricula.estudiante?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matricula.estudiante?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matricula.estudiante?.dni?.includes(searchTerm) ||
            matricula.codigo_matricula?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCiclo = !filterCiclo || matricula.ciclo_id?.toString() === filterCiclo;
        
        const matchesYear = !filterYear || matricula.ciclo?.año?.toString() === filterYear;

        return matchesSearch && matchesCiclo && matchesYear;
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
                // Cargar ciclos disponibles para este estudiante
                const ciclosDisp = await fetchCiclosDisponiblesParaEstudiante(estudiante.id);
                setCiclosDisponibles(ciclosDisp);
                toast.success('Estudiante encontrado');
            } else {
                setSelectedEstudiante(null);
                setCiclosDisponibles([]);
                toast.error('No se encontró ningún estudiante con ese DNI');
            }
        } catch (error) {
            console.error('Error al buscar estudiante:', error);
            toast.error('Error al buscar el estudiante');
            setSelectedEstudiante(null);
            setCiclosDisponibles([]);
        } finally {
            setSearchingStudent(false);
        }
    };

    // Limpiar búsqueda de estudiante
    const clearStudentSearch = () => {
        setDniSearch('');
        setSelectedEstudiante(null);
        setCiclosDisponibles([]);
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
        setCiclosDisponibles([]);
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

    // Obtener el color del estado
    const getEstadoColor = (isActive) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    // Manejar cierre del modal
    const handleCloseModal = () => {
        setShowMatriculaModal(false);
        resetForm();
    };

    return (
        <div className="p-3">
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
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        {/* Búsqueda */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar estudiante o código..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                            />
                        </div>

                        {/* Filtro por Año */}
                        <select
                            value={filterYear}
                            onChange={(e) => {
                                setFilterYear(e.target.value);
                                setFilterCiclo(''); // Reset ciclo filter when year changes
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        >
                            <option value="">Todos los años</option>
                            {[...new Set(ciclos.map(ciclo => ciclo.año).filter(Boolean))].sort((a, b) => b - a).map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>

                        {/* Filtro por Ciclo */}
                        <select
                            value={filterCiclo}
                            onChange={(e) => setFilterCiclo(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        >
                            <option value="">Todos los ciclos</option>
                            {ciclos
                                .filter(ciclo => !filterYear || ciclo.año?.toString() === filterYear)
                                .map(ciclo => (
                                    <option key={ciclo.id} value={ciclo.id}>
                                        {ciclo.nombre} {ciclo.año && `(${ciclo.año})`}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Contador total y botón de actualizar */}
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                            Total: <span className="font-semibold text-gray-900">{filteredMatriculas.length}</span> matrículas
                        </div>
                        <button
                            onClick={() => fetchMatriculas()}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Filter className="h-4 w-4" />
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Matrículas */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                    N°
                                </th>
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
                                    Año
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
                                    <td colSpan="9" className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="ml-2">Cargando matrículas...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMatriculas.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                                        No se encontraron matrículas
                                    </td>
                                </tr>
                            ) : (
                                filteredMatriculas.map((matricula, index) => (
                                    <tr key={matricula.id} className="hover:bg-gray-50">
                                        <td style={{fontSize: 14}} className="text-center size-1">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <Users className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <span className="ml-4 text-sm font-medium text-gray-900">
                                                    {matricula.estudiante?.apellidos} {matricula.estudiante?.nombres}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {matricula.estudiante?.dni}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Calendar className="h-4 w-4 text-gray-400 mr-2 inline" />
                                            <span className="text-sm text-gray-900">
                                                {matricula.ciclo?.nombre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {matricula.ciclo?.año}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {matricula.estudiante?.carrera?.nombre || 'Sin asignar'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Hash className="h-4 w-4 text-gray-400 mr-2 inline" />
                                            <span className="text-sm font-mono text-gray-900">
                                                {matricula.codigo_matricula}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(matricula.fecha_matricula).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(matricula.is_active)}`}>
                                                {matricula.is_active ? (
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                )}
                                                {matricula.is_active ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteMatricula(matricula.id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                                title="Eliminar matrícula"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Nueva Matrícula */}
            <MatriculaModal
                showModal={showMatriculaModal}
                onClose={handleCloseModal}
                dniSearch={dniSearch}
                setDniSearch={setDniSearch}
                selectedEstudiante={selectedEstudiante}
                searchingStudent={searchingStudent}
                handleSearchByDni={handleSearchByDni}
                clearStudentSearch={clearStudentSearch}
                selectedCiclo={selectedCiclo}
                setSelectedCiclo={setSelectedCiclo}
                ciclosDisponibles={ciclosDisponibles}
                codigoMatricula={codigoMatricula}
                setCodigoMatricula={setCodigoMatricula}
                handleMatricular={handleMatricular}
                loading={loading}
            />
        </div>
    );
};

export default Matriculas;