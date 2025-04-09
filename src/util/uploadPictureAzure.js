import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';

const AZURE_STORAGE_ACCOUNT_NAME = 'storageproject25';
const containerName = 'contenedorpictures';
const sasToken = 'sp=racwd&st=2025-04-09T01:44:26Z&se=2025-06-09T05:59:26Z&sv=2024-11-04&sr=c&sig=0NWufvvg8W8a5pDE8Bh%2Bxcv00BHIqktrkM3GuPUWL0Q%3D';

export const uploadImageToAzure = async (file, nombreActividad) => {
    const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sasToken}`,
        new AnonymousCredential()
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `${nombreActividad}-${Date.now()}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadData(file, {
            blobHTTPHeaders: {
                blobContentType: file.type
            }
        });
        
        return blockBlobClient.url;

    } catch (error) {
        console.error('Error al subir la imagen:', error.message);
        throw error;
    }
};
