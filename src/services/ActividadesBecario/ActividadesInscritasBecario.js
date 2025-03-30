import apiUrl from "../../config";

export const ActividadesInscritasData = async ({ no_cuenta }) => {
    try {
        if (!no_cuenta) {
            throw new Error("Número de cuenta no encontrado");
        }

        const response = await fetch(`${apiUrl}/api/postActivityInProgressByAccount?`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ no_cuenta }),
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const Data = await response.json();
        return Data;

    } catch (err) {
        console.error('Fetch error', err);
        throw err;
    }
}

export default ActividadesInscritasData;
