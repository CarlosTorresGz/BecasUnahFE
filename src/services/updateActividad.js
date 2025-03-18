import apiUrl from "../config";

const updateActividad = async (actividad) => {
    try {
        const response = await fetch(`${apiUrl}/api/putActivityAvailable?`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actividad),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            console.log('Actividad Actualizada:', data);
            return data; // Regresar la respuesta de la API
        } else {
            console.error('Error al Guardar actividad Actualizada:', data);
            return null; // O manejar el error según sea necesario
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return null;
    }
};

export default updateActividad;