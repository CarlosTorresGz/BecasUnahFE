import apiUrl from "../../config";

export const handleDelete = async ({ empleado_id, pregunta_id }) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.warn('No se encontró token JWT');
        return { state: false, body: 'Autenticación requerida' };
    }

    const response = await fetch(`${apiUrl}/api/DeleteFAQ?`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ empleado_id, actividad_id })
    });

    if (!response.ok) {
      throw new Error('No se pudo eliminar la pregunta');
    }

    return { state: true }
  } catch (error) {
    return { state: false, body: error }
  }
};