import apiUrl from "../../config";

const fetchParcialData = async ({ centro_id }) => {
    try {        
        const response = await fetch(`${apiUrl}/api/getBecarioActivity`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({centro_id}),
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const dataFetch = await response.json();

        return dataFetch;
    } catch (err) {
        console.error('Fetch error', err);
        throw err;
    }

}

export default fetchParcialData;
