import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';

const AZURE_STORAGE_ACCOUNT_NAME = 'storageproject25';
const containerName = 'contenedorreportes';
const sasToken = 'sp=racwd&st=2025-04-04T21:11:06Z&se=2025-04-06T05:11:06Z&spr=https&sv=2024-11-04&sr=c&sig=ifdhMGpU9dgozQAuJe72JhehDICpGbgNohJTbHeyvLY%3D';

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