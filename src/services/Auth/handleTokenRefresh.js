import apiUrl from "../../config";
import obtenerUsuario from "../../util/jwtDecoded";

export const handleTokenRefresh = async (originalRequest, args) => {
    console.log('Access token expirado. Intentando renovar...');

    const refreshResponse = await fetch(`${apiUrl}/api/auth/refreshaccesstoken`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem('jwtToken', data.token);
        console.log('Access token renovado. Reintentando la solicitud original...');
        return await originalRequest(args);
    } else {
        const user = obtenerUsuario();
        if (user) {
            if (user.rol === 'becario') {
                window.location.href = '/login';
            } else {
                window.location.href = '/login/employee';
            }

            localStorage.removeItem('jwtToken');
            return;
        }
        throw new Error('El refresh token también expiró. El usuario debe iniciar sesión nuevamente.');
    }
};