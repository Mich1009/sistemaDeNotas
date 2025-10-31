import React, { useState, useEffect } from 'react';
import { cursosService } from '../services/apiTeacher';
import useAuthStore from '../../auth/store/authStore';
import toast from 'react-hot-toast';
import CursosList from '../components/CursosList';
import StudentList from '../components/StudentList';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [showStudents, setShowStudents] = useState(false);
    const [showCourseDetails, setShowCourseDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedCycle, setSelectedCycle] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(''); // 🔹 nuevo filtro de estado
    const [allCycles, setAllCycles] = useState([]);

    const user = useAuthStore(state => state.user);

    useEffect(() => {
        fetchCourses();
        fetchAllCycles();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await cursosService.getCourses();
            setCourses(response || []);
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

    const handleViewStudents = async (courseId) => {
        setLoading(true);
        try {
            const data = await cursosService.getStudentsByCourse(courseId);
            setStudents(data);
            setSelectedCourse(courses.find(course => course.id === courseId));
            setShowStudents(true);
            setShowCourseDetails(false);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
            toast.error('No se pudieron cargar los estudiantes');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setShowStudents(false);
        setShowCourseDetails(false);
        setSelectedCourse(null);
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

    // 🔹 Lógica de filtrado incluyendo estado (Activo / Inactivo)
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

    // Renderizado condicional
    if (!showStudents && !showCourseDetails) {
        return (
            <CursosList
                courses={courses}
                filteredCourses={filteredCourses}
                setSelectedYear={setSelectedYear}
                setSelectedCycle={setSelectedCycle}
                selectedYear={selectedYear}
                selectedCycle={selectedCycle}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                availableCycles={availableCycles}
                availableYears={availableYears}
                loading={loading}
                handleViewStudents={handleViewStudents}
                selectedStatus={selectedStatus}           // 👈 nuevo
                setSelectedStatus={setSelectedStatus}     // 👈 nuevo
            />
        );
    }

    if (showStudents && selectedCourse) {
        return (
            <StudentList
                students={students}
                loading={loading}
                selectedCourse={selectedCourse}
                handleBackToList={handleBackToList}
            />
        );
    }

    return null;
};

export default MyCourses;
