import apiUrl from "../../../config";
import { handleTokenRefresh } from "../../Auth/handleTokenRefresh";

export const informacionplanilla_byId = async ({ planilla_id }) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            //console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/informacionPlanillabyId/${planilla_id}`, {
            //const response = await fetch(`http://localhost:7071/api/getInfoSeguimientobyNoCuenta/${no_cuenta}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            return await handleTokenRefresh(informacionSeguimientoBecaAPI, { planilla_id });

        }

        const result = await response.json();

        if (response.ok) {
            return { state: true, body: result };
        } else {
            return { state: false, body: result.error };
        }
    } catch (error) {
        return { state: false, body: error };
    }
}
