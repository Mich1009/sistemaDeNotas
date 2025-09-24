import React from 'react';
import { User } from 'lucide-react';

const Profile = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <User size={64} className="mx-auto text-indigo-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Mi Perfil
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Mi Perfil del panel estudiantil.
                </p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p className="text-indigo-800 font-medium">
                        Aquí podrás ver y editar tu información personal, 
                        actualizar tus datos de contacto, cambiar tu contraseña y gestionar tus preferencias de cuenta.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;