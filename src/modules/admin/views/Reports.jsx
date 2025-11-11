import React from 'react';
import { Network } from 'lucide-react';
import ReportesDinamicos from '../components/ReportesDinamicos';
import ReportOneStudent from '../components/ReportOneStudent';
import EstudiantesModal from '../components/EstudiantesModal';
import { useReportesDinamicos } from '../hooks/useReportesDinamicos';
import { useReportes } from '../hooks/useReportes';

const Reports = () => {
    // Hook para manejar el estado del modal de estudiantes
    const {
        modalEstudiantes,
        cerrarModalEstudiantes,
        abrirModalEstudiantes,
    } = useReportesDinamicos();
    // Hook para manejar el estado del reporte
    const {
        viewTypeReport,
        toggleViewTypeReport,
    } = useReportes();

    return (
        <div className="px-3">

            {viewTypeReport ? (
                <ReportOneStudent toggleViewTypeReport={toggleViewTypeReport} />
            ) : (
                <ReportesDinamicos 
                    abrirModalEstudiantes={abrirModalEstudiantes} 
                    toggleViewTypeReport={toggleViewTypeReport}
                />
            )}

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