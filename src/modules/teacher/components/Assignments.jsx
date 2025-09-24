import React from 'react';
import { FileText } from 'lucide-react';

const Assignments = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FileText size={64} className="mx-auto text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Tareas y Evaluaciones
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Tareas y Evaluaciones del panel docente.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
                        Aquí podrás crear y gestionar tareas, exámenes y evaluaciones para tus cursos, 
                        establecer fechas de entrega, revisar trabajos enviados y proporcionar retroalimentación.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Assignments;