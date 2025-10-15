import React, { useState, useEffect } from 'react';
import { 
    X, 
    BookOpen, 
    Calendar,
    Users,
    Clock,
    Award,
    Search,
    Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cursosService } from '../services/apiAdmin';

const ViewCursos = ({ isOpen, onClose, docente, docenteCursos = [] }) => {
    const [cursos, setCursos] = useState([]);
    const [filteredCursos, setFilteredCursos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedCycle, setSelectedCycle] = useState('');
    const [allCiclos, setAllCiclos] = useState([]);

    // Obtener años únicos de todos los ciclos disponibles
    const availableYears = [...new Set(allCiclos.map(ciclo => 
        ciclo.año
    ))].filter(Boolean).sort((a, b) => b - a);

    // Usar todos los ciclos disponibles filtrados por año seleccionado
    const availableCycles = allCiclos
        .filter(ciclo => !selectedYear || ciclo.año?.toString() === selectedYear)
        .map(ciclo => ciclo.nombre)
        .sort();

    // Cargar todos los ciclos disponibles
    useEffect(() => {
        const fetchCiclos = async () => {
            try {
                const response = await cursosService.getCiclos();
                setAllCiclos(response || []);
            } catch (error) {
                console.error('Error al cargar ciclos:', error);
                toast.error('Error al cargar los ciclos');
            }
        };

        if (isOpen) {
            fetchCiclos();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && docenteCursos.length > 0) {
            setCursos(docenteCursos);
            setFilteredCursos(docenteCursos);
        }
    }, [isOpen, docenteCursos]);

    // Filtrar cursos cuando cambien los filtros
    useEffect(() => {
        let filtered = cursos;

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(curso =>
                curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                curso.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por año
        if (selectedYear) {
            filtered = filtered.filter(curso => 
                curso.ciclo_año?.toString() === selectedYear
            );
        }

        // Filtrar por ciclo
        if (selectedCycle) {
            filtered = filtered.filter(curso => 
                curso.ciclo_nombre === selectedCycle
            );
        }

        setFilteredCursos(filtered);
    }, [cursos, searchTerm, selectedYear, selectedCycle]);

    const handleClose = () => {
        setSearchTerm('');
        setSelectedYear('');
        setSelectedCycle('');
        setCursos([]);
        setFilteredCursos([]);
        setAllCiclos([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{marginTop: 0}} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-3 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Cursos del Docente
                            </h2>
                            <p className="text-sm text-gray-600">
                                {docente ? `${docente.first_name} ${docente.last_name}` : 'Docente'}
                                {filteredCursos.length > 0 && ` - ${filteredCursos.length} curso(s)`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar curso..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                            />
                        </div>

                        {/* Year Filter */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                    setSelectedCycle(''); // Reset cycle filter when year changes
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none appearance-none bg-white"
                            >
                                <option value="">Todos los años</option>
                                {availableYears.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Cycle Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                value={selectedCycle}
                                onChange={(e) => setSelectedCycle(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none appearance-none bg-white"
                            >
                                <option value="">Todos los ciclos</option>
                                {availableCycles.map(cycle => (
                                    <option key={cycle} value={cycle}>
                                        {cycle}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            <span className="ml-2 text-gray-600">Cargando cursos...</span>
                        </div>
                    ) : filteredCursos.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {cursos.length === 0 ? 'Sin cursos asignados' : 'No se encontraron cursos'}
                            </h3>
                            <p className="text-gray-600">
                                {cursos.length === 0 
                                    ? 'Este docente no tiene cursos asignados actualmente.'
                                    : 'Intenta ajustar los filtros para encontrar cursos.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCursos.map((curso) => (
                                <div
                                    key={curso.id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                {curso.nombre}
                                            </h4>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            curso.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {curso.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between space-x-4">
                                        {/* Ciclo y Año */}
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>
                                                {curso.ciclo_nombre} - {curso.ciclo_año}
                                            </span>
                                        </div>

                                        {/* Fechas del ciclo */}
                                        {(curso.ciclo_fecha_inicio || curso.ciclo_fecha_fin) && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span>
                                                    {curso.ciclo_fecha_inicio && new Date(curso.ciclo_fecha_inicio).toLocaleDateString('es-ES')}
                                                    {curso.ciclo_fecha_inicio && curso.ciclo_fecha_fin && ' - '}
                                                    {curso.ciclo_fecha_fin && new Date(curso.ciclo_fecha_fin).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Descripción */}
                                    {curso.descripcion && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-sm text-gray-600">
                                                {curso.descripcion}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewCursos;