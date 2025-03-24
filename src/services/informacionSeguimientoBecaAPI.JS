import apiUrl from "../config";

export const informacionSeguimientoBecaAPI = async ({ no_cuenta}) => {
    try {
        const response = await fetch(`${apiUrl}/api/getInfoSeguimientobyNoCuenta/${no_cuenta}`, {
        //const response = await fetch(`http://localhost:7071/api/getInfoSeguimientobyNoCuenta/${no_cuenta}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        if (response.ok) {
            return { state: true, body: result };
        } else {
            return { state: false, body: 'Error al obtener la información del seguimiento.' };
        }
    } catch (error) {
        console.error('Error obteniendo la información del seguimiento:', error);
        return { state: false, body: 'Error al obtener la información del seguimiento.' };
    }
}

export const setStateBeca = async ({no_cuenta, estado_beca_id}) => {
    console.log('no_cuenta: ', no_cuenta)
    console.log('estado_beca_id: ', estado_beca_id)
    try {
        const response = await fetch(`${apiUrl}/api/putStateBeca?`, {
        //const response = await fetch(`http://localhost:7071/api/putStateBeca`, {
        method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                no_cuenta: no_cuenta,
                estado_beca_id: estado_beca_id
            }),
        });

        const result = await response.json();
        console.log('result: ', result)
        if (response.ok) {
            return { state: true, body: result };
        } else {
            return { state: false, body: 'Error al actualizar el estado.' };
        }
    } catch (error) {
        console.error('Error al actualizar el estado: ', error);
        return { state: false, body: `Error al actualizar el estado: ${error}` };
    }
}

export const saveReport = async ({ no_cuenta, nombre_estado_anterior, empleado_id, nombre_reporte, fecha_reporte, estado_nuevo_beca_id, motivo_cambio_estado_beca, total_horas, observaciones, enlace }) => {
    try {
        const response = await fetch(`${apiUrl}/api/reporteSeguimiento?`, {
        //const response = await fetch(`http://localhost:7071/api/reporteSeguimiento`, {
        method: "POST",
            headers: {
                'Content-Type': 'application/json',
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
        console.log('result: ', result)

        if (response.ok) {
            console.log('Reporte creado:', result);
            return { state: true, body: result };
        } else {
            console.error('Error al crear reporte2:', result);
            return { state: false, body: result };
        }
    } catch (error) {
        console.error('Error al crear el reporte3: ', error);
        return { state: false, body: `Error al crear reporte3: ${error}` };
    }
}