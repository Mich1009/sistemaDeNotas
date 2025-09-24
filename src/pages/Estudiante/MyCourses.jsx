import React from 'react';
import { BookOpen } from 'lucide-react';

const MyCourses = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <BookOpen size={64} className="mx-auto text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Mis Cursos
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Mis Cursos del panel estudiantil.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
                        Aquí podrás ver todos los cursos en los que estás matriculado, 
                        acceder al contenido del curso, revisar materiales de estudio y seguir tu progreso académico.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyCourses;