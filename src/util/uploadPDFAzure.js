import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';
import { getSasToken } from './getSasToken';

const containerName = 'contenedorreportes';

export const uploadPDFAzure = async (pdfBlob, noCuenta, periodo, anioPeriodo) => {
    const sasToken = await getSasToken({ containerName, permissions: 'racwd', expiresInMinutes: 5 });

    const blobServiceClient = new BlobServiceClient(
        sasToken.sasUrl,
        new AnonymousCredential()
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `Reporte_Seguimiento_Academico-${noCuenta}_${periodo}_${anioPeriodo}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadData(pdfBlob, {
            blobHTTPHeaders: {
                blobContentType: pdfBlob.type
            }
        });
        return blockBlobClient.url;
    } catch (error) {
        if (error.response) {
            console.error(`Error al subir el pdf: ${error.response.statusText} - ${error.response.bodyAsText}`);
        } else {
            console.error('Error desconocido al subir el pdf:', error.message);
        }
        throw error;
    }
};