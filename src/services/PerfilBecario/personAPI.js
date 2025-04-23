import apiUrl from "../../config";

export const fetchPersonById = async ({ person_id }) => {
    try {
        const response = await fetch(`${apiUrl}/api/person/${person_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.status) {
            return { state: false, body: data.person };
        }

        return { state: true, body: data.person }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }
}