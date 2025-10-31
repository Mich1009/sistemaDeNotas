import React from 'react';
import { Network } from 'lucide-react';
import ReportesDinamicos from '../components/ReportesDinamicos';
import EstudiantesModal from '../components/EstudiantesModal';
import { useReportesDinamicos } from '../hooks/useReportesDinamicos';

const Reports = () => {
    // Hook para manejar el estado del modal de estudiantes
    const {
        modalEstudiantes,
        cerrarModalEstudiantes,
        abrirModalEstudiantes
    } = useReportesDinamicos();

    return (
        <div className="px-3">


            {/* Contenido de Reportes Dinámicos */}
            <ReportesDinamicos abrirModalEstudiantes={abrirModalEstudiantes} />

            {/* Modal de estudiantes - Se renderiza globalmente */}
            <EstudiantesModal
                isOpen={modalEstudiantes.isOpen}
                onClose={cerrarModalEstudiantes}
                cursoId={modalEstudiantes.cursoId}
                cursoNombre={modalEstudiantes.cursoNombre}
                cicloId={modalEstudiantes.cicloId}
                cicloNombre={modalEstudiantes.cicloNombre}
                tipo={modalEstudiantes.tipo}
            />
        </div>
    );
};

export default Reports;