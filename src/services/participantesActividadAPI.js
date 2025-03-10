import apiUrl from "../config";

export const fetchParticipantesActividadById = async ({ actividad_id }) => {
    try {
        const response = await fetch(`${apiUrl}/api/participantsActivity/${actividad_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return { state: false, body: data };
        }

        return { state: true, body: data }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }

}

export const actualizarAsistencia = async ({ actividadId, noCuenta }) => {
    try {
        const response = await fetch(`${apiUrl}/api/updateattendanceactivity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ actividad_id: actividadId, no_cuenta: noCuenta }),
        });

        const data = await response.json();

        if (response.ok) {
            return { state: true, body: data.message };
        } else {
            console.error('Error al actualizar estado:', data);
            return { state: false, body: data.error };
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error.message);
        return null;
    }
};