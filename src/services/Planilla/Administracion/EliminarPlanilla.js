import apiUrl from "../../../config";
import {getEmpleadoIdFromToken} from "./CrearPlanilla"

export const eliminarPlanilla = async (planilla_id ) => {
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
    if (!planilla_id) {
      console.warn('No se encontró planilla_id');
      return { state: false, body: 'Error: planilla_id no disponible' };
  }
    const response = await fetch(`${apiUrl}/api/Deleteplanilla_Id?`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ empleado_id, planilla_id })
    });

    if (!response.ok) {
      throw new Error('No se pudo eliminar la pregunta');
    }

    return { state: true }
  } catch (error) {
    return { state: false, body: error }
  }
};

