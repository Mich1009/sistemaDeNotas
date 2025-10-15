import React, { useState } from 'react';
import { 
    Users, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Eye, 
    UserCheck,
    BookOpen,
    Mail,
    Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocentes } from '../hooks';
import DocenteModal from './DocenteModal';
import ViewCursos from './ViewCursos';

const Docentes = () => {
    const { 
        docentes, 
        loading, 
        error, 
        createDocente, 
        updateDocente, 
        deleteDocente,
        searchDocenteByDni,
        getDocenteCursos,
        refreshDocentes 
    } = useDocentes();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedDocente, setSelectedDocente] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewCursosModal, setShowViewCursosModal] = useState(false);
    const [docenteCursos, setDocenteCursos] = useState([]);

    // Filter docentes based on search term and status
    const filteredDocentes = docentes.filter(docente => {
        const matchesSearch = 
            docente.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            docente.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            docente.dni?.includes(searchTerm) ||
            docente.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || 
            (filterStatus === 'active' && docente.is_active) ||
            (filterStatus === 'inactive' && !docente.is_active);
        
        return matchesSearch && matchesStatus;
    });

    const handleCreateDocente = async (docenteData) => {
        try {
            await createDocente(docenteData);
            toast.success('Docente creado exitosamente');
            setShowCreateModal(false);
        } catch (error) {
            toast.error('Error al crear docente');
        }
    };

    const handleUpdateDocente = async (docenteData) => {
        try {
            await updateDocente(selectedDocente.id, docenteData);
            toast.success('Docente actualizado exitosamente');
            setShowEditModal(false);
            setSelectedDocente(null);
        } catch (error) {
            toast.error('Error al actualizar docente');
        }
    };

    const handleDeleteDocente = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar definitivamente este docente? Esta acción no se puede deshacer.')) {
            try {
                await deleteDocente(id);
                toast.success('Docente eliminado definitivamente');
            } catch (error) {
                toast.error('Error al eliminar docente');
            }
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
        <div className="space-y-6 p-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Gestión de Docentes</h1>
                    <p className="text-secondary-600 mt-2">
                        Administra los docentes del sistema educativo
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Docente</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar docentes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white text-gray-900 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 min-w-[380px]"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 bg-white text-gray-900 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 min-w-[140px]"
                        >
                            <option value="all">Todos</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-secondary-600">
                            {filteredDocentes.length} docente(s) encontrado(s)
                        </span>
                        <button
                            onClick={refreshDocentes}
                            className="btn-secondary"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Docentes Table */}
            {filteredDocentes.length === 0 ? (
                <div className="card p-8 text-center">
                    <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        No se encontraron docentes
                    </h3>
                    <p className="text-secondary-600">
                        {searchTerm || filterStatus !== 'all' 
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Comienza agregando tu primer docente'
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
                                        Docente
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Grado
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
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                                {filteredDocentes.map((docente) => (
                                    <tr key={docente.id} className="hover:bg-secondary-50">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Users className="w-5 h-5 bg-blue-100 text-blue-600" />
                                                </div>
                                                <div className='ml-4'>
                                                    <div className="text-sm font-medium text-secondary-900">
                                                        {docente.first_name} {docente.last_name}
                                                    </div>
                                                    {docente.especialidad && (
                                                        <div className="text-sm text-secondary-400">
                                                            {docente.especialidad}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {docente.grado_academico || '-'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {docente.dni}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {docente.email}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-secondary-900">
                                            {docente.phone || '-'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                docente.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {docente.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const cursos = await getDocenteCursos(docente.id);
                                                            setDocenteCursos(cursos);
                                                            setSelectedDocente(docente);
                                                            setShowViewCursosModal(true);
                                                        } catch (error) {
                                                            toast.error('Error al obtener cursos del docente');
                                                        }
                                                    }}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Ver cursos"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDocente(docente);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDocente(docente.id)}
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
                </div>
            )}

            {/* TODO: Add modals for create and edit */}
            {/* DocenteModal para crear */}
            <DocenteModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateDocente}
                mode="create"
            />
            
            {/* DocenteModal para editar */}
            <DocenteModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedDocente(null);
                }}
                onSubmit={handleUpdateDocente}
                mode="edit"
                initialData={selectedDocente}
            />

            {/* ViewCursos modal */}
            <ViewCursos
                isOpen={showViewCursosModal}
                onClose={() => {
                    setShowViewCursosModal(false);
                    setSelectedDocente(null);
                    setDocenteCursos([]);
                }}
                docente={selectedDocente}
                docenteCursos={docenteCursos}
            />
        </div>
    );
};

export default Docentes;