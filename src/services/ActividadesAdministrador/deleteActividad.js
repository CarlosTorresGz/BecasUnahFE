import apiUrl from "../../config";
import { handleTokenRefresh } from "../Auth/handleTokenRefresh";

export const handleDelete = async ({ empleado_id, actividad_id }) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.warn('No se encontró token JWT');
      return { state: false, body: 'Autenticación requerida' };
    }

    const response = await fetch(`${apiUrl}/api/DeleteActivity?`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ empleado_id, actividad_id })
    });

    if (response.status === 401) {
      if (response.status === 401) {
        return await handleTokenRefresh(handleDelete, { empleado_id, actividad_id });
      }
    }

    if (!response.ok) {
      throw new Error('No se pudo eliminar la actividad');
    }

    return { state: true }
  } catch (error) {
    return { state: false, body: error }
  }
};