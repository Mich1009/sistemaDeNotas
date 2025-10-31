import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../auth/store/authStore';
import { cursosService } from '../services/apiTeacher';

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
    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    
    // Periodos de 45 minutos con recreo 18:00–18:20
    const timeSlots = ['14:15', '15:00', '15:45', '16:30', '17:15', '18:00', '18:20', '19:05'];
    const END_OF_DAY_MIN = 19 * 60 + 50; // 19:50

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
            const data = await cursosService.getCourses();
            // El servicio ya retorna los datos; no existe "response.data" aquí
            setCourses(Array.isArray(data) ? data : []);
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
            // Generar horario estático basado en los cursos del docente
            const scheduleItems = getStaticScheduleItems();
            
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

    // Horario estático por código de curso (L–V)
        const getStaticScheduleItems = () => {
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
        // Mapa de bloques fijos por código (0=Lunes .. 4=Viernes)
        const scheduleMap = {
            TAM601: [
                { day: 0, start: '14:15', end: '15:45' },
                { day: 2, start: '18:20', end: '19:50' },
                { day: 4, start: '14:15', end: '16:30' },
            ],
            IN602: [
                { day: 0, start: '15:45', end: '17:15' },
                { day: 3, start: '15:45', end: '17:45' },
            ],
            OE603: [
                { day: 0, start: '17:15', end: '18:00' },
                { day: 0, start: '18:20', end: '19:05' },
            ],
            EF604: [
                { day: 1, start: '15:00', end: '16:30' },
            ],
            TPW605: [
                { day: 1, start: '16:30', end: '18:00' },
                { day: 1, start: '18:20', end: '19:05' },
                { day: 2, start: '14:15', end: '15:45' },
                { day: 4, start: '16:30', end: '18:00' },
                { day: 4, start: '18:20', end: '19:05' },
            ],
            HM606: [
                { day: 2, start: '15:45', end: '18:00' },
                { day: 3, start: '14:15', end: '15:45' },
            ],
            SP607: [
                { day: 3, start: '17:15', end: '18:00' },
                { day: 3, start: '18:20', end: '19:50' },
            ],
        };

        // Mapeo por nombre cuando no hay código en el API del docente
        const mapCourseToKey = (course) => {
            const name = String(course?.nombre || '').toLowerCase();
            if (name.includes('programación web') || name.includes('programacion web')) return 'TPW605';
            if (name.includes('inteligencia de negocios')) return 'IN602';
            if (name.includes('aplicaciones móviles') || name.includes('aplicaciones moviles')) return 'TAM601';
            if (name.includes('oportunidades de negocios')) return 'OE603';
            if (name.includes('experiencias formativas')) return 'EF604';
            if (name.includes('herramientas multimedia')) return 'HM606';
            if (name.includes('solución de problemas') || name.includes('solucion de problemas')) return 'SP607';
            return null;
        };

        const items = [];
        courses.forEach((course, idx) => {
            const color = colors[idx % colors.length];
            const byCode = String(course.codigo || course.code || '').toUpperCase().replace(/\s+/g, '');
            const key = scheduleMap[byCode] ? byCode : mapCourseToKey(course);
            const blocks = key ? (scheduleMap[key] || []) : [];
            blocks.forEach((b, i) => {
                items.push({
                    id: `${course.id ?? key ?? idx}-${i}`,
                    day: b.day,
                    start_time: b.start,
                    end_time: b.end,
                    course_id: course.id ?? idx,
                    course_name: course.nombre ?? key ?? 'Curso',
                    classroom: course.aula || 'Aula por definir',
                    color,
                });
            });
        });

        // Nota: Solo mostramos los cursos del docente logueado (provenientes del API).

        return items;
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

    const parseToMinutes = (hhmm) => {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    };

    const getRowRangeForSlot = (slotLabel) => {
        const startMin = parseToMinutes(slotLabel);
        const idx = timeSlots.indexOf(slotLabel);
        const nextStart = idx >= 0 && idx + 1 < timeSlots.length
            ? parseToMinutes(timeSlots[idx + 1])
            : END_OF_DAY_MIN;
        return { startMin, endMin: nextStart };
    };

    const getScheduleItemsForSlot = (slotLabel, dayIndex) => {
        const { startMin, endMin } = getRowRangeForSlot(slotLabel);
        return scheduleItems.filter(item => {
            if (item.day !== dayIndex) return false;
            const s = parseToMinutes(item.start_time);
            const e = parseToMinutes(item.end_time);
            return s < endMin && e > startMin;
        });
    };

    const getSlotRangeLabel = (slot) => {
        const idx = timeSlots.indexOf(slot);
        const end = idx >= 0 && idx + 1 < timeSlots.length ? timeSlots[idx + 1] : '19:50';
        const base = `${slot} - ${end}`;
        return slot === '18:00' ? `${base} • Recreo` : base;
    };

    const renderWeekView = () => {
        return (
            <div className="grid gap-1 mt-4 overflow-x-auto" style={{ gridTemplateColumns: 'auto repeat(5, minmax(0, 1fr))' }}>
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
                    </div>
                ))}
                
                {/* Periodos y eventos */}
                {timeSlots.map(slot => (
                    <React.Fragment key={slot}>
                        {/* Columna de horas */}
                        <div className="sticky left-0 z-10 bg-white text-right pr-2 py-2 text-sm text-gray-600 border-t border-gray-200">
                            {getSlotRangeLabel(slot)}
                        </div>
                        
                        {/* Celdas para cada día */}
                        {weekdays.map((_, dayIndex) => (
                            <div 
                                key={`${slot}-${dayIndex}`} 
                                className={`h-16 border-t border-gray-200 relative ${slot === '18:00' ? 'bg-yellow-50' : ''}`}
                            >
                                {slot === '18:00' ? (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs text-yellow-700">Recreo</div>
                                ) : getScheduleItemsForSlot(slot, dayIndex).map(item => (
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
                    {timeSlots.map(slot => (
                        <div 
                            key={slot} 
                            className="flex border-t border-gray-200 relative"
                        >
                            <div className="w-28 py-3 text-right pr-4 text-sm text-gray-500">
                                {getSlotRangeLabel(slot)}
                            </div>
                            
                            <div className="flex-1 min-h-[4rem] relative">
                                {slot === '18:00' ? (
                                    <div className="h-full flex items-center justify-center text-xs text-yellow-700">Recreo</div>
                                ) : getScheduleItemsForSlot(slot, adjustedDayIndex).map(item => (
                                    <div 
                                        key={item.id}
                                        className={`my-1 rounded-md border-l-4 p-3 ${item.color || 'bg-blue-100 border-blue-500'}`}
                                    >
                                        <div className="font-medium">{item.course_name}</div>
                                        <div className="text-sm text-gray-600">{item.start_time} - {item.end_time}</div>
                                        <div className="text-sm text-gray-600">{item.classroom}</div>
                                    </div>
                                ))}
                                
                                {slot !== '18:00' && getScheduleItemsForSlot(slot, adjustedDayIndex).length === 0 && (
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


