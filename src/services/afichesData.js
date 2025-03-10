import apiUrl from "../config";

const afichesData = async () => {
    try {        
        const response = await fetch(`${apiUrl}/api/getComunicados/?`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const dataFetchComunicados = await response.json();

        return dataFetchComunicados;
    } catch (err) {
        console.error('Fetch error', err);
        throw err;
    }

}

export default afichesData;
