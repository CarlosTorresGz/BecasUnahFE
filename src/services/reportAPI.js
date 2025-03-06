import apiUrl from "../config";

export const fetchReport = async ({ no_cuenta }) => {
    try {
        const response = await fetch(`${apiUrl}/api/report/${no_cuenta}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (!data) {
            return { state: false, body: data };
        }

        return { state: true, body: data }
    } catch (error) {
        return { state: false, body: error };
    }
}

export const fetchBecarioInfoReport = async ({ no_cuenta }) => {
    try {
        const response = await fetch(`${apiUrl}/api/report/infoBecario/${no_cuenta}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (!data) {
            return { state: false, body: data };
        }

        return { state: true, body: data }
    } catch (error) {
        console.error('Error:', error);
        return { state: false, body: error };
    }
}