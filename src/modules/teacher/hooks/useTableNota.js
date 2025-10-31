import { useState } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const useTableNota = () => {
    const [activeTab, setActiveTab] = useState('evaluaciones');
    const [searchTerm, setSearchTerm] = useState('');

    const filterStudents = (students) => {
        return students.filter(student => {
            const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase()) ||
                student.dni.includes(searchTerm);
        });
    };

    const getStudentStatus = (studentId, calculateStudentAverage) => {
        const average = calculateStudentAverage(studentId);
        if (!average) return 'SIN_NOTA';
        return average >= 13 ? 'APROBADO' : 'DESAPROBADO';
    };

    const formatGradeInput = (value) => {
        // Remover caracteres no numéricos excepto punto decimal
        let cleanValue = value.replace(/[^0-9.]/g, '');
        
        // Evitar múltiples puntos decimales
        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            cleanValue = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Limitar a máximo 20
        const numValue = parseFloat(cleanValue);
        if (numValue > 20) {
            cleanValue = '20';
        }
        
        // Formatear con ceros a la izquierda para números enteros menores a 10
        if (cleanValue && !cleanValue.includes('.')) {
            const intValue = parseInt(cleanValue);
            if (intValue >= 0 && intValue < 10) {
                cleanValue = '0' + intValue;
            }
        }
        
        return cleanValue;
    };

    const validateGradeInput = (value) => {
        if (!value) return true;
        
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 20;
    };

    // Función para exportar promedios a Excel
    const handleExportAverages = (courses, selectedCourse, filteredStudents, calculateStudentAverage) => {
        try {
            // Obtener información del curso
            const course = courses.find(c => c.id === selectedCourse);
            if (!course) {
                toast.error('No se encontró información del curso');
                return;
            }

            // Preparar datos para el Excel con el nuevo formato
            const excelData = filteredStudents.map((student, index) => {
                const promedio = calculateStudentAverage(student.id, 'all');
                return {
                    'N°': index + 1,
                    'Apellidos y Nombres': `${student.last_name}, ${student.first_name}`,
                    'Promedio General': promedio || '-'
                };
            });

            // Crear libro de trabajo
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(excelData);

            // Ajustar ancho de columnas
            const colWidths = [
                { wch: 5 },  // N°
                { wch: 35 }, // Apellidos y Nombres
                { wch: 15 }  // Promedio General
            ];
            ws['!cols'] = colWidths;

            // Agregar hoja al libro
            XLSX.utils.book_append_sheet(wb, ws, 'Promedios');

            // Generar nombre del archivo
            const fileName = `Promedios_${course.nombre.replace(/\s+/g, '_')}_${course.ciclo_año || new Date().getFullYear()}.xlsx`;

            // Descargar archivo
            XLSX.writeFile(wb, fileName);
            
            toast.success('✅ Archivo Excel exportado exitosamente');
        } catch (error) {
            console.error('Error al exportar promedios:', error);
            toast.error('Error al exportar el archivo Excel');
        }
    };

    const resetSearch = () => {
        setSearchTerm('');
    };

    const resetTab = () => {
        setActiveTab('evaluaciones');
    };

    return {
        // Estados
        activeTab,
        searchTerm,
        
        // Funciones
        setActiveTab,
        setSearchTerm,
        filterStudents,
        getStudentStatus,
        formatGradeInput,
        validateGradeInput,
        handleExportAverages,
        resetSearch,
        resetTab
    };
};

export default useTableNota;