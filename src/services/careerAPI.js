import apiUrl from "../config";

export const fetchCareerById = async ({ career_id }) => {
    console.log('career_id: ', career_id)

    try {
        const response = await fetch(`${apiUrl}/api/career/${career_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        const data = await response.text();
        console.log('responseData: ', data);

        if (!response.ok) {
            return { state: false, body: data };
        }

        return { state: true, body: data }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }

}