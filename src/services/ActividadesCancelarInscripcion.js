import apiUrl from "../config";

export const ActividadesCancelarInscripcion = async (actividad_id,becario_id) => {
    try {
        // Obtén el número de cuenta del localStorage o del contexto de autenticación
       console.log("el numero de becario_id es: ",becario_id)
       console.log("este es el id:",actividad_id)
        // Verificar si el número de cuenta está disponible
        if (!becario_id || !actividad_id) {
            throw new Error("faltan parametros no encontrado");
        }
        const response = await fetch(`${apiUrl}/api/deleteInscriptionActivity?`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({actividad_id,becario_id,}), 
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return { state: true }
    } catch (err) {
        console.error('Fetch error', err);
        throw err;
    }
}

export default ActividadesCancelarInscripcion;
