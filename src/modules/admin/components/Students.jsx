import React, { useState } from 'react';
import { 
    GraduationCap, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Eye, 
    UserCheck,
    Filter,
    Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEstudiantes } from '../hooks';

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
        refreshEstudiantes 
    } = useEstudiantes();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Filter estudiantes based on search term and status
    const filteredEstudiantes = estudiantes.filter(estudiante => {
        const matchesSearch = 
            estudiante.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.dni?.includes(searchTerm) ||
            estudiante.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || 
            (filterStatus === 'active' && estudiante.activo) ||
            (filterStatus === 'inactive' && !estudiante.activo);
        
        return matchesSearch && matchesStatus;
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
        if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
            try {
                await deleteEstudiante(id);
                toast.success('Estudiante eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar estudiante');
            }
        }
    };

    const handleActivateEstudiante = async (id) => {
        try {
            await activateEstudiante(id);
            toast.success('Estudiante activado exitosamente');
        } catch (error) {
            toast.error('Error al activar estudiante');
        }
    };

    const EstudianteCard = ({ estudiante }) => (
        <div className="card p-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-secondary-900">
                            {estudiante.nombres} {estudiante.apellidos}
                        </h3>
                        <p className="text-sm text-secondary-600">DNI: {estudiante.dni}</p>
                        <p className="text-sm text-secondary-600">{estudiante.email}</p>
                        <div className="flex items-center mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                estudiante.activo 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {estudiante.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
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
                    {!estudiante.activo && (
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
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="all">Todos</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-secondary-600">
                            {filteredEstudiantes.length} estudiante(s) encontrado(s)
                        </span>
                        <button
                            onClick={refreshEstudiantes}
                            className="btn-secondary"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Students Grid */}
            {filteredEstudiantes.length === 0 ? (
                <div className="card p-8 text-center">
                    <GraduationCap className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        No se encontraron estudiantes
                    </h3>
                    <p className="text-secondary-600">
                        {searchTerm || filterStatus !== 'all' 
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Comienza agregando tu primer estudiante'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEstudiantes.map((estudiante) => (
                        <EstudianteCard key={estudiante.id} estudiante={estudiante} />
                    ))}
                </div>
            )}

            {/* TODO: Add modals for create and edit */}
            {/* CreateEstudianteModal */}
            {/* EditEstudianteModal */}
        </div>
    );
};

export default Students;