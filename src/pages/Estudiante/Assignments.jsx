import React from 'react';
import { CheckCircle } from 'lucide-react';

const Assignments = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Tareas
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Tareas del panel estudiantil.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                        Aquí podrás ver todas tus tareas pendientes y completadas, 
                        entregar trabajos, revisar fechas de entrega y consultar la retroalimentación de tus profesores.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Assignments;