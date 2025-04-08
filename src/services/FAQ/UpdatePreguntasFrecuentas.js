import apiUrl from "../../config";
import { handleTokenRefresh } from "../Auth/handleTokenRefresh";

const updatePregunta = async (pregunta_id,pregunta,respuesta) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/putFaq?`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({pregunta_id,pregunta,respuesta}),
        });

        if (response.status === 401) {
            if (response.status === 401) {
                return await handleTokenRefresh(updatePregunta, {pregunta_id, pregunta, respuesta});
            }
        }

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: data.message};
        } else {            
            return { success: false, errorMessage: data.message ? data.message : data.error };
        }
    } catch (error) {
        return { success: false, errorMessage: "Error de conexión con la API: ", error };
    }
};

export default updatePregunta;