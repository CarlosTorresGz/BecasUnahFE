import apiUrl from "../config";

const inscripcionActividad = async ({actividadId, noCuenta}) => {
    console.log('inscripcionActividad:', actividadId, noCuenta);
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
            console.log('inscripcionActividad actualizada:', data);
            return { state: true, body: data.message };
        } else {
            console.error('Error al inscripcion Actividad:', data);
            return { state: false, body: data.error };
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error.message);
        return null;
    }
};

export default inscripcionActividad;