import {
    Users,
    BookOpen,
    GraduationCap,
    FileText,
    Settings,
    BarChart3,
    Home,
    Calendar,
    Award,
    User
} from 'lucide-react';

// Importar componentes de Admin
import AdminDashboard from '../../modules/admin/components/Dashboard';
import Docentes from '../../modules/admin/components/Docentes';
import Courses from '../../modules/admin/components/Course';
import Students from '../../modules/admin/components/Students';
import AdminReports from '../../modules/admin/components/Reports';
import Matriculas from '../../modules/admin/components/Matriculas';
import Configuracion from '../../modules/admin/components/Configuracion';

// Importar componentes de Teacher
import TeacherDashboard from '../../modules/teacher/components/Dashboard';
import MyCourses from '../../modules/teacher/components/MyCourses';
import Grades from '../../modules/teacher/components/Grades';
import Assignments from '../../modules/teacher/components/Assignments';
import TeacherSchedule from '../../modules/teacher/components/Schedule';
import TeacherReports from '../../modules/teacher/components/TeacherReports';
import TeacherProfile from '../../modules/teacher/components/Profile';

// Importar componentes de Student
import StudentDashboard from '../../modules/student/components/Dashboard';
import MyGrades from '../../modules/student/components/MyGrades';
import StudentSchedule from '../../modules/student/components/Schedule';
import Profile from '../../modules/student/components/Profile';

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
            icon: GraduationCap,
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
            id: 'assignments',
            label: 'Tareas y Evaluaciones',
            icon: FileText,
            component: Assignments
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
            component: TeacherReports
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