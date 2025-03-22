import apiUrl from "../config";
import { toast } from "sonner";
import { obtenerAccessToken } from "./MSAL.js"

export const sendEmail = async ({ email, pdfURL }) => {
    console.log('correo: ', email)
    console.log('pdfURL: ', pdfURL)

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No hay token disponible.");
        return;
    }

    try {
        const accessToken = await obtenerAccessToken();
        console.log('accessToken: ', accessToken)
        
        //const response = await fetch(`${apiUrl}/api/sendEmail?`, {
        const response = await fetch(`http://localhost:7071/api/sendEmail`, { //Para Desarrollo
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                correo: email,
                token: accessToken,
                pdfURL: pdfURL, // URL del PDF en Azure Storage
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