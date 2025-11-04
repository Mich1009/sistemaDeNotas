import { useState, useEffect } from 'react';
import { profileService } from '../services/apiStudent';
import useAuthStore from '../../auth/store/authStore';
import toast from 'react-hot-toast';

const useStudentProfile = () => {
    const { updateUser } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Estados para el formulario de perfil
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });

    // Estados para el formulario de contraseña
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await profileService.getProfile();
            setProfile(response);
            setFormData({
                first_name: response.first_name || '',
                last_name: response.last_name || '',
                email: response.email || '',
                phone: response.phone || ''
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.error('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            const response = await profileService.updateProfile(formData);
            setProfile(response);
            updateUser(response); // Actualizar el usuario en el store
            setEditing(false);
            toast.success('Perfil actualizado exitosamente');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error al actualizar el perfil');
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (passwordData.new_password.length < 6) {
            toast.error('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await profileService.changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            });

            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
            setChangingPassword(false);
            toast.success('Contraseña cambiada exitosamente');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Error al cambiar la contraseña');
        }
    };

    const cancelEdit = () => {
        setFormData({
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
            phone: profile.phone || ''
        });
        setEditing(false);
    };

    const cancelPasswordChange = () => {
        setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
        });
        setChangingPassword(false);
    };

    const getRoleDisplayName = (role) => {
        const roles = {
            'ADMIN': 'Administrador',
            'DOCENTE': 'Docente',
            'ESTUDIANTE': 'Estudiante'
        };
        return roles[role] || role;
    };

    const getRoleColor = (role) => {
        const colors = {
            'ADMIN': 'bg-red-100 text-red-800',
            'DOCENTE': 'bg-blue-100 text-blue-800',
            'ESTUDIANTE': 'bg-green-100 text-green-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    return {
        profile,
        loading,
        editing,
        setEditing,
        changingPassword,
        setChangingPassword,
        showCurrentPassword,
        setShowCurrentPassword,
        showNewPassword,
        setShowNewPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        formData,
        setFormData,
        passwordData,
        setPasswordData,
        loadProfile,
        handleInputChange,
        handlePasswordChange,
        handleSaveProfile,
        handleChangePassword,
        cancelEdit,
        cancelPasswordChange,
        getRoleDisplayName,
        getRoleColor
    };
};

export default useStudentProfile;