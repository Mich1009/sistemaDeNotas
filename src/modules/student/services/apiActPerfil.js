import api from "../../../shared/utils/axiosInstance"

export const updatePerfil = {
    updateEstudiante: async (estudianteId, estudianteData) => {
        const response = await api.put(`/admin/estudiantes/${estudianteId}`, estudianteData);
        return response.data;
    }
}
