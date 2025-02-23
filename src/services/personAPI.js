import apiUrl from "../config";

export const fetchPersonById = async ({ person_id }) => {
    const persona_id = parseInt(person_id);
    console.log('person_id: ', persona_id)

    try {
        //const response = await fetch(`${apiUrl}/api/person/${person_id}`, {
        const response = await fetch(`http://localhost:7071/api/person/${persona_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('responseData: ', data);

        if (!data.status) {
            return { state: false, body: data.person };
        }

        return { state: true, body: data.person }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }

}