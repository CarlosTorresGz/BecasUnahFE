import apiUrl from "../config";

const saveActivities = async (actividad) => {
    try {
        const response = await fetch(`${apiUrl}/api/postActivityAvailable/?`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actividad),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Actividad Guardad:', data);
            return data; // Regresar la respuesta de la API
        } else {
            console.error('Error al actualizar actividad:', data);
            return null; // O manejar el error según sea necesario
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return null;
    }
};

export default saveActivities;