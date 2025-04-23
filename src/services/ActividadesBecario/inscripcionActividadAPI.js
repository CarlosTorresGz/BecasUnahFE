import apiUrl from "../../config";

const inscripcionActividad = async ({actividadId, noCuenta}) => {
    try {
        const response = await fetch(`${apiUrl}/api/inscriptionactivity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ actividad_id: actividadId, no_cuenta: noCuenta }),
        });

        const data = await response.json();

        if (response.ok) {
            return { state: true, body: data.message };
        } else {
            return { state: false, body: data.error };
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error.message);
        return null;
    }
};

export default inscripcionActividad;