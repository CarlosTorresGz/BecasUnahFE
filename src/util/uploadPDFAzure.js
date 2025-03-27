import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';

const AZURE_STORAGE_ACCOUNT_NAME = 'storageprojectunah';
const containerName = 'contenedorreport';
const sasToken = 'sp=racwd&st=2025-03-18T17:14:16Z&se=2025-06-19T01:14:16Z&spr=https&sv=2022-11-02&sr=c&sig=cfJi6IG89bAAVcM0J41taz3WtKFs4eZIWJ29dXX5cJg%3D';  // Reemplaza con tu token SAS

export const uploadPDFAzure = async (pdfBlob, noCuenta, periodo, anioPeriodo) => {
    const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sasToken}`,
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