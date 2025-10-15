import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../../modules/auth/store/authStore';
import { getCourses } from '../services/apiTeacher';

const Schedule = () => {
    const { user } = useAuthStore();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [scheduleItems, setScheduleItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState([]);

    // Días de la semana
    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    // Horas del día (formato 24h)
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 AM a 8:00 PM

    useEffect(() => {
        fetchCourses();
        calculateCurrentWeek(currentDate);
    }, []);

    useEffect(() => {
        if (courses.length > 0) {
            fetchScheduleItems();
        }
    }, [courses, selectedCourse, currentDate, viewMode]);

    const calculateCurrentWeek = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajustar cuando el día es domingo
        const monday = new Date(date.setDate(diff));
        
        const week = [];
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            week.push(nextDay);
        }
        
        setCurrentWeek(week);
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await getCourses();
            setCourses(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar los cursos:', error);
            toast.error('Error al cargar los cursos');
            setLoading(false);
        }
    };

    const fetchScheduleItems = async () => {
        try {
            setLoading(true);
            // Generar horarios basados en los cursos reales
            const scheduleItems = getMockScheduleItems();
            
            // Filtrar por curso seleccionado si no es "all"
            const filteredItems = selectedCourse === 'all' 
                ? scheduleItems 
                : scheduleItems.filter(item => item.course_id === parseInt(selectedCourse));
            
            setScheduleItems(filteredItems);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar el horario:', error);
            toast.error('Error al cargar el horario');
            setLoading(false);
            setScheduleItems([]);
        }
    };

    // Función para generar horarios basados en los cursos reales
    const getMockScheduleItems = () => {
        if (courses.length === 0) return [];
        
        const colors = [
            'bg-blue-100 border-blue-500',
            'bg-green-100 border-green-500',
            'bg-purple-100 border-purple-500',
            'bg-yellow-100 border-yellow-500',
            'bg-red-100 border-red-500',
            'bg-indigo-100 border-indigo-500',
            'bg-pink-100 border-pink-500',
            'bg-orange-100 border-orange-500'
        ];
        
        const mockItems = [];
        
        // Generar horarios para cada curso
        courses.forEach((course, courseIndex) => {
            const color = colors[courseIndex % colors.length];
            
            // Generar 2-3 clases por semana para cada curso
            const classesPerWeek = Math.floor(Math.random() * 2) + 2; // 2-3 clases
            
            for (let i = 0; i < classesPerWeek; i++) {
                const dayIndex = Math.floor(Math.random() * 5); // Lunes a Viernes
                const hourStart = Math.floor(Math.random() * 10) + 7; // Entre 7 AM y 5 PM
                const duration = Math.floor(Math.random() * 2) + 1; // 1 o 2 horas
                
                mockItems.push({
                    id: `${course.id}-${i}`,
                    day: dayIndex,
                    start_time: `${hourStart}:00`,
                    end_time: `${hourStart + duration}:00`,
                    course_id: course.id,
                    course_name: course.nombre,
                    classroom: `Aula ${Math.floor(Math.random() * 20) + 101}`,
                    color: color
                });
            }
        });
        
        return mockItems;
    };

    const navigatePrevious = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
        calculateCurrentWeek(newDate);
    };

    const navigateNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }
        setCurrentDate(newDate);
        calculateCurrentWeek(newDate);
    };

    const navigateToday = () => {
        const today = new Date();
        setCurrentDate(today);
        calculateCurrentWeek(today);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short'
        });
    };

    const formatDateFull = (date) => {
        return date.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const formatHour = (hour) => {
        return `${hour}:00`;
    };

    const getScheduleItemsForHour = (hour, dayIndex) => {
        return scheduleItems.filter(item => {
            const startHour = parseInt(item.start_time.split(':')[0]);
            const endHour = parseInt(item.end_time.split(':')[0]);
            return item.day === dayIndex && startHour <= hour && endHour > hour;
        });
    };

    const renderWeekView = () => {
        return (
            <div className="grid grid-cols-8 gap-1 mt-4 overflow-x-auto">
                {/* Encabezados de días */}
                <div className="sticky left-0 z-10 bg-gray-50"></div>
                {weekdays.map((day, index) => (
                    <div 
                        key={index} 
                        className={`text-center py-2 font-medium ${
                            new Date().getDay() === index + 1 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'
                        }`}
                    >
                        <div>{day}</div>
                        <div className="text-xs text-gray-500">
                            {currentWeek[index] && formatDate(currentWeek[index])}
                        </div>
                    </div>
                ))}
                
                {/* Horas y eventos */}
                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        {/* Columna de horas */}
                        <div className="sticky left-0 z-10 bg-white text-right pr-2 py-2 text-sm text-gray-500 border-t border-gray-200">
                            {formatHour(hour)}
                        </div>
                        
                        {/* Celdas para cada día */}
                        {weekdays.map((_, dayIndex) => (
                            <div 
                                key={`${hour}-${dayIndex}`} 
                                className="h-16 border-t border-gray-200 relative"
                            >
                                {getScheduleItemsForHour(hour, dayIndex).map(item => (
                                    <div 
                                        key={item.id}
                                        className={`absolute inset-x-1 rounded-md border-l-4 p-2 overflow-hidden shadow-sm ${item.color || 'bg-blue-100 border-blue-500'}`}
                                        style={{
                                            top: '4px',
                                            bottom: '4px',
                                        }}
                                    >
                                        <div className="font-medium text-sm truncate">{item.course_name}</div>
                                        <div className="text-xs text-gray-600 truncate">{item.start_time} - {item.end_time}</div>
                                        <div className="text-xs text-gray-600 truncate">{item.classroom}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const renderDayView = () => {
        const dayIndex = currentDate.getDay() - 1; // 0 = Lunes, 6 = Domingo
        const adjustedDayIndex = dayIndex < 0 ? 6 : dayIndex; // Ajustar para domingo
        
        return (
            <div className="mt-4">
                <h3 className="text-lg font-medium text-center mb-4">
                    {formatDateFull(currentDate)}
                </h3>
                
                <div className="space-y-2">
                    {hours.map(hour => (
                        <div 
                            key={hour} 
                            className="flex border-t border-gray-200 relative"
                        >
                            <div className="w-20 py-3 text-right pr-4 text-sm text-gray-500">
                                {formatHour(hour)}
                            </div>
                            
                            <div className="flex-1 min-h-[4rem] relative">
                                {getScheduleItemsForHour(hour, adjustedDayIndex).map(item => (
                                    <div 
                                        key={item.id}
                                        className={`my-1 rounded-md border-l-4 p-3 ${item.color || 'bg-blue-100 border-blue-500'}`}
                                    >
                                        <div className="font-medium">{item.course_name}</div>
                                        <div className="text-sm text-gray-600">{item.start_time} - {item.end_time}</div>
                                        <div className="text-sm text-gray-600">{item.classroom}</div>
                                    </div>
                                ))}
                                
                                {getScheduleItemsForHour(hour, adjustedDayIndex).length === 0 && (
                                    <div className="h-full border-l border-gray-200"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="p-3 space-y-5">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Horarios</h1>
                            <p className="text-gray-600">Gestiona tus horarios de clases</p>
                        </div>
                    </div>
                </div>

                {/* Filtros y navegación */}
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                <option value="all">Todos los cursos</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.nombre} ({course.codigo})
                                    </option>
                                ))}
                            </select>
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('week')}
                                className={`px-4 py-2 ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            >
                                Semana
                            </button>
                            <button
                                onClick={() => setViewMode('day')}
                                className={`px-4 py-2 ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            >
                                Día
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={navigatePrevious}
                            className="p-2 rounded-full hover:bg-gray-100"
                            disabled={loading}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <button
                            onClick={navigateToday}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                            disabled={loading}
                        >
                            Hoy
                        </button>
                        
                        <button
                            onClick={navigateNext}
                            className="p-2 rounded-full hover:bg-gray-100"
                            disabled={loading}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenido del horario */}
            <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
                {loading ? (
                    <div className="py-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando horario...</p>
                    </div>
                ) : scheduleItems.length > 0 ? (
                    viewMode === 'week' ? renderWeekView() : renderDayView()
                ) : (
                    <div className="py-8 text-center">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No hay clases programadas</h3>
                        <p className="text-gray-600">
                            No se encontraron clases para el período seleccionado
                        </p>
                    </div>
                )}
            </div>

            {/* Leyenda de cursos */}
            {scheduleItems.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Mis Cursos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Array.from(new Set(scheduleItems.map(item => item.course_id))).map(courseId => {
                            const course = scheduleItems.find(item => item.course_id === courseId);
                            return (
                                <div key={courseId} className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full ${course.color ? course.color.replace('bg-', 'bg-').replace('border-', 'bg-') : 'bg-blue-500'}`}></div>
                                    <span className="text-sm">{course.course_name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;