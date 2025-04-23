import { BlobServiceClient } from '@azure/storage-blob';
import { getSasToken } from './getSasToken';

const containerName = 'contenedorpictures';

export const deletePictureAzure = async (blobName) => {
    if (!blobName) {
        console.error("Error: El nombre del blob es requerido.");
        return false;
    }
    
    const sasToken = await getSasToken({ containerName, permissions: 'racwd', expiresInMinutes: 5 });
    const blobServiceClient = new BlobServiceClient(
        sasToken.sasUrl,
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        //Validar si la imagen existe antes de intentar eliminarla
        const exists = await blockBlobClient.exists();
        if (!exists) {
            return false;
        }

        const options = {
            deleteSnapshots: 'include'
        }

        await blockBlobClient.delete(options);
        return true;
    } catch (error) {
        console.error(`❌ Error al eliminar la imagen: ${error.message}`);
        return false;
    }
};