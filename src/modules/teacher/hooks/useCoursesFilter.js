import { useState, useEffect } from 'react';
import { getCourses } from '../services/apiTeacher';
import { cursosService } from '../../admin/services/apiAdmin';
import toast from 'react-hot-toast';

const useCoursesFilter = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedCycle, setSelectedCycle] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Activo');
    const [allCycles, setAllCycles] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchAllCycles();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await getCourses();
            setCourses(response.data || []);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
            toast.error('No se pudieron cargar los cursos');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCycles = async () => {
        try {
            const response = await cursosService.getCiclos();
            setAllCycles(response || []);
        } catch (error) {
            console.error('Error al cargar ciclos:', error);
            toast.error('Error al cargar los ciclos');
        }
    };

    // Obtener años únicos de todos los ciclos disponibles
    const availableYears = [...new Set(allCycles.map(cycle => cycle.año))]
        .filter(Boolean)
        .sort((a, b) => b - a);

    // Obtener ciclos únicos filtrados por año seleccionado
    const availableCycles = [...new Set(allCycles
        .filter(cycle => !selectedYear || cycle.año?.toString() === selectedYear)
        .map(cycle => cycle.nombre)
    )].filter(Boolean).sort();

    // Lógica de filtrado incluyendo estado (Activo / Inactivo)
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesYear = !selectedYear || course.ciclo_año?.toString() === selectedYear;
        const matchesCycle = !selectedCycle || course.ciclo_nombre === selectedCycle;

        // Determinar estado según fecha
        const now = new Date();
        const start = new Date(course.fecha_inicio);
        const end = new Date(course.fecha_fin);

        let status = 'Inactivo';
        if (now >= start && now <= end) status = 'Activo';

        const matchesStatus = !selectedStatus || status === selectedStatus;

        return matchesSearch && matchesYear && matchesCycle && matchesStatus;
    });

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedYear(new Date().getFullYear().toString());
        setSelectedCycle('');
        setSelectedStatus('Activo');
    };

    return {
        // Estados
        courses,
        filteredCourses,
        loading,
        searchTerm,
        selectedYear,
        selectedCycle,
        selectedStatus,
        allCycles,
        availableYears,
        availableCycles,
        
        // Funciones
        setSearchTerm,
        setSelectedYear,
        setSelectedCycle,
        setSelectedStatus,
        fetchCourses,
        fetchAllCycles,
        resetFilters
    };
};

export default useCoursesFilter;