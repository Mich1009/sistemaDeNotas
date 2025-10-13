import { useState, useEffect } from 'react';
import { matriculasService, estudiantesService, cursosService } from '../services/apiAdmin';
import toast from 'react-hot-toast';

export const useMatriculas = () => {
    const [matriculas, setMatriculas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [ciclos, setCiclos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar matrículas
    const fetchMatriculas = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await matriculasService.getMatriculas(params);
            setMatriculas(data.items || []);
        } catch (err) {
            setError(err.message || 'Error al cargar matrículas');
            console.error('Error fetching matriculas:', err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar estudiantes activos
    const fetchEstudiantes = async () => {
        try {
            const data = await estudiantesService.getEstudiantes({ is_active: true });
            setEstudiantes(data.items || []);
        } catch (err) {
            console.error('Error fetching estudiantes:', err);
        }
    };

    // Cargar ciclos
    const fetchCiclos = async () => {
        try {
            const data = await cursosService.getCiclos();
            setCiclos(data || []);
        } catch (err) {
            console.error('Error fetching ciclos:', err);
        }
    };

    // Cargar ciclos disponibles para un estudiante específico
    const fetchCiclosDisponiblesParaEstudiante = async (estudianteId) => {
        try {
            if (!estudianteId) {
                return [];
            }
            const data = await matriculasService.getCiclosDisponiblesParaEstudiante(estudianteId);
            return data.ciclos_disponibles || [];
        } catch (err) {
            console.error('Error fetching ciclos disponibles para estudiante:', err);
            return [];
        }
    };

    // Matricular estudiante en un ciclo completo
    const matricularEstudianteCiclo = async (estudianteId, cicloId, codigoMatricula) => {
        try {
            setLoading(true);
            const result = await matriculasService.matricularEstudianteCiclo(estudianteId, cicloId, codigoMatricula);
            
            // Actualizar la lista de matrículas
            await fetchMatriculas();
            
            toast.success(`Estudiante matriculado exitosamente`);
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message || 'Error al matricular estudiante';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Eliminar matrícula
    const deleteMatricula = async (matriculaId) => {
        try {
            setLoading(true);
            await matriculasService.deleteMatricula(matriculaId);
            setMatriculas(prev => prev.filter(matricula => matricula.id !== matriculaId));
            toast.success('Matrícula eliminada exitosamente');
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message || 'Error al eliminar matrícula';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Buscar estudiante por DNI
    const searchEstudianteByDni = async (dni) => {
        try {
            if (!dni || dni.length < 8) {
                return null;
            }
            const data = await estudiantesService.searchEstudianteByDni(dni);
            return data;
        } catch (err) {
            if (err.response?.status === 404) {
                return null; // Estudiante no encontrado
            }
            console.error('Error searching estudiante by DNI:', err);
            throw err;
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchMatriculas();
        fetchEstudiantes();
        fetchCiclos();
    }, []);

    return {
        // Estado
        matriculas,
        estudiantes,
        ciclos,
        loading,
        error,
        
        // Acciones
        fetchMatriculas,
        fetchEstudiantes,
        fetchCiclos,
        fetchCiclosDisponiblesParaEstudiante,
        matricularEstudianteCiclo,
        deleteMatricula,
        searchEstudianteByDni
    };
};

export default useMatriculas;