import apiUrl from "../config";

export const getSasToken = async ({ containerName, permissions, expiresInMinutes}) => {
    const response = await fetch(`${apiUrl}/api/getSasToken`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            containerName,
            permissions,
            expiresInMinutes
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Error al obtener el token SAS');
    }
};