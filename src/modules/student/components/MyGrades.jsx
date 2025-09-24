import React from 'react';
import { Award } from 'lucide-react';

const MyGrades = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Award size={64} className="mx-auto text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Mis Calificaciones
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Mis Calificaciones del panel estudiantil.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-medium">
                        Aquí podrás consultar todas tus calificaciones por curso, 
                        ver tu promedio general, revisar el historial de notas y seguir tu rendimiento académico.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyGrades;