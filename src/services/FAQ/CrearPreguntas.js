import apiUrl from "../../config";

const crearPreguntas = async (pregunta,respuesta) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/postFaq?`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({pregunta,respuesta}),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: data.message};
        } else {
            return { success: false, errorMessage: data.message ? data.message : data.error };
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return { success: false, errorMessage: "Error de conexión a la API" };
    }
};

export default crearPreguntas;