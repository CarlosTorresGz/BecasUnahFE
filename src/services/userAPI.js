import apiUrl from "../config";

//Imcompleta
export const iniciarSesion = async () => {
    try {        
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ no_cuenta: noCuenta, contrasena: password }),
        });

        if (!response.ok) {
            throw new Error(data.message || "Error en la autenticación");
        }

        const data = await response.json();

        return { nombre: data.nombre, noCuenta: data.noCuenta };
    } catch (error) {
        console.error('Error:', error);
        return { nombre: null, noCuenta: null };
    }

}

export const changePassword = async () => {
    //Completar

}