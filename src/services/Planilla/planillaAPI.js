import apiUrl from "../../config";

export const fetchPlanillas = async ({ becario_id, beca_id }) => {
    try {
        const response = await fetch(`${apiUrl}/api/planilla`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ becario_id, beca_id })
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