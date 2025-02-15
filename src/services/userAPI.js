import apiUrl from "../config";

//LoginForm
export const iniciarSesion = async ({noCuenta, password}) => {
    try {        
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ no_cuenta: noCuenta, contrasena: password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error en la autenticación");
        }

        
        return { nombre: data.nombre, noCuenta: data.noCuenta, state: true };
    } catch (error) {
        console.error('Error:', error);
        return { nombre: null, noCuenta: null, state: false };
    }

}

export const changePassword = async () => {
    //Completar

}