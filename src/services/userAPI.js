import apiUrl from "../config";

export const iniciarSesionBecario = async ({noCuenta, password}) => {
    console.log('noCuenta: ', noCuenta)
    console.log('pass: ', password)
    try {        
        const response = await fetch(`${apiUrl}/api/auth/loginBecario`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ no_cuenta: noCuenta, contrasena: password }),
        });

        const data = await response.json();
        console.log('response: ', data);

        
        if (!data.status) {
            return { state: false, becario: {descripcion: "Error en la autenticación"} };
        }
        
        return { state: true, data }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, becario: null };
    }

}

export const iniciarSesionEmployee = async ({noEmpleado, password}) => {
    console.log('noEmpleado: ', noEmpleado)
    console.log('pass: ', password)
    try {        
        const response = await fetch(`${apiUrl}/api/auth/loginEmployee`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ no_empleado: noEmpleado, contrasena: password }),
        });

        const data = await response.json();
        console.log('response: ', data);
        
        if (!data.status) {
            return { state: false, employee: {descripcion: "Error en la autenticación"} };
        }
        
        return { state: true, data }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, employee: null };
    }

}

export const changePassword = async ({email, newPass}) => {
    console.log('email: ', email)
    console.log('newPass: ', newPass)
    try {        
        const response = await fetch(`${apiUrl}/api/auth/changePassword`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, newPass: newPass }),
        });

        const data = await response.json();
        console.log('responseData: ', data);
        
        if (!data.status) {
            return { state: false, body: data.body };
        }
        
        return { state: true, body: data.body }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }

}