// Admin Module Exports
export { default as Dashboard } from './components/Dashboard';
export { default as Students } from './components/Students';
export { default as Docentes } from './components/Docentes';
export { default as Course } from './components/Course';
export { default as Reports } from './components/Reports';
export { default as Configuracion } from './components/Configuracion';

// Services
export * from './services/apiAdmin';

// Hooks
export * from './hooks';

// Store/Context
export { AdminProvider, useAdminContext, ADMIN_ACTIONS } from './store';