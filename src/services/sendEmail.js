import apiUrl from "../config";
import { toast } from "sonner";

export const sendEmail = async ({ email, pdfURL }) => {
    console.log('correo: ', email)
    console.log('pdfURL: ', pdfURL)

    try {
        //const response = await fetch(`${apiUrl}/api/sendEmail?`, {
        const response = await fetch(`http://localhost:7071/api/sendEmail`, { //Para Desarrollo
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                persona_id: 26,
                fromEmail: "djcasco@unah.hn",
                toEmail: email,
                pdfURL: pdfURL, // URL del PDF en Azure Storage
                subject: "Reporte Seguimiento Academico",
                bodyMessage: "Adjunto se envia el reporte",
                contrasena: "$2b$10$W5LidGE4fY8T/dCCsDJCMeYy9ng9HV/NCrf0WkZUhhyjJ0vMUwNbC"
            }),
        });

        const result = await response.json();
        console.log('result: ', result)
        if (response.ok) {
            toast.success("Correo enviado correctamente.");
        } else {
            toast.error(`Error al enviar el correo: ${result.error}`);
        }
    } catch (error) {
        console.error('Error enviando el correo:', error);
        toast.error("No se pudo enviar el correo.");
    }
}