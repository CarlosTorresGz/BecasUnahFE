import apiUrl from "../../config";

export const fetchPlanillas = async ({ becario_id }) => {
    try {
        const response = await fetch(`${apiUrl}/api/planilla/${becario_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.status) {
            return { state: false, body: data.planilla };
        }

        return { state: true, body: data.planilla }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }
}