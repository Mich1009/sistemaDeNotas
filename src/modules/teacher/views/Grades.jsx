import React from 'react';
import { BookOpen, Users, FileText, Search, Filter } from 'lucide-react';
import useAuthStore from '../../auth/store/authStore';
import useCoursesFilter from '../hooks/useCoursesFilter';
import useGrades from '../hooks/useGrades';
import TableNota from '../components/TableNota';

const Grades = () => {
    const user = useAuthStore(state => state.user);

    // Hook para filtros de cursos
    const {
        filteredCourses,
        loading: coursesLoading,
        searchTerm,
        selectedYear,
        selectedCycle,
        selectedStatus,
        availableYears,
        availableCycles,
        setSearchTerm,
        setSelectedYear,
        setSelectedCycle,
        setSelectedStatus
    } = useCoursesFilter();

    // Hook para manejo de notas
    const {
        selectedCourse,
        students,
        loading: gradesLoading,
        editableGrades,
        hasChanges,
        savingRows,
        handleCourseSelect,
        handleGradeChange,
        handleSaveStudentGrades,
        handleSaveAllGrades,
        hasUnsavedChanges,
        calculateStudentAverage,
        calculateCourseAverage
    } = useGrades();

    const loading = coursesLoading || gradesLoading;

    return (
        <div className="p-3">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <FileText className="mr-2" /> Sistema de Calificaciones
            </h1>

            {/* Selección de Curso con Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-3">
                <h2 className="text-lg font-semibold text-gray-700">Seleccione un curso</h2>

                {/* Filtros */}
                <div className="flex gap-3 mb-3">
                    {/* Búsqueda */}
                    <div className="relative w-80">
                        <input
                            type="text"
                            placeholder="Buscar curso..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    {/* Filtro por Año */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos los años</option>
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    {/* Filtro por Ciclo */}
                    <select
                        value={selectedCycle}
                        onChange={(e) => setSelectedCycle(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos los ciclos</option>
                        {availableCycles.map(cycle => (
                            <option key={cycle} value={cycle}>{cycle}</option>
                        ))}
                    </select>

                    {/* Filtro por Estado */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos los estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>

                {loading && !selectedCourse ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando cursos...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredCourses.map((course) => (
                            <button
                                key={course.id}
                                onClick={() => handleCourseSelect(course.id)}
                                className={`p-4 border rounded-lg text-left transition-all ${selectedCourse === course.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                            >
                                <h3 className="font-medium text-gray-800">{course.nombre}</h3>
                                <div className='flex items-center justify-between mt-1'>
                                    <p className="text-sm text-gray-500">Ciclo: {course.ciclo_nombre} - {course.ciclo_año}</p>
                                    <div className="flex items-center">
                                        <Users size={14} className="text-gray-400 mr-1" />
                                        <span className="text-xs text-gray-500">{course.total_estudiantes || 0} estudiantes</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Gestión de Notas */}
            {selectedCourse && (
                <TableNota
                    courses={filteredCourses}
                    students={students}
                    selectedCourse={selectedCourse}
                    calculateCourseAverage={calculateCourseAverage}
                    calculateStudentAverage={calculateStudentAverage}
                    handleSaveAllGrades={handleSaveAllGrades}
                    handleSaveStudentGrades={handleSaveStudentGrades}
                    handleGradeChange={handleGradeChange}
                    hasChanges={hasChanges}
                    hasUnsavedChanges={hasUnsavedChanges}
                    loading={loading}
                    savingRows={savingRows}
                    editableGrades={editableGrades}
                />
            )}
        </div>
    );
};

export default Grades;