import { useState } from 'react';
import toast from 'react-hot-toast';
import { calificacionesService } from '../services/apiTeacher';

const useExcelGrades = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const uploadGradesFromExcel = async (courseId, file) => {
        if (!file) {
            toast.error('Por favor selecciona un archivo');
            return;
        }

        // Validar que es un archivo Excel
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        
        if (!validExtensions.includes(fileExtension)) {
            toast.error('Por favor selecciona un archivo Excel (.xlsx o .xls)');
            return;
        }

        setIsUploading(true);
        try {
            const result = await calificacionesService.uploadGradesFromExcel(courseId, file);
            
            if (result.notas_procesadas > 0) {
                toast.success(`✅ ${result.notas_procesadas} notas procesadas exitosamente`);
                
                if (result.errores && result.errores.length > 0) {
                    toast.error(`⚠️ ${result.errores.length} errores encontrados`);
                    console.log('Errores:', result.errores);
                }
            } else {
                toast.error('No se procesaron notas. Revisa el formato del archivo');
            }
            
            return result;
        } catch (error) {
            console.error('Error al cargar Excel:', error);
            toast.error('Error al procesar el archivo Excel');
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const downloadExcelTemplate = async (courseId) => {
        setIsDownloading(true);
        try {
            const blob = await calificacionesService.downloadExcelTemplate(courseId);
            
            // Crear URL para descargar el archivo
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `plantilla_notas_curso_${courseId}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Plantilla Excel descargada exitosamente');
        } catch (error) {
            console.error('Error al descargar plantilla:', error);
            toast.error('Error al descargar la plantilla Excel');
            throw error;
        } finally {
            setIsDownloading(false);
        }
    };

    return {
        isUploading,
        isDownloading,
        uploadGradesFromExcel,
        downloadExcelTemplate
    };
};

export default useExcelGrades;

