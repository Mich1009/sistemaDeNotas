import React from 'react';
import { TrendingUp } from 'lucide-react';

const TeacherReports = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <TrendingUp size={64} className="mx-auto text-indigo-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Reportes
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Reportes del panel docente.
                </p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p className="text-indigo-800 font-medium">
                        Aquí podrás generar reportes de rendimiento de tus estudiantes, 
                        estadísticas de tus cursos, análisis de calificaciones y reportes académicos personalizados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TeacherReports;