import apiUrl from "../config";

export const handleDelete = async (empleado_id, actividad_id) => {
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
  
      const data = await response.json();
      console.log('Actividad eliminada con éxito:', data);
  
      // Aquí actualizas el estado o haces algo para volver a renderizar las actividades
      // Por ejemplo, actualizas el estado de actividades si lo tienes
      // setActividades(prev => prev.filter(actividad => actividad.id !== actividad_id));
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      // Maneja el error y muestra un mensaje de error al usuario
    }
  };

  export default handleDelete();
  