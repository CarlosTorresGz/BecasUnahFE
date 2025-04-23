import apiUrl from "../config";

export const iniciarSesionBecario = async ({ noCuenta, password }) => {
    try {
        const response = await fetch(`${apiUrl}/api/auth/loginBecario`, {
        //const response = await fetch('http://localhost:7071/api/auth/loginBecario', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ no_cuenta: noCuenta, contrasena: password }),
        });

        const data = await response.json();
        localStorage.setItem('jwtToken', data.token);

        if (!data.status) {
            return { state: false, becario: { descripcion: "Error en la autenticación" } };
        }

        return { state: true, data }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, becario: null };
    }

}

export const iniciarSesionEmployee = async ({ noEmpleado, password }) => {
    try {
        const response = await fetch(`${apiUrl}/api/auth/loginEmployee`, {
        //const response = await fetch('http://localhost:7071/api/auth/loginEmployee', {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ no_empleado: noEmpleado, contrasena: password }),
        });

        const data = await response.json();
        localStorage.setItem('jwtToken', data.token);
        
        if (!data.status) {
            return { state: false, employee: { descripcion: "Error en la autenticación" } };
        }

        return { state: true, data }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, employee: null };
    }

}

export const changePassword = async ({ email, newPass }) => {
    try {
        const response = await fetch(`${apiUrl}/api/auth/changePassword`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, newPass: newPass }),
        });

        const data = await response.json();

        if (!data.status) {
            return { state: false, body: data.body };
        }

        return { state: true, body: data.body }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }

}