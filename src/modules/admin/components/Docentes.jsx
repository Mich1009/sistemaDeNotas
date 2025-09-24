import React from 'react';
import { Users } from 'lucide-react';

const Docente = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Users size={64} className="mx-auto text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Gestión de Docentes
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Gestión de Docentes del panel de administración.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
                        Aquí podrás administrar todos los usuarios del sistema, crear nuevos usuarios, 
                        editar perfiles existentes y gestionar roles y permisos.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Docente;