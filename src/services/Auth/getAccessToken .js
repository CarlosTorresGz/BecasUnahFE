export const getAccessToken = async () => {
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
        return token; // Intentar usar el token existente primero
    }

    try {
        const refreshResponse = await fetch('http://localhost:7071/api/AUTH/refreshAccessToken', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('response refresh frontend: ', refreshResponse);

        if (refreshResponse.ok) {
            const { token: newToken } = await refreshResponse.json();
            localStorage.setItem('jwtToken', newToken);
            return newToken;
        } else {
            throw new Error('El refresh token también expiró. Por favor, inicia sesión nuevamente.');
        }
    } catch (error) {
        console.error('Error al renovar token:', error);
        throw new Error('Autenticación requerida');
    }
};