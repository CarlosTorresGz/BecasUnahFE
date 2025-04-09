import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';

const AZURE_STORAGE_ACCOUNT_NAME = 'storageproject25';
const containerName = 'contenedorreportes';
const sasToken = 'sp=r&st=2025-04-09T01:42:36Z&se=2025-06-09T05:59:36Z&sv=2024-11-04&sr=c&sig=c2AwE%2FJ%2Fn9ry3gz%2BMfoePv3vD5Ku20OOpAdyCoAf%2B3E%3D';

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