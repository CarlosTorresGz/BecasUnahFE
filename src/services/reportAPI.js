import apiUrl from "../config";
import { handleTokenRefresh } from "./Auth/handleTokenRefresh";

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
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/report/infoBecario/${no_cuenta}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            if (response.status === 401) {
                return await handleTokenRefresh(fetchBecarioInfoReport, { no_cuenta });
            }
        }

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