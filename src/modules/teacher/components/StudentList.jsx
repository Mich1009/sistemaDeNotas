import React from 'react'
import { BookOpen, Users, FileText, Edit, Eye, Search, Filter, Calendar } from 'lucide-react';

const StudentList = ({ students, loading, selectedCourse, handleBackToList }) => {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Users className="mr-2" /> Estudiantes de {selectedCourse.nombre}
                </h1>
                <button
                    onClick={handleBackToList}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                    Volver a mis cursos
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Información del curso</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <span className="text-sm text-gray-500">Ciclo:</span>
                            <p className="font-medium">{selectedCourse.ciclo_nombre}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Año:</span>
                            <p className="font-medium">{selectedCourse.ciclo_año}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando estudiantes...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-600">No hay estudiantes matriculados en este curso</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>    
                                    <th className="py-3 w-1 px-4 text-left text-sm font-semibold text-gray-700">N°</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">DNI</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Apellido</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {students.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{student.dni}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{student.first_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{student.last_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{student.email}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{student.phone || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentList