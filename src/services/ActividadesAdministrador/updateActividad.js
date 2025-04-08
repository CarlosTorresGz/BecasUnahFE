import apiUrl from "../../config";
import { handleTokenRefresh } from "../Auth/handleTokenRefresh";

const updateActividad = async (actividad) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.warn('No se encontró token JWT');
        return { state: false, body: 'Autenticación requerida' };
    }

    try {
        const response = await fetch(`${apiUrl}/api/putActivityAvailable?`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(actividad),
        });

        if (response.status === 401) {
            if (response.status === 401) {
                return await handleTokenRefresh(updateActividad, actividad);
            }
        }

        const data = await response.json();

        if (response.ok) {
            return { state: true, body: data.message };
        } else {
            return { state: false, body: `ERORR: ${data.message ? data.message : data.error}` };
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return null;
    }
};

export default updateActividad;