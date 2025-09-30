import React, { useState } from 'react';
import { 
    BookOpen, 
    Calendar, 
    GraduationCap
} from 'lucide-react';
import CursosManager from './CursosManager';
import CiclosManager from './CiclosManager';

const Course = () => {

    const [activeTab, setActiveTab] = useState('cursos');

    const renderContent = () => {
        switch (activeTab) {
            case 'cursos':
                return <CursosManager />;
            case 'ciclos':
                return <CiclosManager />;
            default:
                return <CursosManager />;
        }
    };

    return (
        <div className="space-y-6 p-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Gestión Académica</h1>
                    <p className="text-secondary-600 mt-2">
                        Administra cursos y ciclos del programa de Desarrollo de Software
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-secondary-200">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'cursos', label: 'Cursos', icon: BookOpen },
                        { id: 'ciclos', label: 'Ciclos', icon: Calendar }
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === id
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {renderContent()}
        </div>
    );
};

export default Course;