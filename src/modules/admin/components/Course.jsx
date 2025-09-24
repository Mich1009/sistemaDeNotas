import React from 'react';
import { BookOpen } from 'lucide-react';

const Courses = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <BookOpen size={64} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Gestión de Cursos
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Gestión de Cursos del panel de administración.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                        Aquí podrás administrar todos los cursos del sistema, crear nuevos cursos, 
                        editar información de cursos existentes, asignar docentes y gestionar el contenido académico.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Courses;