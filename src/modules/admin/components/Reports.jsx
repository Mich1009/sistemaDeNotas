import React from 'react';
import { FileText } from 'lucide-react';

const Reports = () => {
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FileText size={64} className="mx-auto text-orange-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Reportes
                </h2>
                <p className="text-gray-600 mb-4">
                    Estás en la sección de Reportes del panel de administración.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-orange-800 font-medium">
                        Aquí podrás generar y visualizar reportes del sistema, estadísticas académicas, 
                        reportes de rendimiento, informes de usuarios y análisis de datos del sistema educativo.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reports;