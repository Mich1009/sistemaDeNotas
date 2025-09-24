import React from 'react';
import { GraduationCap } from 'lucide-react';

const StudentManagement = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <GraduationCap size={64} className="mx-auto text-purple-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Gestión de Estudiantes
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Gestión de Estudiantes del panel de administración.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-800 font-medium">
                        Aquí podrás administrar todos los estudiantes del sistema, ver sus perfiles, 
                        gestionar matrículas, revisar el progreso académico y administrar la información estudiantil.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;