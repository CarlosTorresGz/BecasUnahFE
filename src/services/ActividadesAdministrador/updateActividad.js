import apiUrl from "../../config";

const updateActividad = async (actividad) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.warn('No se encontró token JWT');
        return { state: false, body: 'Autenticación requerida' };
    }

    try {
        const response = await fetch(`${apiUrl}/api/putActivityAvailable?`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(actividad),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            return { state: true, body: data.message };
        } else {
            return { state: false, body: `ERORR: ${data.message}` };;
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        return null;
    }
};

export default updateActividad;