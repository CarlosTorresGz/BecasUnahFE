import apiUrl from "../config";

export const fetchData = async () => {
    try {        
        const response = await fetch(`${apiUrl}/api/preguntas_frecuentes`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const dataFetch = await response.json();

        console.log("API Response:", dataFetch);

        return { dataFetch };
    } catch (err) {
        console.error('Fetch error', err);
        throw err;
    }

}