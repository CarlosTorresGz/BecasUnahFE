import apiUrl from "../config";


export const ActividadesRealizadas = async (no_cuenta) => {
    try {
        // Obtén el número de cuenta del localStorage o del contexto de autenticación
       console.log("el numero de cuenta es: ",no_cuenta)
        // Verificar si el número de cuenta está disponible
        if (!no_cuenta) {
            throw new Error("Número de cuenta no encontrado");
        }
         //const cuenta = no_cuenta   // Envía la solicitud POST con el número de cuenta
        const response = await fetch(`${apiUrl}/api/postActivityByAccount?`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({no_cuenta}), // Aquí pasas el número de cuenta como parte del cuerpo
        });
        

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const Data = await response.json();
        console.log(Data)
        return Data;

    } catch (err) {
        console.error('Fetch error', err);
        throw err;
    }
}

export default ActividadesRealizadas;
