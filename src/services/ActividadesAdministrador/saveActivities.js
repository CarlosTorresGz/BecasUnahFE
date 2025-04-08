import apiUrl from "../../config";
import { handleTokenRefresh } from "../Auth/handleTokenRefresh";

const saveActivities = async (actividad) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.warn('No se encontró token JWT');
        return { state: false, body: 'Autenticación requerida' };
    }

    try {
        const response = await fetch(`${apiUrl}/api/actividad/?`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(actividad),
        });

        if (response.status === 401) {
            if (response.status === 401) {
                return await handleTokenRefresh(saveActivities, actividad);
            }
        }

        const data = await response.json();
        if (response.ok) {
            return { state: true, body: data };
        } else {
            return { state: false, body: `ERORR: ${data.message}` };
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return { state: false, body: `ERORR: ${error}` };
    }
};

export default saveActivities;