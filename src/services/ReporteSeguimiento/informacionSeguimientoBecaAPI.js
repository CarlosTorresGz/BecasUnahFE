import apiUrl from "../../config";
import { handleTokenRefresh } from "../Auth/handleTokenRefresh";

export const informacionSeguimientoBecaAPI = async ({ no_cuenta }) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/getInfoSeguimientobyNoCuenta/${no_cuenta}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            return await handleTokenRefresh(informacionSeguimientoBecaAPI, { no_cuenta });
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

export const setStateBeca = async ({ no_cuenta, estado_beca_id }) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/putStateBeca?`, {
            method: "PUT",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                no_cuenta: no_cuenta,
                estado_beca_id: estado_beca_id
            }),
        });

        if (response.status === 401) {
            return await handleTokenRefresh(setStateBeca, { no_cuenta, estado_beca_id });
        }

        const result = await response.json();
        if (response.ok) {
            return { state: true, body: result };
        } else {
            return { state: false, body: 'Error al actualizar el estado.' };
        }
    } catch (error) {
        return { state: false, body: `Error al actualizar el estado: ${error}` };
    }
}

export const saveReport = async ({ no_cuenta, nombre_estado_anterior, empleado_id, nombre_reporte, fecha_reporte, estado_nuevo_beca_id, motivo_cambio_estado_beca, total_horas, observaciones, enlace }) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/reporteSeguimiento?`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                no_cuenta: no_cuenta,
                nombre_estado_anterior: nombre_estado_anterior,
                empleado_id: empleado_id,
                nombre_reporte: nombre_reporte,
                fecha_reporte: fecha_reporte,
                estado_nuevo_beca_id: estado_nuevo_beca_id,
                motivo_cambio_estado_beca: motivo_cambio_estado_beca,
                total_horas: total_horas,
                observaciones: observaciones,
                enlace: enlace
            }),
        });

        if (response.status === 401) {
            return await handleTokenRefresh(saveReport, { no_cuenta, nombre_estado_anterior, empleado_id, nombre_reporte, fecha_reporte, estado_nuevo_beca_id, motivo_cambio_estado_beca, total_horas, observaciones, enlace });
        }

        const result = await response.json();

        if (response.ok) {
            return { state: true, body: result };
        } else {
            return { state: false, body: result };
        }
    } catch (error) {
        return { state: false, body: `Error al crear reporte: ${error}` };
    }
}