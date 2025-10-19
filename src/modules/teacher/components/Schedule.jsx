import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../../modules/auth/store/authStore';
import { getCourses } from '../services/apiTeacher';

const Schedule = () => {
    const { user } = useAuthStore();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    // Tabs por ciclos: impares al inicio del año, pares a mitad de año
    const getDefaultCycleTab = () => (new Date().getMonth() + 1 <= 6 ? 'impares' : 'pares');
    const [cycleTab, setCycleTab] = useState(getDefaultCycleTab());

    useEffect(() => {
        fetchCourses();
    }, []);

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
    // Utilidades para separar por ciclo actual vs otros
    const romanToInt = (roman) => {
        if (!roman) return 0;
        const map = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6 };
        const key = String(roman).trim().toUpperCase();
        return map[key] || 0;
    };

    const visibleCourses = React.useMemo(() => {
        if (!courses || !courses.length) return [];
        if (cycleTab === 'impares') {
            return courses.filter(c => romanToInt(c.ciclo_nombre) % 2 === 1);
        }
        return courses.filter(c => romanToInt(c.ciclo_nombre) % 2 === 0);
    }, [courses, cycleTab]);

    // Utilidades para cuadrícula semanal
    const dayMap = {
        'LUNES': 0, 'LUN': 0, 'LU': 0,
        'MARTES': 1, 'MAR': 1,
        'MIERCOLES': 2, 'MIÉRCOLES': 2, 'MIE': 2, 'MIÉ': 2,
        'JUEVES': 3, 'JUE': 3,
        'VIERNES': 4, 'VIE': 4,
        'SABADO': 5, 'SÁBADO': 5, 'SAB': 5, 'SÁB': 5,
        'DOMINGO': 6, 'DOM': 6
    };
    const days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const timeToMinutes = (hhmm) => {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    };
    const minutesToHH = (min) => String(Math.floor(min / 60)).padStart(2, '0') + ':00';
    const roundDownToHour = (min) => Math.floor(min / 60) * 60;
    const roundUpToHour = (min) => Math.ceil(min / 60) * 60;

    const parseHorario = (horarioStr) => {
        if (!horarioStr || typeof horarioStr !== 'string') return [];
        const results = [];
        const regex = /(Lunes|Martes|Mi[eé]rcoles|Jueves|Viernes|S[áa]bado|Domingo|Lun|Mar|Mi[eé]|Jue|Vie|S[áa]b|Dom)\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/gi;
        let match;
        while ((match = regex.exec(horarioStr)) !== null) {
            const norm = match[1].toUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
            const dayKey = norm === 'MIE' ? 'MIERCOLES' : (norm === 'SAB' ? 'SABADO' : norm);
            const dayIdx = dayMap[dayKey] ?? null;
            const start = timeToMinutes(match[2]);
            const end = timeToMinutes(match[3]);
            if (dayIdx !== null && end > start) {
                results.push({ dayIdx, start, end });
            }
        }
        return results;
    };

    const buildTimeGrid = React.useMemo(() => {
        const events = [];
        visibleCourses.forEach((c) => {
            const evs = parseHorario(c.horario);
            evs.forEach(e => events.push({ ...e, course: c }));
        });
        if (!events.length) {
            const slotTimes = [];
            for (let h = 8; h <= 18; h++) slotTimes.push(String(h).padStart(2,'0')+':00');
            const gridData = days.map(() => ({ cells: Array(slotTimes.length).fill({ type: 'empty' }) }));
            return { slotTimes, gridData };
        }
        const minStart = roundDownToHour(Math.min(...events.map(e => e.start)));
        const maxEnd = roundUpToHour(Math.max(...events.map(e => e.end)));
        const slotTimes = [];
        for (let m = minStart; m <= maxEnd; m += 60) slotTimes.push(minutesToHH(m));
        const gridData = days.map(() => ({ cells: Array(slotTimes.length).fill(null) }));
        gridData.forEach(d => { for (let i = 0; i < slotTimes.length; i++) d.cells[i] = { type: 'empty' }; });
        events.forEach(({ dayIdx, start, end, course }) => {
            if (dayIdx > 5) return;
            const startIdx = Math.max(0, Math.floor((roundDownToHour(start) - roundDownToHour(timeToMinutes(slotTimes[0]))) / 60));
            const endIdx = Math.min(slotTimes.length, Math.ceil((roundUpToHour(end) - roundDownToHour(timeToMinutes(slotTimes[0]))) / 60));
            const span = Math.max(1, endIdx - startIdx);
            if (gridData[dayIdx].cells[startIdx]?.type === 'start') {
                const cell = gridData[dayIdx].cells[startIdx];
                cell.courseStack = (cell.courseStack || []).concat([course]);
                return;
            }
            gridData[dayIdx].cells[startIdx] = { type: 'start', rowSpan: span, course };
            for (let i = startIdx + 1; i < startIdx + span && i < slotTimes.length; i++) {
                gridData[dayIdx].cells[i] = { type: 'skip' };
            }
        });
        return { slotTimes, gridData };
    }, [visibleCourses]);

    return (
        <div className="p-3 space-y-5">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Horarios</h1>
                            <p className="text-gray-600">Cursos por ciclo (cuadrícula tipo horario)</p>
                        </div>
                    </div>
                </div>
                {/* Cards view (mobile) */}
                <div className="md:hidden space-y-3">
                    {visibleCourses.map((c) => (
                        <div key={c.id} className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{c.nombre}</div>
                                    <div className="text-xs text-gray-500">{c.seccion || '-'}</div>
                                </div>
                                <div className="text-xs text-gray-500">{c.ciclo_nombre} • {c.ciclo_año}</div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                                <div>
                                    <div className="text-gray-500 text-xs">Horario</div>
                                    <div>{c.horario || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-xs">Aula</div>
                                    <div>{c.aula || '-'}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contenido: tabla de cursos con pestañas por ciclo */}
            <div className="bg-white rounded-lg shadow-md p-4">
                {loading ? (
                    <div className="py-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando cursos...</p>
                    </div>
                ) : courses.length > 0 ? (
                    <>
                        {/* Pestañas ciclo impares/pares */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCycleTab('impares')}
                                    className={`px-3 py-1 rounded-md text-sm border ${cycleTab === 'impares' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    Ciclos Impares
                                </button>
                                <button
                                    onClick={() => setCycleTab('pares')}
                                    className={`px-3 py-1 rounded-md text-sm border ${cycleTab === 'pares' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    Ciclos Pares
                                </button>
                            </div>
                            {/* Indicador cuando no hay cursos visibles en el ciclo seleccionado */}
                            {visibleCourses.length === 0 && courses.length > 0 && (
                                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                                    No hay cursos en este filtro. Pruebe cambiar de pestaña.
                                </div>
                            )}
                        </div>

                        {/* Cuadrícula tipo horario (desktop) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-2 text-xs font-semibold text-gray-700 border-r w-20">Hora</th>
                                        {days.map((d) => (
                                            <th key={d} className="py-2 px-2 text-xs font-semibold text-gray-700 border-r">{d}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {buildTimeGrid.slotTimes.map((t, rowIdx) => (
                                        <tr key={t}>
                                            <td className="py-2 px-2 text-xs text-gray-600 border-t border-r align-top w-20">{t}</td>
                                            {days.map((_, dayIdx) => {
                                                const cell = buildTimeGrid.gridData[dayIdx]?.cells[rowIdx];
                                                if (!cell || cell.type === 'skip') return null;
                                                if (cell.type === 'start') {
                                                    const c = cell.course;
                                                    return (
                                                        <td key={dayIdx}
                                                            rowSpan={cell.rowSpan}
                                                            className="border-t border-r align-top bg-blue-50 text-xs p-2"
                                                        >
                                                            <div className="font-medium text-gray-800">{c.nombre}</div>
                                                            <div className="text-gray-600">Sección: {c.seccion || '-'}</div>
                                                            <div className="text-gray-600">Ciclo: {c.ciclo_nombre} {c.ciclo_año ? `(${c.ciclo_año})` : ''}</div>
                                                            <div className="text-gray-600">Aula: {c.aula || '-'}</div>
                                                        </td>
                                                    );
                                                }
                                                return (
                                                    <td key={dayIdx} className="border-t border-r align-top text-xs p-2">
                                                        {/* vacío */}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </>
                ) : (
                    <div className="py-8 text-center">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No hay clases programadas</h3>
                        <p className="text-gray-600">
                            No se encontraron cursos asignados para mostrar
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schedule;