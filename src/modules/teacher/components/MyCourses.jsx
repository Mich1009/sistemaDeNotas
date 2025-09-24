import React from 'react';
import { BookOpen } from 'lucide-react';

const MyCourses = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <BookOpen size={64} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Mis Cursos
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Mis Cursos del panel docente.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                        Aquí podrás ver y gestionar todos los cursos que tienes asignados, 
                        revisar el contenido del curso, gestionar estudiantes matriculados y actualizar información del curso.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyCourses;