import { BlobServiceClient } from '@azure/storage-blob';

const AZURE_STORAGE_ACCOUNT_NAME = 'storageprojectunah';
const containerName = 'contenedorpictures';
const sasToken = 'sp=rd&st=2025-03-19T19:02:52Z&se=2025-06-20T03:02:52Z&spr=https&sv=2024-11-04&sr=c&sig=awqMXleaqSfZpht4JioJ5%2BZsULA2eUOritQcM0GG4GM%3D';  // Reemplaza con tu token SAS

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
            console.warn(`⚠️ Advertencia: La imagen '${blobName}' no existe en Azure Storage.`);
            return false;
        }

        const options = {
            deleteSnapshots: 'include'
        }

        await blockBlobClient.delete(options);
        console.log(`✅ Imagen eliminada con éxito: ${blobName}`);
        return true;
    } catch (error) {
        console.error(`❌ Error al eliminar la imagen: ${error.message}`);
        return false;
    }
};