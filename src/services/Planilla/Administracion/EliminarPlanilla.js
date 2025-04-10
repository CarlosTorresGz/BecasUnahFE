import apiUrl from "../../../config";
import {getEmpleadoIdFromToken} from "./CrearPlanilla"

export const eliminarPlanilla = async ({ empleado_id, pregunta_id }) => {
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
    //voy a cambiarlo aun no esta la api XD
    const response = await fetch(`${apiUrl}/api/DeleteFAQ?`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ empleado_id, planilla_Id })
    });

    if (!response.ok) {
      throw new Error('No se pudo eliminar la pregunta');
    }

    return { state: true }
  } catch (error) {
    return { state: false, body: error }
  }
};

