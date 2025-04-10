import apiUrl from "../../../config";
import {handleTokenRefresh} from "../../Auth/handleTokenRefresh";

// Función para obtener el empleado_id desde el token JWT
export const getEmpleadoIdFromToken = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    const payload = token.split('.')[1]; // Obtener el payload
    const decodedPayload = JSON.parse(atob(payload)); // Decodificar y parsear el payload
    return decodedPayload ? decodedPayload.empleado_id : null; // Obtener el empleado_id
};

const crearPlanilla = async (mes,anio,centro_estudio_id) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const empleado_id = getEmpleadoIdFromToken();
        if (!empleado_id) {
            console.warn('No se encontró empleado_id en el token');
            return { state: false, body: 'Error: empleado_id no disponible' };
        }
        
        const response = await fetch(`${apiUrl}/api/postPlanilla?`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({mes,anio,centro_estudio_id,empleado_id}),
        });

        if (response.status === 401) {            
                return await handleTokenRefresh(crearPlanilla, {mes,anio,centro_estudio_id,empleado_id});            
        }

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: data.message};
        } else {
            return { success: false, errorMessage: data.message ? data.message : data.error };
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return { success: false, errorMessage: "Error de conexión a la API" };
    }
};

export default crearPlanilla;