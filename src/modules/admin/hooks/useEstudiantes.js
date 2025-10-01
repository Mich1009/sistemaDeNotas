import { useState, useEffect, useCallback } from 'react';
import { estudiantesService, matriculasService } from '../services/apiAdmin';

export const useEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEstudiantes = useCallback(async (cicloId = null) => {
        try {
            setLoading(true);
            setError(null);
            
            // Siempre obtener TODOS los estudiantes (sin filtro por ciclo)
            const data = await estudiantesService.getEstudiantes();
            let estudiantesConEstado = data.users || [];
            
            // Si se proporciona un ciclo, obtener el estado de matrícula para cada estudiante
            if (cicloId) {
                const matriculas = await matriculasService.getMatriculas({ ciclo_id: cicloId });
                console.log('Matriculas response:', matriculas); // Debug log
                
                const matriculasMap = new Map();
                
                // Verificar si la respuesta tiene la estructura correcta
                const matriculasArray = matriculas.matriculas || matriculas.items || matriculas || [];
                console.log('Matriculas array:', matriculasArray); // Debug log
                
                matriculasArray.forEach(matricula => {
                    matriculasMap.set(matricula.estudiante_id, matricula);
                });
                
                console.log('Matriculas map:', matriculasMap); // Debug log
                
                estudiantesConEstado = estudiantesConEstado.map(estudiante => ({
                    ...estudiante,
                    matriculado: matriculasMap.has(estudiante.id),
                    matricula: matriculasMap.get(estudiante.id) || null
                }));
                
                console.log('Estudiantes con estado:', estudiantesConEstado); // Debug log
            } else {
                // Si no hay filtro por ciclo, marcar todos como sin estado de matrícula específico
                estudiantesConEstado = estudiantesConEstado.map(estudiante => ({
                    ...estudiante,
                    matriculado: null, // No se puede determinar sin un ciclo específico
                    matricula: null
                }));
            }
            
            setEstudiantes(estudiantesConEstado);
        } catch (err) {
            setError(err.message || 'Error al cargar estudiantes');
            console.error('Error fetching estudiantes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getEstudianteById = async (id) => {
        try {
            setError(null);
            return await estudiantesService.getEstudiante(id);
        } catch (err) {
            setError(err.message || 'Error al obtener estudiante');
            throw err;
        }
    };

    const createEstudiante = async (estudianteData) => {
        try {
            setError(null);
            const newEstudiante = await estudiantesService.createEstudiante(estudianteData);
            setEstudiantes(prev => [...prev, newEstudiante]);
            return newEstudiante;
        } catch (err) {
            setError(err.message || 'Error al crear estudiante');
            throw err;
        }
    };

    const updateEstudiante = async (id, estudianteData) => {
        try {
            setError(null);
            const updatedEstudiante = await estudiantesService.updateEstudiante(id, estudianteData);
            setEstudiantes(prev =>
                prev.map(est => est.id === id ? updatedEstudiante : est)
            );
            return updatedEstudiante;
        } catch (err) {
            setError(err.message || 'Error al actualizar estudiante');
            throw err;
        }
    };

    const deleteEstudiante = async (id) => {
        try {
            setError(null);
            await estudiantesService.deleteEstudiante(id);
            setEstudiantes(prev => prev.filter(est => est.id !== id));
        } catch (err) {
            setError(err.message || 'Error al eliminar estudiante');
            throw err;
        }
    };

    const activateEstudiante = async (id, cicloId = null) => {
        try {
            setError(null);
            await estudiantesService.activateEstudiante(id);
            // Refresh the list to get updated data
            await fetchEstudiantes(cicloId);
        } catch (err) {
            setError(err.message || 'Error al activar estudiante');
            throw err;
        }
    };

    const searchEstudianteByDni = async (dni) => {
        try {
            setError(null);
            return await estudiantesService.searchEstudianteByDni(dni);
        } catch (err) {
            setError(err.message || 'Error al buscar estudiante por DNI');
            throw err;
        }
    };

    const getEstudianteNotas = async (id) => {
        try {
            setError(null);
            return await estudiantesService.getEstudianteNotas(id);
        } catch (err) {
            setError(err.message || 'Error al obtener notas del estudiante');
            throw err;
        }
    };

    const getEstudianteMatriculas = async (id) => {
        try {
            setError(null);
            return await estudiantesService.getEstudianteMatriculas(id);
        } catch (err) {
            setError(err.message || 'Error al obtener matrículas del estudiante');
            throw err;
        }
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const refreshEstudiantes = (cicloId = null) => {
        fetchEstudiantes(cicloId);
    };

    return {
        estudiantes,
        loading,
        error,
        fetchEstudiantes,
        getEstudianteById,
        createEstudiante,
        updateEstudiante,
        deleteEstudiante,
        activateEstudiante,
        searchEstudianteByDni,
        getEstudianteNotas,
        getEstudianteMatriculas,
        refreshEstudiantes
    };
};