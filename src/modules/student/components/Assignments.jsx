import React from 'react';
import { CheckCircle, Eye, Calendar, User, BookOpen } from 'lucide-react';

const Assignments = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Tareas y Asignaciones</h1>
                    <p className="text-secondary-600 mt-2">Consulta tus tareas y asignaciones (Solo lectura)</p>
                </div>
                <div className="flex items-center space-x-2">
                    <CheckCircle className="w-8 h-8 text-primary-600" />
                </div>
            </div>

            {/* Información sobre permisos */}
            <div className="card p-6">
                <div className="flex items-start space-x-4">
                    <Eye className="w-6 h-6 text-blue-500 mt-1" />
                    <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                            Vista de Solo Lectura
                        </h3>
                        <p className="text-secondary-600 mb-4">
                            Como estudiante, tienes acceso de solo lectura a las tareas y asignaciones. 
                            No puedes entregar trabajos o modificar información desde esta interfaz.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 font-medium">
                                Para entregar tareas o realizar actividades, contacta directamente con tu docente 
                                o utiliza los canales oficiales de comunicación de la institución.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estado actual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 text-center">
                    <Calendar className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        Tareas Pendientes
                    </h3>
                    <p className="text-3xl font-bold text-orange-600 mb-2">--</p>
                    <p className="text-sm text-secondary-600">
                        Consulta con tu docente
                    </p>
                </div>

                <div className="card p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        Tareas Completadas
                    </h3>
                    <p className="text-3xl font-bold text-green-600 mb-2">--</p>
                    <p className="text-sm text-secondary-600">
                        Consulta con tu docente
                    </p>
                </div>

                <div className="card p-6 text-center">
                    <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                        Proyectos Activos
                    </h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">--</p>
                    <p className="text-sm text-secondary-600">
                        Consulta con tu docente
                    </p>
                </div>
            </div>

            {/* Mensaje informativo */}
            <div className="card p-8 text-center">
                <User className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    Información de Tareas
                </h3>
                <p className="text-secondary-600 mb-4">
                    Para obtener información detallada sobre tus tareas, fechas de entrega y retroalimentación, 
                    contacta directamente con tus docentes o revisa los canales oficiales de comunicación.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
                    <p className="text-yellow-800 font-medium">
                        <strong>Nota:</strong> Esta sección está configurada en modo de solo lectura. 
                        Los estudiantes no pueden entregar tareas o modificar información desde esta interfaz.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Assignments;