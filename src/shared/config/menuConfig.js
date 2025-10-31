import { Users, BookOpen, GraduationCap, Folder, FileText, Settings, BarChart3, Home, Calendar, Award, User, HeartPulse } from 'lucide-react';

// Importar componentes de Admin
import AdminDashboard from '../../modules/admin/views/Dashboard.jsx';
import Docentes from '../../modules/admin/views/Docentes.jsx';
import Courses from '../../modules/admin/views/Course.jsx';
import Students from '../../modules/admin/views/Students.jsx';
import Matriculas from '../../modules/admin/views/Matriculas';
import AdminReports from '../../modules/admin/views/Reports.jsx';
import Configuracion from '../../modules/admin/views/Configuracion.jsx';

// Importar componentes de Teacher
import TeacherDashboard from '../../modules/teacher/views/Dashboard';
import MyCourses from '../../modules/teacher/views/MyCourses';
import Grades from '../../modules/teacher/views/Grades';
import TeacherSchedule from '../../modules/teacher/views/Schedule';
import Reports from '../../modules/teacher/views/Reports';
import TeacherProfile from '../../modules/teacher/views/Profile';

// Importar componentes de Student
import StudentDashboard from '../../modules/student/views/Dashboard';
import MyGrades from '../../modules/student/views/MyGrades';
import CoursesStudent from '../../modules/student/views/MyCourses';
import StudentSchedule from '../../modules/student/views/Schedule';
import Profile from '../../modules/student/views/Profile';

export const menuConfigs = {
    admin: [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            component: AdminDashboard
        },
        {
            id: 'docentes',
            label: 'Docentes',
            icon: Users,
            component: Docentes
        },
        {
            id: 'courses',
            label: 'Cursos y Ciclos',
            icon: BookOpen,
            component: Courses
        },
        {
            id: 'matriculas',
            label: 'Matriculas',
            icon: Folder,
            component: Matriculas
        },
        {
            id: 'students',
            label: 'Estudiantes',
            icon: GraduationCap,
            component: Students
        },
        {
            id: 'reports',
            label: 'Reportes',
            icon: FileText,
            component: AdminReports
        },

        {
            id: 'settings',
            label: 'Configuración',
            icon: Settings,
            component: Configuracion
        }
    ],
    docente: [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            component: TeacherDashboard
        },
        {
            id: 'courses',
            label: 'Mis Cursos',
            icon: BookOpen,
            component: MyCourses
        },
        {
            id: 'grades',
            label: 'Calificaciones',
            icon: Award,
            component: Grades
        },
        {
            id: 'schedule',
            label: 'Horarios',
            icon: Calendar,
            component: TeacherSchedule
        },
        {
            id: 'reports',
            label: 'Reportes',
            icon: BarChart3,
            component: Reports
        },
        {
            id: 'profile',
            label: 'Mi Perfil',
            icon: User,
            component: TeacherProfile
        }
    ],
    estudiante: [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            component: StudentDashboard
        },
        {
            id: 'grades',
            label: 'Mis Calificaciones',
            icon: Award,
            component: MyGrades
        },
        {
            id: 'courses',
            label: 'Mis Cursos',
            icon: BookOpen,
            component: CoursesStudent
        },
        {
            id: 'schedule',
            label: 'Horario',
            icon: Calendar,
            component: StudentSchedule
        },
        {
            id: 'profile',
            label: 'Mi Perfil',
            icon: User,
            component: Profile
        }
    ]
};

export const roleConfig = {
    admin: {
        badgeColor: 'bg-red-100 text-red-800',
        label: 'Admin'
    },
    docente: {
        badgeColor: 'bg-blue-100 text-blue-800',
        label: 'Docente'
    },
    estudiante: {
        badgeColor: 'bg-green-100 text-green-800',
        label: 'Estudiante'
    }
};

export const getMenuItemsByRole = (role) => {
    return menuConfigs[role] || [];
};

export const getRoleConfig = (role) => {
    return roleConfig[role] || roleConfig.estudiante;
};