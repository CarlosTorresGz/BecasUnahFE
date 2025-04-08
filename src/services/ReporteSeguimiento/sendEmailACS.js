import apiUrl from "../../config";
import { handleTokenRefresh } from "../Auth/handleTokenRefresh";

export const sendEmailACS = async ({ email, pdfURL, name, periodo, anio }) => {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.warn('No se encontró token JWT');
            return { state: false, body: 'Autenticación requerida' };
        }

        const response = await fetch(`${apiUrl}/api/sendEmailACS?`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                to: email,
                subject: `Reporte Seguimiento Academico - ${periodo} ${anio}`,
                body: `Hola, ${name}`,
                attachments: [
                    {
                        name: `Reporte Seguimiento Academico - ${periodo} ${anio}.pdf`,
                        content: pdfURL,
                        contentType: "application/pdf"
                    }
                ]
            }),
        });

        if (response.status === 401) {
            if (response.status === 401) {
                return await handleTokenRefresh(sendEmailACS, { email, pdfURL, name, periodo, anio });
            }
        }
        const result = await response.json();

        if (response.ok) {
            return true;
        } else {
            console.error(`Error al enviar el correo: ${result.error}`);
            return false;
        }
    } catch (error) {
        console.error('Error enviando el correo:', error);
        return false;
    }
}