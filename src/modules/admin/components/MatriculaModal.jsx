import { Search, XCircle, Hash } from 'lucide-react';

const MatriculaModal = ({
    showModal,
    onClose,
    dniSearch,
    setDniSearch,
    selectedEstudiante,
    searchingStudent,
    handleSearchByDni,
    clearStudentSearch,
    selectedCiclo,
    setSelectedCiclo,
    ciclosDisponibles,
    codigoMatricula,
    setCodigoMatricula,
    handleMatricular,
    loading
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Nueva Matrícula</h2>
                    <button
                        onClick={onClose}
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
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
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        >
                            <option value="">Seleccionar ciclo</option>
                            {ciclosDisponibles
                                .filter(ciclo => ciclo.año === new Date().getFullYear())
                                .map(ciclo => (
                                <option
                                    key={ciclo.id}
                                    value={ciclo.id}
                                    disabled={!ciclo.puede_matricularse}
                                    title={ciclo.razon}
                                >
                                    {ciclo.nombre} {!ciclo.puede_matricularse ? `(${ciclo.razon})` : ''}
                                </option>
                            ))}
                        </select>
                        {selectedEstudiante && ciclosDisponibles.filter(ciclo => ciclo.año === new Date().getFullYear()).length === 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                                No hay ciclos disponibles para este estudiante en el año actual
                            </p>
                        )}
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
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
                        onClick={onClose}
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
    );
};

export default MatriculaModal;