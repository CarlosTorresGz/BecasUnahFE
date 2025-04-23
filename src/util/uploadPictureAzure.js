import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';
import { getSasToken } from './getSasToken';

const containerName = 'contenedorpictures';

export const uploadImageToAzure = async (file, nombreActividad) => {
    const sasToken = await getSasToken({ containerName, permissions: 'racwd', expiresInMinutes: 5 });

    const blobServiceClient = new BlobServiceClient(
        sasToken.sasUrl,
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
