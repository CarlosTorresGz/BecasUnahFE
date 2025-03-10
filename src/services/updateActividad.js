import apiUrl from "../config";

const updateActividad = async (actividad) => {
    try {
        const response = await fetch(`${apiUrl}/api/actividad/?`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actividad),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Actividad Guardada:', data);
            return data; // Regresar la respuesta de la API
        } else {
            console.error('Error al Guardar actividad:', data);
            return null; // O manejar el error según sea necesario
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return null;
    }
};

export default updateActividad;