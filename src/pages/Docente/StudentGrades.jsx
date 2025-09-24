import React from 'react';
import { Award } from 'lucide-react';

const StudentGrades = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Award size={64} className="mx-auto text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Calificaciones
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Calificaciones del panel docente.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-medium">
                        Aquí podrás gestionar las calificaciones de tus estudiantes, 
                        ingresar notas de exámenes y tareas, calcular promedios y generar reportes de calificaciones.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentGrades;