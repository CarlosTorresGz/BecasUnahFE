import apiUrl from "../config";

export const handleDelete = async ({ empleado_id, actividad_id }) => {
  try {
    const response = await fetch(`${apiUrl}/api/DeleteActivity?`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ empleado_id, actividad_id })
    });

    if (!response.ok) {
      throw new Error('No se pudo eliminar la actividad');
    }

    return { state: true }
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    return { state: false, body: error }
  }
};