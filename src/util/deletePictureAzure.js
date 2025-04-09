import { BlobServiceClient } from '@azure/storage-blob';

const AZURE_STORAGE_ACCOUNT_NAME = 'storageproject25';
const containerName = 'contenedorpictures';
const sasToken = 'sp=racwd&st=2025-04-09T01:44:26Z&se=2025-06-09T05:59:26Z&sv=2024-11-04&sr=c&sig=0NWufvvg8W8a5pDE8Bh%2Bxcv00BHIqktrkM3GuPUWL0Q%3D';

export const deletePictureAzure = async (blobName) => {
    if (!blobName) {
        console.error("Error: El nombre del blob es requerido.");
        return false;
    }
    
    const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sasToken}`,
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