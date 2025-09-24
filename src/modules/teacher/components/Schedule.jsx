import React from 'react';
import { Calendar } from 'lucide-react';

const Schedule = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Calendar size={64} className="mx-auto text-purple-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Horarios
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Horarios del panel docente.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-800 font-medium">
                        Aquí podrás ver y gestionar tus horarios de clases, 
                        programar sesiones, revisar tu calendario académico y coordinar actividades educativas.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Schedule;