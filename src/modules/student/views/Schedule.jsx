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
      
      // Asegurarse de que la respuesta sea un array
      const data = Array.isArray(response) ? response : [];
      
      // Determinar el ciclo más alto del estudiante
      let cicloEstudiante = 1; // Valor por defecto
      
      data.forEach(curso => {
        let cicloCurso;
        
        // Intentar obtener el ciclo del curso de diferentes propiedades
        if (curso.ciclo_id) {
          cicloCurso = parseInt(curso.ciclo_id);
        } else if (curso.ciclo_numero) {
          cicloCurso = parseInt(curso.ciclo_numero);
        } else if (curso.ciclo_nombre) {
          const cicloNombre = curso.ciclo_nombre.toString().toUpperCase();
          // Ordenar las comparaciones de mayor a menor para evitar coincidencias parciales
          if (cicloNombre.includes('VI')) {
            cicloCurso = 6;
          } else if (cicloNombre.includes('IV')) {
            cicloCurso = 4;
          } else if (cicloNombre.includes('V')) {
            cicloCurso = 5;
          } else if (cicloNombre.includes('III')) {
            cicloCurso = 3;
          } else if (cicloNombre.includes('II')) {
            cicloCurso = 2;
          } else if (cicloNombre.includes('I')) {
            cicloCurso = 1;
          }
        }
        
        // Actualizar cicloEstudiante si encontramos un ciclo mayor
        if (cicloCurso && cicloCurso > cicloEstudiante) {
          cicloEstudiante = cicloCurso;
        }
      });
      
      console.log(`Ciclo más alto del estudiante detectado: ${cicloEstudiante}`);
      
      // Mapeo de horarios por ciclo basado en las imágenes
      const horariosPorCiclo = {
        // Ciclo I - Turno Mañana
        1: [
          {
            id: 101,
            nombre: 'ARQUITECTURA DE COMPUTADORA E INTEGRACIÓN DE TIC',
            codigo: 'ACI101',
            docente_nombre: 'Mtro. Ruber Torres Arevalo',
            aula: 'H.T.0 - H.P.1 Taller de Ensamblaje y Reparación',
            horas_semanales: 6,
            ciclo_nombre: 'I',
            horario: 'Lunes 07:30 - 09:45, Miércoles 07:30 - 09:45'
          },
          {
            id: 102,
            nombre: 'FUNDAMENTOS DE PROGRAMACIÓN',
            codigo: 'FP102',
            docente_nombre: 'Dr. Gil Torres Arevalo',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°1A',
            horas_semanales: 6,
            ciclo_nombre: 'I',
            horario: 'Lunes 09:45 - 10:30, Jueves 07:30 - 09:45, Viernes 09:45 - 10:30'
          },
          {
            id: 103,
            nombre: 'LENGUAJE DE PROGRAMACIÓN',
            codigo: 'LP103',
            docente_nombre: 'Ing. Christian Duilin Puyo Torres',
            aula: 'H.T.1 - H.P.0 Laboratorio de Cómputo N°01',
            horas_semanales: 6,
            ciclo_nombre: 'I',
            horario: 'Martes 07:30 - 09:45, Miércoles 09:45 - 10:30'
          },
          {
            id: 104,
            nombre: 'REDES Y CONECTIVIDAD DE COMPUTADORAS',
            codigo: 'RCC104',
            docente_nombre: 'Mtro. Ruber Torres Arevalo',
            aula: 'H.T.0 - H.P.1 Taller de Ensamblaje y Reparación',
            horas_semanales: 6,
            ciclo_nombre: 'I',
            horario: 'Viernes 07:30 - 09:45'
          },
          {
            id: 105,
            nombre: 'COMUNICACIÓN ORAL',
            codigo: 'CO105',
            docente_nombre: 'Jhon Saboya Fulca',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°1A',
            horas_semanales: 4,
            ciclo_nombre: 'I',
            horario: 'Jueves 09:45 - 10:30'
          },
          {
            id: 106,
            nombre: 'OFIMÁTICA',
            codigo: 'OF106',
            docente_nombre: 'Ing. Renato Herger Tarazona Flores',
            aula: 'H.T.1 - H.P.0 Laboratorio de Cómputo N°1A',
            horas_semanales: 4,
            ciclo_nombre: 'I',
            horario: 'Viernes 09:45 - 10:30'
          },
          {
            id: 107,
            nombre: 'APLICACIONES EMPRESARIALES',
            codigo: 'AE107',
            docente_nombre: 'Ing. Renato Herger Tarazona Flores',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°1A',
            horas_semanales: 6,
            ciclo_nombre: 'I',
            horario: 'Lunes 10:50 - 12:20, Miércoles 10:50 - 12:20'
          },
          {
            id: 108,
            nombre: 'EXPERIENCIAS FORMATIVAS',
            codigo: 'EF108',
            docente_nombre: 'INDUCCIÓN',
            aula: 'H.T.0 - H.P.1',
            horas_semanales: 4,
            ciclo_nombre: 'I',
            horario: 'Martes 10:50 - 12:20'
          }
        ],
        
        // Ciclo III - Turno Noche
        3: [
          {
            id: 301,
            nombre: 'INNOVACIÓN TECNOLÓGICA',
            codigo: 'IT301',
            docente_nombre: 'Ing. Renato Herger Tarazona Flores',
            aula: 'H.T.1 - H.P.0 Laboratorio de Cómputo N°02',
            horas_semanales: 6,
            ciclo_nombre: 'III',
            horario: 'Lunes 14:15 - 16:30'
          },
          {
            id: 302,
            nombre: 'INGLÉS PARA LA COMUNICACIÓN',
            codigo: 'IC302',
            docente_nombre: 'P.T Diana Carolina Hidalgo Gonzales',
            aula: 'H.T.0 - H.P.1 Taller de Ensamblaje y Reparación',
            horas_semanales: 6,
            ciclo_nombre: 'III',
            horario: 'Martes 14:15 - 16:30'
          },
          {
            id: 303,
            nombre: 'EXPERIENCIAS FORMATIVAS',
            codigo: 'EF303',
            docente_nombre: 'INDUCCIÓN',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°1A',
            horas_semanales: 4,
            ciclo_nombre: 'III',
            horario: 'Miércoles 14:15 - 16:30'
          },
          {
            id: 304,
            nombre: 'PROGRAMACIÓN CONCURRENTE',
            codigo: 'PC304',
            docente_nombre: 'Mtro. Ruber Torres Arevalo',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°02',
            horas_semanales: 6,
            ciclo_nombre: 'III',
            horario: 'Jueves 14:15 - 16:30, Lunes 18:20 - 19:50'
          },
          {
            id: 305,
            nombre: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
            codigo: 'POO305',
            docente_nombre: 'P.T C.I Jhon Saboya Fulca',
            aula: 'H.T.1 - H.P.0 Laboratorio de Cómputo N°02',
            horas_semanales: 6,
            ciclo_nombre: 'III',
            horario: 'Viernes 14:15 - 16:30, Miércoles 18:20 - 19:50'
          },
          {
            id: 306,
            nombre: 'PROGRAMACIÓN DISTRIBUIDA',
            codigo: 'PD306',
            docente_nombre: 'Ing. Christian Duilin Puyo Torres',
            aula: 'H.T.1 - H.P.0 Laboratorio de Cómputo N°1B',
            horas_semanales: 6,
            ciclo_nombre: 'III',
            horario: 'Lunes 16:30 - 18:00, Martes 18:20 - 19:50'
          },
          {
            id: 307,
            nombre: 'ARQUITECTURA DE BASE DE DATOS',
            codigo: 'ABD307',
            docente_nombre: 'Ing. Christian Duilin Puyo Torres',
            aula: 'H.T.1 - H.P.0 Laboratorio de Cómputo N°1A',
            horas_semanales: 6,
            ciclo_nombre: 'III',
            horario: 'Viernes 16:30 - 18:00, Jueves 18:20 - 19:50'
          },
          {
            id: 308,
            nombre: 'MODELAMIENTO DE SOFTWARE',
            codigo: 'MS308',
            docente_nombre: 'Ing. Renato Herger Tarazona Flores',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°02',
            horas_semanales: 6,
            ciclo_nombre: 'III',
            horario: 'Jueves 16:30 - 18:00, Viernes 18:20 - 19:50'
          }
        ],
        
        // Ciclo IV - Turno Noche
        4: [
          {
            id: 401,
            nombre: 'EXPERIENCIAS FORMATIVAS',
            codigo: 'EF401',
            docente_nombre: 'INDUCCIÓN',
            aula: 'H.T.0 - H.P.1 Laboratorio de Fabricación Digital',
            horas_semanales: 4,
            ciclo_nombre: 'IV',
            horario: 'Lunes 14:15 - 15:00'
          },
          {
            id: 402,
            nombre: 'COMPRENSIÓN Y REDACCIÓN EN INGLÉS',
            codigo: 'CRI402',
            docente_nombre: 'P.T Diana Carolina Hidalgo Gonzales',
            aula: 'H.T.0 - H.P.1 Aula N°12',
            horas_semanales: 6,
            ciclo_nombre: 'IV',
            horario: 'Martes 14:15 - 16:30'
          },
          {
            id: 403,
            nombre: 'DISEÑO GRÁFICO',
            codigo: 'DG403',
            docente_nombre: 'Mtro. Ruber Torres Arevalo',
            aula: 'H.T.0 - H.P.1 Laboratorio de Fabricación Digital',
            horas_semanales: 6,
            ciclo_nombre: 'IV',
            horario: 'Miércoles 14:15 - 16:30, Lunes 15:00 - 17:15'
          },
          {
            id: 404,
            nombre: 'TALLER DE SOFTWARE',
            codigo: 'TS404',
            docente_nombre: 'Ing. Renato Herger Flores Tarazona',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°01',
            horas_semanales: 6,
            ciclo_nombre: 'IV',
            horario: 'Jueves 14:15 - 16:30, Martes 16:30 - 18:00, Martes 18:20 - 19:05'
          },
          {
            id: 405,
            nombre: 'TALLER DE BASE DE DATOS',
            codigo: 'TBD405',
            docente_nombre: 'Ing. Renato Herger Flores Tarazona',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°01',
            horas_semanales: 6,
            ciclo_nombre: 'IV',
            horario: 'Viernes 14:15 - 16:30, Miércoles 16:30 - 18:00, Miércoles 18:20 - 19:05'
          },
          {
            id: 406,
            nombre: 'CULTURA AMBIENTAL',
            codigo: 'CA406',
            docente_nombre: 'Ing. Jhon saboya fulca',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°01',
            horas_semanales: 4,
            ciclo_nombre: 'IV',
            horario: 'Lunes 17:15 - 18:00, Lunes 18:20 - 19:50'
          },
          {
            id: 407,
            nombre: 'SEGURIDAD INFORMÁTICA',
            codigo: 'SI407',
            docente_nombre: 'Ing. Christian Duilin Puyo Torres',
            aula: 'H.T.0 - H.P.0 Laboratorio de Cómputo N°02',
            horas_semanales: 6,
            ciclo_nombre: 'IV',
            horario: 'Jueves 16:30 - 18:00, Jueves 18:20 - 19:05, Viernes 16:30 - 18:00, Viernes 18:20 - 19:05'
          }
        ],
        
        // Ciclo V - Turno Noche
        5: [
          {
            id: 501,
            nombre: 'DESARROLLO DE APLICACIONES MÓVILES',
            codigo: 'DAM501',
            docente_nombre: 'Ing. Christian Duilin Puyo Torres',
            aula: 'H.T.1 - H.P.0 Laboratorio de Cómputo N°1B',
            horas_semanales: 6,
            ciclo_nombre: 'V',
            horario: 'Lunes 14:15 - 16:30'
          },
          {
            id: 502,
            nombre: 'COMPORTAMIENTO ÉTICO',
            codigo: 'CE502',
            docente_nombre: 'P.T C.I Jhon Saboya Fulca',
            aula: 'H.T.0 - H.P.0 Taller de Ensamblaje y Reparación',
            horas_semanales: 6,
            ciclo_nombre: 'V',
            horario: 'Martes 14:15 - 16:30'
          },
          {
            id: 503,
            nombre: 'DISEÑO WEB',
            codigo: 'DW503',
            docente_nombre: 'P.T C.I Jhon Saboya Fulca',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°1B',
            horas_semanales: 6,
            ciclo_nombre: 'V',
            horario: 'Miércoles 14:15 - 16:30, Lunes 18:20 - 19:50, Viernes 18:20 - 19:50'
          },
          {
            id: 504,
            nombre: 'ANIMACIÓN GRÁFICA',
            codigo: 'AG504',
            docente_nombre: 'Ing. Renato Herger Tarazona Flores',
            aula: 'H.T.1 - H.P.0 Laboratorio de Cómputo N°1B',
            horas_semanales: 6,
            ciclo_nombre: 'V',
            horario: 'Jueves 14:15 - 16:30, Martes 18:20 - 19:05, Viernes 18:20 - 19:50'
          },
          {
            id: 505,
            nombre: 'DISEÑO DE APLICACIONES',
            codigo: 'DA505',
            docente_nombre: 'Ing. Christian Duilin Puyo Torres',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°1B',
            horas_semanales: 6,
            ciclo_nombre: 'V',
            horario: 'Viernes 14:15 - 16:30'
          },
          {
            id: 506,
            nombre: 'EXPERIENCIAS FORMATIVAS',
            codigo: 'EF506',
            docente_nombre: 'INDUCCIÓN',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°1B',
            horas_semanales: 4,
            ciclo_nombre: 'V',
            horario: 'Martes 16:30 - 18:00'
          },
          {
            id: 507,
            nombre: 'GESTIÓN Y ADMINISTRACIÓN WEB',
            codigo: 'GAW507',
            docente_nombre: 'Mtro. Ruber Torres Arevalo',
            aula: 'H.T.0 - H.P.1 Laboratorio de Cómputo N°1B',
            horas_semanales: 6,
            ciclo_nombre: 'V',
            horario: 'Miércoles 16:30 - 19:50, Jueves 16:30 - 19:05'
          }
        ],
        
        // Ciclo VI (ya existente, lo mantenemos)
        6: [
          {
            id: 1,
            nombre: 'Taller de Aplicaciones Móviles',
            codigo: 'TAM601',
            docente_nombre: 'Ing. Christian Duilin Puyo',
            aula: 'Lab. Cómputo 01',
            horas_semanales: 6,
            ciclo_nombre: 'VI',
            horario: 'Lunes 14:15 - 15:45, Miércoles 18:20 - 19:50, Viernes 14:15 - 16:30'
          },
          {
            id: 2,
            nombre: 'Inteligencia de Negocios',
            codigo: 'IN602',
            docente_nombre: 'Prof. Jhon Saboya Fulca',
            aula: 'Lab. Cómputo 04',
            horas_semanales: 6,
            ciclo_nombre: 'VI',
            horario: 'Lunes 15:45 - 17:15, Jueves 15:45 - 17:45'
          },
          {
            id: 3,
            nombre: 'Oportunidades de Negocios',
            codigo: 'OE603',
            docente_nombre: 'Ing. Freddy Flores',
            aula: 'Lab. Cómputo 02',
            horas_semanales: 4,
            ciclo_nombre: 'VI',
            horario: 'Lunes 17:15 - 18:00, Lunes 18:20 - 19:05'
          },
          {
            id: 4,
            nombre: 'Experiencias Formativas',
            codigo: 'EF604',
            docente_nombre: 'Team Haro / Innovación',
            aula: 'Lab. de Fabricación Digital',
            horas_semanales: 4,
            ciclo_nombre: 'VI',
            horario: 'Martes 15:00 - 16:30'
          },
          {
            id: 5,
            nombre: 'Taller de Programación Web',
            codigo: 'TPW605',
            docente_nombre: 'Prof. Jhon Saboya Fulca',
            aula: 'Lab. Cómputo 01',
            horas_semanales: 6,
            ciclo_nombre: 'VI',
            horario: 'Martes 16:30 - 18:00, Martes 18:20 - 19:50, Miércoles 14:15 - 15:45, Viernes 16:30 - 18:00, Viernes 18:20 - 19:05'
          },
          {
            id: 6,
            nombre: 'Herramientas Multimedia',
            codigo: 'HM606',
            docente_nombre: 'Ing. Torres Arevalo',
            aula: 'Lab. Cómputo 01',
            horas_semanales: 6,
            ciclo_nombre: 'VI',
            horario: 'Miércoles 15:45 - 18:00, Jueves 14:15 - 15:45'
          },
          {
            id: 7,
            nombre: 'Solución de Problemas',
            codigo: 'SP607',
            docente_nombre: 'Ing. Freddy Flores',
            aula: 'Lab. Cómputo 06',
            horas_semanales: 4,
            ciclo_nombre: 'VI',
            horario: 'Jueves 17:15 - 18:00, Jueves 18:20 - 19:50'
          }
        ]
      };
      
      // Seleccionar el horario correspondiente al ciclo del estudiante
      const horarioCiclo = horariosPorCiclo[cicloEstudiante] || horariosPorCiclo[1]; // Si no hay coincidencia, usar ciclo I
      
      console.log(`[Horario] Cursos cargados para ciclo ${cicloEstudiante}:`, horarioCiclo);
      setCourses(horarioCiclo);
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
    const regex = /^([A-Za-zÁÉÍÓÚáéíóúÑñ]+)\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/;
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
    const daySchedule = schedules.find(s => s.day === dayName);
    
    // Generar un color basado en el código del curso
    const generateCourseColor = (courseCode) => {
      const colors = [
        'bg-blue-100 border-blue-200 text-blue-800',
        'bg-green-100 border-green-200 text-green-800',
        'bg-purple-100 border-purple-200 text-purple-800',
        'bg-yellow-100 border-yellow-200 text-yellow-800',
        'bg-pink-100 border-pink-200 text-pink-800',
        'bg-indigo-100 border-indigo-200 text-indigo-800',
      ];
      const index = course.codigo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
      return colors[index];
    };
  
    const colorClass = generateCourseColor(course.codigo);
  
    return (
      <div className={`h-full p-2 rounded-lg border ${colorClass}`}>
        <div className="font-medium text-sm truncate">
          {course.nombre}
        </div>
        <div className="text-xs opacity-90 flex items-center mt-1">
          <Clock className="w-3 h-3 mr-1" />
          {daySchedule?.startTime} - {daySchedule?.endTime}
        </div>
        <div className="text-xs opacity-90 flex items-center mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          {course.aula}
        </div>
      </div>
    );
  };

  // Vista en lista de cursos con detalles básicos
  const ListView = () => {
    if (!courses || courses.length === 0) {
      return (
        <div className="card p-6">
          <div className="flex items-center text-secondary-700">
            <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
            <span>No hay cursos para mostrar en tu horario.</span>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {courses.map((course, idx) => (
          <div key={course.id || idx} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-secondary-900">{course.nombre}</div>
                <div className="text-sm text-secondary-600 flex items-center mt-1">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {course.codigo}
                </div>
              </div>
              <div className="text-sm text-secondary-600 flex items-center">
                <User className="w-4 h-4 mr-1" />
                {course.docente_nombre}
              </div>
            </div>
            <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm text-secondary-700">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {course.aula}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {course.horario}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Ciclo {course.ciclo_nombre}
              </div>
            </div>
          </div>
        ))}
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
          idx[key].push({ ...course, endTime: it.endTime });
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
          timeSlots.forEach((slot) => {
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
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
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
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Hoy
            </button>
          </div>
          <div className="text-lg font-semibold text-secondary-900">
            {weekDates[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </div>
        </div>
  
        {/* Tabla de horario */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-600 w-24 border-r border-secondary-200">
                    Hora
                  </th>
                  {weekDates.map((date, index) => (
                    <th key={index} className={`px-4 py-4 text-center text-sm font-semibold w-40 border-r border-secondary-200 ${
                      isToday(date) ? 'bg-primary-50 text-primary-700' : 'text-secondary-600'
                    }`}>
                      <div>
                        <div className="text-base">{getDayShortName(date)}</div>
                        <div className="text-xs mt-1 font-normal">
                          {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, timeIndex) => (
                  <tr key={timeIndex} className={time === '18:00' ? 'bg-yellow-50' : ''}>
                    <td className={`px-6 py-3 text-sm font-medium border-r border-secondary-200 ${
                      time === '18:00' ? 'text-yellow-700' : 'text-secondary-600'
                    }`}>
                      {time === '18:00' ? (
                        <div className="flex items-center">
                          <Bell className="w-4 h-4 mr-2" />
                          <span>Recreo</span>
                        </div>
                      ) : time}
                    </td>
                    {weekDates.map((date, dayIndex) => {
                      const dayName = getDayName(date);
                      const key = `${dayName}|${time}`;
  
                      // Fila de recreo: pintar celda vacía con fondo y sin cursos
                      if (time === '18:00') {
                        return (
                          <td key={dayIndex} className="px-2 py-2 bg-yellow-50 border-r border-secondary-200" />
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
                          const startMin = timeToMin(time);
                          const endMin = timeToMin(course.endTime);
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
                          className={`px-2 py-2 align-top border-r border-secondary-200 ${
                            isToday(date) ? 'bg-primary-25' : ''
                          }`}
                        >
                          {coursesStartingNow.map((course, idx) => (
                            <CourseCard 
                              key={`${key}-${idx}`} 
                              course={course} 
                              dayName={dayName} 
                              startTime={time}
                            />
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
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Lista de Cursos
          </h3>
          <div className="space-y-3">
            {courses.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-secondary-900">
                    {course.nombre}
                  </h4>
                  <p className="text-sm text-secondary-600">
                    {course.codigo} • {course.docente_nombre}
                  </p>
                  <p className="text-sm text-secondary-500 mt-1">
                    {course.horario}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-700">
                    {course.aula}
                  </p>
                  <p className="text-xs text-secondary-500">
                    Ciclo {course.ciclo_nombre}
                  </p>
                </div>
              </div>
            ))}
          </div>
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



