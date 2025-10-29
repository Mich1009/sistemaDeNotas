import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
  AlertCircle
} from 'lucide-react';
import { scheduleService } from '../services/apiStudent';
import toast from 'react-hot-toast';

const Schedule = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'list'

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getSchedule();
      console.log('Courses response:', response); // Debug log
      setCourses(response || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Error al cargar el horario');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDates = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
    start.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(start);
      newDate.setDate(start.getDate() + i);
      dates.push(newDate);
    }
    return dates;
  };

  const getDayName = (date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
  };

  const getDayShortName = (date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  const parseSchedule = (scheduleString) => {
    if (!scheduleString) return [];
    
    // Formato esperado: "Lunes 08:00-10:00, Miércoles 14:00-16:00"
    const scheduleItems = scheduleString.split(',').map(item => item.trim());
    return scheduleItems.map(item => {
      const parts = item.split(' ');
      const day = parts[0];
      const time = parts[1];
      const [startTime, endTime] = time.split('-');
      
      return {
        day,
        startTime,
        endTime,
        fullSchedule: item
      };
    });
  };

  const getCoursesForDay = (dayName) => {
    return courses.filter(course => {
      if (!course.horario) return false;
      const schedules = parseSchedule(course.horario);
      return schedules.some(schedule => schedule.day === dayName);
    });
  };

  const getCoursesForTime = (dayName, time) => {
    return courses.filter(course => {
      if (!course.horario) return false;
      const schedules = parseSchedule(course.horario);
      return schedules.some(schedule => {
        if (schedule.day !== dayName) return false;
        const [startHour, startMin] = schedule.startTime.split(':').map(Number);
        const [endHour, endMin] = schedule.endTime.split(':').map(Number);
        const [currentHour, currentMin] = time.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const currentMinutes = currentHour * 60 + currentMin;
        
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
      });
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 22; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const CourseCard = ({ course, time }) => {
    const schedules = parseSchedule(course.horario);
    const currentSchedule = schedules.find(s => s.day === getDayName(new Date()));
    
    return (
      <div className="bg-white border border-secondary-200 rounded-lg p-3 mb-2 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-secondary-900 text-sm mb-1">
              {course.nombre}
            </h4>
            <p className="text-xs text-secondary-600 mb-1">
              {course.codigo}
            </p>
            <div className="flex items-center text-xs text-secondary-500 space-x-2">
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {course.docente_nombre}
              </div>
              {course.aula && (
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {course.aula}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-primary-600">
              {currentSchedule?.startTime} - {currentSchedule?.endTime}
            </div>
            <div className="text-xs text-secondary-500">
              {course.horas_semanales}h/sem
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const weekDates = getWeekDates(currentWeek);
    const timeSlots = generateTimeSlots();

    return (
      <div className="space-y-4">
        {/* Navegación de semana */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              Hoy
            </button>
          </div>
          <div className="text-lg font-semibold text-secondary-900">
            {weekDates[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Tabla de horario */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-600 w-20">
                    Hora
                  </th>
                  {weekDates.map((date, index) => (
                    <th key={index} className={`px-4 py-3 text-center text-sm font-medium w-32 ${
                      isToday(date) ? 'bg-primary-50 text-primary-700' : 'text-secondary-600'
                    }`}>
                      <div>
                        <div className="font-semibold">{getDayShortName(date)}</div>
                        <div className="text-xs">{date.getDate()}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, timeIndex) => (
                  <tr key={timeIndex} className="border-t border-secondary-200">
                    <td className="px-4 py-2 text-sm text-secondary-600 font-medium">
                      {time}
                    </td>
                    {weekDates.map((date, dayIndex) => {
                      const dayName = getDayName(date);
                      const coursesAtTime = getCoursesForTime(dayName, time);
                      
                      return (
                        <td key={dayIndex} className={`px-2 py-1 h-16 ${
                          isToday(date) ? 'bg-primary-25' : ''
                        }`}>
                          {coursesAtTime.map((course, courseIndex) => (
                            <CourseCard key={courseIndex} course={course} time={time} />
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const ListView = () => {
    const weekDates = getWeekDates(currentWeek);
    
    return (
      <div className="space-y-6">
        {/* Navegación */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              Hoy
            </button>
          </div>
          <div className="text-lg font-semibold text-secondary-900">
            {weekDates[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Lista por días */}
        <div className="space-y-4">
          {weekDates.map((date, index) => {
            const dayName = getDayName(date);
            const coursesForDay = getCoursesForDay(dayName);
            
            return (
              <div key={index} className="card">
                <div className={`p-4 border-b ${
                  isToday(date) ? 'bg-primary-50 border-primary-200' : 'bg-secondary-50 border-secondary-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${
                      isToday(date) ? 'text-primary-700' : 'text-secondary-900'
                    }`}>
                      {dayName}
                    </h3>
                    <div className={`text-sm ${
                      isToday(date) ? 'text-primary-600' : 'text-secondary-600'
                    }`}>
                      {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {coursesForDay.length > 0 ? (
                    <div className="space-y-3">
                      {coursesForDay.map((course) => {
                        const schedules = parseSchedule(course.horario);
                        const daySchedule = schedules.find(s => s.day === dayName);
                        
                        return (
                          <div key={course.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-semibold text-secondary-900">
                                {course.nombre}
                              </h4>
                              <p className="text-sm text-secondary-600">
                                {course.codigo} • {course.docente_nombre}
                              </p>
                              {course.aula && (
                                <p className="text-xs text-secondary-500 mt-1">
                                  <MapPin className="w-3 h-3 inline mr-1" />
                                  Aula {course.aula}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary-600">
                                {daySchedule?.startTime} - {daySchedule?.endTime}
                              </div>
                              <div className="text-xs text-secondary-500">
                                {course.horas_semanales} horas/semana
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
                      <p className="text-secondary-600">No hay clases programadas para este día</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Mi Horario</h1>
            <p className="text-secondary-600 mt-2">Consulta tu horario de clases</p>
          </div>
        </div>
        
        <div className="card p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
            <div className="h-32 bg-secondary-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Mi Horario</h1>
          <p className="text-secondary-600 mt-2">Consulta tu horario de clases</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-8 h-8 text-primary-600" />
        </div>
      </div>

      {/* Controles de vista */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                Vista Semanal
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                Vista Lista
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-secondary-600">
            <Bell className="w-4 h-4" />
            <span>{courses.length} cursos matriculados</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      {viewMode === 'week' ? <WeekView /> : <ListView />}

      {/* Información adicional */}
      <div className="card p-6">
        <div className="flex items-start space-x-4">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2">Información del Horario</h3>
            <ul className="text-sm text-secondary-600 space-y-1">
              <li>• Los horarios pueden estar sujetos a cambios</li>
              <li>• Contacta a tu docente si tienes dudas sobre el horario</li>
              <li>• Las aulas pueden cambiar según disponibilidad</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;