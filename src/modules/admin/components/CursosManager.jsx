import React, { useState } from 'react';
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    Users,
    UserPlus,
    UserMinus,
    Clock,
    MapPin,
    Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCursos } from '../hooks';
import CursoModal from './CursoModal';

const CursosManager = () => {
    const {
        cursos,
        ciclos,
        loading,
        error,
        createCurso,
        updateCurso,
        deleteCurso,
        assignDocenteToCurso,
        unassignDocenteFromCurso,
        refreshCursos
    } = useCursos();

    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCiclo, setSelectedCiclo] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    // Filter cursos based on search term, selected ciclo, and year
    const getFilteredCursos = () => {
        let filteredCursos = cursos;

        // Filter by year first (based on ciclo's año)
        if (selectedYear) {
            filteredCursos = filteredCursos.filter(curso => {
                const ciclo = ciclos.find(c => c.id === curso.ciclo_id);
                return ciclo && ciclo.año && ciclo.año.toString() === selectedYear;
            });
        }

        // Filter by ciclo if selected
        if (selectedCiclo) {
            filteredCursos = filteredCursos.filter(curso =>
                curso.ciclo_id === parseInt(selectedCiclo)
            );
        }

        // Filter by search term
        return filteredCursos.filter(curso => {
            const searchFields = [
                curso.nombre,
                curso.codigo,
                curso.descripcion,
                curso.docente_nombre
            ].filter(Boolean);

            return searchFields.some(field =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    };

    const handleCreateCurso = async (cursoData) => {
        try {
            await createCurso(cursoData);
            toast.success('Curso creado exitosamente');
            setShowCreateModal(false);
        } catch (error) {
            toast.error('Error al crear curso');
        }
    };

    const handleUpdateCurso = async (cursoData) => {
        try {
            await updateCurso(selectedCurso.id, cursoData);
            toast.success('Curso actualizado exitosamente');
            setShowEditModal(false);
            setSelectedCurso(null);
        } catch (error) {
            toast.error('Error al actualizar curso');
        }
    };

    const handleDeleteCurso = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
            try {
                await deleteCurso(id);
                toast.success('Curso eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar curso');
            }
        }
    };

    const CursoCard = ({ curso }) => {
        // Obtener el año del ciclo al que pertenece el curso
        const ciclo = ciclos.find(c => c.id === curso.ciclo_id);
        const añoCurso = ciclo ? ciclo.año : null;

        return (
            <div className="card p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-secondary-900">{curso.nombre}</h3>
                            </div>
                            {curso.descripcion && (
                                <p className="text-sm text-secondary-600 mt-1">{curso.descripcion}</p>
                            )}
                            {/* Información del docente y ciclo */}
                            <div className="mt-2 space-y-1">
                                {curso.docente_nombre && (
                                    <p className="text-xs text-secondary-500">
                                        Docente: {curso.docente_nombre}
                                    </p>
                                )}
                                <div className='flex items-center gap-3'>
                                    <p className="text-xs text-secondary-500">
                                        Ciclo: {curso.ciclo_nombre}
                                    </p>
                                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-medium">
                                        {añoCurso}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => {
                                setSelectedCurso(curso);
                                setShowEditModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteCurso(curso.id)}
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

    const filteredCursos = getFilteredCursos();

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
                    <h2 className="text-2xl font-bold text-secondary-900">Gestión de Cursos</h2>
                    <p className="text-secondary-600 mt-1">
                        Administra los cursos del programa de Desarrollo de Software
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Curso</span>
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
                                placeholder="Buscar cursos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-secondary-300 bg-white text-gray-900 rounded-lg 
                                           focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-3 border border-secondary-300 bg-white text-gray-900 rounded-lg 
                                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Todos los años</option>
                            {[...new Set(ciclos.map(ciclo => ciclo.año))].sort((a, b) => b - a).map(año => (
                                <option key={año} value={año}>
                                    {año}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedCiclo}
                            onChange={(e) => setSelectedCiclo(e.target.value)}
                            className="px-4 py-3 border border-secondary-300 bg-white text-gray-900 rounded-lg 
                                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Todos los ciclos</option>
                            {ciclos
                                .filter(ciclo => !selectedYear || ciclo.año.toString() === selectedYear)
                                .map(ciclo => (
                                    <option key={ciclo.id} value={ciclo.id}>
                                        {ciclo.nombre}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-secondary-600">
                            {filteredCursos.length} curso(s) encontrado(s)
                        </span>
                        <button
                            onClick={refreshCursos}
                            className="btn-secondary"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {filteredCursos.length === 0 ? (
                <div className="card p-8 text-center">
                    <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        No se encontraron cursos
                    </h3>
                    <p className="text-secondary-600">
                        {searchTerm || selectedCiclo
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Comienza agregando tu primer curso'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCursos.map((curso) => (
                        <CursoCard key={curso.id} curso={curso} />
                    ))}
                </div>
            )}

            {/* Modals */}
            <CursoModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateCurso}
                mode="create"
                ciclos={ciclos}
            />

            <CursoModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedCurso(null);
                }}
                onSubmit={handleUpdateCurso}
                mode="edit"
                initialData={selectedCurso}
                ciclos={ciclos}
            />
        </div>
    );
};

export default CursosManager;