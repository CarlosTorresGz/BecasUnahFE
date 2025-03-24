import apiUrl from "../config";

export const sendEmailACS = async ({ email, pdfURL, name, periodo, anio }) => {
    try {
        const response = await fetch(`${apiUrl}/api/sendEmailACS?`, {
        //const response = await fetch(`http://localhost:7071/api/sendEmailACS`, { //Para Desarrollo
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
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

        const result = await response.json();
        console.log('result: ', result)
        if (response.ok) {
            console.log("Correo enviado correctamente.");
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