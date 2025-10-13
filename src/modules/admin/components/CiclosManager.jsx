import React, { useState } from 'react';
import {
    Calendar,
    Plus,
    Search,
    Edit,
    Trash2,
    Clock,
    CalendarDays,
    BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCursos } from '../hooks';
import CicloModal from './CicloModal';

const CiclosManager = () => {
    const {
        ciclos,
        cursos,
        loading,
        error,
        createCiclo,
        updateCiclo,
        deleteCiclo,
        refreshCiclos
    } = useCursos();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCiclo, setSelectedCiclo] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Filter ciclos based on search term, year, and status
    const getFilteredCiclos = () => {
        return ciclos.filter(ciclo => {
            const searchFields = [
                ciclo.nombre,
                ciclo.descripcion
            ].filter(Boolean);

            const matchesSearch = searchFields.some(field =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesYear = selectedYear === '' || 
                (ciclo.año && ciclo.año.toString() === selectedYear);

            // Determine status for filtering
            const fechaInicio = new Date(ciclo.fecha_inicio);
            const fechaFin = new Date(ciclo.fecha_fin);
            const now = new Date();

            let cicloStatus;
            if (now < fechaInicio) {
                cicloStatus = 'Próximo';
            } else if (now >= fechaInicio && now <= fechaFin) {
                cicloStatus = 'Activo';
            } else {
                cicloStatus = 'Finalizado';
            }

            const matchesStatus = selectedStatus === '' || cicloStatus === selectedStatus;

            return matchesSearch && matchesYear && matchesStatus;
        });
    };

    // Get courses count for a ciclo
    const getCursosCountForCiclo = (cicloId) => {
        return cursos.filter(curso => curso.ciclo_id === cicloId).length;
    };

    const handleCreateCiclo = async (cicloData) => {
        try {
            await createCiclo(cicloData);
            toast.success('Ciclo creado exitosamente');
            setShowCreateModal(false);
        } catch (error) {
            toast.error('Error al crear ciclo');
        }
    };

    const handleUpdateCiclo = async (cicloData) => {
        try {
            await updateCiclo(selectedCiclo.id, cicloData);
            toast.success('Ciclo actualizado exitosamente');
            setShowEditModal(false);
            setSelectedCiclo(null);
        } catch (error) {
            toast.error('Error al actualizar ciclo');
        }
    };

    const handleDeleteCiclo = async (id) => {
        const cursosCount = getCursosCountForCiclo(id);

        if (cursosCount > 0) {
            toast.error(`No se puede eliminar el ciclo porque tiene ${cursosCount} curso(s) asignado(s)`);
            return;
        }

        if (window.confirm('¿Estás seguro de que deseas eliminar este ciclo? Esta acción no se puede deshacer.')) {
            try {
                await deleteCiclo(id);
                toast.success('Ciclo eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar ciclo');
            }
        }
    };

    const CicloCard = ({ ciclo }) => {
        const cursosCount = getCursosCountForCiclo(ciclo.id);
        const fechaInicio = new Date(ciclo.fecha_inicio);
        const fechaFin = new Date(ciclo.fecha_fin);
        const now = new Date();

        // Determinar el estado del ciclo
        let estado;
        let estadoColor;

        if (now < fechaInicio) {
            estado = 'Próximo';
            estadoColor = 'bg-blue-100 text-blue-800';
        } else if (now >= fechaInicio && now <= fechaFin) {
            estado = 'Activo';
            estadoColor = 'bg-green-100 text-green-800';
        } else {
            estado = 'Finalizado';
            estadoColor = 'bg-red-100 text-red-800';
        }

        return (
            <div className="card p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-secondary-900">{ciclo.nombre} - {ciclo.numero}</h3>
                                <span className={`text-xs px-2 py-1 rounded ${estadoColor}`}>
                                    {estado}
                                </span>
                                {ciclo.año && (
                                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                        {ciclo.año}
                                    </span>
                                )}
                            </div>

                            {ciclo.descripcion && (
                                <p className="text-sm text-secondary-600 mb-2">{ciclo.descripcion}</p>
                            )}

                            {/* Fechas */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                {fechaInicio && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                                        <CalendarDays className="w-3 h-3 mr-1" />
                                        Inicio: {fechaInicio.toLocaleDateString('es-ES')}
                                    </span>
                                )}
                                {fechaFin && (
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Fin: {fechaFin.toLocaleDateString('es-ES')}
                                    </span>
                                )}
                            </div>

                            {/* Información de cursos */}
                            <div className="flex items-center space-x-2">
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center">
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    {cursosCount} curso(s)
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => {
                                setSelectedCiclo(ciclo);
                                setShowEditModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteCiclo(ciclo.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const filteredCiclos = getFilteredCiclos();

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
                    <h2 className="text-2xl font-bold text-secondary-900">Gestión de Ciclos</h2>
                    <p className="text-secondary-600 mt-1">
                        Administra los ciclos académicos del programa de Desarrollo de Software
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Ciclo</span>
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
                                placeholder="Buscar ciclos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-secondary-300 bg-white text-gray-900 rounded-lg 
                                            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-secondary-300 bg-white text-gray-900 rounded-lg 
                                            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">Todos los años</option>
                                {[...new Set(ciclos.map(ciclo => ciclo.año).filter(Boolean))].sort((a, b) => b - a).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-secondary-300 bg-white text-gray-900 rounded-lg 
                                            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">Todos los estados</option>
                                <option value="Próximo">Próximo</option>
                                <option value="Activo">Activo</option>
                                <option value="Finalizado">Finalizado</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-secondary-600">
                            {filteredCiclos.length} ciclo(s) encontrado(s)
                        </span>
                        <button
                            onClick={refreshCiclos}
                            className="btn-secondary"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {filteredCiclos.length === 0 ? (
                <div className="card p-8 text-center">
                    <Calendar className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        No se encontraron ciclos
                    </h3>
                    <p className="text-secondary-600">
                        {searchTerm
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Comienza agregando tu primer ciclo académico'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCiclos.map((ciclo) => (
                        <CicloCard key={ciclo.id} ciclo={ciclo} />
                    ))}
                </div>
            )}

            {/* Modals */}
            <CicloModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateCiclo}
                mode="create"
            />

            <CicloModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedCiclo(null);
                }}
                onSubmit={handleUpdateCiclo}
                mode="edit"
                initialData={selectedCiclo}
            />
        </div>
    );
};

export default CiclosManager;