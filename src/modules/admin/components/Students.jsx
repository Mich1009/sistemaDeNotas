import React, { useState, useEffect } from 'react';
import { 
    GraduationCap, 
    Plus, 
    Search, 
    Edit, 
    UserX, 
    UserCheck,
    Filter,
    Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEstudiantes } from '../hooks';
import { useCiclos } from '../hooks/useCiclos';
import EstudianteModal from './EstudianteModal';

const Students = () => {
    const { 
        estudiantes, 
        loading, 
        error, 
        createEstudiante, 
        updateEstudiante, 
        deleteEstudiante,
        activateEstudiante,
        searchEstudianteByDni,
        refreshEstudiantes,
        fetchEstudiantes
    } = useEstudiantes();

    const { 
        ciclos, 
        loading: ciclosLoading, 
        getUltimoCiclo, 
        getCiclosActivos 
    } = useCiclos();

    // Obtener ciclos activos como valor, no como función
    const ciclosActivos = getCiclosActivos;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCiclo, setSelectedCiclo] = useState(null);
    const [filterMatricula, setFilterMatricula] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Establecer el último ciclo como filtro por defecto
    useEffect(() => {
        if (ciclos.length > 0 && !selectedCiclo) {
            const ultimoCiclo = getUltimoCiclo;
            if (ultimoCiclo) {
                setSelectedCiclo(ultimoCiclo.id);
            }
        }
    }, [ciclos, selectedCiclo]);

    // Cargar estudiantes cuando cambie el ciclo seleccionado
    useEffect(() => {
        if (selectedCiclo) {
            fetchEstudiantes(selectedCiclo);
        }
    }, [selectedCiclo]);

    // Filter estudiantes based on search term and matricula status
    const filteredEstudiantes = estudiantes.filter(estudiante => {
        const matchesSearch = 
            estudiante.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.dni?.includes(searchTerm) ||
            estudiante.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesMatricula = filterMatricula === 'all' || 
            (filterMatricula === 'matriculado' && estudiante.matriculado) ||
            (filterMatricula === 'no_matriculado' && !estudiante.matriculado);
        
        return matchesSearch && matchesMatricula;
    });

    const handleCreateEstudiante = async (estudianteData) => {
        try {
            await createEstudiante(estudianteData);
            toast.success('Estudiante creado exitosamente');
            setShowCreateModal(false);
        } catch (error) {
            toast.error('Error al crear estudiante');
        }
    };

    const handleUpdateEstudiante = async (estudianteData) => {
        try {
            await updateEstudiante(selectedEstudiante.id, estudianteData);
            toast.success('Estudiante actualizado exitosamente');
            setShowEditModal(false);
            setSelectedEstudiante(null);
        } catch (error) {
            toast.error('Error al actualizar estudiante');
        }
    };

    const handleDeleteEstudiante = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas inactivar este estudiante?')) {
            try {
                await deleteEstudiante(id);
                toast.success('Estudiante inactivado exitosamente');
            } catch (error) {
                toast.error('Error al inactivar estudiante');
            }
        }
    };

    const handleActivateEstudiante = async (id) => {
        try {
            await activateEstudiante(id, selectedCiclo);
            toast.success('Estudiante activado exitosamente');
        } catch (error) {
            toast.error('Error al activar estudiante');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-3">
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={selectedCiclo || ''}
                            onChange={(e) => setSelectedCiclo(e.target.value)}
                            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={ciclosLoading}
                        >
                            <option value="">Seleccionar Ciclo</option>
                            {ciclosActivos.map(ciclo => (
                                <option key={ciclo.id} value={ciclo.id}>
                                    {ciclo.nombre}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterMatricula}
                            onChange={(e) => setFilterMatricula(e.target.value)}
                            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="all">Todos</option>
                            <option value="matriculado">Matriculados</option>
                            <option value="no_matriculado">No Matriculados</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-secondary-600">
                            {filteredEstudiantes.length} estudiante(s) encontrado(s)
                        </span>
                        <button
                            onClick={() => refreshEstudiantes(selectedCiclo)}
                            className="btn-secondary"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            {filteredEstudiantes.length === 0 ? (
                <div className="card p-8 text-center">
                    <GraduationCap className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        No se encontraron estudiantes
                    </h3>
                    <p className="text-secondary-600">
                        {searchTerm || filterMatricula !== 'all' 
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
                                        Estudiante
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        DNI
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Teléfono
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Carrera
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Estado Matrícula
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                                {filteredEstudiantes.map((estudiante) => (
                                    <tr key={estudiante.id} className="hover:bg-secondary-50">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <GraduationCap className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div className='ml-4'>
                                                    <div className="text-sm font-medium text-secondary-900">
                                                        {estudiante.first_name} {estudiante.last_name}
                                                    </div>
                                                    {estudiante.direccion && (
                                                        <div className="text-sm text-secondary-400">
                                                            {estudiante.direccion}
                                                        </div>
                                                    )}
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
                                            {estudiante.phone || '-'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {estudiante.carrera?.nombre || 'Sin asignar'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                estudiante.matriculado 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {estudiante.matriculado ? 'Matriculado' : 'No Matriculado'}
                                            </span>
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
                                                {!estudiante.is_active && (
                                                    <button
                                                        onClick={() => handleActivateEstudiante(estudiante.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Activar"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteEstudiante(estudiante.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Inactivar"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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