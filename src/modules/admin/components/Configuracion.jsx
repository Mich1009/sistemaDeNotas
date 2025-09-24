import React from 'react';
import { Settings } from 'lucide-react';

const Configuracion = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Settings size={64} className="mx-auto text-gray-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Configuración del Sistema
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Configuración del Sistema del panel de administración.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 font-medium">
                        Aquí podrás configurar los parámetros del sistema, ajustar configuraciones generales, 
                        gestionar permisos globales, configurar notificaciones y personalizar el comportamiento del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Configuracion;