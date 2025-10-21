import { useState } from 'react';

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
        resetSearch,
        resetTab
    };
};

export default useTableNota;