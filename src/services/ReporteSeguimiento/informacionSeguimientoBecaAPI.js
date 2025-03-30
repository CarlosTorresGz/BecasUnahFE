import apiUrl from "../../config";

export const informacionSeguimientoBecaAPI = async ({ no_cuenta}) => {
    console.log('no cuenta recibido: ', no_cuenta); 
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }
        
        const response = await fetch(`${apiUrl}/api/getInfoSeguimientobyNoCuenta/${no_cuenta}`, {
        //const response = await fetch(`http://localhost:7071/api/getInfoSeguimientobyNoCuenta/${no_cuenta}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();
        console.log('result: ', result);
        if (response.ok) {
            return { state: true, body: result };
        } else {
            return { state: false, body: result.error };
        }
    } catch (error) {
        return { state: false, body: error };
    }
}

export const setStateBeca = async ({no_cuenta, estado_beca_id}) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/putStateBeca?`, {
        method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                no_cuenta: no_cuenta,
                estado_beca_id: estado_beca_id
            }),
        });

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

        const result = await response.json();

        if (response.ok) {
            return { state: true, body: result };
        } else {
            return { state: false, body: result };
        }
    } catch (error) {
        return { state: false, body: `Error al crear reporte3: ${error}` };
    }
}