import apiUrl from "../config";

const updatePregunta = async (pregunta_id,pregunta,respuesta) => {
    try {
        const response = await fetch(`${apiUrl}/api/putFaq?`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({pregunta_id,pregunta,respuesta}),
        });

        const data = await response.json();
        //console.log(data);

        if (response.ok) {
            //console.log('Actividad Actualizada:', data);
            return response.ok; // Regresar la respuesta de la API
        } else {            
            return { success: false, errorMessage: data.message || "Hubo un error al editar, campos obligatorios" }; // O manejar el error según sea necesario
        }
    } catch (error) {
        return { success: false, errorMessage: "Error de conexión con la API" };
    }
};

export default updatePregunta;