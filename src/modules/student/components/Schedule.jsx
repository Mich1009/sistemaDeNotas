import React from 'react';
import { Calendar } from 'lucide-react';

const Schedule = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Calendar size={64} className="mx-auto text-purple-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Horario
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Horario del panel estudiantil.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-800 font-medium">
                        Aquí podrás consultar tu horario de clases, 
                        ver las fechas de exámenes, revisar eventos académicos y planificar tu tiempo de estudio.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Schedule;