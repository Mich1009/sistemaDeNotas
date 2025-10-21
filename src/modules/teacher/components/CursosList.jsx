import React from 'react';
import { BookOpen, Users, Search, Filter, Calendar, Clock } from 'lucide-react';

const CursosList = ({
    handleViewStudents,
    loading,
    setSelectedYear,
    setSelectedCycle,
    selectedYear,
    selectedCycle,
    searchTerm,
    setSearchTerm,
    availableCycles,
    availableYears,
    filteredCourses,
    selectedStatus,
    setSelectedStatus
}) => {
    const now = new Date();

    return (
        <div className="p-3">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <BookOpen className="mr-2" /> Mis Cursos
            </h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div className="flex gap-4 flex-1">
                        {/* Search */}
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Year Filter */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                    setSelectedCycle('');
                                }}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
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
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                value={selectedCycle}
                                onChange={(e) => setSelectedCycle(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                            >
                                <option value="">Todos los ciclos</option>
                                {availableCycles.map(cycle => (
                                    <option key={cycle} value={cycle}>
                                        {cycle}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 🔹 Status Filter */}
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                            >
                                <option value="">Todos los estados</option>
                                <option value="Activo">Activos</option>
                                <option value="Inactivo">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center mt-4 md:mt-0">
                        <Filter className="mr-2 text-gray-500" size={18} />
                        <span className="text-gray-700">Total: {filteredCourses.length} cursos</span>
                    </div>

                </div>

                {/* Lista de cursos */}
                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando cursos...</p>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-600">No se encontraron cursos</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const start = new Date(course.fecha_inicio);
                            const end = new Date(course.fecha_fin);
                            const isActive = now >= start && now <= end;
                            const status = isActive ? 'Activo' : 'Finalizado';

                            return (
                                <div key={course.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-4 border-b">
                                        <h3 className="text-lg font-semibold text-gray-800">{course.nombre}</h3>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-sm text-gray-500">Ciclo: {course.ciclo_nombre}</p>
                                            <p className="text-sm text-blue-600 font-medium">Año: {course.ciclo_año}</p>
                                        </div>
                                        <p className={`mt-2 text-sm font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            Estado: {status}
                                        </p>
                                    </div>

                                    <div className="p-4 py-2 items-center flex justify-between">
                                        <div className="flex items-center">
                                            <Users size={16} className="text-green-500 mr-2" />
                                            <span className="text-sm">Estudiantes: {course.total_estudiantes || 0}</span>
                                        </div>
                                        <button
                                            onClick={() => handleViewStudents(course.id)}
                                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center text-sm"
                                        >
                                            <Users size={14} className="mr-1" /> Estudiantes
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CursosList;
