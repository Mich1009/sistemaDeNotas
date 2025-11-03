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
  const [viewMode, setViewMode] = useState('list'); // 'week' or 'list'

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getSchedule();
      console.log('Courses response:', response); // Debug log
      const data = Array.isArray(response) ? response : [];
      const filtered = data.filter((course) => {
        const cicloNombre = (course?.ciclo_nombre || course?.ciclo || '').toString().toLowerCase();
        const cicloNumero = course?.ciclo_numero ?? course?.cicloNumero ?? course?.cicloId;
        return (
          cicloNumero === 6 ||
          cicloNombre.includes('vi') ||
          cicloNombre.includes('6')
        );
      });

      // Fallback: horario fijo del VI ciclo (Lun–Vie)
      const fallbackSixthCycle = [
        {
          id: 1,
          nombre: 'Taller de Aplicaciones Móviles',
          codigo: 'TAM601',
          docente_nombre: 'Ing. Christian Duilin Puyo',
          aula: 'Lab. Cómputo 01',
          horas_semanales: 6,
          ciclo_nombre: 'VI',
          // Alineado a periodos de 45 min y recreo 18:00–18:20
          horario: 'Lunes 14:15-15:45, Miércoles 18:20-19:50, Viernes 14:15-16:30'
        },
        {
          id: 2,
          nombre: 'Inteligencia de Negocios',
          codigo: 'IN602',
          docente_nombre: 'Prof. Jhon Saboya Fulca',
          aula: 'Lab. Cómputo 04',
          horas_semanales: 6,
          ciclo_nombre: 'VI',
          horario: 'Lunes 15:45-17:15, Jueves 15:45-17:45'
        },
        {
          id: 3,
          nombre: 'Oportunidades de Negocios',
          codigo: 'OE603',
          docente_nombre: 'Ing. Freddy Flores',
          aula: 'Lab. Cómputo 02',
          horas_semanales: 4,
          ciclo_nombre: 'VI',
          horario: 'Lunes 17:15-18:00, Lunes 18:20-19:05'
        },
        {
          id: 4,
          nombre: 'Experiencias Formativas',
          codigo: 'EF604',
          docente_nombre: 'Team Haro / Innovación',
          aula: 'Lab. de Fabricación Digital',
          horas_semanales: 4,
          ciclo_nombre: 'VI',
          horario: 'Martes 15:00-16:30'
        },
        {
          id: 5,
          nombre: 'Taller de Programación Web',
          codigo: 'TPW605',
          docente_nombre: 'Prof. Jhon Saboya Fulca',
          aula: 'Lab. Cómputo 01',
          horas_semanales: 6,
          ciclo_nombre: 'VI',
          horario: 'Martes 16:30-18:00, Martes 18:20-19:50, Miércoles 14:15-15:45, Viernes 16:30-18:00, Viernes 18:20-19:05'
        },
        {
          id: 6,
          nombre: 'Herramientas Multimedia',
          codigo: 'HM606',
          docente_nombre: 'Ing. Torres Arevalo',
          aula: 'Lab. Cómputo 01',
          horas_semanales: 6,
          ciclo_nombre: 'VI',
          horario: 'Miércoles 15:45-18:00, Jueves 14:15-15:45'
        },
        {
          id: 7,
          nombre: 'Solución de Problemas',
          codigo: 'SP607',
          docente_nombre: 'Ing. Freddy Flores',
          aula: 'Lab. Cómputo 06',
          horas_semanales: 4,
          ciclo_nombre: 'VI',
          horario: 'Jueves 17:15-18:00, Jueves 18:20-19:50'
        }
      ];

      // Hardcode: forzar horario del VI ciclo para que se muestre ya
      const finalCourses = fallbackSixthCycle;
      console.log('[Horario] Cursos cargados (hardcoded VI ciclo, alineado 45m + recreo):', finalCourses);
      setCourses(finalCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Error al cargar el horario');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

    const getWeekDates = (date) => {
    const base = new Date(date);
    const day = base.getDay();
    const diff = base.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer d�a
    const monday = new Date(base.setDate(diff));
    
    const dates = [];
    // Solo Lunes a Viernes
    for (let i = 0; i < 5; i++) {
      const newDate = new Date(monday);
      newDate.setDate(monday.getDate() + i);
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
    if (!scheduleString || typeof scheduleString !== 'string') return [];
    const items = scheduleString.split(',').map(s => s.trim()).filter(Boolean);
    const regex = /^([A-Za-zÁÉÍÓÚáéíóúÑñ]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/;
    const parsed = [];
    for (const item of items) {
      const match = item.match(regex);
      if (match) {
        const [, day, startTime, endTime] = match;
        parsed.push({ day, startTime, endTime, fullSchedule: item });
      } else {
        console.warn('[Horario] No coincide formato:', item);
      }
    }
    return parsed;
  };

  const getCoursesForDay = (dayName) => {
    return courses.filter(course => {
      if (!course.horario) return false;
      const schedules = parseSchedule(course.horario);
      return schedules.some(schedule => schedule.day === dayName);
    });
  };

  const getCoursesForTime = (dayName, time) => {
    const result = courses.filter(course => {
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
    // Debug básico para verificar coincidencias por celda
    if (result.length > 0 && (time.endsWith('15') || time.endsWith('30'))) {
      console.log(`[Horario] ${dayName} ${time} -> ${result.length} curso(s)`);
    }
    return result;
  };

      const generateTimeSlots = () => {
    // Periodos académicos de 45 minutos con recreo 18:00–18:20
    return [
      '14:15',
      '15:00',
      '15:45',
      '16:30',
      '17:15',
      '18:00', // Recreo
      '18:20',
      '19:05',
    ];
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

  const CourseCard = ({ course, dayName, startTime }) => {
    const schedules = parseSchedule(course.horario);
    const currentSchedule = schedules.find(s => s.day === dayName && s.startTime === startTime);
    const color = getCourseColor(course);
    
    return (
      <div
        className="h-full rounded-lg p-3 shadow-sm"
        style={{ backgroundColor: color.bg, borderLeft: `4px solid ${color.border}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm" style={{ color: color.text }}>
              {course.nombre}
            </h4>
            <p className="text-xs" style={{ color: color.text }}>
              {course.codigo}
            </p>
            {course.aula && (
              <p className="text-xs mt-1" style={{ color: '#616161' }}>
                <MapPin className="w-3 h-3 inline mr-1" />
                {course.aula}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-bold" style={{ color: color.text }}>
              {currentSchedule?.startTime} - {currentSchedule?.endTime}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const weekDates = getWeekDates(currentWeek);
    const timeSlots = generateTimeSlots();

    const timeToMin = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    // Índice precalculado: clave "Día|HH:MM" -> cursos que inician ahí
    const scheduleIndex = React.useMemo(() => {
      const idx = {};
      courses.forEach((course) => {
        const items = parseSchedule(course.horario);
        items.forEach((it) => {
          const key = `${it.day}|${it.startTime}`;
          if (!idx[key]) idx[key] = [];
          idx[key].push(course);
        });
      });
      return idx;
    }, [courses]);

    // Set de celdas cubiertas por un bloque que comenzó en filas anteriores
    const coveredCells = React.useMemo(() => {
      const covered = new Set();
      courses.forEach((course) => {
        const items = parseSchedule(course.horario);
        items.forEach((it) => {
          const startMin = timeToMin(it.startTime);
          const endMin = timeToMin(it.endTime);
          timeSlots.forEach((slot, idx) => {
            const slotMin = timeToMin(slot);
            if (slotMin > startMin && slotMin < endMin) {
              covered.add(`${it.day}|${slot}`);
            }
          });
        });
      });
      return covered;
    }, [courses, timeSlots]);

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
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, timeIndex) => (
                  <tr key={timeIndex} className="border-t border-secondary-200">
                    <td className={`px-4 py-2 text-sm font-medium ${time === '18:00' ? 'text-yellow-700' : 'text-secondary-600'}`}>
                      {time === '18:00' ? '18:00 • Recreo' : time}
                    </td>
                    {weekDates.map((date, dayIndex) => {
                      const dayName = getDayName(date);
                      const key = `${dayName}|${time}`;

                      // Fila de recreo: pintar celda vacía con fondo y sin cursos
                      if (time === '18:00') {
                        return (
                          <td key={dayIndex} className="px-2 py-2 bg-secondary-100" />
                        );
                      }

                      // Si esta celda está cubierta por un bloque previo, no renderizar TD
                      if (coveredCells.has(key)) {
                        return null;
                      }

                      const coursesStartingNow = scheduleIndex[key] || [];

                      // Calcular rowSpan según los periodos de 45 min hasta el endTime
                      let rowSpan = 1;
                      if (coursesStartingNow.length > 0) {
                        const spans = coursesStartingNow.map((course) => {
                          const it = parseSchedule(course.horario).find((s) => s.day === dayName && s.startTime === time);
                          if (!it) return 1;
                          const startMin = timeToMin(it.startTime);
                          const endMin = timeToMin(it.endTime);
                          const count = timeSlots.filter((t) => {
                            const mins = timeToMin(t);
                            return mins >= startMin && mins < endMin;
                          }).length;
                          return Math.max(1, count);
                        });
                        rowSpan = Math.max(...spans);
                      }

                      return (
                        <td
                          key={dayIndex}
                          rowSpan={rowSpan}
                          className={`px-2 py-1 align-top ${isToday(date) ? 'bg-primary-25' : ''}`}
                        >
                          {coursesStartingNow.map((course, idx) => (
                            <CourseCard key={`${key}-${idx}`} course={course} dayName={dayName} startTime={time} />
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



  // Color por curso para mejorar legibilidad
  const getCourseColor = (course) => {
    const code = (course?.codigo || '').toUpperCase();
    if (code.startsWith('TAM')) return { bg: '#e8f5e9', border: '#2e7d32', text: '#1b5e20' };
    if (code.startsWith('TPW')) return { bg: '#fff9c4', border: '#f9a825', text: '#795548' };
    if (code.startsWith('HM')) return { bg: '#e3f2fd', border: '#1565c0', text: '#0d47a1' };
    if (code.startsWith('IN')) return { bg: '#f3e5f5', border: '#7b1fa2', text: '#4a148c' };
    if (code.startsWith('OE')) return { bg: '#ffe0b2', border: '#ef6c00', text: '#e65100' };
    if (code.startsWith('EF')) return { bg: '#e0f2f1', border: '#00897b', text: '#00695c' };
    if (code.startsWith('SP')) return { bg: '#ffebee', border: '#c62828', text: '#b71c1c' };
    return { bg: '#f5f5f5', border: '#757575', text: '#424242' };
  };



